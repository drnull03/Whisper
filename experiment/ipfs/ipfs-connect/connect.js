import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';

// Connect to the local IPFS node
const ipfs = create({ url: 'http://localhost:5001' });

// Add a file to IPFS
async function addFile() {
  const filePath = path.resolve('file.txt');
  const fileContent = fs.readFileSync(filePath);
  const { cid } = await ipfs.add({ path: 'file.txt', content: fileContent });
  console.log('Added file with CID:', cid.toString());
  return cid.toString();
}

// Retrieve a file from IPFS
async function getFile(cid) {
  const stream = ipfs.cat(cid);
  let data = '';

  for await (const chunk of stream) {
    data += chunk.toString();
  }

  console.log('Retrieved file content:', data);
}

// Example usage
(async () => {
  const cid = await addFile();
  await getFile(cid);
})();
