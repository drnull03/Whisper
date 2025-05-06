const hre = require("hardhat");

async function main() {
  // Replace with your actual contract address
  const calculatorAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  
  // Get the contract instance
  const Calculator = await hre.ethers.getContractFactory("Calculator");
  const calculator = await Calculator.attach(calculatorAddress);

  // Call the add function
  const a = 5;
  const b = 7;
  console.log(`Calling add(${a}, ${b})...`);
  
  // Method 1: Send transaction and wait for result
  const result = await calculator.add(a, b);
  
  // 4. Display the result
  console.log(`Result: ${result.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });