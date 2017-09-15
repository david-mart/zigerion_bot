const admin = require("firebase-admin");

var serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zigerion-bot-db.firebaseio.com"
});

module.exports = admin.database();
