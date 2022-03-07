import { Card, Statistic } from "antd";
import Text from "antd/lib/typography/Text";
import BigNumber from "bignumber.js";
import React from "react";
import { useDashBoardQuery } from "../generated/graphql";
import PocoPrice from "./PocoPrice";
import RewardTransaction from "./RewardTransaction";

function DashBoard() {
  const [queryResult] = useDashBoardQuery();

  return (
    <div className="pt-4">
      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <Statistic
            title="Total user"
            value={queryResult.data?.user_aggregate.aggregate?.count}
          />
        </Card>
        <Card>
          <Statistic
            title="Total Reward"
            value={
              new BigNumber(
                queryResult.data?.reward_transaction_aggregate.aggregate?.sum?.amount
              ).toFixed(2) + " PL"
            }
          />
        </Card>
        <Card>
          <PocoPrice />
        </Card>
      </div>

      <div className="mt-8">
        <RewardTransaction />
      </div>
    </div>
  );
}

export default DashBoard;
