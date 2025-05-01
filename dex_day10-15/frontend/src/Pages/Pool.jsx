import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const poolABI = [
    "function getReserves() external view returns (uint256, uint256)",
    "function swapAforB(uint256 amount) external",
    "function addLiquidity(uint256 amountA, uint256 amountB) external",
    "function removeLiquidity(uint256 liquidity) external",
    "function getLPTokenBalance(address user) external view returns (uint256)",
    "function swapBforA(uint256 amount) external",
    "event TokensSwapped(address indexed user, uint256 amountA, uint256 amountB)"
];
const TOKENABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",

]
const tokenA = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenB = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
const poolAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const Pool = () => {
    const [isSwapping, setIsSwapping] = useState(false);
    const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
    const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [balanceA, setBalanceA] = useState(0);
    const [balanceB, setBalanceB] = useState(0);
    const [swapAmountA, setSwapAmountA] = useState('');
    const [swapAmountB, setSwapAmountB] = useState('');
    const [addLiquidityA, setAddLiquidityA] = useState('');
    const [addLiquidityB, setAddLiquidityB] = useState('');
    const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState('');
    const [liquidity, setLiquidity] = useState(0);

    const checkMetaMask = () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please install MetaMask to interact with the pool.");
            return false;
        }
        return true;
    };

    const fetchPoolBalances = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
            const balances = await poolContract.getReserves();
            setBalanceA(ethers.formatEther(balances[0]));
            setBalanceB(ethers.formatEther(balances[1]));
        } catch (err) {
            console.error(err);
            setError("Failed to fetch pool balances.");
        }
    };

    const swapTokenAForTokenB = async () => {
        if (!checkMetaMask()) return;
        try {
            setIsSwapping(true);
            setError(null);
            setSuccess(null);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const tokenAContract = new ethers.Contract(tokenA, TOKENABI, signer);
            await tokenAContract.approve(poolAddress, ethers.parseEther(swapAmountA, 18));
            
            const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
            const amount = ethers.parseEther(swapAmountA,18);
            const tx = await poolContract.swapAforB(amount);
            await tx.wait();
            setSuccess(`${swapAmountA} TokenA swapped for TokenB!`);
            fetchPoolBalances();
        } catch (err) {
            console.error(err);
            setError("Swap failed. Try again.");
        } finally {
            setIsSwapping(false);
        }
    };

    const swapTokenBForTokenA = async () => {
        if (!checkMetaMask()) return;
        try {
            setIsSwapping(true);
            setError(null);
            setSuccess(null);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
            const amount = ethers.parseEther(swapAmountB);
            const tx = await poolContract.swapTokenBForTokenA(amount);
            await tx.wait();
            setSuccess(`${swapAmountB} TokenB swapped for TokenA!`);
            fetchPoolBalances();
        } catch (err) {
            console.error(err);
            setError("Swap failed. Try again.");
        } finally {
            setIsSwapping(false);
        }
    };

    const addLiquidity = async () => {
        if (!checkMetaMask()) return;
        try {
            setIsAddingLiquidity(true);
            setError(null);
            setSuccess(null);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const tokenAContract = new ethers.Contract(tokenA, TOKENABI, signer);
            const tokenBContract = new ethers.Contract(tokenB, TOKENABI, signer);
            const amountA = ethers.parseEther(addLiquidityA, 18);
            const amountB = ethers.parseEther(addLiquidityB, 18);
            // Approve the pool contract to spend the tokens
            const approveA = await tokenAContract.approve(poolAddress, amountA);

            await approveA.wait();
            const approveB = await tokenBContract.approve(poolAddress, amountB);
            await approveB.wait();
            // const amountA = ethers.parseEther(addLiquidityA, 18);
            const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
            console.log("Adding liquidity with amounts:", addLiquidityA, addLiquidityB);
            const tx = await poolContract.addLiquidity(amountA, amountB);
            await tx.wait();
            const liquidity = await poolContract.getLPTokenBalance(signer.getAddress());
            setLiquidity(ethers.formatEther(liquidity));

            setSuccess(`Liquidity added: ${addLiquidityA} TokenA and ${addLiquidityB} TokenB`);
            fetchPoolBalances();
        } catch (err) {
            console.error(err);
            setError("Adding liquidity failed. Try again.");
        } finally {
            setIsAddingLiquidity(false);
        }
    };

    const removeLiquidity = async () => {
        if (!checkMetaMask()) return;
        try {
            setIsRemovingLiquidity(true);
            setError(null);
            setSuccess(null);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const poolContract = new ethers.Contract(poolAddress, poolABI, signer);
            const liquidity = ethers.parseEther(removeLiquidityAmount);
            const tx = await poolContract.removeLiquidity(liquidity);
            await tx.wait();
            setSuccess(`Liquidity removed: ${removeLiquidityAmount} LP Tokens`);
            fetchPoolBalances();
        } catch (err) {
            console.error(err);
            setError("Removing liquidity failed. Try again.");
        } finally {
            setIsRemovingLiquidity(false);
        }
    };

    useEffect(() => {
        fetchPoolBalances();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
            <div className="bg-white border-4 border-black p-10 rounded-3xl shadow-[8px_8px_0px_0px_black] w-full max-w-md">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-black leading-tight">
                    💧 Liquidity Pool
                </h1>

                <div className="mb-10">
                    <div className="p-4 border-2 border-black rounded-xl bg-pink-300 mb-4 text-center">
                        <p className="text-xl font-bold text-black">Pool TokenA Balance:</p>
                        <p className="text-2xl font-mono">{balanceA}</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-xl bg-cyan-300 text-center">
                        <p className="text-xl font-bold text-black">Pool TokenB Balance:</p>
                        <p className="text-2xl font-mono">{balanceB}</p>
                    </div>
                </div>

                {/* Swap Section */}
                <div className="flex flex-col space-y-6">
                    <input
                        type="number"
                        placeholder="Amount of TokenA to swap"
                        value={swapAmountA}
                        onChange={(e) => setSwapAmountA(e.target.value)}
                        className="p-4 border-2 border-black rounded-xl mb-4 text-center"
                    />
                    <button
                        onClick={swapTokenAForTokenB}
                        disabled={isSwapping}
                        className="bg-blue-400 hover:bg-blue-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
                    >
                        {isSwapping ? "Swapping..." : "Swap TokenA for TokenB"}
                    </button>

                    <input
                        type="number"
                        placeholder="Amount of TokenB to swap"
                        value={swapAmountB}
                        onChange={(e) => setSwapAmountB(e.target.value)}
                        className="p-4 border-2 border-black rounded-xl mb-4 text-center"
                    />
                    <button
                        onClick={swapTokenBForTokenA}
                        disabled={isSwapping}
                        className="bg-green-400 hover:bg-green-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
                    >
                        {isSwapping ? "Swapping..." : "Swap TokenB for TokenA"}
                    </button>
                </div>

                {/* Add Liquidity Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-center text-black mb-4">Add Liquidity</h2>
                    <input
                        type="number"
                        placeholder="Amount of TokenA"
                        value={addLiquidityA}
                        onChange={(e) => setAddLiquidityA(e.target.value)}
                        className="p-4 border-2 border-black rounded-xl mb-4 text-center"
                    />
                    <input
                        type="number"
                        placeholder="Amount of TokenB"
                        value={addLiquidityB}
                        onChange={(e) => setAddLiquidityB(e.target.value)}
                        className="p-4 border-2 border-black rounded-xl mb-4 text-center"
                    />
                    <button
                        onClick={addLiquidity}
                        disabled={isAddingLiquidity}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
                    >
                        {isAddingLiquidity ? "Adding Liquidity..." : "Add Liquidity"}
                    </button>
                </div>

                {/* Remove Liquidity Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-center text-black mb-4">Remove Liquidity</h2>
                    <input
                        type="number"
                        placeholder="Amount of LP tokens"
                        value={removeLiquidityAmount}
                        onChange={(e) => setRemoveLiquidityAmount(e.target.value)}
                        className="p-4 border-2 border-black rounded-xl mb-4 text-center"
                    />
                    <button
                        onClick={removeLiquidity}
                        disabled={isRemovingLiquidity}
                        className="bg-red-400 hover:bg-red-500 text-black font-bold py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_black] transition-all duration-300"
                    >
                        {isRemovingLiquidity ? "Removing Liquidity..." : "Remove Liquidity"}
                    </button>
                </div>
                {/* Current Liquidity */}
                {liquidity > 0 && (
                    <div className="mt-6 p-4 bg-blue-300 border-2 border-black rounded-xl text-center font-bold shadow-[4px_4px_0px_0px_black]">
                        Current Liquidity: {liquidity} LP Tokens
                    </div>
                )}
                {/* Success/Failure Messages */}
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
    );
};

export default Pool;
