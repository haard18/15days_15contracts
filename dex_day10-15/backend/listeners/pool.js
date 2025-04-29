import { POOL } from "../lib/contract.js";
import { channel, connectToRabbitMQ } from "../lib/rabbitmq.js";

const startSwapListener = async () => {
    await connectToRabbitMQ();
    
    // Listen for A -> B swaps
    POOL.on("SwappedAforB", async (trader, amountA, amountB) => {
        const payload = {
            type: "SwappedAforB",
            trader,
            amountA: amountA.toString(),
            amountB: amountB.toString(),
            timestamp: Date.now()
        };

        await channel.sendToQueue("swaps", Buffer.from(JSON.stringify(payload)));
        console.log("Sent SwappedAforB:", payload);
    });

    // Listen for B -> A swaps
    POOL.on("SwappedBforA", async (trader, amountB, amountA) => {
        const payload = {
            type: "SwappedBforA",
            trader,
            amountB: amountB.toString(),
            amountA: amountA.toString(),
            timestamp: Date.now()
        };

        await channel.sendToQueue("swaps", Buffer.from(JSON.stringify(payload)));
        console.log("Sent SwappedBforA:", payload);
    });
};
const startLiquidityListener = async () => {
    await connectToRabbitMQ();

    POOL.on("LiquidityAdded", async (provider, amountA, amountB) => {
        const payload = {
            type: "LiquidityAdded",
            provider,
            amountA: amountA.toString(),
            amountB: amountB.toString(),
            timestamp: Date.now(),
        };

        await channel.sendToQueue("liquidity", Buffer.from(JSON.stringify(payload)));
        console.log("LiquidityAdded event sent:", payload);
    });

    POOL.on("LiquidityRemoved", async (provider, amountA, amountB) => {
        const payload = {
            type: "LiquidityRemoved",
            provider,
            amountA: amountA.toString(),
            amountB: amountB.toString(),
            timestamp: Date.now(),
        };

        await channel.sendToQueue("liquidity", Buffer.from(JSON.stringify(payload)));
        console.log("LiquidityRemoved event sent:", payload);
    });
};
export { startSwapListener , startLiquidityListener };
