    const { onCall, HttpsError } = require("firebase-functions/v2/https");
    const admin = require("firebase-admin");
    const db = admin.firestore();

    exports.setUserRole = onCall(async (request) => {
      // 1. VERIFICAÇÃO DE SEGURANÇA:
      // Verifica se o usuário que está a chamar esta função é um admin.
      // A propriedade 'role' vem do Custom Claim que vamos definir.
      if (request.auth.token.role !== 'admin') {
        throw new HttpsError(
          "permission-denied",
          "Apenas administradores podem alterar os papéis dos usuários."
        );
      }

      // 2. OBTENÇÃO DOS DADOS:
      // Pega o email do usuário-alvo e o novo papel que queremos atribuir.
      const { email, newRole } = request.data;
      const validRoles = ['admin', 'promoter', 'funcionario', 'cliente'];

      if (!email || !newRole || !validRoles.includes(newRole)) {
        throw new HttpsError(
          "invalid-argument",
          "Por favor, forneça um e-mail e um papel válido."
        );
      }

      try {
        // 3. ENCONTRAR O USUÁRIO-ALVO:
        const user = await admin.auth().getUserByEmail(email);

        // 4. ATRIBUIR AS PERMISSÕES (CUSTOM CLAIMS):
        // Esta é a parte mais importante. Define o 'role' no token de autenticação.
        await admin.auth().setCustomUserClaims(user.uid, { role: newRole });

        // 5. ATUALIZAR O FIRESTORE (PARA CONSISTÊNCIA):
        // Também guardamos o papel no banco de dados para facilitar as consultas.
        const userRef = db.collection('users').doc(user.uid);
        await userRef.set({ role: newRole }, { merge: true });

        return {
          success: true,
          message: `Sucesso! O usuário ${email} agora tem o papel de ${newRole}.`,
        };
      } catch (error) {
        console.error("Erro ao definir o papel do usuário:", error);
        throw new HttpsError("internal", "Ocorreu um erro ao processar a sua solicitação.");
      }
    });
    
