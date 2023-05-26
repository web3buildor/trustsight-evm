import {
  HStack,
  VStack,
  Text,
  Image,
  Box,
  Spinner,
  Button,
  Divider,
  Input,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import withTransition from "@components/withTransition";
import { featuredProjects } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress, TRUSTSIGHT_API_URL } from "@utils/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FaCommentDots, FaHeart } from "react-icons/fa";
import Jdenticon from "react-jdenticon";
import { useAccount } from "wagmi";

function Feed() {
  const router = useRouter();
  const { address: account } = useAccount();
  const [reviews, setReviews] = useState([]);
  const [followerReviews, setFollowerReviews] = useState([]);
  const [isHover, setIsHover] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState("defi");
  const [renderedReviews, setRenderedReviews] = useState([]);
  const [loadMoreCount, setLoadMoreCount] = useState(1);
  const [isComment, setIsComment] = useState<string | undefined>();
  const [newComment, setNewComment] = useState("");

  const fetchReviews = useCallback(async () => {
    const res = await fetch(`${TRUSTSIGHT_API_URL}/api/reviews`);
    const data = await res.json();
    setReviews(data);
    setRenderedReviews(data.slice(0, 10));
  }, []);

  const fetchFollowingReviews = useCallback(async () => {
    const res = await fetch(
      `${TRUSTSIGHT_API_URL}/api/reviews/following/${account}`
    );
    const data = await res.json();
    setFollowerReviews(data);
  }, [account]);

  useEffect(() => {
    if (reviews.length === 0) fetchReviews();
    if (followerReviews.length === 0) fetchFollowingReviews();
  }, [selectedCategory, reviews, fetchReviews, fetchFollowingReviews]);

  const handleLoadMore = () => {
    setLoadMoreCount(loadMoreCount + 1);
    const moreReviews = reviews.slice(
      loadMoreCount * 10,
      (loadMoreCount + 1) * 10
    );
    setRenderedReviews([...renderedReviews, ...moreReviews]); // Add the next set of reviews to the rendered reviews
  };

  const handleLike = async (_id: string) => {
    await axios.put(`${TRUSTSIGHT_API_URL}/api/reviews`, {
      _id,
      newLike: account,
    });
    fetchReviews();
  };

  const handleComment = (_id: string) => {
    setIsComment(_id);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const submitComment = async (_id: string) => {
    await axios.put(`${TRUSTSIGHT_API_URL}/api/reviews`, {
      _id,
      newComment: {
        commenter: account,
        content: newComment,
        createdAt: Date.now(),
      },
    });
    fetchReviews();
    setNewComment("");
  };

  if (reviews.length === 0)
    return (
      <main className={styles.main}>
        <VStack gap={4} w="100%">
          <Text className={styles.header} w="100%">
            Reviews Feed
          </Text>
          <Spinner></Spinner>
        </VStack>
      </main>
    );

  return (
    <main className={styles.main}>
      <VStack gap={4} w="100%">
        <Text className={styles.header} w="100%">
          Reviews Feed
        </Text>
        <Box h="10px" />
        <Tabs isFitted variant="custom">
          <TabList mb="1em">
            <Tab
              _selected={{
                color: "black",
                fontWeight: 700,
                borderBottom: "2px solid black",
              }}
            >
              Latest
            </Tab>
            <Tab
              _selected={{
                color: "black",
                fontWeight: 700,
                borderBottom: "2px solid black",
              }}
            >
              Following
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack gap={5}>
                {renderedReviews && renderedReviews.length > 0 ? (
                  renderedReviews.map(
                    (
                      {
                        _id,
                        reviewer,
                        trust,
                        comment,
                        createdAt,
                        reviewee,
                        likes,
                        comments,
                      },
                      index
                    ) => (
                      <HStack
                        key={index}
                        onMouseEnter={() => setIsHover(_id)}
                        onMouseLeave={() => setIsHover(undefined)}
                        cursor="pointer"
                      >
                        <VStack className={styles.reviewContainer}>
                          <HStack w="100%">
                            <VStack
                              className={styles.leftReviewSection}
                              onClick={() =>
                                router.push(`/address/${reviewer}`)
                              }
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
                                  {index % 5 === 0
                                    ? 4.45
                                    : index % 5 === 1
                                    ? 4.24
                                    : index % 5 === 2
                                    ? 4.71
                                    : index % 5 === 3
                                    ? 4.34
                                    : 4.82}
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
                                    <HStack
                                      className={styles.blankStarContainer}
                                    >
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
                                      onClick={() =>
                                        router.push(`/address/${reviewee}`)
                                      }
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
                                    <HStack>
                                      <Text fontWeight={700}>
                                        {abridgeAddress(reviewee)}
                                      </Text>
                                    </HStack>
                                  )}
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
                          {isComment === _id && (
                            <VStack w="100%" pt="1rem">
                              <Divider color="gray.400" />
                              <Box pt=".5rem"></Box>
                              {comments
                                ? Object.values(comments).map(
                                    ({
                                      commenter,
                                      content,
                                      createdAt,
                                    }: any) => (
                                      <HStack
                                        key={commenter}
                                        w="100%"
                                        pb="1rem"
                                      >
                                        <Text className={styles.reviewReviewer}>
                                          {abridgeAddress(commenter)}
                                        </Text>
                                        <Text
                                          className={styles.reviewDescription}
                                          pl="27px"
                                        >
                                          {content}
                                        </Text>
                                        <Text
                                          className={styles.reviewDate}
                                          whiteSpace="nowrap"
                                        >
                                          {new Date(createdAt).toDateString()}
                                        </Text>
                                      </HStack>
                                    )
                                  )
                                : []}
                              <HStack w="100%">
                                <Input
                                  onChange={handleCommentChange}
                                  value={newComment}
                                />
                                <Button onClick={() => submitComment(_id)}>
                                  Comment
                                </Button>
                              </HStack>
                            </VStack>
                          )}
                        </VStack>
                        {isHover === _id && (
                          <VStack pl="1rem" gap={2}>
                            <HStack className={styles.postIcon}>
                              <FaHeart onClick={() => handleLike(_id)} />
                              <Text>{Object.keys(likes).length}</Text>
                            </HStack>
                            <HStack className={styles.postIcon}>
                              <FaCommentDots
                                onClick={() => handleComment(_id)}
                              />
                              <Text>
                                {comments ? Object.keys(comments).length : 0}
                              </Text>
                            </HStack>
                          </VStack>
                        )}
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
            </TabPanel>
            <TabPanel>
              <VStack gap={5}>
                {followerReviews && followerReviews.length > 0 ? (
                  followerReviews.map(
                    (
                      {
                        _id,
                        reviewer,
                        trust,
                        comment,
                        createdAt,
                        reviewee,
                        likes,
                        comments,
                      },
                      index
                    ) => (
                      <HStack
                        key={index}
                        onMouseEnter={() => setIsHover(_id)}
                        onMouseLeave={() => setIsHover(undefined)}
                        cursor="pointer"
                      >
                        <VStack className={styles.reviewContainer}>
                          <HStack w="100%">
                            <VStack
                              className={styles.leftReviewSection}
                              onClick={() =>
                                router.push(`/address/${reviewer}`)
                              }
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
                                  {index % 5 === 0
                                    ? 4.45
                                    : index % 5 === 1
                                    ? 4.24
                                    : index % 5 === 2
                                    ? 4.71
                                    : index % 5 === 3
                                    ? 4.34
                                    : 4.82}
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
                                    <HStack
                                      className={styles.blankStarContainer}
                                    >
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
                                      onClick={() =>
                                        router.push(`/address/${reviewee}`)
                                      }
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
                                    <HStack>
                                      <Text fontWeight={700}>
                                        {abridgeAddress(reviewee)}
                                      </Text>
                                    </HStack>
                                  )}
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
                          {isComment === _id && (
                            <VStack w="100%" pt="1rem">
                              <Divider color="gray.400" />
                              <Box pt=".5rem"></Box>
                              {comments
                                ? Object.values(comments).map(
                                    ({
                                      commenter,
                                      content,
                                      createdAt,
                                    }: any) => (
                                      <HStack
                                        key={commenter}
                                        w="100%"
                                        pb="1rem"
                                      >
                                        <Text className={styles.reviewReviewer}>
                                          {abridgeAddress(commenter)}
                                        </Text>
                                        <Text
                                          className={styles.reviewDescription}
                                          pl="27px"
                                        >
                                          {content}
                                        </Text>
                                        <Text
                                          className={styles.reviewDate}
                                          whiteSpace="nowrap"
                                        >
                                          {new Date(createdAt).toDateString()}
                                        </Text>
                                      </HStack>
                                    )
                                  )
                                : []}
                              <HStack w="100%">
                                <Input
                                  onChange={handleCommentChange}
                                  value={newComment}
                                />
                                <Button onClick={() => submitComment(_id)}>
                                  Comment
                                </Button>
                              </HStack>
                            </VStack>
                          )}
                        </VStack>
                        {isHover === _id && (
                          <VStack pl="1rem" gap={2}>
                            <HStack className={styles.postIcon}>
                              <FaHeart onClick={() => handleLike(_id)} />
                              <Text>{Object.keys(likes).length}</Text>
                            </HStack>
                            <HStack className={styles.postIcon}>
                              <FaCommentDots
                                onClick={() => handleComment(_id)}
                              />
                              <Text>
                                {comments ? Object.keys(comments).length : 0}
                              </Text>
                            </HStack>
                          </VStack>
                        )}
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
    </main>
  );
}

export default withTransition(Feed);
