import fs from 'fs'

const path = '../clients/snapshots.json'

async function main() {




    //take one snapshot after deployment
    //const snapshotId = await network.provider.send("evm_snapshot");
    //const snapshots = [];
    //const message = 'Deployed State';
    //snapshots.push({snapshotId,message});
    fs.writeFileSync(path, JSON.stringify([], null, 2));
    console.log("Cleared Snapshots !!!");





}


await main();