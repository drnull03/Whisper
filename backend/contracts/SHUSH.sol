// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
// this is a ERC20 token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SHUSH is ERC20 {
    mapping(address => bool) public hasClaimed;

    constructor() ERC20("SHUSH Token", "SHUSH") {}

    /// @notice Allow each address to claim 100 SHUSH once
    //called only by Whisper
    function claimInitial(address _user) external {
        require(!hasClaimed[_user], "Already claimed");
        hasClaimed[_user] = true;
        _mint(_user, 100 * 10**decimals());
    }

    /// @notice Burn tokens from a user — called by Whisper contract
    function burnFrom(address from, uint256 amount) external {
        _burn(from, amount);
    }

    /// 🚫 Disable transfers
    function _transfer(address, address, uint256) internal pure override {
        revert("SHUSH is non-transferable");
    }

    /// 🚫 Disable approvals
    function approve(address, uint256) public pure override returns (bool) {
        revert("SHUSH is non-transferable");
    }

    function allowance(address, address) public pure override returns (uint256) {
        return 0;
    }

    /// 🚫 Disable transferFrom
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("SHUSH is non-transferable");
    }

    /// 🚫 Disable direct transfers
    function transfer(address, uint256) public pure override returns (bool) {
        revert("SHUSH is non-transferable");
    }
}
