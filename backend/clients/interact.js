// scripts/interact.js
const fs = require("fs");



async function main() {
    const [deployer,secondAccount] = await ethers.getSigners();  // Get the first account (deployer)
    console.log("Interacting with contract from address:", deployer.address);
  
    
   // const whisperAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Provide the actual address here
  
    // Get the contract instance
    
    
    const { "WhisperModule#Whisper": whisperAddress } = JSON.parse(fs.readFileSync("/home/drnull/Whisper/backend/ignition/deployments/chain-31337/deployed_addresses.json"));
    
    
    
    
    
    const Whisper = await ethers.getContractFactory("contracts/WhisperV2.sol:Whisper");
    const whisper = await Whisper.attach(whisperAddress);  // Attach to the deployed contract
  
    
    
    //await whisper.registerUser("diaa@Whisper.com","diaaPublicKey");
    
    const WhisperWithSecondAccount = whisper.connect(secondAccount);
    //await WhisperWithSecondAccount.registerUser("nawar@Whisper.eth","nawarPublicKey");
    await WhisperWithSecondAccount.sendEmail("nawar@Whisper.eth","diaa@Whisper.com","hello f");

    sent = await WhisperWithSecondAccount.getSent();
    console.log("sent",sent);
    
    //inbox = await whisper.getInbox();
    //console.log("inbox",inbox);
    //inbox = await whisper.getInbox();
    //console.log("inbox",inbox);
    
    
  
 
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  