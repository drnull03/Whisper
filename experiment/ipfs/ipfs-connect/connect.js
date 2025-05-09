import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Initialize the IPFS client
const ipfs = create({ url: 'http://localhost:5001' });

// Function to retrieve and convert file content
async function getFile(cid) {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const content = buffer.toString('utf-8');
    console.log('Retrieved file content:', content);
  } catch (error) {
    console.error('Error retrieving file:', error);
  }
}

// Example usage
const cid = 'QmYregh1mU7otV4s37hXLKnJ2fk2e8yFbJmU9L9cM6yrQM'; // Replace with your CID
getFile(cid);
