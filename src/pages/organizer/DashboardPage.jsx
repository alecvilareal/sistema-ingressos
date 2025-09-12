import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import EventCard from '../../components/common/EventCard';
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganizer } from '../../services/eventService';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
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
  }, [currentUser]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2 className={styles.title}>Painel do Organizador</h2>
        <div className={styles.actions}>
          <Link to="/organizer/create-event">
            <Button>Criar Novo Evento</Button>
          </Link>
          <Link to="/organizer/check-in">
            <Button style={{ background: '#17a2b8' }}>Fazer Check-in</Button>
          </Link>
        </div>
      </header>

      <h3 className={styles.contentTitle}>Meus Eventos</h3>
      
      {loading ? (
        <p>A carregar eventos...</p>
      ) : myEvents.length > 0 ? (
        <div className={styles.eventGrid}>
          {myEvents.map(event => (
            <div key={event.id} style={{ margin: '1rem' }}>
              <EventCard event={event} />
              <div style={{ marginTop: '0.5rem' }}>
                <Link to={`/organizer/manage-event/${event.id}`}>
                  <Button style={{ width: '100%' }}>Gerir Evento</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noEventsMessage}>
          <p>Você ainda não criou nenhum evento.</p>
          <p>Clique em "Criar Novo Evento" para começar!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;