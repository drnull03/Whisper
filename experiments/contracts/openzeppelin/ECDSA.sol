// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureVerifier {
    using ECDSA for bytes32;

    // Example function to verify a signed message
    function verifySignature(address signer, string memory message, bytes memory signature) public pure returns (bool) {
        // Hash the message (this will be the message you want to verify)
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        
        // Convert the message hash into an Ethereum-specific signed message hash
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        
        // Recover the signer address from the signature
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        
        // Compare the recovered signer address with the expected signer address
        return recoveredSigner == signer;
    }
}
