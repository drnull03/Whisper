const hre = require("hardhat");
const { ethers } = hre;
const getBalances = require('./utils')

async function main() {
  // Get signers - we'll use two accounts to demonstrate sender/relayer
  const [somguy,sender, relayer] = await ethers.getSigners();
  
  // Get deployed contract instances
  const Forwarder = await ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
  
  const MetaGreeter = await ethers.getContractFactory("MetaGreeter");
  const greeter = await MetaGreeter.attach("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853");
  await getBalances()
  console.log("Sender address:", sender.address);
  console.log("Relayer address:", relayer.address);
  
  console.log("Forwarder address:", await forwarder.getAddress());
  console.log("Greeter address:", await greeter.getAddress());

  // Step 1: Prepare the meta-transaction
  const greeting = "Hello from meta-tx!";
  const greeterInterface = new ethers.Interface([
    "function setGreeting(string calldata _greeting)"
  ]);
  const data = greeterInterface.encodeFunctionData("setGreeting", [greeting]);

  const nonce = await forwarder.nonces(sender.address);

  const request = {
    from: sender.address,
    to: await greeter.getAddress(),
    value: "0",
    gas: "100000",
    nonce: nonce.toString(),
    deadline: Math.floor(Date.now() / 1000) + 300,
    data: data,
  };

  // Step 2: Sign the meta-transaction (normally done by sender offline)
  const domain = {
    name: "MyForwarder", // Must match what you used in Forwarder constructor
    version: "0.0.1",
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: await forwarder.getAddress(),
  };

  const types = {
    ForwardRequest: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "gas", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
  };

  const signature = await sender.signTypedData(domain, types, request);
  const signedRequest = { ...request, signature };

  // Step 3: Relay the meta-transaction (typically done by a relayer)
  console.log("\nSending meta-transaction...");



  const tx = await forwarder.connect(relayer).execute(signedRequest);
  await tx.wait();
  console.log("hello")
  await forwarder.connect(relayer).execute(request, signature);

  await tx.wait();
  console.log("ass")
  // Step 4: Verify the greeting was set
  const currentGreeting = await greeter.greet();
  console.log("\nCurrent greeting:", currentGreeting);
  console.log("Success! Meta-transaction was executed.");
  await getBalances();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});