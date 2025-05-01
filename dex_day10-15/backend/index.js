import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectToRabbitMQ } from './lib/rabbitmq.js';
import { startLiquidityListener, startSwapListener } from './listeners/pool.js';
import { startFaucetListener } from './listeners/faucet.js';
import { startLiquidityConsumer, startSwapConsumer } from './consumers/poolC.js';
import { server } from './lib/socket.js';

dotenv.config();

const app = express();
app.use(cors());

app.get('/', (_, res) => res.send('Swap listener running'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

(async () => {
    await connectToRabbitMQ();
    console.log("Connected to RabbitMQ");
    await startSwapListener(); // Keep the process alive
    console.log("Swap listener started"); // Will never reach here
    await startLiquidityListener(); // Keep the process alive
    console.log("Liquidity listener started"); // Will never reach here
    await startFaucetListener(); // Keep the process alive
    console.log("Faucet listener started"); // Will never reach here
    await startLiquidityConsumer(); // Keep the process alive
    console.log("Liquidity consumer started"); // Will never reach here
    await startSwapConsumer(); // Keep the process alive
    server.listen(5002, () => console.log('Server running on port 5002'));
    console.log("socket server started"); // Will never reach here

})();
