// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract MetaGreeter is ERC2771Context {
    string private greeting;

    constructor(address trustedForwarder) ERC2771Context(trustedForwarder) {}

    function setGreeting(string calldata _greeting) external {
        greeting = _greeting;
    }

    function greet() external view returns (string memory) {
        return greeting;
    }

    function versionRecipient() external pure returns (string memory) {
        return "1.0.0";
    }
}
