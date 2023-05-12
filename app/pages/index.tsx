import { Search2Icon } from "@chakra-ui/icons";
import { HStack, VStack, Text, Input, Image, Box } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import { useRouter } from "next/router";
import { useState } from "react";

function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState("DAO");
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
        <HStack w="100%" justifyContent="space-between"></HStack>
        <HStack className={styles.carousel}></HStack>
      </VStack>
      <Box h="60px" />
      <VStack gap={6} w="100%">
        <Text className={styles.header} w="100%">
          Recent Reviews
        </Text>
        <HStack className={styles.carousel}></HStack>
      </VStack>
      <Box h="40px" />
      <Text className={styles.bold}>
        Built with ❤️ at BNB Zero2Hero Hackathon
      </Text>
    </main>
  );
}

export default Home;
