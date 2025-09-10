import formatCurrency from "./formatCurrency";

export const formatDiscount = (type, value) => {
  if (type === "percent") return `${parseFloat(value).toFixed(0)}%`;
  return formatCurrency(value);
};

export const getUsageProgress = (used, limit) => {
  const usedNum = parseInt(used || "0", 10);
  const limitNum = parseInt(limit || "0", 10);
  const percent = limitNum > 0 ? (usedNum / limitNum) * 100 : 0;
  return { used: usedNum, limit: limitNum, percent };
};

export const formatRecurring = (value) => (value === "1" ? "Yes" : "No");

export const getDaysLeft = (validTill) => {
  const today = new Date();
  const end = new Date(validTill);
  const days = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return days;
};
