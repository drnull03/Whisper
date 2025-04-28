// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SHUSH is ERC20, Ownable {
    // Anti-spam parameters
    uint256 public constant INITIAL_BALANCE = 100 ether; // 20 SHUSH (18 decimals)
    uint256 public constant SPAM_PENALTY = 20 ether; // Penalty per spam flag
    uint256 public constant INACTIVITY_REWARD = 5 ether; // Daily reward
    uint256 public constant REGENERATION_RATE = 10 ether; // Weekly regeneration

    // Access tiers
    uint256 public constant FULL_ACCESS = 50 ether;
    uint256 public constant RATE_LIMITED = 20 ether;

    // User tracking
    mapping(address => uint256) public lastActivityTime;
    mapping(address => uint256) public lastRegenerationTime;

    // Whisper system address (can deduct/add tokens)
    address public whisperSystem;

    constructor() ERC20("SHUSH", "SHS") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10**18); // 1 million initial supply
    }

    // Only Whisper system can call this
    modifier onlyWhisper() {
        require(msg.sender == whisperSystem, "Not Whisper system");
        _;
    }

    // Set Whisper system address (admin-only)
    function setWhisperSystem(address _system) external onlyOwner {
        whisperSystem = _system;
    }

    // Mint initial balance for new users (callable by Whisper)
    function mintInitial(address user) external onlyWhisper {
        _mint(user, INITIAL_BALANCE);
        lastActivityTime[user] = block.timestamp;
        lastRegenerationTime[user] = block.timestamp;
    }

    // Penalize spammer (deduct SHUSH)
    function penalize(address spammer) external onlyWhisper {
        _burn(spammer, SPAM_PENALTY);
        lastActivityTime[spammer] = block.timestamp;
    }

    // Reward for reporting spam/inactivity
    function reward(address user, uint256 amount) external onlyWhisper {
        _mint(user, amount);
        lastActivityTime[user] = block.timestamp;
    }

    // Regenerate SHUSH over time (1/week)
    function regenerate(address user) public {
        require(
            block.timestamp >= lastRegenerationTime[user] + 1 weeks,
            "Wait 1 week"
        );
        if (balanceOf(user) < INITIAL_BALANCE) {
            _mint(user, REGENERATION_RATE);
        }
        lastRegenerationTime[user] = block.timestamp;
    }

    // Override ERC-20 transfers to make non-transferable
    function _update(address from, address to, uint256 amount) internal virtual override {
        require(
            from == address(0) || to == address(0) || msg.sender == whisperSystem,
            "SHUSH is non-transferable"
        );
        super._update(from, to, amount);
        
        // Update activity timestamp for both parties
        if (from != address(0)) {
            lastActivityTime[from] = block.timestamp;
        }
        if (to != address(0)) {
            lastActivityTime[to] = block.timestamp;
        }
    }

    // Check user's access tier
    function getAccessTier(address user) public view returns (string memory) {
        uint256 balance = balanceOf(user);
        if (balance >= FULL_ACCESS) return "Full";
        if (balance >= RATE_LIMITED) return "Rate-Limited";
        return "Blocked";
    }

    // Helper function to check if user can send emails
    function canSendEmails(address user) public view returns (bool) {
        return balanceOf(user) >= RATE_LIMITED;
    }
}
