import NodeRSA from 'node-rsa';
import { promisify } from 'util';



function generateKeys() {
    //intentionally set it to 1024 for speed encryption and demo purposes
    const key = new NodeRSA({ b: 1024 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');
  
  
  
    const encryptor = new NodeRSA(publicKey, {
      encryptionScheme: 'pkcs1_oaep',
      environment: 'node'
    });
  
    const decryptor = new NodeRSA(privateKey, {
      encryptionScheme: 'pkcs1_oaep',
      environment: 'node'
    });
  
  
  
    encryptor.encryptAsync = promisify(encryptor.encrypt.bind(encryptor));
    decryptor.decryptAsync = promisify(decryptor.decrypt.bind(decryptor));
  
    return { encryptor, decryptor,publicKey,privateKey };
  }
  
  
  async function encryptText(encryptor, text) {
  
  return await encryptor.encryptAsync(text,'base64');
  }
  
  
  
  async function decryptText(decryptor,text){
  
    return await decryptor.decryptAsync(text,'utf-8');
  }




  export {
generateKeys,
encryptText,
decryptText
};