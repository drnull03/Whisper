const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy("MyForwarder");
  await forwarder.waitForDeployment();

  console.log("Forwarder deployed to:",await forwarder.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
