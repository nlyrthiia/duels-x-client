import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import type { Chain } from "@starknet-react/chains";
import {
  jsonRpcProvider,
  StarknetConfig,
  cartridge as cartridgeExplorer,
} from "@starknet-react/core";
import cartridgeConnector from "../config/cartridgeConnector";

// Select RPC and chain based on VITE_PUBLIC_DEPLOY_TYPE to match cartridgeConnector
const { VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env as {
  VITE_PUBLIC_DEPLOY_TYPE?: string;
};

const getRpcUrl = (): string => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "localhost":
      return "http://localhost:5050";
    case "mainnet":
      return "https://api.cartridge.gg/x/starknet/mainnet";
    case "sepolia":
    default:
      return "https://api.cartridge.gg/x/starknet/sepolia";
  }
};

const rpcUrl = getRpcUrl();
console.log(rpcUrl, "rpcUrl");

// When localhost, we expose a custom Katana chain so StarknetConfig matches the connector
const katanaChain: any = {
  id: BigInt("0x4b4154414e41"), // "KATANA"
  name: "Katana",
  network: "localhost",
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] },
  },
};

const selectedChain: Chain = (() => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "localhost":
      return katanaChain;
    case "mainnet":
      return mainnet;
    case "sepolia":
    default:
      return sepolia;
  }
})();

// Configure the JSON RPC provider to always use the computed rpcUrl
const provider = jsonRpcProvider({
  rpc: () => ({ nodeUrl: rpcUrl }),
});

// Create the Starknet provider
export default function StarknetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StarknetConfig
      autoConnect
      defaultChainId={selectedChain.id}
      chains={[selectedChain]}
      provider={provider}
      connectors={[cartridgeConnector]}
      explorer={cartridgeExplorer}
    >
      {children}
    </StarknetConfig>
  );
}
