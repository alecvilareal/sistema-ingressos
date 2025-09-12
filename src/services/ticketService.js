// src/services/ticketService.js
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getTicketsByUserId = async (userId) => {
  if (!userId) return [];

  try {
    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return tickets;
  } catch (error) {
    console.error("Erro ao buscar ingressos do usuário:", error);
    throw error;
  }
};