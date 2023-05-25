# TrustScore Registry

This project is a trust scoring system, built on top of Binance Smart Chain blockchain, that uses the Eigentrust algorithm for computing trust scores in a decentralized network.

## Usage

The `main()` function is the entry point of the script. It starts by attaching to the `TrustScoreRegistry` contract on the Binance Smart Chain network. It then encodes a trust key and sets up a filter to listen for `AttestationCreated` events related to that key.

The `TrustScoreRegistry` contract is queried for `AttestationCreated` events. For each event, the creator and recipient are extracted and a trust relationship is added to the pool. The initial trust scores for each recipient are also set.

After all events are processed, the trust scores are computed using the Eigentrust algorithm. Each trust score is then updated on the `TrustScoreRegistry` contract.

## Functions

The primary functions of this script are:

- `createPool()`: Initializes a trust pool with default parameters.
- `encodeRawKey(rawKey)`: Encodes a raw key into a suitable format for storage and computation.
- `addTrust(pool, creator, recipient, score)`: Adds trust relationships to the trust pool.
- `initialTrust(pool, recipient, score)`: Sets the initial trust scores for recipients.
- `computeTrust(pool)`: Calculates the Eigentrust scores iteratively based on the trust pool's relationships.
- `computeIteration(pool, prevIteration)`: Performs a single iteration of the Eigentrust calculation.
- `avgD(prevIteration, currIteration)`: Calculates the average difference between two consecutive iterations.
- `main()`: The main entry point of the script.
- `createReview(recipient, score)`: Adds a review to the contract with the calculated trust score.


## Environment Variables

You need to setup the following environment variables:

- `CONTRACT_ADDRESS`: The address of the deployed `TrustScoreRegistry` contract.
- `BSC_TESTNET_RPC_URL`: The Binance Smart Chain Testnet RPC URL.
- `PRIVATE_KEY`: The private key of the Binance Smart Chain account.

Please make sure to replace these with your actual values.

## Dependencies

The project depends on the following packages:

- `hardhat`: A development environment to compile, deploy, test, and debug your contracts.
- `@nomiclabs/hardhat-ethers`: A hardhat plugin to interact with the blockchain.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
