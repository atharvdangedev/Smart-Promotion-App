/* eslint-disable react/prop-types */

const UploadProgress = ({ uploadProgress }) => {
  return (
    <div className="progress mt-2" style={{ height: "10px" }}>
      <div
        className="progress-bar bg-primary"
        role="progressbar"
        style={{ width: `${uploadProgress}%` }}
        aria-valuenow={uploadProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
};

export default UploadProgress;
