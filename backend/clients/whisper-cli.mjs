import whisperEnv from './utils/whisperEnv.mjs';
import WhisperClient from './utils/blockchainUtils.mjs';
import { Command } from 'commander';
import chalk from 'chalk';








const program = new Command();

program
    .name('whisper-cli')
    .description('CLI version for whisper program')
    .version('1.0.0');





program
    .command('register')
    .description('Register a new user')
    .requiredOption('--name <name>', 'Username')
    .action((options) => {
        console.log(chalk.yellow('Registering user:'));
        console.log(chalk.blue(`Name: ${options.name}`));
        // TODO: Call registerUser() from your Web3/ethers contract here
    });

// Send email
program
    .command('send')
    .description('Send an email')
    .requiredOption('--from <from>', 'Sender name')
    .requiredOption('--to <to>', 'Recipient name')
    .requiredOption('--cid <cid>', 'IPFS CID of the email')
    .action((options) => {
        console.log(chalk.yellow(`✉️ Sending email from ${options.from} to ${options.to}`));
        console.log(chalk.cyan(`IPFS CID: ${options.cid}`));
        // TODO: Call sendEmail() from your contract
    });

program.parse(process.argv);



async function main() {
await whisperEnv.init();




}

await main();
