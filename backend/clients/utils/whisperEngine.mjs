
import WhisperClient from "./blockchainUtils.mjs"
import { isValidEmail } from "./emailParserUtils.mjs";
import { generateKeys } from "./encryptionUtils.mjs";
import chalk from 'chalk';


//this file should contain final whisper functionality


class WhisperEngine{



    constructor(whisper,shush,ourAddress,addresses){
        this.client = new WhisperClient(whisper,shush,ourAddress,addresses);
    }


    
    async  register(address,name){
        
        
        if(!isValidEmail(name)){
            console.log(chalk.red.bold("Error: This is not a valid Email !!!"));
            console.log(chalk.yellow("a correct email should end with @whisper.eth as a suffix, it shouldn't be longer than 22 characters and contains no special characters !"));
            process.exit(1);
            
        }
        
        const { encryptor, decryptor,publicKey,privateKey }=generateKeys();
        
        await this.client.registerUser(address,name,publicKey);
        //save name and encrpytion iformation on local file

        

    }






};