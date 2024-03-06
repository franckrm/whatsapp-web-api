
const express = require('express');
const router = new express.Router();
const whatsappclient = require("../services/WhatsappClient")

router.get('/', (req, res) => {
  res.send('Hello Tested');
});

router.post("/message", (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const message = req.body.message;
  console.log("Número de telefone:", phoneNumber);
  console.log("Mensagem:", message);
  whatsappclient.sendMessage(req.body.phoneNumber, req.body.message);
  res.send();
})

module.exports = router