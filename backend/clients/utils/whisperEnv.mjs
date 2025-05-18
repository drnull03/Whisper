import fs from 'fs';
import path from 'path';
import { generateKeys } from './encryptionUtils.mjs';

class WhisperEnvironment {
    constructor(snapshotFile = 'snapshots.json') {
        this.snapshotFile = snapshotFile;
        this.snapshots = [];
        this.whisper = null;
        this.shush = null;
        this.ourAddress = null;
        this.addresses = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        await this.setUpContracts();
        await this.readSnapshots();
        this.initialized = true;
    }

    getContractAddresses() {
        const filePath = path.resolve(
            '/home/drnull/Whisper/backend/ignition/deployments/chain-31337/deployed_addresses.json'
        );
        const deployed = JSON.parse(fs.readFileSync(filePath));
        return {
            whisperAddress: deployed['WhisperV3Module#Whisper'],
            shushAddress: deployed['WhisperV3Module#SHUSH'],
        };
    }

    async setUpContracts() {
        const { whisperAddress, shushAddress } = this.getContractAddresses();
        const addresses = await ethers.getSigners();
        this.ourAddress = addresses[4];
        this.addresses = addresses;

        const Whisper = await ethers.getContractFactory('contracts/WhisperV3.sol:Whisper');
        this.whisper = Whisper.attach(whisperAddress);

        const Shush = await ethers.getContractFactory('SHUSH');
        this.shush = Shush.attach(shushAddress);
    }

    async readSnapshots() {
        if (fs.existsSync(this.snapshotFile)) {
            const data = fs.readFileSync(this.snapshotFile);
            this.snapshots = JSON.parse(data);
        }

        if (this.snapshots.length === 0) {
            await this.takeSnapshot('First Deployment');
        }
    }

    async saveSnapshots() {
        fs.writeFileSync(this.snapshotFile, JSON.stringify(this.snapshots, null, 2));
    }

    async takeSnapshot(message) {
        // Skip if snapshot with same message exists
        const exists = this.snapshots.some(s => s.message === message);
        if (exists) {
            console.log(`Snapshot with message "${message}" already exists. Skipping.`);
            return;
        }
        const snapshotId = await network.provider.send('evm_snapshot');
        this.snapshots.push({ snapshotId, message });
        await this.saveSnapshots();
        console.log(`Snapshot taken: "${message}" (ID: ${snapshotId})`);
    }

    async revertSnapshot(message) {
        const index = this.snapshots.findIndex(s => s.message === message);
        if (index === -1) {
            console.log('Snapshot not found for:', message);
            return;
        }

        // Revert
        await network.provider.send('evm_revert', [this.snapshots[index].snapshotId]);

        // Truncate and refresh snapshot for reuse
        this.snapshots = this.snapshots.slice(0, index + 1);
        const newSnapshotId = await network.provider.send('evm_snapshot');
        this.snapshots[index].snapshotId = newSnapshotId;
        await this.saveSnapshots();

        console.log(`Reverted to "${message}" and refreshed snapshot ID to ${newSnapshotId}`);
    }

    async revertToInitialSnapshot() {
        const first = this.snapshots[0];
        if (!first) {
            console.log('No initial snapshot to revert to.');
            return;
        }

        await network.provider.send('evm_revert', [first.snapshotId]);
        this.snapshots = [first];

        const newSnapshotId = await network.provider.send('evm_snapshot');
        this.snapshots[0].snapshotId = newSnapshotId;
        await this.saveSnapshots();

        console.log(`Reverted to initial snapshot and refreshed ID to ${newSnapshotId}`);
    }

    async clearSnapshots() {
        this.snapshots = [];
        fs.writeFileSync(this.snapshotFile, JSON.stringify([], null, 2));
        console.log('Snapshots cleared');
    }
}

const whisperEnv = new WhisperEnvironment();
export default whisperEnv;
