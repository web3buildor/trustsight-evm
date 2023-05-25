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
    createdAt: review.createdAt,
  }));
}

function getRandomFourOrFive(): number {
  return Math.random() > 0.5 ? 5 : 4;
}

const MONGO_USER = process.env.MONGO_USER ?? "";
const MONGO_PW = process.env.MONGO_PW ?? "";

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.hsk5jk6.mongodb.net/?retryWrites=true&w=majority`;

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
      .db("trustsight")
      .collection("addresses");

    const addressKeys = Object.keys(addresses);

    for (let i = 0; i < addressKeys.length; i++) {
      await addressesCollection.updateOne(
        { _id: addressKeys[i] as any },
        { $set: addresses[addressKeys[i]] },
        { upsert: true }
      );
    }
    // const reviewsCollection = await client
    //   .db("trustsight")
    //   .collection("reviews");

    // const result = mapReviews(reviews);

    // for (let i = 0; i < result.length; i++) {
    //   await reviewsCollection.updateOne(
    //     { _id: result[i]._id as any },
    //     { $set: result[i] },
    //     { upsert: true }
    //   );
    // }
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
