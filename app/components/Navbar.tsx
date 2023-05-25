import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image, VStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { useAccount } from "wagmi";

const Navbar = () => {
  const { address } = useAccount();
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
      <HStack>
        <ConnectButton />
        <Menu>
          <MenuButton as={Button} variant="custom">
            <HamburgerIcon />
          </MenuButton>
          <MenuList>
            <Link href="/explore">
              <MenuItem>Explore</MenuItem>
            </Link>
            <Link href="/feed">
              <MenuItem>Feed</MenuItem>
            </Link>
            <Link href={`/address/${address}`}>
              <MenuItem>My Profile</MenuItem>
            </Link>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

export default Navbar;
