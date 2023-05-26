import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express, { Request, Response, Express } from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import { projects } from "./data";
import { fetchSBTTokenURI } from "./tokenURI";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app: Express = express();
const port = process.env.PORT ?? 8888;
const MONGO_USER = process.env.MONGO_USER ?? "";
const MONGO_PW = process.env.MONGO_PW ?? "";

dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.hsk5jk6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/api/address/:address", async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    await client.connect();

    const addressesCollection = await client
      .db("trustsight")
      .collection("addresses");

    const metadata = await addressesCollection.findOne({ address });

    if (metadata) res.status(200).send(metadata);
    else {
      const newMetadata = {
        username: "",
        subtitle: "",
        image: "",
        address: address,
        category: "",
        createdAt: "",
        description: "",
        flags: 0,
        followers: {},
        following: {},
      };
      await addressesCollection.updateOne(
        { _id: address as any },
        { $set: newMetadata },
        { upsert: true }
      );
      res.status(200).send(newMetadata);
    }
  } catch (error) {
    console.error("Error while processing request:", error);
    res.status(500).send("An error occurred while communicating with GPT-4.");
  }
});

type Review = Record<string, any>;

function computeAverage(reviews: Review[]): Review {
  if (reviews.length === 0) {
    return { trust: 0 };
  }

  const total = reviews.reduce((acc, curr) => {
    for (const key in curr) {
      if (typeof curr[key] === "number") {
        acc[key] = (acc[key] || 0) + curr[key];
      }
    }
    return acc;
  }, {} as Review);

  const count = reviews.length;

  const average = {} as Review;
  for (const key in total) {
    average[key] = total[key] / count;
  }

  return average;
}

app.get("/api/reviews", async (req: Request, res: Response) => {
  try {
    await client.connect();

    const reviewsCollection = await client
      .db("trustsight")
      .collection("reviews");

    const reviews = await reviewsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).send(reviews);
  } catch (error) {
    console.error("Error while fetching reviews:", error);
    res.status(500).send("An error occurred");
  }
});

app.get(
  "/api/reviews/following/:address",
  async (req: Request, res: Response) => {
    const { address } = req.params;

    console.log(address);
    try {
      await client.connect();

      const addressesCollection = await client
        .db("trustsight")
        .collection("addresses");

      const metadata = await addressesCollection.findOne({ address });

      // array of addresses the addresss is following
      const following = metadata ? Object.keys(metadata.following) : [];

      const reviewsCollection = await client
        .db("trustsight")
        .collection("reviews");

      const reviewsAboutFollowing = await reviewsCollection
        .find({
          $or: [
            { reviewee: { $in: following } },
            { reviewer: { $in: following } },
          ],
        })
        .toArray();

      res.status(200).send(reviewsAboutFollowing);
    } catch (error) {
      console.error("Error while fetching reviews:", error);
      res.status(500).send("An error occurred");
    }
  }
);

app.get("/api/reviews/:address", async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    await client.connect();

    const reviewsCollection = await client
      .db("trustsight")
      .collection("reviews");

    const reviews = await reviewsCollection
      .find({
        $or: [{ reviewee: address }, { reviewer: address }],
      })
      .toArray();

    const givenReviews = reviews.filter(
      (r) => r.reviewer.toLocaleLowerCase() === address.toLocaleLowerCase()
    );
    const receivedReviews = reviews.filter(
      (r) => r.reviewee.toLocaleLowerCase() === address.toLocaleLowerCase()
    );

    const average = computeAverage(receivedReviews);

    res.status(200).send({
      scores: average,
      givenReviews,
      receivedReviews,
    });
  } catch (error) {
    console.error("Error while fetching reviews:", error);
    res.status(500).send("An error occurred");
  }
});

app.put("/api/reviews", async (req: Request, res: Response) => {
  const { _id, likes, newLike, newComment } = req.body;
  try {
    await client.connect();

    const reviewsCollection = await client
      .db("trustsight")
      .collection("reviews");

    if (newLike) {
      await reviewsCollection.updateOne(
        { _id: _id as any },
        {
          $set: {
            likes: { [newLike]: true },
          },
        },
        { upsert: true }
      );
    }

    if (newComment) {
      await reviewsCollection.updateOne(
        { _id: _id as any },
        {
          $set: {
            comments: { [newComment.commenter]: newComment },
          },
        },
        { upsert: true }
      );
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error while caching review:", error);
    res.status(500).send("An error occurred");
  }
});

app.get("/api/projects/:category", async (req: Request, res: Response) => {
  const { category } = req.params;
  try {
    const filteredProjects = projects.filter((p) => p.category === category);

    res.status(200).send(filteredProjects);
  } catch (error) {
    console.error("Error while processing request:", error);
    res.status(500).send("An error occurred while communicating with GPT-4.");
  }
});

app.get("/api/sbt/:address", async (req: Request, res: Response) => {
  const { address } = req.params;

  try {
    await client.connect();

    const addressesCollection = await client
      .db("trustsight")
      .collection("addresses");

    const reviewsCollection = await client
      .db("trustsight")
      .collection("reviews");

    const metadata = await addressesCollection.findOne({ address });

    const reviews = await reviewsCollection
      .find({ reviewee: address })
      .toArray();

    const average = computeAverage(reviews);
    const score = average.trust;
    const numReviews = reviews.length;

    const tokenURI = await fetchSBTTokenURI(
      address,
      metadata ? metadata.username : null,
      metadata ? metadata.image : null,
      score,
      numReviews
    );

    res.status(200).send({ tokenURI });
  } catch (error) {
    console.error("Error while processing request:", error);
    res.status(500).send("An error occurred while communicating with GPT-4.");
  }
});

app.post("/api/reviews", async (req: Request, res: Response) => {
  const { review } = req.body;
  const { reviewer, reviewee } = review;
  try {
    await client.connect();

    const reviewsCollection = await client
      .db("trustsight")
      .collection("reviews");

    await reviewsCollection.updateOne(
      { _id: `${reviewer}:${reviewee}` as any },
      { $set: review },
      { upsert: true }
    );

    res.status(200).send();
  } catch (error) {
    console.error("Error while caching review:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/api/address", async (req: Request, res: Response) => {
  const { address, username, image, newFollow } = req.body;

  try {
    await client.connect();

    const addressesCollection = await client
      .db("trustsight")
      .collection("addresses");

    if (username) {
      await addressesCollection.updateOne(
        { _id: address as any },
        {
          $set: {
            address,
            username,
          },
        },
        { upsert: true }
      );
    }

    if (image) {
      await addressesCollection.updateOne(
        { _id: address as any },
        {
          $set: {
            address,
            image,
          },
        },
        { upsert: true }
      );
    }

    if (newFollow) {
      await addressesCollection.updateOne(
        { _id: address as any },
        {
          $set: {
            [`following.${newFollow}`]: true,
          },
        },
        { upsert: true }
      );
      await addressesCollection.updateOne(
        { _id: newFollow as any },
        {
          $set: {
            [`followers.${address}`]: true,
          },
        },
        { upsert: true }
      );
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error while caching review:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
