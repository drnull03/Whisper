const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhisperModuleV1", (m) => {
  const whisper = m.contract("contracts/WhisperV1.sol:Whisper"); // No constructor args
  return { whisper };
});
