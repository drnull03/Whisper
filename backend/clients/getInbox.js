// scripts/interact.js
async function main() {
    const [deployer,secondAccount] = await ethers.getSigners();  // Get the first account (deployer)
    console.log("Interacting with contract from address:", deployer.address);
  
    // Replace with your deployed contract's address
    //0x5FbDB2315678afecb367f032d93F642f64180aa3
    const whisperAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Provide the actual address here
  
    // Get the contract instance
    const Whisper = await ethers.getContractFactory("contracts/WhisperV2.sol:Whisper");
    const whisper = await Whisper.attach(whisperAddress);  // Attach to the deployed contract
  
    // Call contract functions
    // For example, you could call a read function, like `getInbox()`


    await whisper.registerUser("diaa@Whisper.com","diaaPublicKey");
    
    const WhisperWithSecondAccount = whisper.connect(secondAccount);
    await WhisperWithSecondAccount.registerUser("nawar@Whisper.eth","nawarPublicKey");
    await WhisperWithSecondAccount.sendEmail("nawar@Whisper.eth","diaa@Whisper.com","hello f");

    sent = await WhisperWithSecondAccount.getSent();
    console.log("sent",sent);

    inbox = await whisper.getInbox();
    console.log("inbox",inbox);
    //inbox = await whisper.getInbox();
    //console.log("inbox",inbox);

    
  
    // If you want to send a transaction (e.g., calling `sendEmail`)
    // Make sure to call contract functions with the necessary parameters
    // const tx = await whisper.sendEmail("senderName", "recipientName", "ipfsCID");
  
    // If you send a transaction, wait for the receipt:
    // await tx.wait();
  
    // Example: Granting a role if your contract supports it (e.g., grantRole function)
    // const tx = await whisper.grantRole(role, account);
    // await tx.wait();
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  