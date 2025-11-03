import React from "react";

import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  InjectedConnector,
  jsonRpcProvider,
} from "@starknet-react/core";

export function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
      new InjectedConnector({
        options: { id: "okxwallet" },
      }),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  const rpc = () => {
    return {
      nodeUrl: `https://starknet-sepolia.public.blastapi.io/rpc/v0_7`,
    };
  };

  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
