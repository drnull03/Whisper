import { ethers } from "ethers";

// Sepolia RPC URL from Infura

const RPC_URL = `https://sepolia.infura.io/v3/550ff109045d4614871503c52a406e07`;

// Your wallet's private key
//don't attempt to use this key it has been changed
const PRIVATE_KEY = "47951a88df3bcf005fa13ec683bd45cf81b7b4351ae4fa7c9bc459a5cd8ad433"; 

// Create provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create wallet (signer) connected to provider
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Example function: Check wallet balance
async function main() {
  const address = await wallet.getAddress();
  console.log("Wallet address:", address);

  const balance = await provider.getBalance(address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  // (Optional) Send transaction example:
  // const tx = await wallet.sendTransaction({
  //   to: "0xRecipientAddressHere",
  //   value: ethers.parseEther("0.001")
  // });
  // console.log("Transaction sent:", tx.hash);
  // await tx.wait();
  // console.log("Transaction confirmed!");
  const CONTRACT_ADDRESS = "0xfb9E02ec7266DE1aEF5Df258c127eD5d381f6b9F";
  const CONTRACT_ABI = [
    {
      "inputs": [
        { "internalType": "uint256", "name": "x", "type": "uint256" },
        { "internalType": "uint256", "name": "y", "type": "uint256" }
      ],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "x", "type": "uint256" },
        { "internalType": "uint256", "name": "y", "type": "uint256" }
      ],
      "name": "div",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "x", "type": "uint256" },
        { "internalType": "uint256", "name": "y", "type": "uint256" }
      ],
      "name": "multi",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "x", "type": "uint256" },
        { "internalType": "uint256", "name": "y", "type": "uint256" }
      ],
      "name": "sub",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        { "internalType": "uint256", "name": "", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];


const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// 5. Call the add function
async function callAdd() {
  const a = 5; // example input
  const b = 10; // example input

  const tx = await contract.add(a, b);
  console.log("Transaction sent! Hash:", tx.hash);

  // Step 2: Wait for mining
  await tx.wait();
  console.log("Transaction mined!");

  // Step 3: Now call retrieve() or ret()
  const result = await contract.retrieve(); // or await contract.ret()
  console.log("Stored result:", result.toString());
}

callAdd();



}

main();
