import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5002"); // 🔁 Adjust URL if deployed

export default function Events() {
  const [swaps, setSwaps] = useState([]);
  const [liquidityEvents, setLiquidityEvents] = useState([]);

  useEffect(() => {
    socket.on("swap_event", (data) => {
      setSwaps((prev) => [data, ...prev.slice(0, 9)]);
    });

    socket.on("liquidity_event", (data) => {
      setLiquidityEvents((prev) => [data, ...prev.slice(0, 9)]);
    });

    return () => {
      socket.off("swap_event");
      socket.off("liquidity_event");
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Recent Swaps</h2>
      <ul className="mb-6">
        {swaps.map((s, i) => (
          <li key={i} className="text-sm text-gray-700 mb-1">
            [{new Date(s.timestamp).toLocaleTimeString()}] {s.trader} swapped{" "}
            {s.amountA || s.amountB} {s.amountA ? "TokenA → TokenB" : "TokenB → TokenA"}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-2">Liquidity Events</h2>
      <ul>
        {liquidityEvents.map((e, i) => (
          <li key={i} className="text-sm text-gray-700 mb-1">
            [{new Date(e.timestamp).toLocaleTimeString()}] {e.provider}{" "}
            {e.type === "LiquidityAdded" ? "added" : "removed"} liquidity:
            {` ${e.amountA} TokenA + ${e.amountB} TokenB`}
          </li>
        ))}
      </ul>
    </div>
  );
}
