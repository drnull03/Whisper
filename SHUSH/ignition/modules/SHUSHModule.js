const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SHUSH", (m) => {
  const shush = m.contract("SHUSH"); // No constructor args
  return { shush };
});