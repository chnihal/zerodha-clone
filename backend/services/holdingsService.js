const formatNetPercent = (avg, price) => {
  if (!avg || !price) {
    return "0.00%";
  }

  const netPercent = ((price - avg) / avg) * 100;
  return `${netPercent >= 0 ? "+" : ""}${netPercent.toFixed(2)}%`;
};

const enrichHoldingWithQuote = (holding, quote) => {
  const data = holding.toObject ? holding.toObject() : { ...holding };
  const price = quote?.price ?? data.price;
  const net = formatNetPercent(data.avg, price);
  const netPercent =
    data.avg > 0 ? ((price - data.avg) / data.avg) * 100 : 0;

  return {
    ...data,
    price,
    net,
    day: quote?.percent ?? data.day,
    isLoss: quote ? quote.isDown : netPercent < 0,
    priceSource: quote?.source,
    priceUpdatedAt: quote?.updatedAt,
  };
};

module.exports = { formatNetPercent, enrichHoldingWithQuote };
