// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventDemo {
    event MessageLogged(string message);  // Simple event declaration
    
    function logMessage(string memory _message) public {
        emit MessageLogged(_message);  // Emit the event
    }
}