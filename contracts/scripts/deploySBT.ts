import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

async function main() {
  const TrustSightSBT = await ethers.getContractFactory("TrustSightSBT");
  const trustSightSBT = await TrustSightSBT.deploy();
  await trustSightSBT.deployed();

  console.log(`TrustSightSBT deployed to ${trustSightSBT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
