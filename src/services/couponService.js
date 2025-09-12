// src/services/couponService.js
import { db, functions } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';

// Busca os cupons de um evento (leitura direta do Firestore, pois é seguro)
export const getCouponsByEventId = async (eventId) => {
  if (!eventId) return [];
  const couponsRef = collection(db, "coupons");
  const q = query(couponsRef, where("eventId", "==", eventId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Chama a Cloud Function para criar um cupom (operação de escrita segura)
export const createCoupon = async (couponData) => {
  const createCouponFunction = httpsCallable(functions, 'createCoupon');
  return await createCouponFunction(couponData);
};

export const applyCoupon = async (couponCode, cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("O carrinho está vazio.");
  }
  const applyCouponFunction = httpsCallable(functions, 'applyCoupon');
  return await applyCouponFunction({ couponCode, cartItems });
};