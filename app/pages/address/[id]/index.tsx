import styles from "@styles/Home.module.css";
import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { Web3Storage } from "web3.storage";

import { useRouter } from "next/router";
import { abridgeAddress, capitalizeFirstLetter } from "@utils/utils";
import { Select } from "@chakra-ui/react";
import { FaFlag } from "react-icons/fa";
import Identicon from "react-identicons";
import { useAccount, useProvider } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import withTransition from "@components/withTransition";
import { featuredProjects, mockReviews, scoreMap } from "@data/data";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import ReviewModal from "@components/ReviewModal";
import { Metadata } from "@utils/types";

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY;

const client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN,
  endpoint: new URL("https://api.web3.storage"),
});

type CachedReview = {
  reviewee: string;
  [key: string]: string | number;
};

type Scores = {
  [key: string]: number;
};

function Profile() {
  const provider = useProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventLogMap, setEventLogMap] = useState({});
  const [metadata, setMetadata] = useState<Metadata | undefined>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [scores, setScores] = useState<Scores | undefined>();
  const [trustScoresMap, setTrustScoresMap] = useState({});
  const [five, setFive] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { openConnectModal } = useConnectModal();
  const { address: account } = useAccount();

  const [sortReviews, setSortReviews] = useState("recent");
  const [filterReviews, setFilterReviews] = useState("all");

  const router = useRouter();
  const { id: address } = router.query;

  const handleReview = () => {
    if (!account) {
      openConnectModal();
    } else {
      onOpen();
    }
  };

  const handleSetFive = () => {};

  const reviewList = useMemo(() => {
    if (sortReviews === "recent")
      return reviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortReviews === "oldest")
      return reviews.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    else {
      return reviews.sort(
        (a, b) => scoreMap[b.reviewer] - scoreMap[a.reviewer]
      );
    }
  }, [reviews, sortReviews]);

  const filteredReviewList = useMemo(() => {
    if (filterReviews === "all") return reviewList;
    else {
      return reviewList.filter(
        (review) => review.trust == parseInt(filterReviews)
      );
    }
  }, [filterReviews, reviewList]);

  function handleSelectChange(e) {
    setSortReviews(e.target.value);
  }

  function handleFilterChange(e) {
    setFilterReviews(e.target.value);
  }

  const fetchMetadata = useCallback(async () => {
    if (!address) return;

    const res = await fetch(`http://localhost:8000/api/address/${address}`);
    const data = await res.json();
    setMetadata(data);
  }, [address]);

  const fetchReviews = useCallback(async () => {
    if (!address) return;

    const res = await fetch(`http://localhost:8000/api/reviews/${address}`);
    const data = await res.json();
    const { scores, reviews } = data;
    setScores(scores);
    setReviews(reviews);
  }, [address]);

  useEffect(() => {
    if (!metadata) fetchMetadata();
    if (!metadata) fetchReviews();
  }, [address]);

  if (!metadata || !scores)
    return (
      <main className={styles.main}>
        <Spinner></Spinner>
      </main>
    );

  const {
    title,
    subtitle,
    image,
    category,
    createdAt,
    description,
    subscores,
    flags,
  } = metadata;

  return (
    <main className={styles.main}>
      <ReviewModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={title}
        image={image}
        address={address as string}
        account={account}
        category={category}
        subscores={subscores}
      />
      <HStack w="100%" justifyContent="space-between">
        <VStack className={styles.leftSection}>
          <VStack className={styles.stickySection}>
            {image ? (
              <Image
                src={image}
                alt={image}
                className={styles.profileImage}
              ></Image>
            ) : (
              <Identicon
                string={address as string}
                className={styles.profileImage}
              />
            )}
            <Box h="10px"></Box>
            <VStack onClick={handleReview} cursor="pointer">
              <HStack>
                {new Array(5).fill(0).map((_, idx) => (
                  <Image
                    src="/blankstar.png"
                    alt="yo"
                    key={idx}
                    className={styles.largestar}
                  />
                ))}
              </HStack>
              <Text>Review this address</Text>
            </VStack>
          </VStack>
        </VStack>

        <VStack className={styles.rightSection}>
          <VStack className={styles.rightInnerSection}>
            <HStack w="100%" justifyContent="space-between">
              <Text className={styles.profileTitle}>
                {title ? title : abridgeAddress(address as string)}
              </Text>
              <HStack>
                <VStack>
                  <HStack>
                    <VStack opacity={0.4}>
                      <FaFlag />
                    </VStack>
                    <Text className={styles.reviewsText}>
                      Report this address
                    </Text>
                  </HStack>
                  {flags && (
                    <Text className={styles.reviewsSubtext}>
                      Reported by {flags} users
                    </Text>
                  )}
                </VStack>
              </HStack>
            </HStack>
            <HStack paddingBottom=".5rem">
              <Text className={styles.profileSubtitle}>
                {`${abridgeAddress(address as string)} ${
                  subtitle ? `(${subtitle})` : ""
                }`}
              </Text>
              {category && (
                <VStack className={styles.categoryPill}>
                  <Text className={styles.categoryPillText}>{category}</Text>
                </VStack>
              )}
              {flags && (
                <VStack className={styles.scamPill}>
                  <Text className={styles.categoryPillText}>Likely Scam</Text>
                </VStack>
              )}
            </HStack>

            <HStack>
              {new Array(Math.round(scores.trust)).fill(0).map((_, idx) => (
                <Image
                  src="/star.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              {new Array(5 - Math.round(scores.trust)).fill(0).map((_, idx) => (
                <Image
                  src="/greystar.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              <Text className={styles.scoreText}>
                {scores.trust.toFixed(2)}
              </Text>
              <Text className={styles.reviewsText}>
                · {reviews.length} reviews
              </Text>
            </HStack>
            <Box h="1px"></Box>
            <Text className={styles.description}>
              {description ?? "No description available."}
            </Text>
            <Box h="10px"></Box>
            {createdAt && (
              <Text className={styles.reviewsText}>
                Contract deployed on {new Date(createdAt).toDateString()}
              </Text>
            )}
          </VStack>
          <Box h="20px"></Box>
          <VStack className={styles.reviewsContainer}>
            <Text className={styles.reviewsHeader}>Reviews</Text>
            <VStack className={styles.reviewsScorebarContainer}>
              {subscores &&
                subscores.length > 0 &&
                subscores.map((val) => (
                  <HStack key={val}>
                    <Text className={styles.categoryTitle}>
                      {capitalizeFirstLetter(val)}
                    </Text>
                    <Box className={styles.scoreBarContainer}>
                      <Box
                        className={styles.scoreBar}
                        width={scores[val] / 5}
                      ></Box>
                    </Box>
                    <Text className={styles.categoryScore}>
                      {scores[val].toFixed(2)}
                    </Text>
                  </HStack>
                ))}
            </VStack>
          </VStack>
          {subscores && <Box h="20px"></Box>}
          <VStack w="100%" gap={5} alignItems="flex-start">
            <HStack className={styles.filterContainer}>
              <Text className={styles.filterLabel}>Sort by:</Text>
              <VStack className={styles.select}>
                <Select variant="custom" onChange={handleSelectChange}>
                  <option value="recent">Most recent</option>
                  <option value="trusted">Most trusted</option>
                  <option value="oldest">Oldest</option>
                </Select>
              </VStack>
              <Box w="10px"></Box>
              <Text className={styles.filterLabel}>Filter by:</Text>
              <VStack className={styles.select}>
                <Select variant="custom" onChange={handleFilterChange}>
                  <option value="all">Show all</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 stars</option>
                </Select>
              </VStack>
            </HStack>
            <VStack gap={5}>
              {filteredReviewList && filteredReviewList.length > 0 ? (
                filteredReviewList.map(
                  ({ reviewer, trust, comment, createdAt }, index) => (
                    <HStack key={index} className={styles.reviewContainer}>
                      <VStack className={styles.leftReviewSection}>
                        <Identicon
                          string={reviewer as string}
                          className={styles.reviewImage}
                        />
                        <Text className={styles.reviewReviewer}>
                          {abridgeAddress(reviewer)}
                        </Text>
                        <HStack>
                          <Image
                            alt="yo"
                            src="/blackstar.png"
                            className={styles.blackstar}
                            opacity={0.5}
                          ></Image>
                          <Text className={styles.reviewScore}>
                            {(Math.random() + 4).toFixed(2)}
                          </Text>
                        </HStack>
                      </VStack>
                      <VStack className={styles.rightReviewSection}>
                        <HStack className={styles.rightTopSection}>
                          <HStack className={styles.smallStarContainer}>
                            <HStack
                              className={styles.goldStarContainer}
                              style={{
                                width: `${(trust / 5) * 157}px`,
                              }}
                            >
                              {new Array(Math.round(trust))
                                .fill(0)
                                .map((_, idx) => (
                                  <Image
                                    src="/star.png"
                                    alt="yo"
                                    key={idx}
                                    className={styles.star}
                                  />
                                ))}
                            </HStack>
                            <HStack className={styles.blankStarContainer}>
                              {new Array(5).fill(0).map((_, idx) => (
                                <Image
                                  src="/greystar.png"
                                  alt="yo"
                                  key={idx}
                                  className={styles.star}
                                />
                              ))}
                            </HStack>
                          </HStack>
                          <Text className={styles.reviewDate}>
                            {new Date(createdAt).toDateString()}
                          </Text>
                        </HStack>
                        <Text className={styles.reviewDescription}>
                          {comment}
                        </Text>
                      </VStack>
                    </HStack>
                  )
                )
              ) : (
                <Text>No reviews available.</Text>
              )}
            </VStack>
          </VStack>
        </VStack>
      </HStack>
    </main>
  );
}

export default withTransition(Profile);
