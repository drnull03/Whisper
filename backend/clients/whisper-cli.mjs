
// Import the MimeText package using ES Modules
import { simpleParser } from 'mailparser';
import NodeRSA from 'node-rsa';
import { performance } from 'perf_hooks';
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

  return { encryptor, decryptor };
}


async function encryptText(encryptor, text) {

return await encryptor.encryptAsync(text,'base64');
}



async function decryptText(decryptor,text){

  return await decryptor.decryptAsync(text,'utf-8');
}



const {encryptor,decryptor}=generateKeys();












/*
console.log(raw)



simpleParser(raw)
.then(parsed => {
  //console.log(parsed.subject); // Extract subject
  //console.log(parsed.text); // Extract plain text body
  console.log(parsed)// Extract attachments

  
})
.catch(err => console.error('Error parsing:', err));

*/



/*
async function main(){











}




main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});*/