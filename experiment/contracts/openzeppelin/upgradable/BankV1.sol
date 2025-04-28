// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BankV1 is Initializable {
    address public owner;
    uint256 public totalDeposits;

    function initialize(address _owner) public initializer {
        owner = _owner;
        totalDeposits = 0;
    }

    function deposit() public payable virtual {
        totalDeposits += msg.value;
    }

    function withdrawAll() public {
        require(msg.sender == owner, "Not the owner");
        payable(owner).transfer(address(this).balance);
    }
}
