import styles from "@styles/Home.module.css";
import { HStack, Image, Text, Box } from "@chakra-ui/react";

type StarRatingProps = {
  score: number;
  reviewCount: number;
};

function StarRating({ score, reviewCount }: StarRatingProps) {
  const filledStars = Math.floor(score);
  const partialStar = score - filledStars;

  return (
    <HStack position="relative">
      <HStack width="210px">
        <HStack zIndex={1}>
          {[...Array(filledStars)].map((_, idx) => (
            <Image src="/star.png" alt="Full star" key={idx} width="35px" />
          ))}
          {partialStar > 0 && (
            <Box
              width={`${35 * partialStar}px`}
              height="35px"
              overflow="hidden"
            >
              <Box
                width="35px"
                height="35px"
                background={`url(/star.png)`}
                backgroundSize="cover"
              />
            </Box>
          )}
        </HStack>
        <HStack position="absolute" margin="0 !important" zIndex={0}>
          {[...Array(5)].map((_, idx) => (
            <Image
              src="/greystar.png"
              alt="Empty star"
              key={idx}
              width="35px"
            />
          ))}
        </HStack>
      </HStack>
      <Text className={styles.scoreText}>{score ? score.toFixed(2) : "0"}</Text>
      <Text className={styles.reviewsText}>· {reviewCount} reviews</Text>
    </HStack>
  );
}

export default StarRating;
