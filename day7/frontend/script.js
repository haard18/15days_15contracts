let provider, signer, factory, FACTORY_ADDRESS;
FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with deployed

const factoryABI = [
  {
    type: "function",
    name: "createCoffeeContract",
    inputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployedContracts",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllDeployedContracts",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CoffeeContractDeployed",
    inputs: [
      {
        name: "artist",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "contractAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ContractAlreadyDeployed",
    inputs: [],
  },
]; // Load from factory.json
const coffeeABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "artistAddress",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allCoffees",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "message",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "artist",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "artistName",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyCoffee",
    inputs: [
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "message",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getAllCoffess",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct BuyMeCoffee.Coffeesbought[]",
        components: [
          {
            name: "name",
            type: "string",
            internalType: "string",
          },
          {
            name: "message",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalance",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "numberOfCoffees",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "NewCoffe",
    inputs: [
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "message",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "CannotBuyCoffee",
    inputs: [],
  },
  {
    type: "error",
    name: "NotArtist",
    inputs: [],
  },
]; // Load from coffee.json

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65");
    factory = new ethers.Contract(FACTORY_ADDRESS, factoryABI, signer);
    document.getElementById(
      "status"
    ).innerText = `Wallet connected: ${await signer.getAddress()}`;
  }
}

async function deployContract() {
  const name = document.getElementById("artistName").value;
  if (!name) return alert("Enter your name");

  try {
    const tx = await factory.createCoffeeContract(name);
    console.log("Transaction sent:", tx);

    const receipt = await tx.wait(); // Wait for the transaction to be mined
    console.log("Transaction mined:", receipt);

    document.getElementById(
      "status"
    ).innerText = `Contract deployed successfully!`;
  } catch (error) {
    console.error("Deployment failed:", error);
    document.getElementById(
      "status"
    ).innerText = `Deployment failed: ${error.message}`;
  }
}

async function listContracts() {
  provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const readFactory = new ethers.Contract(
    FACTORY_ADDRESS,
    factoryABI,
    provider
  );
  const contracts = await readFactory.getAllDeployedContracts();
  console.log("Deployed contracts:", contracts);

  const container = document.getElementById("contractList");
  container.innerHTML = ""; // Clear existing list

  for (const addr of contracts) {
    try {
      const coffeeContract = new ethers.Contract(addr, coffeeABI, provider);
      const name = await coffeeContract.artistName();

      const div = document.createElement("div");
      div.className = "neo-card";
      div.innerHTML = `
          <p><strong>Artist:</strong> ${name}</p>
          <p><strong>Contract:</strong> ${addr}</p>
          <input type="text" placeholder="Your Name" class="p-1 border w-full my-1" id="name-${addr}">
          <input type="text" placeholder="Message" class="p-1 border w-full my-1" id="msg-${addr}">
          <button onclick="sendCoffee('${addr}')">☕ Send 0.001 ETH</button>
        `;
      container.appendChild(div);
    } catch (err) {
      console.warn(`Failed to fetch artist name for contract ${addr}:`, err);
    }
  }
}

async function sendCoffee(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // This is your actual wallet signer
  
    const coffee = new ethers.Contract(address, coffeeABI, signer); // ← proper signer here
  
    const name = document.getElementById(`name-${address}`).value;
    const msg = document.getElementById(`msg-${address}`).value;
  
    const tx = await coffee.buyCoffee(name, msg, {
      value: ethers.utils.parseEther("0.02"),
    });
    await tx.wait();
    alert("Coffee sent!");
  }

window.onload = () => {
  if (location.pathname.includes("browse")) {
    listContracts();
  }
};
