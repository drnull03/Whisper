// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureContract is Ownable {
    uint256 public secretValue;


    constructor() Ownable(msg.sender) {}
    // Only the owner can set this value
    function setSecretValue(uint256 _value) public onlyOwner {
        secretValue = _value;
    }

    // Anyone can read the value
    function getSecretValue() public view returns (uint256) {
        return secretValue;
    }
}
