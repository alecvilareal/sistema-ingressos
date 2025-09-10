// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, getTicketLots } from '../services/eventService';
import Button from '../components/common/Button';
import Input from '../components/common/Input'; // Importe o Input para o seletor de quantidade
import { useCart } from '../contexts/CartContext'; // Importe o hook do carrinho

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Novo estado para controlar as quantidades de cada lote que o usuário quer adicionar
  const [quantities, setQuantities] = useState({});

  const { addToCart } = useCart(); // Pegue a função do nosso contexto de carrinho

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return; // Garante que temos um eventId antes de buscar
      try {
        setLoading(true);
        setError(''); // Limpa erros anteriores

        // Busca os dados do evento e os lotes em paralelo para mais eficiência
        const [eventData, lotsData] = await Promise.all([
          getEventById(eventId),
          getTicketLots(eventId)
        ]);
        
        if (eventData) {
          setEvent(eventData);
          setLots(lotsData);
          // Inicializa as quantidades para 0 para todos os lotes
          const initialQuantities = lotsData.reduce((acc, lot) => {
            acc[lot.id] = 0;
            return acc;
          }, {});
          setQuantities(initialQuantities);

        } else {
          setError('Evento não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar os dados do evento.');
        console.error("Erro ao carregar detalhes do evento:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]); // Executa toda vez que o eventId da URL mudar

  // Função para controlar a mudança na quantidade de um lote específico
  const handleQuantityChange = (lotId, value) => {
    // Garante que a quantidade seja um número e não seja negativa
    const numQuantity = Math.max(0, parseInt(value, 10) || 0); // O || 0 é para caso o input fique vazio
    setQuantities(prev => ({ ...prev, [lotId]: numQuantity }));
  };

  // Função para adicionar o lote selecionado ao carrinho
  const handleAddToCart = (lot) => {
    const quantityToAdd = quantities[lot.id] || 0;

    if (quantityToAdd <= 0) {
      alert("Por favor, selecione pelo menos 1 ingresso para adicionar ao carrinho.");
      return;
    }

    if (quantityToAdd > lot.quantity) {
      alert(`Quantidade indisponível. Restam apenas ${lot.quantity} ingresso(s) para este lote.`);
      return;
    }
    
    addToCart(lot, quantityToAdd);
    alert(`${quantityToAdd} ingresso(s) para "${lot.name}" adicionado(s) ao carrinho!`);
    // Opcional: Resetar a quantidade no input após adicionar ao carrinho
    setQuantities(prev => ({ ...prev, [lot.id]: 0 }));
  };


  // Renderização condicional para estados de carregamento e erro
  if (loading) {
    return <p>Carregando detalhes do evento...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!event) {
    return <p>Evento não encontrado.</p>; // Caso event seja nulo e não haja erro específico
  }

  // Estilos básicos para a página
  const pageStyle = { maxWidth: '800px', margin: 'auto', textAlign: 'left', padding: '20px' };
  const imageStyle = { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' };
  const descriptionStyle = { whiteSpace: 'pre-wrap', lineHeight: '1.6' };

  return (
    <div style={pageStyle}>
      <img src={event.imageUrl} alt={event.name} style={imageStyle} />
      <h1>{event.name}</h1>
      <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      <p><strong>Local:</strong> {event.location}</p>
      <hr style={{ margin: '30px 0' }} />
      <h3>Sobre o Evento</h3>
      <p style={descriptionStyle}>{event.description}</p>
      <hr style={{ margin: '30px 0' }} />

      {/* Seção de Ingressos Dinâmica */}
      <h3>Ingressos Disponíveis</h3>
      <div>
        {lots.length > 0 ? (
          lots.map(lot => (
            <div key={lot.id} style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column', // Mudei para coluna para melhor responsividade
              gap: '10px',
              backgroundColor: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1em' }}>{lot.name}</p>
                  <p style={{ margin: 0, color: '#007bff', fontSize: '1.2em' }}>
                    {lot.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small>Quantidade disponível: {lot.quantity}</small>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <label htmlFor={`qty-${lot.id}`}>Qtd:</label>
                <Input
                  id={`qty-${lot.id}`}
                  type="number"
                  min="0"
                  // A quantidade máxima é o que está disponível para o lote
                  max={lot.quantity}
                  value={quantities[lot.id] || 0}
                  onChange={(e) => handleQuantityChange(lot.id, e.target.value)}
                  style={{ width: '70px', textAlign: 'center' }}
                />
                <Button onClick={() => handleAddToCart(lot)} disabled={lot.quantity === 0}>
                  {lot.quantity === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum lote de ingresso disponível no momento.</p>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;