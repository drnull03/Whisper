import { generateKeys } from './encryptionUtils.mjs';
import chalk from 'chalk';

function handleErrors(error) {
    console.error(chalk.red.bold("❌ Backend Error: Smart Contract reverted."));

    if (error.error?.message) {
        console.error(chalk.yellow(" • Revert message:"), error.error.message);
    } else if (error.reason) {
        console.error(chalk.yellow(" • Revert reason:"), error.reason);
    } else if (error.code === 'CALL_EXCEPTION') {
        console.error(chalk.yellow(' • CALL_EXCEPTION (generic revert)'));
    } else {
        console.error(chalk.yellow(' • Unexpected error:'), error.message);
    }

    process.exit(1);
}

class WhisperClient {
    constructor(whisper, shush, ourAddress = null, addresses = []) {
        this.whisper = whisper;
        this.shush = shush;
        this.ourAddress = ourAddress;
        this.addresses = addresses;
    }

    async registerUser(address, email, publicKey) {
        try {
            const key = publicKey;
            const tx = await this.whisper.connect(address).registerUser(email, key);
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async resolveENS(address, email) {
        try {
            return await this.whisper.connect(address).ENS(email);
        } catch (error) {
            handleErrors(error);
        }
    }

    async getPublicKeyOf(address, email) {
        try {
            return await this.whisper.connect(address).getPublicKeyOf(email);
        } catch (error) {
            handleErrors(error);
        }
    }

    async getInbox(address) {
        try {
            return await this.whisper.connect(address).getInbox();
        } catch (error) {
            handleErrors(error);
        }
    }

    async clearInbox(address) {
        try {
            const tx = await this.whisper.connect(address).clearInbox();
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async getSent(address) {
        try {
            return await this.whisper.connect(address).getSent();
        } catch (error) {
            handleErrors(error);
        }
    }

    async clearSent(address) {
        try {
            const tx = await this.whisper.connect(address).clearSent();
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async reportSpam(reporter, spammerEmail) {
        try {
            const tx = await this.whisper.connect(reporter).reportSpam(spammerEmail);
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async updateEncryptionKey(address, name, newPublicKey = null) {
        try {
            const key = newPublicKey || generateKeys().publicKey;
            const tx = await this.whisper.connect(address).updateEncryptionKey(key, name);
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async sendEmail(sender, fromEmail, toEmail, ipfsCID) {
        try {
            const tx = await this.whisper.connect(sender).sendEmail(fromEmail, toEmail, ipfsCID);
            await tx.wait();
            return tx;
        } catch (error) {
            handleErrors(error);
        }
    }

    async getBalance(address) {
        try {
            const balance = await this.shush.balanceOf(address);
            return ethers.formatUnits(balance, 18);
        } catch (error) {
            handleErrors(error);
        }
    }

    async registerThreeUsers() {
        try {
            if (!this.addresses || this.addresses.length < 15) {
                throw new Error('Address array is not properly initialized.');
            }
            const [user1, user2, user3] = [this.addresses[12], this.addresses[13], this.addresses[14]];
            const aliceKey = generateKeys().publicKey;
            const bobKey = generateKeys().publicKey;
            const charlieKey = generateKeys().publicKey;

            await Promise.all([
                this.registerUser(user1, 'alice@whisper.eth', aliceKey),
                this.registerUser(user2, 'bob@whisper.eth', bobKey),
                this.registerUser(user3, 'charlie@whisper.eth', charlieKey),
            ]);
        } catch (error) {
            handleErrors(error);
        }
    }

    async registerMe() {
        try {
            if (!this.ourAddress) throw new Error('ourAddress not set.');
            await this.registerUser(this.ourAddress, 'diaa@whisper.eth');
        } catch (error) {
            handleErrors(error);
        }
    }
}

export default WhisperClient;
