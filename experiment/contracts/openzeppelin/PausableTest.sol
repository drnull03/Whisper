// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SecureContract is Ownable,Pausable{
    uint256 public secretValue;
    
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }


    constructor() Ownable(msg.sender) {}
    // Only the owner can set this value
    function setSecretValue(uint256 _value) public onlyOwner {
        secretValue = _value;
    }

    // Anyone can read the value
    function getSecretValue() public whenNotPaused view returns (uint256)  {
        return secretValue;
    }
}
