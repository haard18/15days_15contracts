import amqp from 'amqplib/callback_api.js';
let channel;
const connectToRabbitMQ = async () => {

    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
            if (error0) {
                return reject(error0);
            }
            connection.createChannel((error1, ch) => {
                if (error1) {
                    return reject(error1);
                }
                channel = ch;
                resolve();
            });
        });
    });
};
export { connectToRabbitMQ, channel };