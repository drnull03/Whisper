
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhisperV3Module", (m) => {
  // 1. Get deployer account (first signer)
  const deployer = m.getAccount(0);

  // 2. Deploy SHUSH Token
  const shush = m.contract("SHUSH", [], {
    from: deployer
  });

  // 3. Deploy Whisper with SHUSH address
  const whisper = m.contract("contracts/WhisperV3.sol:Whisper", [shush], {
    from: deployer
  });

  // 4. Set Whisper contract in SHUSH
  m.call(shush, "setWhisper", [whisper], {
    from: deployer,
    id: "SetWhisperInShush" // Unique identifier for this operation
  });

  return { shush, whisper };
});