// src/components/common/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Importa o nosso arquivo de estilos
import styles from './EventCard.module.css';

const EventCard = ({ event }) => {
  const { id, name, date, location, imageUrl } = event;

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    // As classes vêm do objeto 'styles' que importamos
    <Link to={`/event/${id}`} className={styles.card}>
      <img src={imageUrl} alt={name} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <div className={styles.cardDetails}>
          <p><strong>Data:</strong> {formattedDate}</p>
          <p><strong>Local:</strong> {location}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;