import styles from "@styles/Home.module.css";
import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { abridgeAddress } from "@utils/utils";
import { Select } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Jdenticon from "react-jdenticon";

import { reviews, scoreMap } from "@data/data";

type ReviewsSectionProps = {
  givenReviews: any[];
  receivedReviews: any[];
};

function ReviewsSection({
  givenReviews,
  receivedReviews,
}: ReviewsSectionProps) {
  const [sortReviews, setSortReviews] = useState("recent");
  const [filterReviews, setFilterReviews] = useState("all");

  const givenReviewList = useMemo(() => {
    if (sortReviews === "recent")
      return givenReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortReviews === "oldest")
      return givenReviews.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    else {
      return givenReviews.sort(
        (a, b) => scoreMap[b.reviewer] - scoreMap[a.reviewer]
      );
    }
  }, [givenReviews, sortReviews]);

  const receivedReviewList = useMemo(() => {
    if (sortReviews === "recent")
      return receivedReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sortReviews === "oldest")
      return receivedReviews.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    else {
      return receivedReviews.sort(
        (a, b) => scoreMap[b.reviewer] - scoreMap[a.reviewer]
      );
    }
  }, [receivedReviews, sortReviews]);

  const filteredGivenReviewList = useMemo(() => {
    if (filterReviews === "all") return givenReviewList;
    else {
      return givenReviewList.filter(
        (review) => review.trust == parseInt(filterReviews)
      );
    }
  }, [filterReviews, givenReviewList]);

  const filteredReceivedReviewList = useMemo(() => {
    if (filterReviews === "all") return receivedReviewList;
    else {
      return receivedReviewList.filter(
        (review) => review.trust == parseInt(filterReviews)
      );
    }
  }, [filterReviews, receivedReviewList]);

  function handleSelectChange(e) {
    setSortReviews(e.target.value);
  }

  function handleFilterChange(e) {
    setFilterReviews(e.target.value);
  }

  return (
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
      <Tabs isFitted variant="custom">
        <TabList mb="1em">
          <Tab
            _selected={{
              color: "black",
              fontWeight: 700,
              borderBottom: "2px solid black",
            }}
          >
            Received
          </Tab>
          <Tab
            _selected={{
              color: "black",
              fontWeight: 700,
              borderBottom: "2px solid black",
            }}
          >
            Given
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack gap={5}>
              {filteredReceivedReviewList &&
              filteredReceivedReviewList.length > 0 ? (
                filteredReceivedReviewList.map(
                  ({ reviewer, trust, comment, createdAt }, index) => (
                    <HStack key={index} className={styles.reviewContainer}>
                      <VStack className={styles.leftReviewSection}>
                        <Jdenticon
                          value={reviewer as string}
                          className={styles.reviewImage}
                          size="48"
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
                <VStack w="890px">
                  <Text>No reviews available.</Text>
                </VStack>
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack gap={5}>
              {filteredGivenReviewList && filteredGivenReviewList.length > 0 ? (
                filteredGivenReviewList.map(
                  ({ reviewer, trust, comment, createdAt }, index) => (
                    <HStack key={index} className={styles.reviewContainer}>
                      <VStack className={styles.leftReviewSection}>
                        <Jdenticon
                          value={reviewer as string}
                          className={styles.reviewImage}
                          size="48"
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
                <VStack w="890px">
                  <Text>No reviews available.</Text>
                </VStack>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}

export default ReviewsSection;
