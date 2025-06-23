/* eslint-disable react/prop-types */
import { Phone, Globe, Mail, Nfc } from "lucide-react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LoadingFallback from "../../../LoadingFallback/LoadingFallback";
import axios from "axios";
import "./visitingCard.css";
import { captureCard } from "../../../utils/captureCards";
import { downloadImage } from "../../../utils/downloadImage";
import { handleApiError } from "../../../utils/handleApiError";

const VisitingCard = ({ cardId, onClose, orderStatus }) => {
  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const IMG_URL = "https://api.Smart Promotion App/image-proxy";

  // State variables
  const cardRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [side, setSide] = useState("front");
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardBgImage, setCardBgImage] = useState(null);
  const [cardLogo, setCardLogo] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (cardData) {
        try {
          if (cardData.card_bg_image) {
            setCardBgImage(`${IMG_URL}/${cardData.card_bg_image}`);
          }
          if (cardData.logo) {
            setCardLogo(`${IMG_URL}/${cardData.logo}`);
          }
        } catch (error) {
          handleApiError(error, "fetching", "card images");
        }
      }
    };
    fetchImages();
  }, [IMG_URL, cardData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APP_URL}/view-card/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setCardData(response.data.card_details);
        }
      } catch (error) {
        setCardData([]);
        handleApiError(error, "fetching", "card details");
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, cardId, token]);

  const handleCaptureCards = async () => {
    if (!cardRef.current || isCapturing) return;
    try {
      setIsCapturing(true);

      // Capture front
      setSide("front");
      console.log("capturing front");
      await new Promise((r) => setTimeout(r, 500));
      const frontBlob = await captureCard(cardRef);

      // Capture back
      setSide("back");
      console.log("capturing back");
      await new Promise((r) => setTimeout(r, 500));
      const backBlob = await captureCard(cardRef);

      // Download
      console.log("downloading");
      if (frontBlob) downloadImage(frontBlob, "front-card.svg");
      if (backBlob) downloadImage(backBlob, "back-card.svg");

      // reset
      setSide("front");
      onClose();
    } catch (err) {
      console.error(err);
      console.log("error occured");
      handleApiError(err, "capturing", "card");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingFallback />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div
          className="container d-flex justify-content-start align-items-center"
          style={{ height: "500px", width: "800px" }}
        >
          <div
            className="card shadow-lg"
            style={{
              width: "743px",
              height: "469px",
              borderRadius: "32px",
              position: "relative",
              overflow: "hidden",
              background: cardData.card_color,
              backgroundImage: cardBgImage ? `url(${cardBgImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            ref={cardRef}
          >
            <div className="card-body p-4 h-100">
              {side === "front" ? (
                <div className="position-relative h-100">
                  {cardLogo && (
                    <div className="position-absolute top-0 start-0 ss-image-container">
                      <img
                        src={cardLogo}
                        alt="Front Logo"
                        className="ss-image"
                      />
                    </div>
                  )}

                  <div className="position-absolute top-0 end-0">
                    <div
                      className="rounded ss-nfc-icon"
                      style={{
                        color: cardData.qr_nfc_color,
                      }}
                    >
                      <Nfc className="ss-nfc-icon-size" />
                    </div>
                  </div>

                  <div className="position-absolute ss-card-details bottom-0 end-0">
                    <h2
                      className="card-title"
                      style={{
                        fontSize: `${cardData.titleSize}rem`,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                        color: cardData.text_color,
                      }}
                    >
                      {cardData.name}
                    </h2>
                    {cardData.subTitle && (
                      <p
                        className="card-text ss-text-size"
                        style={{
                          textTransform: "capitalize",
                          color: cardData.text_color,
                        }}
                      >
                        {cardData.subTitle}
                      </p>
                    )}
                    {cardData.phoneNumber && (
                      <p
                        className="card-text d-flex align-items-center gap-2 ss-text-size"
                        style={{
                          color: cardData.text_color,
                        }}
                      >
                        <Phone className="ss-normal-icon-size" />{" "}
                        {cardData.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="position-absolute bottom-0 end-0">
                    <div
                      className="rounded-4 ss-qr-code-body"
                      style={{
                        border: `3px solid ${cardData.qr_nfc_color}`,
                        backgroundColor: "white",
                      }}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/440px-QR_code_for_mobile_English_Wikipedia.svg.png"
                        alt="QR Code"
                        className="ss-qr-code"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="position-relative h-100">
                  {cardLogo && (
                    <div className="position-absolute start-50 translate-middle ss-card-back-side">
                      <img
                        src={cardLogo}
                        alt="Back Logo"
                        className="ss-card-back-logo"
                        onError={(e) => {
                          e.target.src =
                            "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500";
                        }}
                      />
                    </div>
                  )}

                  <div className="position-absolute top-0 end-0">
                    <div
                      className="rounded ss-nfc-icon"
                      style={{
                        color: cardData.qr_nfc_color,
                      }}
                    >
                      <Nfc className="ss-nfc-icon-size" />
                    </div>
                  </div>

                  <div
                    className="position-absolute start-0 w-100 p-4"
                    style={{ bottom: "5%" }}
                  >
                    <div className="d-flex flex-column align-items-center mt-4">
                      {cardData.email && (
                        <p
                          className="card-text d-flex align-items-center gap-2 ss-text-size2"
                          style={{
                            color: cardData.text_color,
                          }}
                        >
                          <Mail className="ss-normal-icon-size" />
                          {cardData.email}
                        </p>
                      )}
                      {cardData.website && (
                        <p
                          className="card-text d-flex align-items-center gap-2 ss-text-size2"
                          style={{
                            color: cardData.text_color,
                          }}
                        >
                          <Globe className="ss-normal-icon-size" />
                          {cardData.website}
                        </p>
                      )}
                    </div>
                  </div>

                  <p
                    className="position-absolute start-0 w-100 ss-footer-note"
                    style={{
                      bottom: "1%",
                      textAlign: "center",
                      color: cardData.text_color,
                    }}
                  >
                    Powered by Smart Promotion App
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {orderStatus === "Pending" && (
        <div className="alert alert-warning" role="alert">
          Please wait for the order to be completed before printing the card.
        </div>
      )}

      <div className="d-flex justify-content-center gap-3 mb-2">
        <button
          onClick={() => setSide("front")}
          className={`btn ${
            side === "front" ? "btn-dark" : "btn-outline-dark"
          }`}
          aria-pressed={side === "front"}
          disabled={isCapturing}
        >
          <ChevronLeft className="me-1" />
          Front
        </button>
        <button
          onClick={() => setSide("back")}
          className={`btn ${side === "back" ? "btn-dark" : "btn-outline-dark"}`}
          aria-pressed={side === "back"}
          disabled={isCapturing}
        >
          Back
          <ChevronRight className="ms-1" />
        </button>
        <button
          onClick={handleCaptureCards}
          className="btn btn-dark"
          disabled={isCapturing || orderStatus === "Pending"}
        >
          {isCapturing ? "Capturing..." : "Print"}
          <Printer className="ms-1" />
        </button>
      </div>
    </>
  );
};

export default VisitingCard;
