import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import "@nomiclabs/hardhat-ethers";

describe("TrustScoreRegistry", function () {
  async function deployFixture() {
    const TrustScoreRegistry = await ethers.getContractFactory(
      "TrustScoreRegistry"
    );
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const trustScoreRegistry = await TrustScoreRegistry.deploy();
    await trustScoreRegistry.deployed();

    return { trustScoreRegistry, owner, addr1, addr2, addrs };
  }

  describe("createReview", function () {
    it("Should create a review correctly", async function () {
      const { trustScoreRegistry, owner, addr1, addr2, addrs } =
        await loadFixture(deployFixture);

      const reviewKey = ethers.utils.formatBytes32String("Review1");
      const reviewValue = ethers.utils.toUtf8Bytes("Review 1 details");

      await trustScoreRegistry
        .connect(addr1)
        .createReview([
          { reviewee: addr2.address, key: reviewKey, val: reviewValue },
        ]);

      const storedReviewValue = await trustScoreRegistry.registry(
        addr1.address,
        addr2.address,
        reviewKey
      );

      expect(ethers.utils.arrayify(storedReviewValue)).to.deep.equal(
        reviewValue
      );
    });

    it("Should emit ReviewCreated event", async function () {
      const { trustScoreRegistry, owner, addr1, addr2, addrs } =
        await loadFixture(deployFixture);

      const reviewKey = ethers.utils.formatBytes32String("Review2");
      const reviewValue = ethers.utils.toUtf8Bytes("Review 2 details");

      await expect(
        trustScoreRegistry
          .connect(addr1)
          .createReview([
            { reviewee: addr2.address, key: reviewKey, val: reviewValue },
          ])
      )
        .to.emit(trustScoreRegistry, "ReviewCreated")
        .withArgs(addr1.address, addr2.address, reviewKey, reviewValue);
    });

    it("Should update a review correctly", async function () {
      const { trustScoreRegistry, addr1, addr2 } = await loadFixture(
        deployFixture
      );

      const reviewKey = ethers.utils.formatBytes32String("Review1");
      const reviewValue1 = ethers.utils.toUtf8Bytes("Review 1 details - old");
      const reviewValue2 = ethers.utils.toUtf8Bytes(
        "Review 1 details - updated"
      );

      await trustScoreRegistry
        .connect(addr1)
        .createReview([
          { reviewee: addr2.address, key: reviewKey, val: reviewValue1 },
        ]);

      await trustScoreRegistry
        .connect(addr1)
        .createReview([
          { reviewee: addr2.address, key: reviewKey, val: reviewValue2 },
        ]);

      const storedReviewValue = await trustScoreRegistry.registry(
        addr1.address,
        addr2.address,
        reviewKey
      );

      expect(ethers.utils.arrayify(storedReviewValue)).to.deep.equal(
        reviewValue2
      );
    });

    it("Should create multiple reviews correctly", async function () {
      const { trustScoreRegistry, addr1, addr2 } = await loadFixture(
        deployFixture
      );

      const reviewKey1 = ethers.utils.formatBytes32String("Review1");
      const reviewValue1 = ethers.utils.toUtf8Bytes("Review 1 details");

      const reviewKey2 = ethers.utils.formatBytes32String("Review2");
      const reviewValue2 = ethers.utils.toUtf8Bytes("Review 2 details");

      await trustScoreRegistry.connect(addr1).createReview([
        { reviewee: addr2.address, key: reviewKey1, val: reviewValue1 },
        { reviewee: addr2.address, key: reviewKey2, val: reviewValue2 },
      ]);

      const storedReviewValue1 = await trustScoreRegistry.registry(
        addr1.address,
        addr2.address,
        reviewKey1
      );

      const storedReviewValue2 = await trustScoreRegistry.registry(
        addr1.address,
        addr2.address,
        reviewKey2
      );

      expect(ethers.utils.arrayify(storedReviewValue1)).to.deep.equal(
        reviewValue1
      );
      expect(ethers.utils.arrayify(storedReviewValue2)).to.deep.equal(
        reviewValue2
      );
    });

    it("Should fail when user tries to review themselves", async function () {
      const { trustScoreRegistry, addr1 } = await loadFixture(deployFixture);

      const reviewKey = ethers.utils.formatBytes32String("Review1");
      const reviewValue = ethers.utils.toUtf8Bytes("Review 1 details");

      await expect(
        trustScoreRegistry
          .connect(addr1)
          .createReview([
            { reviewee: addr1.address, key: reviewKey, val: reviewValue },
          ])
      ).to.be.revertedWith("User cannot review themselves");
    });
  });
});
