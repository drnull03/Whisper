const hre = require("hardhat");

async function main() {
  const initialValue = 100;
  const myContract = await hre.ethers.deployContract("Calculator");

  await myContract.waitForDeployment();

  console.log(
    `MyContract deployed to ${myContract.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});