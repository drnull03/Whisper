// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyAccessControlExample is AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        // msg.sender will be the DEFAULT_ADMIN_ROLE
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintSomething() public onlyRole(MINTER_ROLE) {
        // Only accounts with MINTER_ROLE can call this
    }

    function doAdminStuff() public onlyRole(DEFAULT_ADMIN_ROLE) {
        // Only Admin can call this
    }

    function giveMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function removeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }
}
