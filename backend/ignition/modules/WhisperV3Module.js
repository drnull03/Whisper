const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("WhisperModuleV3", (m) => {
  const shush = m.contract("SHUSH"); // No constructor args
  return { whisper };
});