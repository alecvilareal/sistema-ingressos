import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Componentes reutilizáveis
import Button from '../../components/common/Button';
import EventCard from '../../components/common/EventCard';

// Hooks e Serviços
import { useAuth } from '../../contexts/AuthContext';
import { getEventsByOrganizer } from '../../services/eventService';

const DashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Esta função é executada assim que o componente é montado
    const fetchEvents = async () => {
      // Garante que temos um usuário logado antes de tentar buscar os eventos
      if (currentUser) {
        try {
          // Chama a função do serviço, passando o ID do usuário logado
          const events = await getEventsByOrganizer(currentUser.uid);
          setMyEvents(events);
        } catch (error) {
          console.error("Falha ao buscar eventos do organizador:", error);
        } finally {
          // Independentemente de sucesso ou falha, para de carregar
          setLoading(false);
        }
      }
    };

    fetchEvents();
  }, [currentUser]); // A lista de dependências [currentUser] garante que o código rode novamente se o usuário mudar

  return (
    <div>
      <h2>Painel do Organizador</h2>
      <p>Bem-vindo! Aqui você pode gerenciar seus eventos.</p>

      {/* Botão para criar um novo evento */}
      <div style={{ marginTop: '20px', maxWidth: '200px' }}>
         <Link to="/organizer/create-event">
            <Button>Criar Novo Evento</Button>
        </Link>
        <Link to="/organizer/check-in">
          <Button style={{ background: '#17a2b8' }}>Fazer Check-in</Button>
        </Link>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Meus Eventos</h3>
        
        {/* Lógica de renderização condicional */}
        {loading ? (
          <p>Carregando eventos...</p>
        ) : myEvents.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Mapeia a lista de eventos e renderiza um card para cada um */}
            {myEvents.map(event => (
              <div key={event.id}> {/* Container para o card e o botão */}
                <EventCard event={event} />
                <div style={{ margin: '0 10px 20px 10px', maxWidth: '300px' }}>
                  <Link to={`/organizer/manage-event/${event.id}`}>
                    <Button>Gerenciar</Button>
                  </Link>
                </div>
              </div>
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