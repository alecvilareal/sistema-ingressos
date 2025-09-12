import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminUsersPage = () => {
  const { currentUser } = useAuth(); // Obtém o usuário logado para pegar o token
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null); // Para feedback visual durante a atualização

  // Função para buscar a lista de usuários, usando useCallback para otimização
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Importa dinamicamente as funções do Firebase necessárias
      const { getFunctions, httpsCallable } = await import("firebase/functions");
      const { functions } = await import("../../config/firebaseConfig");
      
      const listUsersFunction = httpsCallable(functions, 'listUsers');
      const result = await listUsersFunction();
      setUsers(result.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os usuários quando a página é carregada
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Função que lida com a alteração do papel
  const handleRoleChange = async (email, newRole, uid) => {
    setSuccessMessage('');
    setError('');
    setUpdatingUserId(uid); // Ativa o estado de 'atualizando' para este usuário

    if (!currentUser) {
      setError("Administrador não autenticado.");
      setUpdatingUserId(null);
      return;
    }

    try {
      // 1. Obtém o token de autenticação do admin logado
      const idToken = await currentUser.getIdToken();

      // 2. Define a URL da nossa função HTTPS
      const url = "https://southamerica-east1-sistema-ingressos-app.cloudfunctions.net/setUserRole";

      // 3. Faz a chamada usando fetch, como uma API REST normal
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`, // Envia o token para verificação de segurança no backend
        },
        body: JSON.stringify({ data: { email, newRole } }), // Envia os dados no formato esperado pela função
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao alterar o papel do usuário.');
      }

      setSuccessMessage(result.data.message);
      fetchUsers(); // Atualiza a lista para refletir a mudança
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingUserId(null); // Desativa o estado de 'atualizando'
    }
  };

  if (loading) return <p>A carregar lista de usuários...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <h2>Gestão de Usuários</h2>
      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>ERRO: {error}</p>}
      {successMessage && <p style={{ color: 'green', border: '1px solid green', padding: '10px', borderRadius: '5px' }}>SUCESSO: {successMessage}</p>}
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Papel (Role)</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{user.email}</td>
              <td style={{ padding: '12px' }}><strong>{user.role}</strong></td>
              <td style={{ padding: '12px' }}>
                <select
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user.email, e.target.value, user.uid)}
                  disabled={updatingUserId === user.uid} // Desativa o select durante a atualização
                  style={{ padding: '8px', fontSize: '1em' }}
                >
                  <option value="cliente">Cliente</option>
                  <option value="funcionario">Funcionário</option>
                  <option value="promoter">Promoter</option>
                  <option value="admin">Admin</option>
                </select>
                {updatingUserId === user.uid && <span style={{ marginLeft: '10px' }}>A salvar...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;