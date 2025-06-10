import NodeRSA from 'node-rsa';
import { promisify } from 'util';
import chalk from 'chalk';


function handleError(stage, error) {
  console.error(chalk.red.bold(`❌ ${stage} Error:`), error.message || error);
  process.exit(1);
}


function generateKeys() {
  try {
    const key = new NodeRSA({ b: 1024 }); // 1024-bit for demo
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    const encryptor = new NodeRSA(publicKey, {
      encryptionScheme: 'pkcs1_oaep',
      environment: 'node',
    });

    const decryptor = new NodeRSA(privateKey, {
      encryptionScheme: 'pkcs1_oaep',
      environment: 'node',
    });

    // Promisify async methods
    encryptor.encryptAsync = promisify(encryptor.encrypt.bind(encryptor));
    decryptor.decryptAsync = promisify(decryptor.decrypt.bind(decryptor));

    return { encryptor, decryptor, publicKey, privateKey };
  } catch (error) {
    handleError('Key Generation', error);
  }
}


async function encryptText(encryptor, text) {
  try {
    return await encryptor.encryptAsync(text, 'base64');
  } catch (error) {
    handleError('Encryption', error);
  }
}


 
async function decryptText(decryptor, text) {
  try {
    return await decryptor.decryptAsync(text, 'utf-8');
  } catch (error) {
    handleError('Decryption', error);
  }
}

export {
  generateKeys,
  encryptText,
  decryptText,
};
