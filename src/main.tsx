import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Starknet
import StarknetProvider from "./dojo/starknet-provider";

// Dojo imports
import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";

// Local imports
import { setupWorld } from "./bindings/typescript/contracts.gen";
import type { SchemaType } from "./bindings/typescript/models.gen";
import { dojoConfig } from "./config/dojoConfig";

// App Entry
import App from "./App.jsx";
import "./index.css";

async function main() {
  // Initialize the SDK with configuration options
  const sdk = await init<SchemaType>({
    client: {
      // Required: Address of the deployed World contract
      worldAddress: dojoConfig.manifest.world.address,
      // Optional: Torii indexer URL (defaults to http://localhost:8080)
      toriiUrl: dojoConfig.toriiUrl || "http://localhost:8080",

      // Optional: Relay URL for real-time messaging
      // relayUrl: dojoConfig.relayUrl || "/ip4/127.0.0.1/tcp/9090",
    },
    // Domain configuration for typed message signing (SNIP-12)
    domain: {
      name: "DuelsX",
      version: "1.0",
      chainId: "KATANA", // or "SN_MAIN", "SN_SEPOLIA", "KATANA"
      revision: "1",
    },
  });

  createRoot(document.getElementById("root")!).render(
    <StarknetProvider>
      <DojoSdkProvider
        sdk={sdk}
        dojoConfig={dojoConfig}
        clientFn={setupWorld}
      >
        <App />
        <ToastContainer />
      </DojoSdkProvider>
    </StarknetProvider>
  );
}

main();
