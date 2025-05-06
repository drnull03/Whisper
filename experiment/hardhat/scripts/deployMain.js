const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  

  const MetaGreeter = await hre.ethers.getContractFactory("MetaGreeter");
  const metaGreeter = await MetaGreeter.deploy('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9');
  await metaGreeter.waitForDeployment();

  console.log("MetaGreeter deployed to:",await metaGreeter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
