// src/components/common/EventCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '10px',
  width: '300px', // Largura fixa para melhor alinhamento
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'left',
  textDecoration: 'none', // Remove o sublinhado do link
  color: 'inherit',      // O texto herda a cor normal
  display: 'flex',         // Usando flexbox para melhor estrutura interna
  flexDirection: 'column',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const EventCard = ({ event }) => {
  const { id, name, date, location, imageUrl } = event; // Precisamos do ID aqui

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    // 2. Envolva todo o card com o componente Link
    <Link to={`/event/${id}`} style={cardStyle}>
      <img src={imageUrl} alt={name} style={imageStyle} />
      <div style={{ flexGrow: 1, paddingTop: '10px' }}> {/* Div para o conteúdo crescer */}
        <h3>{name}</h3>
        <p><strong>Data:</strong> {formattedDate}</p>
        <p><strong>Local:</strong> {location}</p>
      </div>
    </Link>
  );
};

export default EventCard;