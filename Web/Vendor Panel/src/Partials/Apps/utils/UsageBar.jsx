/* eslint-disable react/prop-types */
import { getUsageProgress } from "./couponFormatters";

export const UsageBar = ({ used, limit }) => {
  const { used: u, limit: l, percent } = getUsageProgress(used, limit);

  return (
    <div>
      <div>{`${u} / ${l || "∞"}`}</div>
      {l > 0 && (
        <div className="progress" style={{ height: "6px", width: "80px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
};
