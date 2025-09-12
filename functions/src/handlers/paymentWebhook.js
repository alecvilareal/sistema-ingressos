const { onRequest } = require("firebase-functions/v2/https");
const { getMpClient, mercadopagoWebhookSecret } = require("../config/mercadoPago");
const { Payment } = require("mercadopago");
const admin = require("firebase-admin");
const crypto = require("crypto");

exports.paymentWebhook = onRequest(async (req, res) => {
  // CORREÇÃO: A inicialização do Firestore é feita dentro da função
  const db = admin.firestore();
  
  try {
    const topic = req.query.topic || req.query.type;
    console.log(`Webhook recebido - Tópico: ${topic}`);

    // Processa apenas as notificações de 'payment' que têm o formato esperado
    if (topic === 'payment' && req.body && req.body.id && req.body.data && req.body.data.id) {
      const secret = mercadopagoWebhookSecret.value();
      const signatureHeader = req.headers["x-signature"] || req.headers["X-Signature"];
      const requestId = req.headers["x-request-id"] || req.headers["X-Request-Id"];

      if (!signatureHeader || !requestId) {
        console.warn("Notificação de pagamento recebida sem cabeçalhos de assinatura.");
        return res.status(400).send("Cabeçalhos de assinatura ausentes.");
      }

      const notificationId = req.body.id.toString();
      const parts = signatureHeader.split(',');
      const tsPart = parts.find(part => part.trim().startsWith('ts='));
      const v1Part = parts.find(part => part.trim().startsWith('v1='));

      if (!tsPart || !v1Part) {
          console.error("Formato do cabeçalho x-signature inválido.");
          return res.status(400).send("Formato de assinatura inválido.");
      }

      const timestamp = tsPart.split('=')[1];
      const signature = v1Part.split('=')[1];
      const manifest = `id:${notificationId};request-id:${requestId};ts:${timestamp};`;
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(manifest);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        console.error("Assinatura de webhook inválida! A chave secreta pode estar dessincronizada.");
        return res.status(401).send("Assinatura inválida.");
      }
      
      console.log("Assinatura do Webhook validada com sucesso!");

      const paymentId = req.body.data.id;
      const mpClient = getMpClient();
      const payment = new Payment(mpClient);
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo && paymentInfo.status === 'approved') {
        const orderRef = db.collection('orders').doc(paymentId.toString());
        const doc = await orderRef.get();
        if (!doc.exists) {
            await orderRef.set({
              mercadoPagoId: paymentId,
              items: paymentInfo.additional_info?.items || [],
              payerEmail: paymentInfo.payer?.email,
              status: 'approved',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`Pedido ${orderRef.id} criado com sucesso.`);
        } else {
            console.log(`Pedido ${paymentId} já foi processado anteriormente.`);
        }
      } else {
          console.log(`Pagamento ${paymentId} não está com status 'approved'. Status atual: ${paymentInfo?.status}`);
      }
    } else {
      console.log(`Notificação do tipo '${topic}' ou com payload inválido ignorada.`);
    }
    
    return res.status(200).send('Webhook processado.');

  } catch (error) {
    console.error("Erro fatal ao processar webhook:", error);
    return res.status(500).send("Erro interno.");
  }
});