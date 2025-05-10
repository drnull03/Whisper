const { ethers } = require('hardhat')

async function getBalances(){

    const accounts = await ethers.getSigners();

    for (const account of accounts) {
      const balance = await ethers.provider.getBalance(account.address);
      console.log(`${account.address}: ${ethers.formatEther(balance)} ETH`);
    }


}


module.exports = getBalances;