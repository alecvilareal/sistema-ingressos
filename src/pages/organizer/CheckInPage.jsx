// src/pages/organizer/CheckInPage.jsx
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebaseConfig';

const CheckInPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: 'Aponte a câmara para um QR Code.', type: 'info' });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    const onScanSuccess = (decodedText) => {
      scanner.clear();
      setScanResult(decodedText);
    };

    const onScanError = (error) => {
      // console.warn(error); // Pode ser útil para depuração
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      // Limpeza quando o componente for desmontado
      if (scanner) {
        scanner.clear().catch(error => console.error("Falha ao limpar o scanner.", error));
      }
    };
  }, []);

  useEffect(() => {
    const validate = async () => {
      if (scanResult) {
        setIsLoading(true);
        setMessage({ text: `A validar ingresso: ${scanResult}...`, type: 'info' });

        try {
          const validateTicket = httpsCallable(functions, 'validateTicket');
          const result = await validateTicket({ ticketId: scanResult });

          if (result.data.success) {
            setMessage({ text: result.data.message, type: 'success' });
          } else {
            setMessage({ text: result.data.message, type: 'error' });
          }
        } catch (error) {
          setMessage({ text: 'Erro de comunicação com o servidor.', type: 'error' });
        } finally {
          setIsLoading(false);
          // Opcional: reiniciar o scanner após um tempo
        }
      }
    };
    validate();
  }, [scanResult]);

  const getMessageStyle = (type) => {
    const baseStyle = {
        padding: '20px',
        marginTop: '20px',
        borderRadius: '8px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        textAlign: 'center'
    };
    if (type === 'success') return { ...baseStyle, background: '#d4edda', color: '#155724' };
    if (type === 'error') return { ...baseStyle, background: '#f8d7da', color: '#721c24' };
    return { ...baseStyle, background: '#e2e3e5', color: '#383d41' };
  }

  return (
    <div>
      <h2>Check-in de Ingressos</h2>
      <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>
      { (isLoading || message.text) &&
        <div style={getMessageStyle(message.type)}>
          <p>{isLoading ? 'A processar...' : message.text}</p>
        </div>
      }
    </div>
  );
};

export default CheckInPage;