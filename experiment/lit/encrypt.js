import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString, decryptToString } from "lit-protocol/encryption";
import { LIT_NETWORK, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";

const litNodeClient = new LitNodeClient({
  litNetwork: LIT_NETWORK.DatilDev,
  debug: false
});
await litNodeClient.connect();

const ethersWallet = new ethers.Wallet(
  process.env.ETHEREUM_PRIVATE_KEY!, // Replace with your private key
  new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);