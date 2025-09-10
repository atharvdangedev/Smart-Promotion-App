/* eslint-disable react/prop-types */
import { formatDiscount } from "./couponFormatters";

export const DiscountBadge = ({ type, value }) => {
  return (
    <span
      className={`badge ${type === "percent" ? "bg-info" : "bg-warning"}`}
      style={{ color: "#fff" }}
    >
      {formatDiscount(type, value)}
    </span>
  );
};
