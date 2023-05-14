export const categories = [
  "DeFi",
  "NFT",
  "DAO",
  "Gaming",
  "Metaverse",
  "Social",
  "Security",
  "Infrastructure",
  "Wallet",
  "Identity",
  "More",
];

// TODO: update metadata for accuracy
export const featuredProjects = {
  "0x10ed43c718714eb63d5aa57b78b54704e256024e": {
    title: "PancakeSwap",
    subtitle: "Router v2",
    image: "/pancake.png",
    score: 4.86,
    address: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    reviews: 29,
    category: "DeFi",
    createdAt: "2021-12-13 01:49:21",
    description:
      "PancakeSwap is the leading decentralized exchange on BNB Smart Chain, with the highest trading volumes in the market.",
    subscores: ["tokenomics", "liquidity", "governance", "innovative"],
    tokenomics: 4.3,
    liquidity: 4.7,
    governance: 4.9,
    innovative: 4.4,
    flags: 0,
  },
  "0x1111111254fb6c44bAC0beD2854e76F90643097d": {
    title: "1inch Network",
    image: "/1inch.png",
    score: 4.96,
    address: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
    reviews: 29,
  },
  "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8": {
    title: "Stargate Finance",
    image: "/stargate.jpg",
    score: 4.82,
    address: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
    reviews: 2048,
  },
  "0xD1ca1F4dBB645710f5D5a9917AA984a47524f49A": {
    title: "Bitkeep Swap",
    image: "/bitkeep.png",
    score: 4.92,
    address: "0xD1ca1F4dBB645710f5D5a9917AA984a47524f49A",
    reviews: 192,
  },
};

export const featuredReviews = [
  {
    image: "/1.png",
    stars: 5,
    reviewer: "martinc.eth",
    recipient:
      featuredProjects["0x10ed43c718714eb63d5aa57b78b54704e256024e"].title,
    review:
      "PancakeSwap is the best decentralized exchange app I have ever used! It's fast, secure, and easy to use.",
  },
  {
    image: "/2.png",
    stars: 5,
    reviewer: "martinc.eth",
    recipient:
      featuredProjects["0x1111111254fb6c44bAC0beD2854e76F90643097d"].title,
    review:
      "I love 1inch! It's so easy to use and has a great interface. I can trade my favorite cryptocurrencies with ease.",
  },
  {
    image: "/3.png",
    stars: 5,
    reviewer: "martinc.eth",
    recipient:
      featuredProjects["0x10ed43c718714eb63d5aa57b78b54704e256024e"].title,
    review:
      "I've been using it for a few weeks now and I'm so impressed with how easy it is to use. It's perfect for beginners like me.",
  },
  {
    image: "/4.png",
    stars: 5,
    reviewer: "martinc.eth",
    recipient:
      featuredProjects["0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8"].title,
    review:
      "The Stargate Finance app is fantastic! It's easy to navigate and makes trading cryptocurrencies a breeze. Highly recommended!",
  },
];

export const defiProjects = [
  {
    title: "PancakeSwap",
    image: "/PancakeSwap.png",
    score: 4.86,
    address: "0xFeebabE6b0418eC13b30aAdF129F5DcDd4f70CeA",
    reviews: 29,
  },
];

