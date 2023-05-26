import styles from "@styles/Home.module.css";
import { HStack, Image, VStack, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import Jdenticon from "react-jdenticon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { Web3Storage } from "web3.storage";
import { TRUSTSIGHT_API_URL } from "@utils/utils";

const WEB3_STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY;

const client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN,
  endpoint: new URL("https://api.web3.storage"),
});

type ProfileSectionProps = {
  address: string;
  account: string;
  profileImage: string;
  fetchMetadata: () => void;
  onOpen: () => void;
};

function ProfileSection({
  address,
  account,
  profileImage,
  fetchMetadata,
  onOpen,
}: ProfileSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
  const { openConnectModal } = useConnectModal();

  async function handleSaveImage() {
    if (!uploadedFile) {
      setIsEditingImage(false);
      return;
    }

    const blob = new Blob([uploadedFile], { type: "application/png" });
    const imageToUpload = [new File([blob], "image.png")];
    const imageCID = await client.put(imageToUpload);
    const imageLink = `https://${imageCID}.ipfs.w3s.link/image.png`;

    const response = await axios.post(`${TRUSTSIGHT_API_URL}/api/address`, {
      address: account,
      image: imageLink,
    });

    if (response.status === 200) {
      await fetchMetadata();
    }

    setIsEditingImage(false);
  }

  function handleFileUpload(e) {
    setIsEditingImage(true);
    setUploadedFile(e.target.files[0]);
  }

  const handleReview = () => {
    if (!account) {
      openConnectModal();
    } else {
      onOpen();
    }
  };

  return (
    <VStack className={styles.stickySection}>
      {uploadedFile ? (
        <Image
          src={URL.createObjectURL(uploadedFile)}
          alt="image"
          className={styles.profileImage}
        ></Image>
      ) : profileImage ? (
        <Image
          src={profileImage}
          alt="image"
          className={styles.profileImage}
        ></Image>
      ) : (
        <Jdenticon value={address as string} className={styles.profileImage} />
      )}
      {address === account &&
        (isEditingImage ? (
          <VStack pt="1rem">
            <Button className={styles.editImageBtn} onClick={handleSaveImage}>
              Save new image
            </Button>
          </VStack>
        ) : (
          <VStack className={styles.fileUploadContainer}>
            <input
              type="file"
              name="images"
              id="images"
              required
              multiple
              onChange={handleFileUpload}
              className={styles.fileUploader}
            />
            <Button className={styles.editImageBtn}>Edit profile image</Button>
          </VStack>
        ))}
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
  );
}

export default ProfileSection;
