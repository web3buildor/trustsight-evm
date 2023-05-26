import { HStack, VStack, Text, Image, Box, SimpleGrid } from "@chakra-ui/react";
import withTransition from "@components/withTransition";
import { categories, defiProjects } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress, TRUSTSIGHT_API_URL } from "@utils/utils";
import { useCallback, useEffect, useState } from "react";

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("defi");
  const [dapps, setDapps] = useState([]);
  const isNavbar = false;

  const fetchDapps = useCallback(async () => {
    if (!selectedCategory) return;
    const res = await fetch(
      `${TRUSTSIGHT_API_URL}/api/projects/${selectedCategory}`
    );
    const data = await res.json();
    setDapps(data);
  }, [selectedCategory]);

  useEffect(() => {
    fetchDapps();
  }, [selectedCategory, fetchDapps]);

  return (
    <main className={styles.main}>
      <VStack gap={4} w="100%">
        <Text className={styles.header} w="100%">
          Explore Projects
        </Text>
        <HStack w="100%" justifyContent="space-between">
          {categories.map((value, idx) => (
            <Text
              key={idx}
              className={`${styles.subheader} ${
                selectedCategory === value.toLocaleLowerCase() &&
                styles.selected
              }`}
              onClick={() => setSelectedCategory(value.toLocaleLowerCase())}
              cursor="pointer"
            >
              {value}
            </Text>
          ))}
        </HStack>
        <Box h="10px" />

        {dapps.length === 0 ? (
          <VStack>
            <Text>No dapps in this category yet.</Text>
          </VStack>
        ) : (
          <SimpleGrid columns={4} gap={10}>
            {dapps.map(({ title, image, score, address, reviews }, idx) => (
              <VStack key={idx} className={styles.projectCard}>
                <Image src={image} alt="yo" className={styles.projectImage} />
                <VStack w="100%" pt=".3rem">
                  <HStack className={styles.projectTextContainer}>
                    <Text className={styles.projectTitle}>{title}</Text>
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
          </SimpleGrid>
        )}
      </VStack>
    </main>
  );
}

export default withTransition(Explore);
