import React, { useState } from "react";
import { useDashBoardQuery } from "../generated/graphql";
import EditPost from "./Post/EditPost";
import PostList from "./Post/PostList";

function DashBoard() {
  const [queryResult] = useDashBoardQuery();

  return (
    <div className="pt-4">
      {/* <div className="grid gap-8 md:grid-cols-3">
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
              ).toFixed(2) + " "
            }
          />
        </Card>
        <Card>
          <PocoPrice />
        </Card>
      </div> */}

      <div className="mt-8">
        <PostList />
      </div>
    </div>
  );
}

export default DashBoard;
