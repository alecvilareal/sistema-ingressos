// functions/src/handlers/createCoupon.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.createCoupon = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new HttpsError("unauthenticated", "Você precisa estar logado.");
  }

  const { code, eventId, discountType, discountValue, usesLeft } = request.data;

  // Validação dos dados recebidos
  if (!code || !eventId || !discountType || !discountValue || !usesLeft) {
    throw new HttpsError("invalid-argument", "Dados do cupom incompletos.");
  }

  // Validação de segurança: o usuário é o dono do evento?
  const eventRef = db.collection('events').doc(eventId);
  const eventDoc = await eventRef.get();
  if (!eventDoc.exists || eventDoc.data().organizerId !== userId) {
    throw new HttpsError("permission-denied", "Você não tem permissão para criar cupons para este evento.");
  }

  // Cria o cupom no Firestore
  const couponRef = db.collection('coupons').doc(code.toUpperCase());
  await couponRef.set({
    code: code.toUpperCase(),
    eventId,
    discountType,
    discountValue,
    usesLeft,
    organizerId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Cupom criado com sucesso!" };
});