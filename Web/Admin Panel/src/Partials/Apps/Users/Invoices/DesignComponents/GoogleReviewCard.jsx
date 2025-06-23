/* eslint-disable react/prop-types */
import { Phone, Globe, Mail, Building2 } from "lucide-react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LoadingFallback from "../../../LoadingFallback/LoadingFallback";
import googleLogo from "../../../../../assets/images/google_name.png";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { captureCard } from "../../../utils/captureCards";
import { downloadImage } from "../../../utils/downloadImage";
import { handleApiError } from "../../../utils/handleApiError";

const GoogleReviewCard = ({ cardId, onClose, orderStatus }) => {
  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  // State variables
  const cardRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [side, setSide] = useState("front");
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardFrontLogo, setCardFrontLogo] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (cardData?.logo) {
        try {
          const frontLogoURL = `${IMG_URL}/card-images/${cardData.logo}`;
          setCardFrontLogo(frontLogoURL);
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
          setIsLoading(false);
        }
      } catch (error) {
        setCardData([]);
        handleApiError(error, "fetching", "card details");
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, cardId, token]);

  if (isLoading) return <LoadingFallback />;

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  if (!cardData)
    return (
      <div className="alert alert-danger" role="alert">
        No card data available
      </div>
    );

  const cardStyle = {
    width: "355px",
    height: "530px",
    backgroundColor: cardData.card_color,
    color: cardData.text_color,
    border: "1px solid #dee2e6",
    borderRadius: "15px",
    padding: "20px",
    position: "relative",
    transition: "all 0.3s ease",
  };

  const renderBackSide = () => (
    <div className="text-center">
      <div>
        <p className="mt-2 mb-4">
          Please take a minute
          <br />
          and leave us a review on Google!
        </p>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div
            className="qr-code-container"
            style={{
              width: "150px",
              height: "150px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              justifyContent: "center",
              border: `3px solid ${cardData.text_color}`,
              borderRadius: "22px",
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/440px-QR_code_for_mobile_English_Wikipedia.svg.png"
              alt="QR Code"
              style={{
                width: "calc(100% - 8px)",
                height: "calc(100% - 8px)",
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <small>
            {cardData.title && (
              <div
                style={{
                  color: `${cardData.text_color}`,
                  fontSize: "16px",
                  textTransform: "capitalize",
                }}
              >
                <Building2 /> {cardData.title}
              </div>
            )}

            {cardData.phone && (
              <div
                style={{
                  color: `${cardData.text_color}`,
                  fontSize: "16px",
                }}
              >
                <Phone /> {cardData.phone}
              </div>
            )}

            {cardData.email && (
              <div
                style={{
                  color: `${cardData.text_color}`,
                  fontSize: "16px",
                }}
              >
                <Mail size={24} /> {cardData.email}
              </div>
            )}

            {cardData.website && (
              <div
                style={{
                  color: `${cardData.text_color}`,
                  fontSize: "16px",
                }}
              >
                <Globe size={24} /> {cardData.website}
              </div>
            )}
          </small>
        </div>
        <div className="d-flex justify-content-center mt-3 mb-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <FaStar key={index} color="#FFD700" size={24} />
          ))}
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ color: cardData.text_color }}
        >
          <div>1. Scan QR-code</div>
          <div>2. Leave a review</div>
          <div>3. Done!</div>
        </div>
      </div>
    </div>
  );

  const renderCardFront = () => (
    <div className="text-center">
      <div
        style={{
          marginTop: cardFrontLogo ? "20px" : "10px",
          marginBottom: cardFrontLogo ? "20px" : "10px",
          textAlign: "center",
        }}
      >
        {cardFrontLogo && (
          <img
            src={cardFrontLogo}
            alt="Company Logo"
            style={{
              width: "200px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "15px",
            }}
          />
        )}
      </div>

      <div
        style={{
          marginBottom: !cardFrontLogo && "90px",
          marginTop: !cardFrontLogo && "40px",
        }}
      >
        <img
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
          alt="Google Logo"
          style={{
            width: cardFrontLogo ? "180px" : "210px",
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "15px",
          }}
        />
      </div>

      <div className="d-flex justify-content-center my-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <FaStar key={index} color="#FFD700" size={24} />
        ))}
      </div>

      <p
        className="mt-4"
        style={{
          color: cardData.text_color,
          fontSize: "36px",
          lineHeight: "1.2",
        }}
      >
        Review us <br /> on{" "}
        <img
          src={googleLogo}
          loading="lazy"
          alt="Google Logo"
          style={{
            width: "120px",
            backgroundColor: "white",
            padding: "2px",
            borderRadius: "10px",
          }}
        />
      </p>
    </div>
  );

  const handleCaptureCards = async () => {
    if (!cardRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      await Promise.all([cardFrontLogo].map((img) => (new Image().src = img)));

      setSide("front");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const frontBlob = await captureCard("front", cardRef);

      setSide("back");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const backBlob = await captureCard("back", cardRef);

      if (frontBlob) downloadImage(frontBlob, "front-card.png");
      if (backBlob) downloadImage(backBlob, "back-card.png");

      setSide("front");
      onClose();
    } catch (err) {
      handleApiError(err, "capturing", "card");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center">
        <div style={cardStyle} ref={cardRef} className="card shadow-lg mb-4">
          {side === "front" ? renderCardFront() : renderBackSide()}
        </div>
      </div>

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

export default GoogleReviewCard;
