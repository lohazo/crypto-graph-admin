import { ethers } from "ethers";
import {
  Erc20__factory,
  PancakePair__factory,
  Chainlink__factory,
} from "../../types";
import { simpleRpcProvider } from "./providers";

export function isAddress(value: string) {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export function getErc20Contract(
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return Erc20__factory.connect(address, signerOrProvider);
}

export function getChainlinkContract(
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return Chainlink__factory.connect(address, signerOrProvider);
}

export function getPancakePairContract(
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return PancakePair__factory.connect(address, signerOrProvider);
}
