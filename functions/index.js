// functions/index.js

const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

// Inicializa o Firebase Admin SDK (necessário para o Firestore no backend)
admin.initializeApp();

// Define a região para todas as funções exportadas neste arquivo
setGlobalOptions({ region: "southamerica-east1" });

// Carrega e exporta as funções dos seus arquivos separados
const { createPaymentPreference } = require("./src/handlers/createPaymentPreference");
const { paymentWebhook } = require("./src/handlers/paymentWebhook");

exports.createPaymentPreference = createPaymentPreference;
exports.paymentWebhook = paymentWebhook;