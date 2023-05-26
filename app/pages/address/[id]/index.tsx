import styles from "@styles/Home.module.css";
import {
  HStack,
  VStack,
  Text,
  Box,
  useDisclosure,
  Spinner,
  IconButton,
  Input,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  abridgeAddress,
  capitalizeFirstLetter,
  TRUSTSIGHT_API_URL,
} from "@utils/utils";
import { FaCheck, FaFlag, FaPen, FaStar } from "react-icons/fa";
import { useAccount, useSigner } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import withTransition from "@components/withTransition";
import ReviewModal from "@components/ReviewModal";
import { Metadata } from "@utils/types";
import axios from "axios";
import ProfileSection from "@components/ProfileSection";
import StarRating from "@components/StarRating";
import ReviewsSection from "@components/ReviewsSection";
import { ethers } from "ethers";

import sbtContract from "@data/sbt.json";

type Scores = {
  [key: string]: number;
};

const SBT = "0x718F299076eC91cF070Df6467c327f5b49d613c9";

function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [metadata, setMetadata] = useState<Metadata | undefined>();
  const [givenReviews, setGivenReviews] = useState<any[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<any[]>([]);
  const [scores, setScores] = useState<Scores | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const { data: signer } = useSigner();
  const { address: account } = useAccount();
  const [newUsername, setNewUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string>("");

  const router = useRouter();
  const { id: address } = router.query;

  async function fetchTokenURI() {
    const res = await fetch(`${TRUSTSIGHT_API_URL}/api/sbt/${address}`);
    const { tokenURI } = await res.json();
    return tokenURI;
  }

  async function mintSBT() {
    if (address) {
      const tokenURI = await fetchTokenURI();

      const ethersRegistryContract = new ethers.Contract(
        SBT,
        sbtContract.abi,
        signer
      );

      const txn = await ethersRegistryContract.mint(account, tokenURI);
      setTxnHash(txn);
    }
  }

  function handleUsernameChange(e) {
    e.preventDefault();
    setNewUsername(e.target.value);
  }

  async function handleEditNameMode() {
    if (isEditingName) {
      await updateUsername();
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
    }
  }

  const fetchMetadata = useCallback(async () => {
    if (!address) return;

    const res = await fetch(`${TRUSTSIGHT_API_URL}/api/address/${address}`);
    const data = await res.json();
    setMetadata(data);
    setUsername(data.username);
    setProfileImage(data.image);
  }, [address]);

  const fetchReviews = useCallback(async () => {
    if (!address) return;

    const res = await fetch(`${TRUSTSIGHT_API_URL}/api/reviews/${address}`);
    const data = await res.json();
    const { scores, givenReviews, receivedReviews } = data;
    setScores(scores);
    setGivenReviews(givenReviews);
    console.log(givenReviews);
    setReceivedReviews(receivedReviews);
  }, [address]);

  const updateUsername = useCallback(async () => {
    try {
      const response = await axios.post(`${TRUSTSIGHT_API_URL}/api/address`, {
        address: account,
        username: newUsername,
      });

      if (response.status === 200) {
        await fetchMetadata();
      }
    } catch (e) {
      console.log(e);
    }
  }, [account, fetchMetadata, newUsername]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    fetchMetadata();
    fetchReviews();

    return () => clearTimeout(timer);
  }, [address, fetchMetadata, fetchReviews]);

  if (!metadata || !scores || isLoading)
    return (
      <main className={styles.main}>
        <VStack pt="4rem">
          <Spinner size="lg"></Spinner>
        </VStack>
      </main>
    );

  const {
    username: name,
    subtitle,
    image,
    category,
    createdAt,
    description,
    subscores,
    flags,
  } = metadata;

  const profileName = name ? name : abridgeAddress(address as string);

  const isProfileOwner = address === account;

  return (
    <main className={styles.main}>
      <ReviewModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        username={username}
        image={image}
        address={address as string}
        account={account}
        category={category}
        subscores={subscores}
      />
      <HStack w="100%" justifyContent="space-between">
        <VStack className={styles.leftSection}>
          <ProfileSection
            address={address as string}
            account={account}
            profileImage={profileImage}
            fetchMetadata={fetchMetadata}
            onOpen={onOpen}
          />
        </VStack>
        <VStack className={styles.rightSection}>
          <VStack className={styles.rightInnerSection}>
            <HStack w="100%" justifyContent="space-between">
              <HStack>
                {isEditingName ? (
                  <Input
                    placeholder={profileName}
                    value={newUsername}
                    onChange={handleUsernameChange}
                    width="80%"
                  ></Input>
                ) : (
                  <Text className={styles.profileTitle}>{profileName}</Text>
                )}
                {isProfileOwner && (
                  <Box pl=".5rem" onClick={handleEditNameMode}>
                    <IconButton
                      aria-label="Edit profile"
                      icon={isEditingName ? <FaCheck /> : <FaPen />}
                    />
                  </Box>
                )}
              </HStack>
              <HStack>
                <VStack>
                  {isProfileOwner ? (
                    <HStack>
                      <Button onClick={mintSBT}>
                        Mint Profile SBT{" "}
                        <Box pl=".4rem">
                          <FaStar />
                        </Box>
                      </Button>
                    </HStack>
                  ) : (
                    <HStack>
                      <VStack opacity={0.4}>
                        <FaFlag />
                      </VStack>
                      <Text className={styles.reviewsText}>
                        Report this address
                      </Text>
                    </HStack>
                  )}
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
            <StarRating
              score={scores.trust ?? 0}
              reviewCount={receivedReviews.length}
            />
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
          <ReviewsSection
            givenReviews={givenReviews}
            receivedReviews={receivedReviews}
          />
        </VStack>
      </HStack>
    </main>
  );
}

export default withTransition(Profile);
