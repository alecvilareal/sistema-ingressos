// functions/src/handlers/createPaymentPreference.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { Preference } = require("mercadopago");
const { getMpClient } = require("../config/mercadoPago");

exports.createPaymentPreference = onCall(async (request) => {
  const mpClient = getMpClient(); // Obtém o cliente inicializado

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Você precisa estar logado para realizar uma compra.");
  }
  
  const cartItems = request.data.cartItems;
  const userEmail = request.auth.token.email;

  const items = cartItems.map(item => ({
    id: item.id,
    title: item.name,
    quantity: item.quantity,
    currency_id: "BRL",
    unit_price: item.price,
  }));

  const preferenceData = {
    items: items,
    payer: { email: userEmail },
    back_urls: {
      success: "https://sistema-ingressos-app.web.app/payment-success",
      failure: "https://sistema-ingressos-app.web.app/payment-failure",
      pending: "https://sistema-ingressos-app.web.app/payment-pending",
    },
    auto_return: "approved",
    notification_url: `https://southamerica-east1-sistema-ingressos-app.cloudfunctions.net/paymentWebhook`
  };

  try {
    const preference = new Preference(mpClient);
    const result = await preference.create({ body: preferenceData });
    console.log("Resposta da API do Mercado Pago:", JSON.stringify(result, null, 2));
    return {
      id: result.id,
      init_point: result.init_point,
    };
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento no Mercado Pago:", error);
    throw new HttpsError("internal", "Não foi possível criar a preferência de pagamento.");
  }
});