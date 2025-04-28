// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BankV1.sol";

contract BankV2 is BankV1 {
    uint256 public minimumDeposit;

    function initializeV2(uint256 _minimumDeposit) public reinitializer(2) {
        minimumDeposit = _minimumDeposit;
    }

    function deposit() public payable override {
        require(msg.value >= minimumDeposit, "Deposit too small");
        totalDeposits += msg.value;
    }
}
