import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ?? "0x8d52577beae02D3FE7d8C33AF7f5B00c291C7603";

async function main() {
  const TrustScoreRegistry = await ethers.getContractFactory(
    "TrustScoreRegistry"
  );
  const trustScoreRegistry = await TrustScoreRegistry.attach(CONTRACT_ADDRESS);

  // Replace with actual reviewee address and review details
  const revieweeAddress = "0x5Dfd095B154137B31D54712d1695E55a55001cd0";
  const reviewKey = ethers.utils.formatBytes32String("Review1");
  const reviewValue = ethers.utils.toUtf8Bytes("Review 1 details");

  const review = {
    reviewee: revieweeAddress,
    key: reviewKey,
    val: reviewValue,
  };

  const tx = await trustScoreRegistry.createReview([review]);
  const receipt = await tx.wait();

  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
