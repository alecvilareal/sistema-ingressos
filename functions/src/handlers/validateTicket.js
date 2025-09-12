// functions/src/handlers/validateTicket.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.validateTicket = onCall(async (request) => {
  // Garante que o usuário que está a fazer o check-in (ex: staff) está autenticado.
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Apenas usuários autenticados podem validar ingressos.");
  }

  const ticketId = request.data.ticketId;
  if (!ticketId) {
    throw new HttpsError("invalid-argument", "O ID do ingresso é obrigatório.");
  }

  const ticketRef = db.collection("tickets").doc(ticketId);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);

      if (!ticketDoc.exists) {
        return { success: false, message: "Ingresso Inválido ou Inexistente." };
      }

      const ticketData = ticketDoc.data();

      if (ticketData.status === 'utilizado') {
        return { success: false, message: "Este ingresso já foi utilizado!" };
      }

      if (ticketData.status !== 'pago') {
        return { success: false, message: `Status do ingresso inválido: ${ticketData.status}` };
      }

      // Se chegou até aqui, o ingresso é válido.
      transaction.update(ticketRef, { status: "utilizado" });
      return { success: true, message: `Check-in Aprovado! Ingresso para ${ticketData.eventName}.` };
    });

    return result;

  } catch (error) {
    console.error("Erro na transação de check-in:", error);
    throw new HttpsError("internal", "Ocorreu um erro ao validar o ingresso.");
  }
});