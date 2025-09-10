// src/pages/organizer/ManageEventPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, addTicketLot, getTicketLots } from '../../services/eventService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ManageEventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o formulário de novo lote
  const [lotName, setLotName] = useState('');
  const [lotPrice, setLotPrice] = useState('');
  const [lotQuantity, setLotQuantity] = useState('');

  // Função para buscar os dados do evento e os lotes
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventData, lotsData] = await Promise.all([
        getEventById(eventId),
        getTicketLots(eventId)
      ]);
      setEvent(eventData);
      setLots(lotsData);
    } catch (error) {
      console.error("Erro ao buscar dados do evento", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleAddLot = async (e) => {
    e.preventDefault();
    const newLotData = {
      name: lotName,
      price: parseFloat(lotPrice), // Converte para número
      quantity: parseInt(lotQuantity, 10), // Converte para número inteiro
    };

    try {
      await addTicketLot(eventId, newLotData);
      // Limpa o formulário e atualiza a lista de lotes
      setLotName('');
      setLotPrice('');
      setLotQuantity('');
      fetchData(); // Re-busca os dados para mostrar o novo lote
    } catch (error) {
      console.error("Falha ao adicionar lote", error);
    }
  };
  
  if (loading) return <p>Carregando...</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <div>
      <h2>Gerenciar Evento: {event.name}</h2>
      <hr />

      {/* Formulário para Adicionar Lotes */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <h3>Adicionar Novo Lote de Ingresso</h3>
        <form onSubmit={handleAddLot}>
          <Input placeholder="Nome do Lote (ex: Pista, 1º Lote)" value={lotName} onChange={e => setLotName(e.target.value)} required />
          <Input type="number" placeholder="Preço (ex: 50.00)" value={lotPrice} onChange={e => setLotPrice(e.target.value)} required />
          <Input type="number" placeholder="Quantidade Disponível" value={lotQuantity} onChange={e => setLotQuantity(e.target.value)} required />
          <Button type="submit">Adicionar Lote</Button>
        </form>
      </div>

      {/* Lista de Lotes Existentes */}
      <div>
        <h3>Lotes de Ingressos Cadastrados</h3>
        {lots.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {lots.map(lot => (
              <li key={lot.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <strong>{lot.name}</strong> - R$ {lot.price.toFixed(2)} - Quantidade: {lot.quantity}
                {/* Futuramente: Botões de Editar/Excluir */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum lote de ingresso cadastrado para este evento.</p>
        )}
      </div>
    </div>
  );
};

export default ManageEventPage;