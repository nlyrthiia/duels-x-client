import { exitToMenu, resetGame } from "../utils/utils";
import { click } from "../utils/assetPaths";
import { useAccount, useDisconnect } from "@starknet-react/core";

const SettingsModal = ({
  showSettingsModal,
  setShowSettingsModal,
  playAudio,
  toggleAudioMute,
  toggleMusic,
}) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!showSettingsModal) {
    return null;
  }

  const handleSettingsClose = () => {
    setShowSettingsModal(false);
    playAudio(click);
  };

  const handleDisconnect = () => {
    setShowSettingsModal(false);
    playAudio(click);
    exitToMenu();
    disconnect();
  };

  return (
    <>
      <div
        className="modal modal-sm fade show d-block"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-modal">
            <div className="modal-header border-0">
              <h4 className="modal-title w-100 text-center font-lora-bold ms-3">
                Settings
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleSettingsClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="d-flex flex-column align-items-center">
                {isConnected ? (
                  <>
                    <div className="mb-3">
                      Player: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    <button
                      type="button"
                      className="btn btn-dark btn-width mb-3"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="btn btn-dark btn-width mb-3"
                  onClick={toggleAudioMute}
                >
                  Toggle Sound
                </button>

                <button
                  type="button"
                  className="btn btn-dark btn-width mb-3"
                  onClick={toggleMusic}
                >
                  Toggle Music
                </button>

                <button
                  type="button"
                  className="btn btn-dark btn-width mb-3"
                  onClick={resetGame}
                >
                  Reset Game
                </button>

                <button
                  type="button"
                  className="btn btn-dark btn-width mb-2"
                  onClick={exitToMenu}
                >
                  Exit to Title
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default SettingsModal;
