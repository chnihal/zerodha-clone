const symbolAliases = {
  HUL: "HINDUNILVR",
};

const normalizeSymbol = (name) => {
  const normalized = String(name || "").trim().toUpperCase();
  return symbolAliases[normalized] || normalized;
};

const rebuildHoldingsFromOrders = async (HoldingsModel, OrdersModel) => {
  const orders = await OrdersModel.find({}).sort({ createdAt: 1 });
  const positions = {};
  const existingHoldings = await HoldingsModel.find({});
  const existingByName = Object.fromEntries(
    existingHoldings.map((holding) => [holding.name, holding.toObject()])
  );

  orders.forEach((order) => {
    const name = normalizeSymbol(order.name);
    const qty = Number(order.qty);
    const price = Number(order.price);
    const mode = String(order.mode || "").toUpperCase();

    if (!name || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price)) {
      return;
    }

    if (!positions[name]) {
      positions[name] = { qty: 0, avg: 0 };
    }

    if (mode === "BUY") {
      const position = positions[name];
      const totalQty = position.qty + qty;
      position.avg =
        position.qty === 0
          ? price
          : (position.avg * position.qty + price * qty) / totalQty;
      position.qty = totalQty;
      return;
    }

    if (mode === "SELL") {
      if (!positions[name] || positions[name].qty < qty) {
        return;
      }

      positions[name].qty -= qty;

      if (positions[name].qty <= 0) {
        delete positions[name];
      }
    }
  });

  await HoldingsModel.deleteMany({});

  const holdingsToInsert = Object.entries(positions)
    .filter(([, position]) => position.qty > 0)
    .map(([name, position]) => {
      const existing = existingByName[name];

      return {
        name,
        qty: position.qty,
        avg: position.avg,
        price: existing?.price ?? position.avg,
        net: existing?.net ?? "0.00%",
        day: existing?.day ?? "0.00%",
      };
    });

  if (holdingsToInsert.length > 0) {
    await HoldingsModel.insertMany(holdingsToInsert);
  }
};

module.exports = { normalizeSymbol, rebuildHoldingsFromOrders };
