const hre = require("hardhat");

async function main() {
  // Deploy contract
  const EventDemo = await hre.ethers.getContractFactory("EventDemo");
  const eventDemo = await EventDemo.deploy();
  await eventDemo.waitForDeployment();
  console.log("Contract deployed to:", await eventDemo.getAddress());

  // Set up event listener
  console.log("\nSetting up event listener...");
  eventDemo.on("MessageLogged", (message) => {
    console.log("New event detected! Message:", message);
  });

  // Trigger the event
  console.log("\nLogging a message...");
  const tx = await eventDemo.logMessage("Hello Hardhat!");
  await tx.wait();

  // Wait a bit to catch the event
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Clean up
  eventDemo.removeAllListeners();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });