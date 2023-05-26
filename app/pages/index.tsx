import { Search2Icon } from "@chakra-ui/icons";
import { HStack, VStack, Text, Input, Image, Box } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  categories,
  featuredProjects,
  featuredReviews,
  projects,
} from "@data/data";

function abridgeAddress(address?: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 6)}...${address.substring(l - 4, l)}`;
}

function abridgeCharacters(address?: string, char?: number) {
  if (!address) return address;
  const l = address.length;
  if (l <= char) return address;
  return `${address.substring(0, char)}...`;
}

function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState("DeFi");
  const isNavbar = false;
  const [inputValue, setInputValue] = useState("");

  function handleInputChange(e: any) {
    setInputValue(e.target.value);
  }

  function handleNavigation(e: any) {
    e.preventDefault();
    if (inputValue.length === 0) return;
    router.push(`/address/${inputValue}`);
  }

  return (
    <main className={styles.main}>
      <Box h="40px" />
      <VStack gap={8}>
        <Text className={styles.title}>
          Read Reviews. Write Reviews. Find addresses you can{" "}
          <span className={styles.specialWord}>trust.</span>
        </Text>
        <HStack className={!isNavbar ? styles.searchbar : styles.searchbarMini}>
          <Search2Icon color="black" />
          <form onSubmit={handleNavigation} style={{ width: "100%" }}>
            <Input
              className={styles.searchInput}
              placeholder="Search by address or ENS"
              onSubmit={handleNavigation}
              onChange={handleInputChange}
            ></Input>
          </form>
        </HStack>
      </VStack>
      <Box h="100px" />
      <VStack gap={4} w="100%">
        <Text className={styles.header} w="100%">
          Explore Projects
        </Text>
        <HStack
          w="100%"
          justifyContent="space-between"
          paddingTop=".5rem"
          paddingBottom=".5rem"
        >
          {categories.map((value, idx) => (
            <Text
              key={idx}
              className={`${styles.subheader} ${
                selected === value && styles.selected
              }`}
              onClick={() => {
                if (value === "More") router.push("/explore");

                setSelected(value);
              }}
              cursor="pointer"
            >
              {value}
            </Text>
          ))}
        </HStack>
        <HStack className={styles.carousel}>
          {projects
            .filter((p) => p.category === selected.toLocaleLowerCase())
            .slice(0, 4)
            .map(({ title, image, score, address, reviews }, idx) => (
              <VStack
                key={idx}
                className={styles.projectCard}
                onClick={() => router.push(`/address/${address}`)}
                cursor="pointer"
              >
                <Image src={image} alt="yo" className={styles.projectImage} />
                <VStack w="100%" pt=".3rem">
                  <HStack className={styles.projectTextContainer}>
                    <Text className={styles.projectTitle}>
                      {abridgeCharacters(title, 16)}
                    </Text>
                    <HStack>
                      <Image
                        src="/blackstar.png"
                        alt="yo"
                        className={styles.blackstar}
                      />
                      <Text className={styles.projectTitle}>{score}</Text>
                    </HStack>
                  </HStack>
                  <HStack className={styles.projectTextContainer}>
                    <Text className={styles.projectSubtitle}>
                      {abridgeAddress(address)}
                    </Text>
                    <Text className={styles.projectSubtitle}>({reviews})</Text>
                  </HStack>
                </VStack>
              </VStack>
            ))}
        </HStack>
      </VStack>
      <Box h="60px" />
      <VStack gap={6} w="100%">
        <Text className={styles.header} w="100%">
          Recent Reviews
        </Text>
        <HStack className={styles.carousel}>
          {featuredReviews.map(
            ({ image, reviewer, recipient, stars, review }, idx) => (
              <VStack key={idx} className={styles.reviewCard}>
                <HStack>
                  <Image src={image} alt="yo" className={styles.reviewImage} />
                  {new Array(stars).fill(0).map((_, idx) => (
                    <Image
                      src="/star.png"
                      alt="yo"
                      key={idx}
                      className={styles.star}
                    />
                  ))}
                  {new Array(5 - stars).fill(0).map((_, idx) => (
                    <Image
                      src="/greystar.png"
                      alt="yo"
                      key={idx}
                      className={styles.star}
                    />
                  ))}
                </HStack>
                <Text className={styles.bold}>
                  {reviewer}{" "}
                  <span className={styles.specialWord2}>reviewed</span>{" "}
                  {recipient}
                </Text>
                <Text className={styles.review}>{review}</Text>
              </VStack>
            )
          )}
        </HStack>
      </VStack>
      <Box h="4rem" />
      <Text className={styles.bold}>
        Built with ❤️ at BNB Zero2Hero Hackathon
      </Text>
    </main>
  );
}

export default Home;
