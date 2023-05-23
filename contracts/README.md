# TrustScoreRegistry

This is a solidity smart contract for the Binance Smart Chain , which maintains a registry of trust scores. Each user (identified by their Binance Smart Chain address) can submit a review for another user, which is then stored on the blockchain.

## Contract Details

The contract `TrustScoreRegistry` stores user reviews in a nested mapping, where each review is associated with a reviewer, a reviewee, and an identifier key. The structure of the nested mapping is as follows:

```solidity
mapping(address => mapping(address => mapping(bytes32 => bytes))) public registry;
```

The `Review` struct is used to represent a single review, which includes the reviewee's address, a key (identifier), and a value (review details).

```solidity
struct Review {
    address reviewee;
    bytes32 key;
    bytes val;
}
```

An event `ReviewCreated` is emitted each time a new review is created. This event includes the reviewer's address, reviewee's address, the key (identifier), and the value (review details).

```solidity
event ReviewCreated(
    address indexed reviewer,
    address indexed reviewee,
    bytes32 indexed key,
    bytes val
);
```
## Functions
- `createReview(Review[] memory _reviews)`: This function accepts an array of Review structs as input and stores them in the contract. It also emits a ReviewCreated event for each review in the array. The function contains a condition to ensure that a user cannot review themselves.

```solidity
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

```

## Development
After cloning the repository, you can compile the contract with solc or the Solidity compiler of your choice, then deploy it using the Hardhat script below.

## License
This project is licensed under the MIT License.

