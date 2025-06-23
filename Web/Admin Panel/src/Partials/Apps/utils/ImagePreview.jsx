/* eslint-disable react/prop-types */

const ImagePreview = ({ ImagePreviewURL, onRemove }) => {
  return (
    <div className="mt-3 position-relative d-inline-block">
      <img
        src={ImagePreviewURL}
        alt="Preview"
        className="rounded border object-fit-cover"
        style={{ maxWidth: "100%", height: "150px" }}
      />
      <button
        type="button"
        className="btn-close position-absolute"
        style={{
          top: "-10px",
          right: "-10px",
          backgroundColor: "white",
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
        aria-label="Close"
        onClick={onRemove}
      ></button>
    </div>
  );
};

export default ImagePreview;
