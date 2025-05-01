import { connectToRabbitMQ, channel } from "../lib/rabbitmq.js";
import { io } from "../lib/socket.js";
const startLiquidityConsumer = async () => {
    await connectToRabbitMQ();
    await channel.assertQueue("liquidity", { durable: false }); // 🔥 Fix
    channel.consume("liquidity", (msg) => {
        if (msg !== null) {
            const payload = JSON.parse(msg.content.toString());

            console.log("Liquidity Event Consumed:", payload);

            io.emit("liquidity_event", payload); // emit to all clients
            channel.ack(msg);
        }
    });
};

const startSwapConsumer = async () => {
    await connectToRabbitMQ();
    await channel.assertQueue("swaps", { durable: false }); // 🔥 Fix
    channel.consume("swaps", (msg) => {
        if (msg !== null) {
            const payload = JSON.parse(msg.content.toString());

            console.log("Swap Event Consumed:", payload);

            io.emit("swap_event", payload); // emit to all clients
            channel.ack(msg);
        }
    });
};

export { startLiquidityConsumer, startSwapConsumer };