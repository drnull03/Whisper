// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";         // ERC-20 core
import "@openzeppelin/contracts/access/AccessControl.sol";       // Role‐based access
import "@openzeppelin/contracts/utils/Pausable.sol";             // Pausable checks

error UrNotWhisper();
error ShushIsNonTransferable();
error AlreadyClaimedShushToken(address user);

contract SHUSH is ERC20, AccessControl, Pausable {
    event WhisperUpdated(address indexed newWhisper);
    event Claimed(address indexed user);
    event Burned(address indexed user,uint256 amount);




    address public WhisperContract;
    mapping(address => bool) public hasClaimed;


    modifier onlyWhisper() {
        if (msg.sender != WhisperContract) revert UrNotWhisper();
        _;
    }


    /// @notice Set the only external contract allowed to mint/burn
    function setWhisper(address _whisper) external onlyRole(DEFAULT_ADMIN_ROLE) {
        WhisperContract = _whisper;
        emit WhisperUpdated(_whisper);
    }


   modifier firstTimeClaim(address user) {
    if(hasClaimed[user]){
        revert AlreadyClaimedShushToken(user);
    }
    _;
   }


    


    constructor() ERC20("SHUSH Token", "SHUSH") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        WhisperContract=msg.sender;
    }

    

    /// @notice Pause all token moves
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Unpause token moves
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    

    /// @notice One-time claim of 100 SHUSH, only via Whisper
    function claimInitial(address _user) external onlyWhisper firstTimeClaim(_user) {
        
        hasClaimed[_user] = true;
        _mint(_user, 100 * 10 ** decimals());
        emit Claimed(_user);
    }

    /// @notice Burn SHUSH from any user, only via Whisper
    function burnFrom(address _from, uint256 _amount) external onlyWhisper {
        _burn(_from, _amount);
        emit Burned(_from,_amount);
    }

    /// @dev Central hook for all balance changes; block transfers
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused  {
        // Allow minting (from == zero), burning (to == zero), or calls from WhisperContract
        if (
            from != address(0) &&           // not mint
            to   != address(0)            // not burn    
        ) {
            revert ShushIsNonTransferable();
        }
        super._update(from, to, amount);
    }
}
