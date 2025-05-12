// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";         // ERC-20 core
import "@openzeppelin/contracts/access/AccessControl.sol";       // Role‐based access
import "@openzeppelin/contracts/utils/Pausable.sol";             // Pausable checks

error UrNotWhisper();

contract SHUSH is ERC20, AccessControl, Pausable {
    address public WhisperContract;
    mapping(address => bool) public hasClaimed;

    constructor() ERC20("SHUSH Token", "SHUSH") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Set the only external contract allowed to mint/burn
    function setWhisper(address _whisper) external onlyRole(DEFAULT_ADMIN_ROLE) {
        WhisperContract = _whisper;
    }

    /// @notice Pause all token moves
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpause token moves
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    modifier onlyWhisper() {
        if (msg.sender != WhisperContract) revert UrNotWhisper();
        _;
    }

    /// @notice One-time claim of 100 SHUSH, only via Whisper
    function claimInitial(address user) external onlyWhisper {
        require(!hasClaimed[user], "Already claimed");
        hasClaimed[user] = true;
        _mint(user, 100 * 10 ** decimals());
    }

    /// @notice Burn SHUSH from any user, only via Whisper
    function burnFrom(address from, uint256 amount) external onlyWhisper {
        _burn(from, amount);
    }

    /// @dev Central hook for all balance changes; block transfers
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused onlyWhisper {
        // Allow minting (from == zero), burning (to == zero), or calls from WhisperContract
        if (
            from != address(0) &&           // not mint
            to   != address(0) &&           // not burn
            msg.sender != WhisperContract   // not our controller
        ) {
            revert("SHUSH is non-transferable");
        }
        super._update(from, to, amount);
    }
}
