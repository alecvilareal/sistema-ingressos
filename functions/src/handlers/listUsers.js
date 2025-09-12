// functions/src/handlers/listUsers.js
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

exports.listUsers = onCall(async (request) => {
  // 1. VERIFICAÇÃO DE SEGURANÇA: Apenas admins podem listar usuários.
  if (request.auth.token.role !== 'admin') {
    throw new HttpsError(
      "permission-denied",
      "Apenas administradores podem listar os usuários."
    );
  }

  try {
    // 2. BUSCA TODOS OS USUÁRIOS: O SDK Admin permite esta operação.
    const userRecords = await admin.auth().listUsers(100); // Lista os primeiros 100 usuários

    // 3. FORMATA A RESPOSTA: Envia apenas os dados necessários para o frontend.
    const users = userRecords.users.map(user => ({
      uid: user.uid,
      email: user.email,
      role: user.customClaims?.role || 'cliente', // Pega o papel dos custom claims
    }));

    return { users };

  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw new HttpsError("internal", "Não foi possível buscar a lista de usuários.");
  }
});