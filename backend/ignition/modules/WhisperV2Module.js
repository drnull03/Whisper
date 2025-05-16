const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhisperModuleV2", (m) => {
  const whisper = m.contract("contracts/WhisperV2.sol:Whisper"); // No constructor args
  return { whisper };
});
