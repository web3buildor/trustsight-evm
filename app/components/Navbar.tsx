import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>

      <ConnectButton />
    </HStack>
  );
};

export default Navbar;
