
import fs from 'fs'
import { generateKeys } from "./encryptionUtils.mjs"

let ourAddress;
let whisper;
let shush;
let whisperAddress;
let shushAddress;
let snapshotId;

async function getBalances() {

    const accounts = await ethers.getSigners();
    let counter = 1;
    for (const account of accounts) {

        const balance = await ethers.provider.getBalance(account.address);
        console.log(`account ${counter}: ${account.address}: ${ethers.formatEther(balance)} ETH`);
        counter++;
    }


}


function getContractAddress() {
    //using absolute path because it is only for demo
    const deployed_addresses = JSON.parse(fs.readFileSync("/home/drnull/Whisper/backend/ignition/deployments/chain-31337/deployed_addresses.json"));
    whisperAddress = deployed_addresses['WhisperV3Module#Whisper'];
    shushAddress = deployed_addresses['WhisperV3Module#SHUSH'];


    return { whisperAddress, shushAddress };
}






async function getUser() {
    //gonna add randomness later
    const addresses = await ethers.getSigners();
    const randomInt = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    ourAddress = addresses[randomInt];


    return ourAddress;
}


async function attachContracts() {
    try{
    const Whisper = await ethers.getContractFactory("contracts/WhisperV3.sol:Whisper");
    whisper = await Whisper.attach(whisperAddress);
    const Shush = await ethers.getContractFactory("SHUSH");
    shush = await Shush.attach(shushAddress);
    
    return { whisper, shush };
    }catch(error){
        console.log("There is no whisper contract at this address");
        return 0;
    }
}





async function registerMe(email, publicKey) {
    const whisperWithMainAccount = whisper.connect(ourAddress);
    await whisperWithMainAccount.registerUser(email, publicKey);

}


async function registerThreeUsers() {
    const addresses = await ethers.getSigners();
    const user1 = addresses[12];
    const user2 = addresses[13];
    const user3 = addresses[14];
    const { publicKey: aliceKey } = generateKeys();
    const { publicKey: bobKey } = generateKeys();
    const { publicKey: charlieKey } = generateKeys();
    const registerFirstUser = whisper.connect(user1).registerUser("alice@whisper.eth", aliceKey);
    const registerSecondUser = whisper.connect(user2).registerUser("bob@whisper.eth", bobKey);
    const registerThirdUser = whisper.connect(user3).registerUser("charlie@whisper.eth", charlieKey);


    //register three users concurrently
    await Promise.all([
        registerFirstUser,
        registerSecondUser,
        registerThirdUser
    ]);

}


async function setUpFirstLevelFixture() {
    getContractAddress();
    await attachContracts();
    

}


async function setUpSecondLevelFixture(){
    const { publicKey: myPubKey } = generateKeys();
    await getUser();
    await registerMe("diaa@whisper.eth", myPubKey);
    await registerThreeUsers();
}


async function takeSnapShot() {
    snapshotId = await network.provider.send("evm_snapshot");

}

async function revertLatestSnapShot() {
    if (snapshotId) {
        await network.provider.send("evm_revert", [snapshotId]);
    } else {
        await network.provider.send("hardhat_reset");
    }
}

async function main() {




await setUpFirstLevelFixture();
const pubKey=await whisper.connect(ourAddress).getPublicKeyOf("diaa@whisper.eth");
console.log(pubKey);






    /*
    
    
    
    
    
  
    
  
    
    
    
    
    
    
    
    
  
    
    
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
    
    
  */

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
