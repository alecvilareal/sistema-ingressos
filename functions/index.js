// functions/index.js

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineString } = require('firebase-functions/params');
const { MercadoPagoConfig, Preference } = require("mercadopago");

setGlobalOptions({ region: "southamerica-east1" });

const mercadopagoAccessToken = defineString("MERCADOPAGO_ACCESS_TOKEN");

let client = null;

exports.createPaymentPreference = onCall(async (request) => {
  if (!client) {
    const token = mercadopagoAccessToken.value();
    if (!token) {
      throw new HttpsError("internal", "O Access Token do Mercado Pago não está configurado.");
    }
    client = new MercadoPagoConfig({ accessToken: token });
    console.log("Cliente do Mercado Pago inicializado com sucesso.");
  }

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
    payer: {
      email: userEmail,
    },
    back_urls: {
      success: "http://localhost:5173/payment-success",
      failure: "http://localhost:5173/payment-failure",
      pending: "http://localhost:5173/payment-pending",
    },
    // auto_return: "approved", // <-- LINHA REMOVIDA
  };

  try {
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });
    return {
      id: result.id,
      init_point: result.init_point,
    };
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento no Mercado Pago:", error);
    throw new HttpsError("internal", "Não foi possível criar a preferência de pagamento.");
  }
});

exports.helloWorld = onCall((request) => {
  return {
    message: "Olá, mundo! A função de teste executou com sucesso.",
    user: request.auth ? request.auth.token.email : "Usuário não logado."
  };
});