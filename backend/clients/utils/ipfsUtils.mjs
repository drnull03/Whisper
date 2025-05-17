import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'http://localhost:5001' });


async function ipfsPop(cid) {
    try {
        const chunks = [];
        for await (const chunk of ipfs.cat(cid)) {
            
            chunks.push(chunk);
        }
        
        return Buffer.concat(chunks).toString();


    } catch (error) {
        console.log("ipfs error", error)
        return 'NaN';
    }

}


async function ipfsPush(text) {
    try {

        const { cid } = await ipfs.add(text);
        return cid.toString();

    } catch (error) {
        console.log("ipfs error", error)
        return 'NaN';
    }
}



export{
    ipfsPush,
    ipfsPop
};