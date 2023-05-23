import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  HStack,
  Text,
  VStack,
  Image,
  Link as ChakraLink,
  Textarea,
  Button,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import SuccessLottie from "@components/SuccessLottie";
import Identicon from "react-identicons";
import {
  abridgeAddress,
  capitalizeFirstLetter,
  encodeRawKey,
} from "@utils/utils";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import registryContract from "@data/abi.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const REGISTRY = "0x8d52577beae02D3FE7d8C33AF7f5B00c291C7603";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  image: string;
  address: string;
  category: string;
  subscores: any;
};

function ReviewModal({
  isOpen,
  onOpen,
  onClose,
  title,
  image,
  address,
  category,
  subscores,
}: Props) {
  const [reviewMap, setReviewMap] = useState({ trust: { val: 0 } });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: REGISTRY,
    abi: registryContract.abi,
    functionName: "createReview",
    args: [Object.values(reviewMap)],
  });

  const {
    data,
    error,
    isError,
    isLoading: isTxnLoading,
    isSuccess,
    write,
  } = useContractWrite(config);

  function handleSetScore(score: number, type: string) {
    const reviewDeepCopy = JSON.parse(JSON.stringify(reviewMap));

    if (score === reviewDeepCopy[type]["val"]) {
      reviewDeepCopy[type]["val"] = 0;
      setReviewMap(reviewDeepCopy);
    } else {
      reviewDeepCopy[type]["val"] = score;
      setReviewMap(reviewDeepCopy);
    }
  }

  // initialize reviewMap
  useEffect(() => {
    if (!address || !subscores) return;

    const reviewDeepCopy = JSON.parse(JSON.stringify(reviewMap));

    const trustKey = encodeRawKey(`trustsight.trust`);

    const review = {
      reviewee: address,
      key: trustKey,
      val: 0,
    };

    reviewDeepCopy["trust"] = review;

    subscores.forEach((subscore) => {
      const reviewKey = encodeRawKey(
        `trustsight.${category.toLowerCase()}.${subscore}`
      );

      const review = {
        reviewee: address,
        key: reviewKey,
        val: 0,
      };

      reviewDeepCopy[subscore] = review;
    });
    setReviewMap(reviewDeepCopy);
  }, [address, subscores]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalHeader className={styles.modalHeader}>
          <Text className={styles.yourReview}>Your Review</Text>
        </ModalHeader>
        <ModalCloseButton />
        {isSuccess && data ? (
          <VStack className={styles.lottieContainer}>
            <SuccessLottie />
            <Text className={styles.subHeader} pb="1rem">
              Review successfully submitted!
            </Text>
          </VStack>
        ) : (
          <ModalBody>
            <VStack>
              <HStack className={styles.modalTopSection}>
                <HStack>
                  {image ? (
                    <Image
                      src={image}
                      alt={image}
                      className={styles.modalImage}
                    ></Image>
                  ) : (
                    <Identicon
                      string={address as string}
                      className={styles.modalImage}
                    />
                  )}
                  <VStack className={styles.modalTitleSection}>
                    <Text className={styles.modalTitle}>{title}</Text>
                    <Text className={styles.modalAddress}>
                      {abridgeAddress(address as string)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack gap={2}>
                  <Text className={styles.trustScore}>Trust Score</Text>
                  <HStack>
                    {new Array(reviewMap["trust"]["val"])
                      .fill(0)
                      .map((_, idx) => (
                        <Image
                          src="/star.png"
                          alt="yo"
                          key={`star-${idx}`}
                          className={styles.largestar}
                          onClick={() => handleSetScore(idx + 1, "trust")}
                        />
                      ))}
                    {new Array(5 - reviewMap["trust"]["val"])
                      .fill(0)
                      .map((_, idx) => (
                        <Image
                          src="/blankstar.png"
                          alt="yo"
                          key={`blankstar-${idx}`}
                          className={styles.largestar}
                          onClick={() =>
                            handleSetScore(
                              reviewMap["trust"]["val"] + idx + 1,
                              "trust"
                            )
                          }
                        />
                      ))}
                  </HStack>
                </HStack>
              </HStack>
              <Box h="10px"></Box>
              <HStack>
                {category && (
                  <VStack className={styles.categoryPill}>
                    <Text className={styles.categoryPillText}>{category}</Text>
                  </VStack>
                )}
                <Text className={styles.subHeader}>
                  Category scores (optional)
                </Text>
              </HStack>
              <Box h="10px"></Box>
              {subscores && subscores.length > 0 && (
                <SimpleGrid columns={2} gap={6}>
                  {subscores.map((type) => (
                    <HStack key={type}>
                      <Text className={styles.subHeader} w="130px">
                        {capitalizeFirstLetter(type)}
                      </Text>
                      <HStack>
                        {new Array(
                          type in reviewMap ? reviewMap[type]["val"] : 0
                        )
                          .fill(0)
                          .map((_, idx) => (
                            <Image
                              src="/star.png"
                              alt="yo"
                              key={`star-${idx}`}
                              className={styles.largestar}
                              onClick={() => handleSetScore(idx + 1, type)}
                            />
                          ))}
                        {new Array(
                          type in reviewMap ? 5 - reviewMap[type]["val"] : 5
                        )
                          .fill(0)
                          .map((_, idx) => (
                            <Image
                              src="/blankstar.png"
                              alt="yo"
                              key={`blankstar-${idx}`}
                              className={styles.largestar}
                              onClick={() =>
                                handleSetScore(
                                  reviewMap[type]["val"] + idx + 1,
                                  type
                                )
                              }
                            />
                          ))}
                      </HStack>
                    </HStack>
                  ))}
                </SimpleGrid>
              )}
              <Box h="15px"></Box>
              <VStack w="100%" alignItems="flex-start">
                <Text className={styles.trustScore}>Comments</Text>
                <Box h="5px"></Box>
                <Textarea placeholder="Write your review" />
              </VStack>
            </VStack>
          </ModalBody>
        )}
        <ModalFooter className={styles.modalFooter}>
          {isSuccess && data ? (
            <ChakraLink
              isExternal
              href={`https://testnet.bscscan.com/tx/${data.hash}`}
            >
              <Button className={styles.submitButton}>View Transaction</Button>
            </ChakraLink>
          ) : (
            <Button className={styles.submitButton} onClick={() => write?.()}>
              {isTxnLoading ? <Spinner color="white" /> : "Submit Review"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
