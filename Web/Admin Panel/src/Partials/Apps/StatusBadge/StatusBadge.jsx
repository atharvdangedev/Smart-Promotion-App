/* eslint-disable react/prop-types */
const StatusBadge = ({ status, badgeStatuses }) => {
  const bgColor = badgeStatuses[status];
  const textColor = "#ffffff";

  return (
    <div
      className="btn btn-sm"
      style={{
        backgroundColor: status === "NoStatus" ? "#E8EBF7" : bgColor,
        color: status === "NoStatus" ? "#000" : textColor,
        pointerEvents: "none",
        cursor: "default",
      }}
    >
      {status}
    </div>
  );
};

export default StatusBadge;
