import { useDojoSDK } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { toast } from "react-toastify";

const useInteraction = () => {
  const { client } = useDojoSDK();
  const { account } = useAccount();

  async function call(namespace: string, method: string, ...args: any) {
    try {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }
      console.log("Calling namespace:", namespace, "method:", method, "with args:", args);
      console.log("Client:", client);
      console.log("Client keys:", Object.keys(client || {}));
      if (!client || !client[namespace]) {
        console.error("Available namespaces:", Object.keys(client || {}));
        toast.error(`Namespace ${namespace} not found in client`);
        return false;
      }
      if (!client[namespace][method]) {
        console.error("Available methods:", Object.keys(client[namespace] || {}));
        toast.error(`Method ${method} not found in client.${namespace}`);
        return false;
      }
      const tx = await client[namespace][method](account, ...args);
      const receipt = await account.waitForTransaction(tx.transaction_hash);
      console.log("Transaction receipt:", receipt);
      return true;
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast.error(error.message || "OOPS something went wrong");
      return false;
    }
  }

  async function spawnPlayer() {
    return call("arcane_game", "spawnPlayer");
  }

  async function startMatch(opponent: string) {
    return call("arcane_game", "startMatch", opponent);
  }

  async function playCard(matchId: number, handSlot: number) {
    return call("arcane_game", "playCard", matchId, handSlot);
  }

  async function endTurn(matchId: number) {
    return call("arcane_game", "endTurn", matchId);
  }

  async function setDeck(seed: number, cards: number[]) {
    return call("arcane_game", "setDeck", seed, cards);
  }

  return { call, spawnPlayer, startMatch, playCard, endTurn, setDeck };
};

export default useInteraction;

