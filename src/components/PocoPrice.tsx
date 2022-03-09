import { Statistic } from "antd";
import BigNumber from "bignumber.js";
import React from "react";
import { usePocoPriceQuery } from "../generated/graphql";

function PocoPrice() {
  const [queryResult] = usePocoPriceQuery();
  const price = new BigNumber(queryResult.data?.token_price?.[0].price || 0)
    .div(1e18)
    .toFixed(4);

  return <Statistic title="Poco Price" value={"$" + price} />;
}

export default PocoPrice;
