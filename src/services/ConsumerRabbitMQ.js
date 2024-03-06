const amqp = require('amqplib');

const queueName = 'send-immediately';
const rabbitMQHost = process.env.RABBITMQ_HOST || 'rabbitmq';
const rabbitMQPort = process.env.RABBITMQ_PORT || 5672;
const rabbitMQUser = process.env.RABBITMQ_USER || 'ribeirovisk';
const rabbitMQPassword = process.env.RABBITMQ_PASSWORD || 'Hce@123';

async function processarMensagem(numberMessageWhatsapp) {
  try {
    const whatsappclient = require("./WhatsappClient");  // Movido para dentro da função
    console.log("Número de telefone:", numberMessageWhatsapp.phoneNumber);
    console.log("Mensagem:", numberMessageWhatsapp.message);
    await whatsappclient.sendMessage(numberMessageWhatsapp.phoneNumber, numberMessageWhatsapp.message);
  } catch (error) {
    console.error('Erro ao processar mensagem:', error.message);
  }
}

async function consumirMensagens() {
  try {
    const connection = await amqp.connect({
      hostname: rabbitMQHost,
      port: rabbitMQPort,
      username: rabbitMQUser,
      password: rabbitMQPassword,
    });
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });

    console.log(`[*] Aguardando mensagens. Para sair, pressione CTRL+C`);

    channel.consume(queueName, (item) => {
      if (item !== null) {
        const numberMessageWhatsapp = JSON.parse(item.content.toString());
        processarMensagem(numberMessageWhatsapp);
        channel.ack(item);
      }
    });
  } catch (error) {
    console.error('Erro ao consumir mensagens:', error.message);
  }
}

module.exports = { consumirMensagens, processarMensagem };
