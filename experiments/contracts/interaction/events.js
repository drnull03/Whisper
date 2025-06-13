const { ethers } = require("ethers");

// Connect to Ethereum provider (e.g., MetaMask or Infura)
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Your contract's ABI and address
const contractABI = [
  "event Transfer(address indexed from, address indexed to, uint256 amount)"
];
const contractAddress = "YOUR_CONTRACT_ADDRESS";

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Listen for the "Transfer" event
contract.on("Transfer", (from, to, amount) => {
    console.log(`Transfer event detected: ${from} sent ${amount} to ${to}`);
});
