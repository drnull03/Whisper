
import fs, { read } from 'fs'
import { generateKeys } from "./encryptionUtils.mjs"




Array.prototype.last = function () {
    if (this.length != 0) {
        return this[this.length - 1];
    }
    else {
        return 0;
    }
};

const addresses = await ethers.getSigners();
const ourAddress = addresses[4];
let whisper;
let shush;

let snapshots = [];

async function readSnapShots() {

    const data = fs.readFileSync('snapshots.json');
    snapshots = JSON.parse(data);
    if(snapshots.length == 0){
        
        
        await takeSnapShot("First Deployment");
    }
    

}

await readSnapShots();

///////////////////////////////////////









async function getBalances() {

    const accounts = await ethers.getSigners();
    let counter = 1;
    for (const account of accounts) {

        const balance = await ethers.provider.getBalance(account.address);
        console.log(`account ${counter}: ${account.address}: ${ethers.formatEther(balance)} ETH`);
        counter++;
    }


}


function getContractAddresses() {
    //using absolute path because it is only for demo
    const deployed_addresses = JSON.parse(fs.readFileSync("/home/drnull/Whisper/backend/ignition/deployments/chain-31337/deployed_addresses.json"));
    const whisperAddress = deployed_addresses['WhisperV3Module#Whisper'];
    const shushAddress = deployed_addresses['WhisperV3Module#SHUSH'];
    

    return { whisperAddress, shushAddress };
}







async function setUpContracts() {
    
        const { whisperAddress, shushAddress } = getContractAddresses();
        const Whisper = await ethers.getContractFactory("contracts/WhisperV3.sol:Whisper");
        whisper = await Whisper.attach(whisperAddress);
        const Shush = await ethers.getContractFactory("SHUSH");
        shush = await Shush.attach(shushAddress);

        return { whisper, shush };
    
}





async function registerMe(email, publicKey) {
    await whisper.connect(ourAddress).registerUser(email, publicKey);


}


async function setUpFixture() {
    const { publicKey: myPubKey } = generateKeys();
    await registerMe("diaa@whisper.eth", myPubKey);
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








async function takeSnapShot(message) {
    const snapshotId = await network.provider.send("evm_snapshot");
    //console.log(typeof(snapshotId));
    snapshots.push({ snapshotId, message });
    await saveSnapShots();
}

async function revertLatestSnapShot() {
    const { snapshotId } = snapshots.last();
   // console.log(typeof(snapshotId));
    if (snapshotId) {
        await network.provider.send("evm_revert", [snapshotId]);
        snapshots.pop();
        await saveSnapShots();
    } else {
        console.log("error no SnapShot yet !!!");
    }

}



async function saveSnapShots() {
    fs.writeFileSync('snapshots.json', JSON.stringify(snapshots, null, 2));
    //console.log("Saved snapshots to file.");

}



async function restorInitalState(){
const { snapshotId } = snapshots[0];
await network.provider.send("evm_revert", [snapshotId]);
await clearSnapShots();
}


//should not best used manually
async function clearSnapShots() {
    snapshots = []; // clear in memory

    fs.writeFileSync('snapshots.json', JSON.stringify([], null, 2));
    console.log("snapshots cleared !!!!");
}

async function main() {



await setUpContracts();
await setUpFixture();
await revertLatestSnapShot();
await setUpFixture();














}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
