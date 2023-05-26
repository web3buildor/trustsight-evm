require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "evmosTestnet",
  // defaultNetwork: "hardhat",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    // bsctestnet: {
    //   url:
    //     process.env.BSC_TESTNET_RPC_URL ??
    //     "https://data-seed-prebsc-2-s3.binance.org:8545	",
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    evmosTestnet: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};
