// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TrustScoreRegistry {
    // A nested mapping to store reviews for each user (reviewee) submitted by another user (reviewer).
    // Structure: registry[reviewer][reviewee][key] = score
    mapping(address => mapping(address => mapping(bytes32 => bytes)))
        public registry;

    // A struct to represent review, containing the reviewee's address, a key (identifier), and a score (review details).
    struct Review {
        address reviewee;
        bytes32 key;
        bytes val;
    }

    // An event to notify listeners when a new review is created (useful for dapps).
    // It includes the reviewer's address, reviewee's address, the key (identifier), and the score (review details).
    event ReviewCreated(
        address indexed reviewer,
        address indexed reviewee,
        bytes32 indexed key,
        bytes val
    );

    // createReview function accepts an array of Review structs as input and stores them in the contract.
    // It also emits a ReviewCreated event for each review in the array.
    function createReview(Review[] memory _reviews) public {
        for (uint256 i = 0; i < _reviews.length; ++i) {
            Review memory review = _reviews[i];

            require(
                msg.sender != review.reviewee,
                "User cannot review themselves"
            );

            registry[msg.sender][review.reviewee][review.key] = review.val;
            emit ReviewCreated(
                msg.sender,
                review.reviewee,
                review.key,
                review.val
            );
        }
    }
}
