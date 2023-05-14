import { ethers } from "ethers";

export function abridgeAddress(address?: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 6)}...${address.substring(l - 4, l)}`;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function encodeRawKey(rawKey: string) {
  if (rawKey.length < 32) return ethers.utils.formatBytes32String(rawKey);

  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawKey));
  return hash.slice(0, 64) + "ff";
}

export function isValidEthereumAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // Check if it has the basic requirements of an address
    return false;
  }
  return true;
}

export function isChecksumAddress(address) {
  // Check each case
  address = address.replace("0x", "");
  var addressHash = ethers.utils.keccak256(address.toLowerCase());
  for (var i = 0; i < 40; i++) {
    // The nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
}
