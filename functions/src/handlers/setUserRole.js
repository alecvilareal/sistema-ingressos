// functions/src/handlers/setUserRole.js
const { onRequest } = require("firebase-functions/v2/https"); // MUDANÇA: de onCall para onRequest
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Importa e configura o CORS

exports.setUserRole = onRequest(async (req, res) => {
  // Usa o middleware CORS para lidar com o pedido 'preflight' e adicionar os cabeçalhos
  cors(req, res, async () => {
    try {
      // 1. VERIFICAÇÃO DE SEGURANÇA MANUAL
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        res.status(403).send("Não autorizado: Token não fornecido.");
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.role !== 'admin') {
        res.status(403).send("Não autorizado: Apenas administradores podem executar esta ação.");
        return;
      }

      // 2. LÓGICA DA FUNÇÃO (agora lê do req.body)
      const { email, newRole } = req.body.data;
      const validRoles = ['admin', 'promoter', 'funcionario', 'cliente'];

      if (!email || !newRole || !validRoles.includes(newRole)) {
        res.status(400).send("Argumentos inválidos: Forneça um e-mail e um papel válido.");
        return;
      }

      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { role: newRole });

      const db = admin.firestore();
      const userRef = db.collection('users').doc(user.uid);
      await userRef.set({ role: newRole }, { merge: true });

      // 3. ENVIA A RESPOSTA DE SUCESSO
      res.status(200).send({
        data: { // O frontend espera um objeto 'data'
          success: true,
          message: `Sucesso! O usuário ${email} agora tem o papel de ${newRole}.`,
        }
      });

    } catch (error) {
      console.error("Erro ao definir o papel do usuário:", error);
      res.status(500).send({ error: "Ocorreu um erro interno." });
    }
  });
});