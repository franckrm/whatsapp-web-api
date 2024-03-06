const amqp = require('amqplib');
const config = require("./config")

class Producer{
    channel;

    async createChannel(){
        const connection = await amqp.connect(config.rabboMQ.url);
        this.channel = connection.createChannel();
    }



    async publishMessage(routingKey, message){
        if(!this.channel){
            this.createChannel();
        }

        const exchangeName = config.rebbitMQ.exchangeName;

        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date()
        }

        await this.channel.publish(
            exchangeName, 
            routingKey, 
            Buffer.from(JSON.stringify(logDetails))
         );
    }
}