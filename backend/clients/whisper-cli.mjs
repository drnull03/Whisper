import whisperEnv from './utils/whisperEnv.mjs';
import { getBalance, registerMe, registerThreeUsers, registerUser, resolveENS } from './utils/blockchianUtils.mjs';
import { generateKeys } from './utils/encryptionUtils.mjs';
async function main() {
    await whisperEnv.init();
    await whisperEnv.revertToInitialSnapshot();
    //console.log(whisperEnwhisperEnvv.snapshots)
    //await whisperEnv.revertToInitialSnapshot();

    
    const whisper = whisperEnv.whisper;
    const shush = whisperEnv.shush;
    const ourAddress = whisperEnv.ourAddress;
    const addresses=whisperEnv.addresses;
    await registerMe(whisper,ourAddress);
    await registerUser(whisper,addresses[17],"ahmad@whisper.eth");
    console.log(await getBalance(shush,ourAddress));
    const identity = await resolveENS(whisper,ourAddress,"diaa@whisper.eth");
    console.log(identity);
}

await main();
