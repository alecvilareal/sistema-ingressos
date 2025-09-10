// src/services/eventService.js
import { db, storage } from "../config/firebaseConfig";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Função para fazer upload da imagem do evento
export const uploadEventImage = async (imageFile) => {
  if (!imageFile) return null;

  // Cria um nome de arquivo único (ex: event-banners/1678886400000-banner.jpg)
  const fileName = `event-banners/${Date.now()}-${imageFile.name}`;
  const storageRef = ref(storage, fileName);

  try {
    // Faz o upload do arquivo
    const snapshot = await uploadBytes(storageRef, imageFile);
    // Pega a URL de download pública do arquivo
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    throw error;
  }
};

// Função para criar um novo evento no Firestore
export const createEvent = async (eventData) => {
  try {
    // Adiciona um novo documento na coleção 'events'
    const docRef = await addDoc(collection(db, "events"), eventData);
    return docRef.id; // Retorna o ID do novo evento criado
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Buscar todos os eventos
export const getAllEvents = async () => {
  try {
    const eventsCollection = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCollection);
    // Mapeia os documentos para incluir o ID e os dados
    const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return eventList;
  } catch (error) {
    console.error("Erro ao buscar todos os eventos:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Buscar eventos por ID do organizador
export const getEventsByOrganizer = async (organizerId) => {
  if (!organizerId) return [];
  try {
    const eventsCollection = collection(db, "events");
    // Cria uma query para filtrar eventos pelo organizerId
    const q = query(eventsCollection, where("organizerId", "==", organizerId));
    const eventSnapshot = await getDocs(q);
    const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return eventList;
  } catch (error) {
    console.error("Erro ao buscar eventos do organizador:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Buscar um evento específico pelo ID
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId); // Cria uma referência ao documento
    const eventSnap = await getDoc(eventRef);   // Busca o documento

    if (eventSnap.exists()) {
      // Retorna os dados do documento junto com seu ID
      return { id: eventSnap.id, ...eventSnap.data() };
    } else {
      console.log("Nenhum evento encontrado com este ID!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar evento por ID:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Adicionar um lote de ingresso a um evento
export const addTicketLot = async (eventId, lotData) => {
  try {
    // Cria uma referência para a subcoleção 'ticketLots' dentro do evento específico
    const lotsCollectionRef = collection(db, "events", eventId, "ticketLots");
    const docRef = await addDoc(lotsCollectionRef, lotData);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar lote de ingresso:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Buscar todos os lotes de ingresso de um evento
export const getTicketLots = async (eventId) => {
  try {
    const lotsCollectionRef = collection(db, "events", eventId, "ticketLots");
    const lotsSnapshot = await getDocs(lotsCollectionRef);
    const lotsList = lotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return lotsList;
  } catch (error) {
    console.error("Erro ao buscar lotes de ingresso:", error);
    throw error;
  }
};