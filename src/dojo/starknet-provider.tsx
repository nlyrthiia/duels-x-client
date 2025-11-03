import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  jsonRpcProvider,
  StarknetConfig,
  cartridge as cartridgeExplorer,
} from "@starknet-react/core";
import cartridgeConnector from "../config/cartridgeConnector";

// Configure the JSON RPC provider
const provider = jsonRpcProvider({
  rpc: (chain) => {
    switch (chain) {
      case mainnet:
      default:
        return { nodeUrl: "https://api.cartridge.gg/x/starknet/mainnet" };
      case sepolia:
        return { nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia" };
    }
  },
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
      defaultChainId={sepolia.id}
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[cartridgeConnector]}
      explorer={cartridgeExplorer}
    >
      {children}
    </StarknetConfig>
  );
}
