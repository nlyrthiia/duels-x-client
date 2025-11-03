import { Connector } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { toSessionPolicies } from "@cartridge/controller";
import { constants } from "starknet";
import { manifest } from "./manifest";

const { VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env;

const getRpcUrl = () => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "localhost":
      return "http://localhost:5050"; // Katana localhost default port
    case "mainnet":
      return "https://api.cartridge.gg/x/starknet/mainnet";
    case "sepolia":
      return "https://api.cartridge.gg/x/starknet/sepolia";
    default:
      return "https://api.cartridge.gg/x/starknet/sepolia";
  }
};

const getDefaultChainId = () => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "localhost":
      return "0x4b4154414e41"; // KATANA in ASCII
    case "mainnet":
      return constants.StarknetChainId.SN_MAIN;
    case "sepolia":
      return constants.StarknetChainId.SN_SEPOLIA;
    default:
      return constants.StarknetChainId.SN_SEPOLIA;
  }
};

const getGameContractAddress = () => {
  if (!manifest || !manifest.contracts || manifest.contracts.length === 0) {
    console.error("❌ No contracts found in manifest!");
    throw new Error("No game contracts found in manifest");
  }
  // Find arcane_game contract
  const arcaneContract = manifest.contracts.find((c) =>
    c.tag.includes("arcane_game")
  );
  if (!arcaneContract) {
    console.error("❌ arcane_game contract not found in manifest!");
    throw new Error("arcane_game contract not found");
  }
  return arcaneContract.address;
};

let CONTRACT_ADDRESS_GAME: string;
try {
  CONTRACT_ADDRESS_GAME = getGameContractAddress();
} catch (error) {
  console.error("❌ Failed to get game contract address:", error);
  // Fallback - will cause issues but allows app to load
  CONTRACT_ADDRESS_GAME = "0x0";
}

// DuelsX game policies
const policies = {
  contracts: {
    [CONTRACT_ADDRESS_GAME]: {
      methods: [
        { name: "spawn_player", entrypoint: "spawn_player" },
        { name: "set_deck", entrypoint: "set_deck" },
        { name: "start_match", entrypoint: "start_match" },
        { name: "play_card", entrypoint: "play_card" },
        { name: "end_turn", entrypoint: "end_turn" },
        { name: "concede", entrypoint: "concede" },
      ],
    },
  },
};

const rpcUrl = getRpcUrl();
const chainId = getDefaultChainId();

console.log("🌐 DuelsX Cartridge Connector Configuration:", {
  rpcUrl,
  chainId,
  namespace: "dojo_starter",
  slot: "duels-x",
  contractAddress: CONTRACT_ADDRESS_GAME,
  methodsCount: policies.contracts[CONTRACT_ADDRESS_GAME]?.methods?.length || 0,
});

const sessions = toSessionPolicies(policies);
const options = {
  chains: [{ rpcUrl }],
  defaultChainId: chainId,
  policies: sessions,
  namespace: "dojo_starter",
  slot: "duels-x",
};

let cartridgeConnector: Connector;

try {
  cartridgeConnector = new ControllerConnector(options) as never as Connector;
  console.log("✅ DuelsX Cartridge connector created successfully");
} catch (error) {
  console.error("❌ Failed to create Cartridge connector:", error);
  throw error;
}

export default cartridgeConnector;
