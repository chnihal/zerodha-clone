export const computeHoldingsSummary = (holdings = []) => {
  const totalInvestment = holdings.reduce(
    (sum, stock) => sum + Number(stock.avg) * Number(stock.qty),
    0
  );
  const currentValue = holdings.reduce(
    (sum, stock) => sum + Number(stock.price) * Number(stock.qty),
    0
  );
  const totalPnl = currentValue - totalInvestment;
  const totalPnlPercent =
    totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  return {
    count: holdings.length,
    totalInvestment,
    currentValue,
    totalPnl,
    totalPnlPercent,
  };
};

export const formatCompactINR = (value) => {
  const amount = Number(value) || 0;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 100000) {
    return `${sign}${(abs / 100000).toFixed(2)}L`;
  }

  if (abs >= 1000) {
    return `${sign}${(abs / 1000).toFixed(2)}k`;
  }

  return `${sign}${abs.toFixed(2)}`;
};
