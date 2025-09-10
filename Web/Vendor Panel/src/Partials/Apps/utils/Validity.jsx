/* eslint-disable react/prop-types */
import { getDaysLeft } from "./couponFormatters";
import { formatDate } from "./formatDate";

export const Validity = ({ from, till }) => {
  const daysLeft = getDaysLeft(till);

  return (
    <div className="d-flex flex-column">
      <span>
        {formatDate(from)} - {formatDate(till)}
      </span>
      <small className={daysLeft < 0 ? "text-danger" : "text-muted"}>
        {daysLeft < 0 ? "Expired" : `${daysLeft} days left`}
      </small>
    </div>
  );
};
