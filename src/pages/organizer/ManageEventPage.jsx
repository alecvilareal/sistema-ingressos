import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getEventById, getTicketLots, addTicketLot } from '../../services/eventService';
import { createCoupon, getCouponsByEventId } from '../../services/couponService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './ManageEventPage.module.css';

const ManageEventPage = () => {
  const { eventId } = useParams();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [lots, setLots] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o formulário de novo lote
  const [lotName, setLotName] = useState('');
  const [lotPrice, setLotPrice] = useState('');
  const [lotQuantity, setLotQuantity] = useState('');

  // Estados para o formulário de novo cupom
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [usesLeft, setUsesLeft] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventData, lotsData, couponsData] = await Promise.all([
        getEventById(eventId),
        getTicketLots(eventId),
        getCouponsByEventId(eventId)
      ]);
      setEvent(eventData);
      setLots(lotsData);
      setCoupons(couponsData);
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
      price: parseFloat(lotPrice),
      quantity: parseInt(lotQuantity, 10),
    };

    try {
      await addTicketLot(eventId, newLotData);
      alert('Lote de ingresso criado com sucesso!');
      setLotName('');
      setLotPrice('');
      setLotQuantity('');
      fetchData();
    } catch (error) {
      console.error("Falha ao adicionar lote", error);
      alert(`Erro: ${error.message}`);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    const newCouponData = {
      code: couponCode.toUpperCase(),
      discountType: discountType,
      discountValue: parseFloat(discountValue),
      usesLeft: parseInt(usesLeft, 10),
      eventId: eventId,
      organizerId: currentUser.uid,
    };

    try {
      await createCoupon(newCouponData);
      alert('Cupom criado com sucesso!');
      setCouponCode('');
      setDiscountValue('');
      setUsesLeft('');
      fetchData();
    } catch (error) {
      console.error("Falha ao criar cupom", error);
      alert(`Erro: ${error.message}`);
    }
  };
  
  if (loading) return <p>A carregar...</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Gerir Evento: {event.name}</h2>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Lotes de Ingressos</h3>
          <form onSubmit={handleAddLot} className={styles.form}>
            <Input placeholder="Nome do Lote (ex: Pista, 1º Lote)" value={lotName} onChange={e => setLotName(e.target.value)} required />
            <Input type="number" placeholder="Preço (ex: 50.00)" value={lotPrice} onChange={e => setLotPrice(e.target.value)} step="0.01" required />
            <Input type="number" placeholder="Quantidade Disponível" value={lotQuantity} onChange={e => setLotQuantity(e.target.value)} required />
            <Button type="submit">Adicionar Lote</Button>
          </form>

          <ul className={styles.itemList}>
            {lots.length > 0 ? lots.map(lot => (
              <li key={lot.id} className={styles.item}>
                <span><strong>{lot.name}</strong> - {(lot.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                <span>Qtd: {lot.quantity}</span>
              </li>
            )) : <p>Nenhum lote cadastrado.</p>}
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Cupons de Desconto</h3>
          <form onSubmit={handleAddCoupon} className={styles.form}>
            <Input placeholder="Código (ex: PROMO10)" value={couponCode} onChange={e => setCouponCode(e.target.value)} required />
            <select value={discountType} onChange={e => setDiscountType(e.target.value)} style={{ width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' }}>
              <option value="percentage">Percentagem (%)</option>
              <option value="fixed">Valor Fixo (R$)</option>
            </select>
            <Input type="number" placeholder="Valor do Desconto" value={discountValue} onChange={e => setDiscountValue(e.target.value)} step="0.01" required />
            <Input type="number" placeholder="Quantidade de Usos" value={usesLeft} onChange={e => setUsesLeft(e.target.value)} required />
            <Button type="submit">Criar Cupom</Button>
          </form>

          <ul className={styles.itemList}>
            {coupons.length > 0 ? coupons.map(coupon => (
              <li key={coupon.id} className={styles.item}>
                <span><strong>{coupon.code}</strong> - {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' BRL'}</span>
                <span>Usos: {coupon.usesLeft}</span>
              </li>
            )) : <p>Nenhum cupom cadastrado.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ManageEventPage;