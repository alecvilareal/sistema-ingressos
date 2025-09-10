// src/pages/organizer/CreateEventPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent, uploadEventImage } from '../../services/eventService';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const CreateEventPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Você precisa estar logado para criar um evento.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Fazer upload da imagem e obter a URL
      const imageUrl = await uploadEventImage(eventImage);
      if (!imageUrl) {
        throw new Error("Falha no upload da imagem ou nenhuma imagem selecionada.");
      }

      // 2. Montar o objeto do evento
      const eventData = {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        description: eventDescription,
        imageUrl: imageUrl,
        organizerId: currentUser.uid, // Associa o evento ao usuário logado
        createdAt: new Date(),
      };

      // 3. Salvar o evento no Firestore
      await createEvent(eventData);

      // 4. Redirecionar para o dashboard após o sucesso
      navigate('/organizer/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Criar Novo Evento</h2>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Nome do Evento" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        <Input placeholder="Local do Evento" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
        <textarea
          placeholder="Descrição do Evento"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          style={{ width: '100%', minHeight: '100px', padding: '10px', margin: '5px 0' }}
          required
        ></textarea>
        <label>Banner do Evento</label>
        <Input type="file" onChange={handleImageChange} required />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Evento'}
        </Button>
      </form>
    </div>
  );
};

export default CreateEventPage;