export const mockAddresses = {
  "0x9c12939390052919aF3155f41Bf4160Fd3666A6f": {
    title: "PancakeSwap",
    image: "/PancakeSwap.png",
    score: 4.22,
    address: "0x9c12939390052919aF3155f41Bf4160Fd3666A6f",
    reviews: 29,
    category: "DeFi",
    description:
      "PancakeSwap Finance, at its core, is a solution for protocols on Optimism to properly incentivize liquidity for their own use cases. Building on top of the groundwork laid out by Solidly, our team has addressed that first iteration's core issues to realize its full potential.",
    createdAt: 1652940000000,
    subscores: ["tokenomics", "liquidity", "governance", "innovative"],
    tokenomics: 4.9,
    liquidity: 4.8,
    governance: 4.2,
    innovative: 4.6,
  },
  "0xe688b84b23f322a994a53dbf8e15fa82cdb71127": {
    title: "BNB  DAO",
    image: "/bnbdao.png",
    score: 4.96,
    address: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviews: 29,
    category: "DAO",
    description:
      "BNB DAO is a member-owned community. $BNB  holders direct the community's events, investments, and interests. Holders may (in the future) receive a portion of the profits from ETHDenver, Bufficorn Ventures or the Colorado Jam Incubator.",
    createdAt: 1514444400000,
    subscores: ["community", "impact", "governance", "financials"],
    community: 4.9,
    impact: 4.8,
    governance: 4.2,
    financials: 4.6,
  },
  "0x14e262BF93FDDD01F605baE7c39A87B02234Ee03": {
    score: 0,
    address: "0x14e262BF93FDDD01F605baE7c39A87B02234Ee03",
    reviews: 5,
    flags: 5,
  },
};

export const mockReviews = {
  "0x10ed43c718714eb63d5aa57b78b54704e256024e": [
    {
      reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
      image: "/1.png",
      score: 5.0,
      stars: 500,
      review:
        "PancakeSwap is a game-changer for DeFi enthusiasts! The platform offers unparalleled transparency, security, and user-friendliness. The team behind PancakeSwap is extremely responsive and committed to providing a seamless user experience. I highly recommend this protocol for anyone interested in DeFi.",
      createdAt: 1678032357324,
    },
    {
      reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
      image: "/1.png",
      score: 4.68,
      stars: 400,
      review:
        "I've been using PancakeSwap for a few months now and it's been nothing but smooth sailing. The protocol offers high yields with minimal risk, and the user interface is intuitive and easy to use. The team is also very transparent about their operations, which adds to the overall sense of trustworthiness. UI could use a revamp.",
      createdAt: 1678002357324,
    },
    {
      reviewer: "0x9507c04B10486547584C37bCBd931B2a4FeE9A41",
      image: "/1.png",
      score: 3.78,
      stars: 400,
      review:
        "PancakeSwap is an innovative DeFi protocol that is paving the way for a more secure and transparent decentralized finance ecosystem. The platform's unique features, such as the Velo governance token and the VUSD stablecoin, make it stand out from other DeFi protocols. Sometimes liquidity issues in certain pairs.",
      createdAt: 1677922357324,
    },
    {
      reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
      image: "/1.png",
      score: 1.0,
      stars: 500,
      review:
        "I've been a DeFi enthusiast for a while, and I must say that PancakeSwap is one of the best protocols I've used so far. The platform's user-friendly interface, high yields, and transparent operations make it a top choice for anyone looking to earn passive income in the DeFi space. Keep up the great work, PancakeSwap team!",
      createdAt: 1677922357324,
    },
  ],
  "0xe688b84b23f322a994a53dbf8e15fa82cdb71127": [
    {
      reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
      image: "/1.png",
      score: 4.88,
      stars: 5,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      createdAt: 1677976220816,
    },
    {
      reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
      image: "/1.png",
      score: 4.88,
      stars: 5,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      createdAt: 1677976220816,
    },
    {
      reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
      image: "/1.png",
      score: 4.88,
      stars: 5,
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
      createdAt: 1677976220816,
    },
  ],
  "0x14e262BF93FDDD01F605baE7c39A87B02234Ee03": [
    {
      reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",

      image: "/1.png",
      score: 5.0,
      stars: 0,
      review:
        "BEWARE fellow bufficorns! this guy asked me to mint his project and i got scammed my favorite NFTs. DON'T approve the transaction",
      createdAt: 1677976220816,
    },
    {
      reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
      image: "/1.png",
      score: 4.88,
      stars: 0,
      review: "give me my NFTs back you scammer.",
      createdAt: 1677976220816,
    },
    {
      reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
      image: "/1.png",
      score: 4.28,
      stars: 0,
      review:
        "STAY AWAY FROM THIS SCAMMER ADDRESS. They have it hooked up to a setApprovalForAll with your most expensive NFT collection using Seaport.",
      createdAt: 1677976220816,
    },
  ],
};

