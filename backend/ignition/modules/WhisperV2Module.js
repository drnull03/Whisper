const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhisperModule", (m) => {
  const whisper = m.contract("contracts/WhisperV2.sol:Whisper"); // No constructor args
  return { whisper };
});
