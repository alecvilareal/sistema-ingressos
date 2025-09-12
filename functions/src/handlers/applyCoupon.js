// functions/src/handlers/applyCoupon.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const db = admin.firestore();

exports.applyCoupon = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Você precisa estar logado para aplicar um cupom.");
  }

  const { couponCode, cartItems } = request.data;
  if (!couponCode || !cartItems || cartItems.length === 0) {
    throw new HttpsError("invalid-argument", "Código do cupom ou itens do carrinho em falta.");
  }

  const code = couponCode.toUpperCase();
  const couponRef = db.collection('coupons').doc(code);
  const couponDoc = await couponRef.get();

  // --- VALIDAÇÕES ---
  if (!couponDoc.exists) {
    throw new HttpsError("not-found", "Cupom inválido ou inexistente.");
  }

  const couponData = couponDoc.data();
  const eventIdInCart = cartItems[0].eventId; // Pega o ID do evento do primeiro item

  if (couponData.eventId !== eventIdInCart) {
    throw new HttpsError("failed-precondition", "Este cupom não é válido para o evento no seu carrinho.");
  }

  if (couponData.usesLeft <= 0) {
    throw new HttpsError("failed-precondition", "Este cupom já esgotou.");
  }

  // --- CÁLCULO DO DESCONTO ---
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discountAmount = 0;

  if (couponData.discountType === 'percentage') {
    discountAmount = subtotal * (couponData.discountValue / 100);
  } else if (couponData.discountType === 'fixed') {
    discountAmount = couponData.discountValue;
  }

  // Garante que o desconto não é maior que o subtotal
  discountAmount = Math.min(subtotal, discountAmount);

  return {
    success: true,
    discountAmount: discountAmount,
    couponData: { code: couponData.code, ...couponData }
  };
});