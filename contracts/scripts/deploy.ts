import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

async function main() {
  const TrustScoreRegistry = await ethers.getContractFactory(
    "TrustScoreRegistry"
  );
  const trustScoreRegistry = await TrustScoreRegistry.deploy();
  await trustScoreRegistry.deployed();

  console.log(`TrustScoreRegistry deployed to ${trustScoreRegistry.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
