import { ethers } from "ethers";

// Sepolia RPC URL from Infura

const RPC_URL = `https://sepolia.infura.io/v3/550ff109045d4614871503c52a406e07`;

// Your wallet's private key
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
}

main();
