// src/pages/organizer/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import EventCard from '../../components/common/EventCard'; // Importe o card
import { useAuth } from '../../contexts/AuthContext'; // Para pegar o ID do usuário
import { getEventsByOrganizer } from '../../services/eventService'; // Importe a função de busca

const DashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Função para buscar os eventos
    const fetchEvents = async () => {
      if (currentUser) {
        try {
          const events = await getEventsByOrganizer(currentUser.uid);
          setMyEvents(events);
        } catch (error) {
          console.error("Falha ao buscar eventos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [currentUser]); // Executa sempre que currentUser mudar

  return (
    <div>
      <h2>Painel do Organizador</h2>
      <p>Bem-vindo! Aqui você pode gerenciar seus eventos.</p>
      <div style={{ marginTop: '20px', maxWidth: '200px' }}>
         <Link to="/organizer/create-event">
            <Button>Criar Novo Evento</Button>
        </Link>
      </div>
      <div style={{ marginTop: '30px' }}>
        <h3>Meus Eventos</h3>
        {loading ? (
          <p>Carregando eventos...</p>
        ) : myEvents.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {myEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p>Você ainda não criou nenhum evento.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;