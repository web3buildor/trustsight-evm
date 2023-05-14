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
import { abridgeAddress, capitalizeFirstLetter } from "@utils/utils";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  title: string;
  image: string;
  address: string;
  category: string;
  subscores: any;
  attestationMap: any;
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
  attestationMap,
}: Props) {
  const isSuccess = false;
  const isTxnLoading = false;
  const data = {};

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
                    {new Array(attestationMap["trust"]["val"] / 100)
                      .fill(0)
                      .map((_, idx) => (
                        <Image
                          src="/star.png"
                          alt="yo"
                          key={`star-${idx}`}
                          className={styles.largestar}
                          // onClick={() => handleSetScore(idx + 1, "trust")}
                        />
                      ))}
                    {new Array(5 - attestationMap["trust"]["val"] / 100)
                      .fill(0)
                      .map((_, idx) => (
                        <Image
                          src="/blankstar.png"
                          alt="yo"
                          key={`blankstar-${idx}`}
                          className={styles.largestar}
                          // onClick={() =>
                          //   handleSetScore(
                          //     attestationMap["trust"]["val"] / 100 + idx + 1,
                          //     "trust"
                          //   )
                          // }
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
                          type in attestationMap
                            ? attestationMap[type]["val"] / 100
                            : 0
                        )
                          .fill(0)
                          .map((_, idx) => (
                            <Image
                              src="/star.png"
                              alt="yo"
                              key={`star-${idx}`}
                              className={styles.largestar}
                              // onClick={() => handleSetScore(idx + 1, type)}
                            />
                          ))}
                        {new Array(
                          type in attestationMap
                            ? 5 - attestationMap[type]["val"] / 100
                            : 5
                        )
                          .fill(0)
                          .map((_, idx) => (
                            <Image
                              src="/blankstar.png"
                              alt="yo"
                              key={`blankstar-${idx}`}
                              className={styles.largestar}
                              // onClick={() =>
                              //   handleSetScore(
                              //     attestationMap[type]["val"] / 100 + idx + 1,
                              //     type
                              //   )
                              // }
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
            <ChakraLink isExternal href="https://example.com">
              <Button className={styles.submitButton}>View Transaction</Button>
            </ChakraLink>
          ) : (
            <Button
              className={styles.submitButton}
              //   onClick={() => write?.()}
            >
              {isTxnLoading ? <Spinner color="white" /> : "Submit Review"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
