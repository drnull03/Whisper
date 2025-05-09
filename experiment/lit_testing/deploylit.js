const { ethers } = require('hardhat')
const fs= require("fs")


async function main() {

const [deployer] = await ethers.getSigners();
console.log("deploying using the account address",deployer.address)

const PKPNFT = await ethers.getContractFactory("PKPNFT");
const pkpNft = await PKPNFT.deploy();
await pkpNft.waitForDeployment();
const pkpNftAddress = await pkpNft.getAddress();
console.log("Address of PKPNFT",pkpNftAddress);




}


main().catch( (error) => {
console.error(error);
process.exitCode = 1;
})
