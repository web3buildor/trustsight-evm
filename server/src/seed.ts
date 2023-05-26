import { MongoClient, ServerApiVersion } from "mongodb";
import { addresses, reviews } from "./data";
import { ethers } from "ethers";
require("dotenv").config();

function generateEthereumAddresses(num: number): string[] {
  const addresses: string[] = [];

  for (let i = 0; i < num; i++) {
    const randomWallet = ethers.Wallet.createRandom();
    addresses.push(randomWallet.address);
  }

  return addresses;
}

type Review = {
  reviewer: string;
  reviewee: string;
  score: number;
  review: string;
  createdAt: string;
};

type Result = {
  _id: string;
  comment: string;
  governance: number;
  innovative: number;
  liquidity: number;
  tokenomics: number;
  reviewer: string;
  reviewee: string;
  transaction: null;
  trust: number;
};

const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

function mapReviews(reviews: Review[]): Result[] {
  const addresses = generateEthereumAddresses(reviews.length);

  return reviews.map((review, idx) => ({
    _id: `${addresses[idx]}:${review.reviewee}`,
    comment: review.review,
    governance: getRandomFourOrFive(),
    innovative: getRandomFourOrFive(),
    liquidity: getRandomFourOrFive(),
    tokenomics: getRandomFourOrFive(),
    reviewer: addresses[idx],
    reviewee: review.reviewee,
    transaction: null,
    trust: review.score,
    createdAt: getRandomDate(new Date("2023-05-02"), new Date("2023-05-13")),
    likes: {},
    comments: {},
  }));
}

function getRandomFourOrFive(): number {
  return Math.random() > 0.5 ? 5 : 4;
}

const uri = process.env.MONGO_URL ?? "";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  try {
    await client.connect();

    const addressesCollection = await client
      .db("trustsight-evmos")
      .collection("addresses");

    const addressKeys = Object.keys(addresses);

    for (let i = 0; i < addressKeys.length; i++) {
      await addressesCollection.updateOne(
        { _id: addressKeys[i] as any },
        { $set: addresses[addressKeys[i]] },
        { upsert: true }
      );
    }

    const reviewsCollection = await client
      .db("trustsight-evmos")
      .collection("reviews");

    const result = mapReviews(reviews);

    for (let i = 0; i < result.length; i++) {
      await reviewsCollection.updateOne(
        { _id: result[i]._id as any },
        { $set: result[i] },
        { upsert: true }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
