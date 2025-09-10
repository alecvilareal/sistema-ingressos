// src/components/common/EventCard.jsx

import React from 'react';

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '10px',
  maxWidth: '300px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'left',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const EventCard = ({ event }) => {
  // O objeto 'event' virá do Firestore
  const { name, date, location, imageUrl } = event;

  // Formata a data para um formato mais legível
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={cardStyle}>
      <img src={imageUrl} alt={name} style={imageStyle} />
      <h3>{name}</h3>
      <p><strong>Data:</strong> {formattedDate}</p>
      <p><strong>Local:</strong> {location}</p>
      {/* Futuramente, podemos adicionar um link/botão aqui */}
    </div>
  );
};

export default EventCard;