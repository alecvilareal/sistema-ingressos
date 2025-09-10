// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../services/eventService';
import EventCard from '../components/common/EventCard';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const eventList = await getAllEvents();
        setEvents(eventList);
      } catch (error) {
        console.error("Falha ao buscar todos os eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []); // [] significa que executa apenas uma vez, quando o componente é montado

  return (
    <div>
      <h2>Próximos Eventos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : events.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p>Nenhum evento encontrado no momento.</p>
      )}
    </div>
  );
};

export default HomePage;