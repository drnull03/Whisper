// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract MerkleTree {
    bytes32[] private leaves;  // Array of leaves
    bytes32[] private merkleTree;  // The whole tree (root, nodes, leaves)

    // Constructor accepts an array of leaves
    constructor(bytes32[] memory _leaves) {
        require(_leaves.length > 0, "Leaves array can't be empty");
        leaves = _leaves;
        generateMerkleTree();
    }

    // Function to generate the Merkle Tree
    function generateMerkleTree() private {
        // Initialize merkle tree with leaves
        merkleTree = leaves;

        // Loop through leaves and build the tree
        while (merkleTree.length > 1) {
            uint256 n = merkleTree.length;
            require(n % 2 == 0, "Leaves count must be even for this simple implementation");

            bytes32[] memory nextLevel = new bytes32[](n / 2);

            // Combine and hash pairs of nodes
            for (uint256 i = 0; i < n; i += 2) {
                nextLevel[i / 2] = keccak256(abi.encodePacked(merkleTree[i], merkleTree[i + 1]));
            }

            merkleTree = nextLevel;  // Update the merkle tree to the new level
        }
    }

    // Function to get the Merkle Root (final hash)
    function getMerkleRoot() public view returns (bytes32) {
        require(merkleTree.length == 1, "Tree has not been generated");
        return merkleTree[0];
    }

    // Function to get the leaves of the tree
    function getLeaves() public view returns (bytes32[] memory) {
        return leaves;
    }

    // Function to add a new leaf and regenerate the tree
    function addLeaf(bytes32 newLeaf) public {
        leaves.push(newLeaf);
        generateMerkleTree(); // Rebuild the tree
    }
}

