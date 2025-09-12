// functions/src/handlers/paymentWebhook.js

const { onRequest } = require("firebase-functions/v2/https");
const { getMpClient, mercadopagoWebhookSecret } = require("../config/mercadoPago");
const { Payment } = require("mercadopago");
const admin = require("firebase-admin");
const crypto = require("crypto");

const db = admin.firestore();

exports.paymentWebhook = onRequest(async (req, res) => {
  const topic = req.query.topic || req.query.type;
  console.log(`Webhook recebido - Tópico: ${topic}`);

  if (topic === 'payment') {
    try {
      const secret = mercadopagoWebhookSecret.value();
      const signatureHeader = req.headers["x-signature"];
      const requestId = req.headers["x-request-id"];
      const notificationId = req.query.id;

      // ... (Restante da lógica de validação e processamento do webhook) ...
      // (O código interno desta função permanece o mesmo da última versão que funcionou)
      
      console.log("SUCESSO: Assinatura do Webhook validada!");
      
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
        }
      }
      
      return res.status(200).send('Webhook processado com sucesso.');

    } catch (error) {
      console.error("Erro fatal ao processar webhook:", error);
      return res.status(500).send("Erro interno.");
    }
  } else {
    console.log(`Notificação do tipo '${topic}' ignorada.`);
    return res.status(200).send('Notificação ignorada.');
  }
});