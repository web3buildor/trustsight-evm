import {
  HStack,
  VStack,
  Text,
  Image,
  Box,
  Spinner,
  Button,
} from "@chakra-ui/react";
import withTransition from "@components/withTransition";
import { featuredProjects } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress, TRUSTSIGHT_API_URL } from "@utils/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Jdenticon from "react-jdenticon";

function Feed() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("defi");
  const [renderedReviews, setRenderedReviews] = useState([]);
  const [loadMoreCount, setLoadMoreCount] = useState(1);

  const fetchReviews = useCallback(async () => {
    const res = await fetch(`${TRUSTSIGHT_API_URL}/api/reviews`);
    const data = await res.json();
    setReviews(data);
    setRenderedReviews(data.slice(0, 10));
  }, []);

  useEffect(() => {
    if (reviews.length === 0) fetchReviews();
  }, [selectedCategory, reviews, fetchReviews]);

  const filteredReviewList = reviews;

  // const itemCount = filteredReviewList.length;

  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 1);
    const moreReviews = reviews.slice(
      loadMoreCount * 10,
      (loadMoreCount + 1) * 10
    );
    setRenderedReviews([...renderedReviews, ...moreReviews]); // Add the next set of reviews to the rendered reviews
  };

  if (reviews.length === 0)
    return (
      <main className={styles.main}>
        <VStack gap={4} w="100%">
          <Text className={styles.header} w="100%">
            Latest Reviews
          </Text>
          <Spinner></Spinner>
        </VStack>
      </main>
    );

  return (
    <main className={styles.main}>
      <VStack gap={4} w="100%">
        <Text className={styles.header} w="100%">
          Latest Reviews
        </Text>
        <Box h="10px" />
        {/* <List
          height={1000} // or however tall you want your list to be
          itemCount={itemCount}
          itemSize={220} // or however tall each row is
          width="100%" // or however wide you want your list to be
          itemData={filteredReviewList}
        >
          {Row}
        </List> */}
        <VStack gap={5}>
          {renderedReviews && renderedReviews.length > 0 ? (
            renderedReviews.map(
              ({ reviewer, trust, comment, createdAt, reviewee }, index) => (
                <HStack key={index} className={styles.reviewContainer}>
                  <VStack
                    className={styles.leftReviewSection}
                    onClick={() => router.push(`/address/${reviewer}`)}
                    cursor="pointer"
                  >
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
                        alt="trust_stars"
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
                      <HStack>
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
                        {featuredProjects[reviewee] ? (
                          <HStack
                            paddingLeft="0.5rem"
                            onClick={() => router.push(`/address/${reviewee}`)}
                            cursor="pointer"
                          >
                            <Image
                              className={styles.feedReviewee}
                              src={featuredProjects[reviewee].image}
                              alt={featuredProjects[reviewee].title}
                            />
                            <Text fontWeight={700}>
                              {featuredProjects[reviewee].title}
                            </Text>
                          </HStack>
                        ) : (
                          <Text>{abridgeAddress(reviewee)}</Text>
                        )}
                      </HStack>
                      <Text className={styles.reviewDate}>
                        {new Date(createdAt).toDateString()}
                      </Text>
                    </HStack>
                    <Text className={styles.reviewDescription}>{comment}</Text>
                  </VStack>
                </HStack>
              )
            )
          ) : (
            <VStack w="890px">
              <Text>No reviews available.</Text>
            </VStack>
          )}
          {renderedReviews.length < reviews.length ? (
            <Button onClick={handleLoadMore}>Load More</Button>
          ) : null}
        </VStack>
      </VStack>
    </main>
  );
}

function Row({ index, style, data }) {
  const router = useRouter();
  const { reviewer, trust, comment, createdAt, reviewee } = data[index];

  // Render a single row here, using the style provided by react-window
  return (
    <div style={style}>
      <HStack key={index} className={styles.reviewContainer}>
        <VStack
          className={styles.leftReviewSection}
          onClick={() => router.push(`/address/${reviewer}`)}
          cursor="pointer"
        >
          <Jdenticon
            value={reviewer as string}
            className={styles.reviewImage}
          />
          <Text className={styles.reviewReviewer}>
            {abridgeAddress(reviewer)}
          </Text>
          <HStack>
            <Image
              alt="trust_stars"
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
            <HStack>
              <HStack className={styles.smallStarContainer}>
                <HStack
                  className={styles.goldStarContainer}
                  style={{
                    width: `${(trust / 5) * 157}px`,
                  }}
                >
                  {new Array(Math.round(trust)).fill(0).map((_, idx) => (
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
              {featuredProjects[reviewee] ? (
                <HStack
                  paddingLeft="0.5rem"
                  onClick={() => router.push(`/address/${reviewee}`)}
                  cursor="pointer"
                >
                  <Image
                    className={styles.feedReviewee}
                    src={featuredProjects[reviewee].image}
                    alt={featuredProjects[reviewee].title}
                  />
                  <Text fontWeight={700}>
                    {featuredProjects[reviewee].title}
                  </Text>
                </HStack>
              ) : (
                <Text>{abridgeAddress(reviewee)}</Text>
              )}
            </HStack>
            <Text className={styles.reviewDate}>
              {new Date(createdAt).toDateString()}
            </Text>
          </HStack>
          <Text className={styles.reviewDescription}>{comment}</Text>
        </VStack>
      </HStack>
    </div>
  );
}

export default withTransition(Feed);
