import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();

const CONTRACT_ADDRESS = "0xc530ea65d19fcf09a1fb9aedc820e06fb38f35a0";

async function main() {
  const SBT = await ethers.getContractFactory("TrustSightSBT");
  const sbt = await SBT.attach(CONTRACT_ADDRESS);
  const tx = await sbt.tokenURI(1);
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
