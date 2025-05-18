import fs from 'fs';
import { generateKeys } from './encryptionUtils.mjs';



    async function registerThreeUsers(whisper, addresses) {
    const user1 = addresses[12];
    const user2 = addresses[13];
    const user3 = addresses[14];
    const { publicKey: aliceKey } = generateKeys();
    const { publicKey: bobKey } = generateKeys();
    const { publicKey: charlieKey } = generateKeys();
    //whisper.connect(user1).registerUser("")
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


async function registerMe(whisper,ourAddress){
    const { publicKey: myKey } = generateKeys();
    await whisper.connect(ourAddress).registerUser("diaa@whisper.eth",myKey);
}



async function registerUser(whisper,address,email){
    const { publicKey: key } = generateKeys();
    await whisper.connect(address).registerUser(email,key);

}

async function resolveENS(whisper,address,email){
    return await whisper.connect(address).ENS(email);
}


async function getBalance(shush,address){
    const balance = await shush.balanceOf(address);
    const humanReadable = ethers.formatUnits(balance, 18);
    return humanReadable;
}


async function getInbox(whisper,address){
    return await whisper.connect(address).getInbox();
}

async function clearInbox(whisper,address){
    return await whisper.connect(address).clearInbox();
}

async function getSent(whisper,address){
    return await whisper.connect(address).getSent();
}


async function clearSent(whisper,address){
    return await whisper.connect(address).clearSent();
}


async function updateEncryptionKey(whisper,address,email){
    const { publicKey: key } = generateKeys();
    await whisper.connect(address).updateEncryptionKey(key,email)
}

export {
    registerThreeUsers,
    registerMe,
    getBalance,
    resolveENS,
    registerUser,
    getInbox,
    getSent,
    clearInbox,
    clearSent,
    updateEncryptionKey
};
