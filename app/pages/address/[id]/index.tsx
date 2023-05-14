import styles from "@styles/Home.module.css";
import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  useDisclosure,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { Web3Storage } from "web3.storage";

import { useRouter } from "next/router";
import { abridgeAddress, capitalizeFirstLetter } from "@utils/utils";
import { Select } from "@chakra-ui/react";
import { FaFlag } from "react-icons/fa";
import Identicon from "react-identicons";
import { useProvider } from "wagmi";
import { useCallback, useMemo, useState } from "react";
import withTransition from "@components/withTransition";
import { featuredProjects, mockReviews, reviews, scoreMap } from "@data/data";

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY;

const client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN,
  endpoint: new URL("https://api.web3.storage"),
});

function Profile() {
  const provider = useProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventLogMap, setEventLogMap] = useState({});
  const [trustScoresMap, setTrustScoresMap] = useState({});
  const [attestationMap, setAttestationMap] = useState({ trust: { val: 0 } });
  const [five, setFive] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [sortReviews, setSortReviews] = useState("recent");
  const [filterReviews, setFilterReviews] = useState("all");

  const router = useRouter();
  const { id: address } = router.query;

  const handleReview = () => {};
  const handleSetFive = () => {};

  const filteredReviews = useMemo(
    () => reviews.filter((r) => r.reviewee === address),
    [address]
  );

  const reviewList = useMemo(() => {
    if (sortReviews === "recent")
      return filteredReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortReviews === "oldest")
      return filteredReviews.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    else {
      return filteredReviews.sort(
        (a, b) => scoreMap[b.reviewer] - scoreMap[a.reviewer]
      );
    }
  }, [filteredReviews, sortReviews]);

  const filteredReviewList = useMemo(() => {
    if (filterReviews === "all") return reviewList;
    else {
      return reviewList.filter(
        (review) => review.score == parseInt(filterReviews)
      );
    }
  }, [filterReviews, reviewList]);

  function handleSelectChange(e) {
    setSortReviews(e.target.value);
  }

  function handleFilterChange(e) {
    setFilterReviews(e.target.value);
  }

  if (!address)
    return (
      <main className={styles.main}>
        <Spinner></Spinner>
      </main>
    );

  const {
    title,
    image,
    category,
    createdAt,
    description,
    subscores,
    reviews: reviewScore,
    score,
    flags,
  } = featuredProjects[address as string];

  return (
    <main className={styles.main}>
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
            <HStack>
              <Text className={styles.profileSubtitle}>
                {abridgeAddress(address as string)}
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
              {new Array(Math.round(score)).fill(0).map((_, idx) => (
                <Image
                  src="/star.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              {new Array(5 - Math.round(score)).fill(0).map((_, idx) => (
                <Image
                  src="/greystar.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              <Text className={styles.scoreText}>
                {isNaN(eventLogMap["trustsight.trust"] / 100)
                  ? 0
                  : eventLogMap["trustsight.trust"] / 100}
              </Text>
              <Text className={styles.reviewsText}>
                · {reviewScore} reviews
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
                        // width={`${
                        //   eventLogMap[
                        //     `trustsight.${category.toLowerCase()}.${val}`
                        //   ] / 5
                        // }%`}
                        width={featuredProjects[address as string][val] / 5}
                      ></Box>
                    </Box>
                    <Text className={styles.categoryScore}>
                      {/* {eventLogMap[
                        `trustsight.${category.toLowerCase()}.${val}`
                      ] / 100} */}
                      {featuredProjects[address as string][val]}
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
                  ({ reviewer, score, review, createdAt }, index) => (
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
                            {scoreMap[reviewer]}
                          </Text>
                        </HStack>
                      </VStack>
                      <VStack className={styles.rightReviewSection}>
                        <HStack className={styles.rightTopSection}>
                          <HStack className={styles.smallStarContainer}>
                            <HStack
                              className={styles.goldStarContainer}
                              style={{
                                width: `${(score / 5) * 157}px`,
                              }}
                            >
                              {new Array(Math.round(score))
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
                          {review}
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
