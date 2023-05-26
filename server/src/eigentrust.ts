import hre from "hardhat";
import "@nomiclabs/hardhat-ethers";

// Create an initial trust pool with default parameters
function createPool() {
  return {
    trustPool: {},
    initialTrust: {},
    certainty: 0.001,
    max: 200,
    alpha: 0.95,
  };
}

// Encode a raw key into a suitable format
function encodeRawKey(rawKey) {
  if (rawKey.length < 32) return hre.ethers.utils.formatBytes32String(rawKey);

  const hash = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes(rawKey));
  return hash.slice(0, 64) + "ff";
}

// Add trust relationships to the trust pool
function addTrust(pool, creator, recipient, score) {
  if (!pool.trustPool.hasOwnProperty(creator)) {
    pool.trustPool[creator] = {};
  }
  pool.trustPool[creator][recipient] = score;
}

// Set the initial trust scores for recipients
function initialTrust(pool, recipient, score) {
  pool.initialTrust[recipient] = score;
}

// Calculate the Eigentrust scores iteratively based on the trust pool's relationships
function computeTrust(pool) {
  if (Object.keys(pool.initialTrust).length === 0) {
    return {};
  }

  let prevIteration = pool.initialTrust;

  for (let i = 0; i < pool.max; i++) {
    let currIteration = computeIteration(pool, prevIteration);
    let d = avgD(prevIteration, currIteration);
    prevIteration = currIteration;
    if (d < pool.certainty) {
      break;
    }
  }

  return prevIteration;
}

// Perform a single iteration of the Eigentrust calculation
function computeIteration(pool, prevIteration) {
  const t1 = {};
  Object.entries(prevIteration).forEach(([creator, score1]) => {
    Object.entries(pool.trustPool[creator] || {}).forEach(
      ([recipient, score2]) => {
        if (creator != recipient) {
          if (!t1.hasOwnProperty(recipient)) {
            t1[recipient] = 0;
          }
          t1[recipient] += (score1 as any) * (score2 as any);
        }
      }
    );
  });

  let highestTrustScore = 0;
  Object.entries(t1).forEach(([_, score]: [any, any]) => {
    if (score > highestTrustScore) {
      highestTrustScore = score;
    }
  });

  Object.entries(t1).forEach(([key, score]) => {
    t1[key] =
      ((score as any) / highestTrustScore) * pool.alpha +
      (1 - pool.alpha) * pool.initialTrust[key];
  });

  return t1;
}

// Calculate the average difference between two consecutive iterations
function avgD(prevIteration, currIteration) {
  let d = 0;

  Object.entries(currIteration).forEach(([key, score]) => {
    d += Math.abs((score as any) - prevIteration[key]);
  });

  d = d / Object.entries(prevIteration).length;

  return d;
}

async function main() {
  const TrustScoreRegistry = await hre.ethers.getContractFactory(
    "TrustScoreRegistry"
  );
  const trustScoreRegistry = TrustScoreRegistry.attach(
    process.env.CONTRACT_ADDRESS ?? ""
  );

  const trustKey = encodeRawKey(`trustsight.trust`);

  const trustEvent = trustScoreRegistry.filters.ReviewCreated(
    null,
    null,
    trustKey
  );

  const pool = createPool();

  // Query the contract for trust events
  trustScoreRegistry
    .queryFilter(trustEvent, 3451375)
    .then(async (events) => {
      events.forEach(({ args }: any) => {
        const creator = args[0];
        const recipient = args[1];
        const encodedValue = args[3];
        const decodedValue = Number(encodedValue);
        addTrust(pool, creator, recipient, decodedValue);
      });

      // Set initial trust for recipients
      events.forEach(({ args }: any) => {
        const recipient = args[1];
        const encodedValue = args[3];
        const decodedValue = Number(encodedValue);
        initialTrust(pool, recipient, decodedValue);
      });

      const outputPool = computeTrust(pool);

      // Update scores on the contract
      for (const [recipient, score] of Object.entries(outputPool)) {
        await createReview(recipient, score);
      }

      console.log(`Updated ${events.length} scores`);
    })
    .catch((error) => {
      console.error(error);
    });
}

main();

// Add an review to the contract with the calculated trust score
async function createReview(recipient, score) {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.EVMOS_TESTNET_RPC_URL
  );
  const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const TrustScoreRegistry = await hre.ethers.getContractFactory(
    "TrustScoreRegistry"
  );
  const trustScoreRegistry = TrustScoreRegistry.attach(
    process.env.CONTRACT_ADDRESS ?? ""
  );

  const attendedKey = encodeRawKey("trustsight.trust");

  const review = {
    about: recipient,
    key: attendedKey,
    val: score,
  };

  const tx = await trustScoreRegistry.connect(wallet).attest([review]);
  const receipt = await tx.wait();

  console.log("receipt: ", JSON.stringify(receipt, null, 2));
}
