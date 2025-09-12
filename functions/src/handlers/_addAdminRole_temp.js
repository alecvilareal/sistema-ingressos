    const { onCall, HttpsError } = require("firebase-functions/v2/https");
    const admin = require("firebase-admin");

    // Esta função só deve ser usada uma vez para criar o primeiro admin.
    // DEPOIS DE USAR, APAGUE ESTA FUNÇÃO E FAÇA O DEPLOY NOVAMENTE.
    exports.addAdminRole = onCall(async (request) => {
      const email = request.data.email;
      try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
        
        // Também atualiza o Firestore
        const db = admin.firestore();
        await db.collection('users').doc(user.uid).set({ role: 'admin' }, { merge: true });
        
        return { message: `Sucesso! O usuário ${email} agora é um administrador.` };
      } catch (error) {
        console.error("Erro ao adicionar o primeiro admin:", error);
        throw new HttpsError("internal", "Erro ao adicionar admin.");
      }
    });
    
