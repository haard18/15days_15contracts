import { FAUCET } from "../lib/contract.js";
import { channel, connectToRabbitMQ } from "../lib/rabbitmq.js";

const startFaucetListener = async () => {
    await connectToRabbitMQ();

    FAUCET.on("TokensReceived", async (user, amount) => {
        // Create the event payload
        const payload = {
            type: "TokensReceived",
            user,
            amount: amount.toString(), // Convert BigNumber to string for safety
            timestamp: Date.now()
        };

        // Send to RabbitMQ
        await channel.sendToQueue("faucet", Buffer.from(JSON.stringify(payload)));
        console.log("TokensReceived event sent:", payload);
    });
};
export  { startFaucetListener };