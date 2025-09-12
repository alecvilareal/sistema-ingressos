// functions/src/config/mercadoPago.js

const { MercadoPagoConfig } = require("mercadopago");
const { defineString } = require('firebase-functions/params');

// Define os parâmetros que guardarão nossos segredos
const mercadopagoAccessToken = defineString("MERCADOPAGO_ACCESS_TOKEN");
const mercadopagoWebhookSecret = defineString("MERCADOPAGO_WEBHOOK_SECRET");

let mpClient = null;

// Função para inicializar e retornar o cliente (padrão Singleton)
const getMpClient = () => {
  if (!mpClient) {
    const token = mercadopagoAccessToken.value();
    if (!token) {
      console.error("O Access Token do Mercado Pago não está configurado.");
      throw new Error("Erro de configuração do servidor de pagamento.");
    }
    mpClient = new MercadoPagoConfig({ accessToken: token });
    console.log("Cliente do Mercado Pago inicializado.");
  }
  return mpClient;
};

module.exports = {
  getMpClient,
  mercadopagoWebhookSecret,
};