/* eslint-disable react/prop-types */
import VisitingCard from "./DesignComponents/VisitingCard";
import GoogleReviewCard from "./DesignComponents/GoogleReviewCard";

const CARD_COMPONENTS = {
  "Digital Business Card": VisitingCard,
  "Digital Review Card": GoogleReviewCard,
};

const ImagePopup = ({ onClose, template, cardId, orderStatus }) => {
  const CardComponent = CARD_COMPONENTS[template];

  if (!CardComponent) {
    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="alert alert-danger m-3" role="alert">
              Invalid template type: {template}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header border-bottom-0">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body pt-0">
            <CardComponent
              cardId={cardId}
              onClose={onClose}
              orderStatus={orderStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