export const scoreMap = {
  "0xe688b84b23f322a994a53dbf8e15fa82cdb71127": 4.85,
  "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF": 4.99,
  "0x9507c04B10486547584C37bCBd931B2a4FeE9A41": 4.88,
  "0xCBD6832Ebc203e49E2B771897067fce3c58575ac": 4.82,
};

export const reviews = [
  {
    reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "PancakeSwap is the best decentralized exchange app I have ever used! It's fast, secure, and easy to use.",
    createdAt: "2023-04-12 07:11:34",
  },
  {
    reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 4,
    review:
      "I love PancakeSwap! It's so easy to use and has a great interface. I can trade my favorite cryptocurrencies with ease.",
    createdAt: "2023-04-06 02:55:53",
  },
  {
    reviewer: "0x9507c04B10486547584C37bCBd931B2a4FeE9A41",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I've been using it for a few weeks now and I'm so impressed with how easy it is to use. It's perfect for beginners like me.",
    createdAt: "2023-04-14 20:52:21",
  },
  {
    reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "The PancakeSwap app is fantastic! It's easy to navigate and makes trading cryptocurrencies a breeze. Highly recommended!",
    createdAt: "2023-04-05 16:12:48",
  },
  {
    reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "PancakeSwap is the best! I've used other decentralized exchanges in the past, but none of them compare to PancakeSwap.",
    createdAt: "2023-04-11 23:19:36",
  },
  {
    reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I love the PancakeSwap app! It's so easy to use and makes trading cryptocurrencies a breeze. Highly recommended!",
    createdAt: "2023-04-13 09:44:52",
  },
  {
    reviewer: "0x9507c04B10486547584C37bCBd931B2a4FeE9A41",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 4,
    review:
      "PancakeSwap is the future of decentralized exchanges. It's fast, secure, and easy to use. I can't imagine using any other app.",
    createdAt: "2023-04-08 04:31:40",
  },

  {
    reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I've been using PancakeSwap for a few months now and it's amazing! It's the best decentralized exchange app out there.",
    createdAt: "2023-04-06 21:28:43",
  },
  {
    reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review: "I've recommended it to all my friends who trade cryptocurrencies.",
    createdAt: "2023-04-07 00:53:12",
  },
  {
    reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I can't recommend PancakeSwap enough! It's fast, reliable, and has a great user interface. Trading cryptocurrencies has never been easier.",
    createdAt: "2023-04-10 01:56:34",
  },
  {
    reviewer: "0x9507c04B10486547584C37bCBd931B2a4FeE9A41",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "PancakeSwap is the best decentralized exchange app I've ever used. It's fast, secure, and easy to use.",
    createdAt: "2023-04-04 18:25:56",
  },
  {
    reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 4,
    review:
      "I love using PancakeSwap! It's so easy to use and makes trading cryptocurrencies a breeze.",
    createdAt: "2023-04-09 12:13:24",
  },
  {
    reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review: "I've been using it for a few months now and it's so easy to use.",
    createdAt: "2023-04-12 22:42:07",
  },
  {
    reviewer: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I've tried other decentralized exchanges in the past, but PancakeSwap is by far the best. It's fast, secure, and easy to use.",
    createdAt: "2023-04-14 04:49:05",
  },
  {
    reviewer: "0x9507c04B10486547584C37bCBd931B2a4FeE9A41",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "PancakeSwap is amazing! It's so easy to use and has a great user interface. I can trade my favorite cryptocurrencies with ease.",
    createdAt: "2023-04-05 14:23:37",
  },
  {
    reviewer: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I've been using it for a few weeks now and it's perfect for beginners like me.",
    createdAt: "2023-04-04 22:58:20",
  },
  {
    reviewer: "0xe688b84b23f322a994a53dbf8e15fa82cdb71127",
    reviewee: "0x10ed43c718714eb63d5aa57b78b54704e256024e",
    score: 5,
    review:
      "I love PancakeSwap! It's fast, reliable, and has a great user interface. Trading cryptocurrencies has never been easier.",
    createdAt: "2023-04-13 21:37:28",
  },
];
