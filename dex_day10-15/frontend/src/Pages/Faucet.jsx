import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
const faucetABI = [
  "function requestTokenA() external",
  "function requestTokenB() external",
  "function getFaucetBalance() external view returns (uint256, uint256)",
  "event TokensReceived(address indexed user, uint256 amount)"
]
const faucetAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
const Faucet = () => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [balanceA, setBalanceA] = useState(0)
  const [balanceB, setBalanceB] = useState(0)
  const checkMetaMask = () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use the faucet.");
      return false;
    }
    return true;
  };

  const requestTokenA = async () => {
    if (!checkMetaMask()) return;
    try {
      setIsRequesting(true);
      setError(null);
      setSuccess(null);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const faucetContract = new ethers.Contract(faucetAddress, faucetABI, signer);
      const tx = await faucetContract.requestTokenA();
      await tx.wait();
      setSuccess("TokenA successfully requested!");
      fetchBalances();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const requestTokenB = async () => {
    if (!checkMetaMask()) return;
    try {
      setIsRequesting(true);
      setError(null);
      setSuccess(null);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const faucetContract = new ethers.Contract(faucetAddress, faucetABI, signer);
      const tx = await faucetContract.requestTokenB();
      await tx.wait();
      setSuccess("TokenB successfully requested!");
      fetchBalances();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsRequesting(false);
    }
  };
  const fetchBalances = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

      // const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();  
      const faucetContract = new ethers.Contract(faucetAddress, faucetABI, signer);
      const balances = await faucetContract.getFaucetBalance();
      setBalanceA(balances[0].toString());
      setBalanceB(balances[1].toString());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch balances.");
    }
  }
  useEffect(() => {
    fetchBalances();
  }
    , [balanceA, balanceB])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      <div className="bg-white border-4 border-black p-10 rounded-3xl shadow-[8px_8px_0px_0px_black] w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-black leading-tight">
          🚰 Token Faucet
        </h1>

        <div className="mb-10">
          <div className="p-4 border-2 border-black rounded-xl bg-pink-300 mb-4 text-center">
            <p className="text-xl font-bold text-black">TokenA Balance:</p>
            <p className="text-2xl font-mono">{ethers.formatEther(balanceA)}</p>
          </div>
          <div className="p-4 border-2 border-black rounded-xl bg-cyan-300 text-center">
            <p className="text-xl font-bold text-black">TokenB Balance:</p>
            <p className="text-2xl font-mono">{ethers.formatEther(balanceB)}</p>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <button
            onClick={requestTokenA}
            disabled={isRequesting}
            className="bg-blue-400 hover:bg-blue-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
          >
            {isRequesting ? "Requesting..." : "Request TokenA"}
          </button>
          <button
            onClick={requestTokenB}
            disabled={isRequesting}
            className="bg-green-400 hover:bg-green-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
          >
            {isRequesting ? "Request TokenB" : " Request TokenB"}
          </button>
        </div>

        {success && (
          <div className="mt-6 p-4 bg-lime-300 border-2 border-black rounded-xl text-center font-bold shadow-[4px_4px_0px_0px_black]">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-300 border-2 border-black rounded-xl text-center font-bold shadow-[4px_4px_0px_0px_black]">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Faucet