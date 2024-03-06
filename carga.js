const amqp = require('amqplib');

async function publishMultipleMessages() {
  const rabbitmqHost = process.env.RABBITMQ_HOST || '172.25.181.216';
  const rabbitmqPort = process.env.RABBITMQ_PORT || 5672;
  const rabbitmqUser = process.env.RABBITMQ_USER || 'ribeirovisk';
  const rabbitmqPassword = process.env.RABBITMQ_PASSWORD || 'Hce@123';

  // Cria a URL de conexão com o RabbitMQ
  const connectionURL = `amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}`;

  try {
    // Conecta ao RabbitMQ
    const connection = await amqp.connect(connectionURL);
    const channel = await connection.createChannel();

    // Nome da fila
    const queueName =  'send-immediately';

    // Declara a fila, caso não exista
    await channel.assertQueue(queueName);

    // Array de mensagens a serem enviadas
    const messages = [
      `{
          "phoneNumber": "5521968629008@c.us",
          "message": "1 Lembre de consulta teste"
        }`,
        `{
          "phoneNumber": "5521979544303@c.us",
          "message": "2 Lembre de consulta teste"
        }`,
        `{
          "phoneNumber": "5521967293735@c.us",
          "message": "3 Lembre de consulta teste"
        }`,
        `{
          "phoneNumber": "5521976055455@c.us",
          "message": "4 Lembre de consulta teste"
        }`,
        // `{
        //     "phoneNumber": "5521979544303@c.us",
        //     "message": "Consulta amanha fds"
        // }`,
        // `{
        //     "phoneNumber": "5521979544303@c.us",
        //     "message": "Consulta amanha fds"
        // }`,
        // `{
        //     "phoneNumber": "5521979544303@c.us",
        //     "message": "Consulta amanha fds"
        // }`,
        // `{
        //     "phoneNumber": "5521979544303@c.us",
        //     "message": "Consulta amanha fds"
        // }`,
    ];

    // Envia cada mensagem do array
    for (const message of messages) {
      channel.sendToQueue(queueName, Buffer.from(message));
      console.log(`Mensagem enviada: ${message}`);
    }

    // Fecha a conexão após enviar todas as mensagens
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error.message);
  }
}

// Chama a função para enviar múltiplas mensagens
publishMultipleMessages();
