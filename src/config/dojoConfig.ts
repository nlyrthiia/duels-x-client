import { createDojoConfig } from "@dojoengine/core";

import { manifest } from "./manifest";

const {
  VITE_PUBLIC_NODE_URL,
  VITE_PUBLIC_TORII,
  VITE_PUBLIC_MASTER_ADDRESS,
  VITE_PUBLIC_MASTER_PRIVATE_KEY,
  VITE_PUBLIC_DEPLOY_TYPE,
} = import.meta.env as Record<string, string | undefined>;

console.log(VITE_PUBLIC_DEPLOY_TYPE, "VITE_PUBLIC_DEPLOY_TYPE");
console.log(VITE_PUBLIC_NODE_URL, "VITE_PUBLIC_NODE_URL");
console.log(VITE_PUBLIC_TORII, "VITE_PUBLIC_TORII");
console.log(VITE_PUBLIC_MASTER_ADDRESS, "VITE_PUBLIC_MASTER_ADDRESS");
console.log(VITE_PUBLIC_MASTER_PRIVATE_KEY, "VITE_PUBLIC_MASTER_PRIVATE_KEY");
console.log(manifest, "manifest");
const deriveRpcUrl = (): string => {
  if (VITE_PUBLIC_NODE_URL && VITE_PUBLIC_NODE_URL.length > 0)
    return VITE_PUBLIC_NODE_URL;
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

console.log(deriveRpcUrl(), "deriveRpcUrl");
export const dojoConfig = createDojoConfig({
  manifest,
  masterAddress: VITE_PUBLIC_MASTER_ADDRESS || "",
  masterPrivateKey: VITE_PUBLIC_MASTER_PRIVATE_KEY || "",
  rpcUrl: deriveRpcUrl(),
  toriiUrl: VITE_PUBLIC_TORII || "",
});
