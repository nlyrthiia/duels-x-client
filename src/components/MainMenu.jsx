import { useState, useEffect } from "react";
import useAudioPlayer from "./hooks/useAudioPlayer";
import usePreloadAssets from "./hooks/usePreloadAssets";
import { cardFronts, click, IMAGES, AUDIO, MUSIC } from "./utils/assetPaths";
import CardGalleryModal from "./modals/CardGalleryModal";
import HelpModal from "./modals/HelpModal";
import AboutModal from "./modals/AboutModal";
import { useAccount, useConnect } from "@starknet-react/core";
import { toast } from "react-toastify";
import useInteraction from "../dojo/hooks/useInteraction";

const MainMenu = () => {
  // Preload to use cache and reduce latency
  usePreloadAssets(IMAGES, AUDIO, MUSIC);
  const { address, account, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { spawnPlayer } = useInteraction();

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCardGallery, setShowCardGallery] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const { playAudio } = useAudioPlayer();

  const loadGame = () => {
    // Use full page rerender to keep the game state clean
    window.location.href = "/game";
  };

  const handleConnect = async () => {
    if (isConnected && address) {
      console.log("Already connected, spawning player and navigating to game");
      try {
        const success = await spawnPlayer();

        if (success) {
          toast.success("Player spawned successfully, navigating to game");
          window.location.href = "/game";
        } else {
          console.error("Spawn failed");
        }
      } catch (error) {
        console.error("Spawn error:", error);
      }
    } else if (!isConnected || !address) {
      console.log("Not connected, attempting to connect...");
      if (!connectors || connectors.length === 0) {
        console.error("No connectors available!");
        alert("Cartridge Controller not found. Please check your setup.");
        return;
      }
      const connector = connectors[0];
      await connect({ connector });
    }
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
    playAudio(click);
  };

  const handleCardsClick = () => {
    setShowCardGallery(true);
    playAudio(click);
  };

  const handleAboutClick = () => {
    setShowAboutModal(true);
    playAudio(click);
  };

  return (
    <div className="d-flex flex-column bg-menu vh-100 justify-content-center align-items-center">
      <div className="d-flex align-items-baseline mb-5">
        <p className="font-cinzel-semibold menu-title-fs m-0">Duels-X</p>
        <span className="badge bg-secondary ms-2">v0.14</span>
      </div>

      {/* Without the beta tag
      <p className='font-cinzel-semibold menu-title-fs mb-5'>Duels-X</p> */}

      <div className="d-flex flex-column mt-5">
        {isConnected ? (
          <div className="d-flex align-items-center justify-content-center mb-3">
            <i className="bi bi-wallet2 me-2">Player:</i>
            <span
              className="text-truncate"
              style={{ maxWidth: "200px" }}
              title={address}
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        ) : null}
        <button
          className="btn btn-dark btn-lg btn-width mb-3"
          onClick={handleConnect}
        >
          Play
        </button>
        <button
          className="btn btn-dark btn-lg btn-width mb-3"
          onClick={handleHelpClick}
        >
          Instructions
        </button>
        <button
          className="btn btn-dark btn-lg btn-width mb-3"
          onClick={handleCardsClick}
        >
          Cards
        </button>
        <button
          className="btn btn-dark btn-lg btn-width"
          onClick={handleAboutClick}
        >
          About
        </button>
      </div>

      {/* Components rendered on demand */}
      <HelpModal
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
        playAudio={playAudio}
      />
      <CardGalleryModal
        showCardGallery={showCardGallery}
        setShowCardGallery={setShowCardGallery}
        cardImages={cardFronts}
        playAudio={playAudio}
      />
      <AboutModal
        showAboutModal={showAboutModal}
        setShowAboutModal={setShowAboutModal}
        playAudio={playAudio}
      />
    </div>
  );
};

export default MainMenu;
