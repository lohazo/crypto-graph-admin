import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Text from "antd/lib/typography/Text";
import BigNumber from "bignumber.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Order, useOrderQuery, useOrderSubscriptionSubscription } from "../generated/graphql";
import { shortenAddress } from "../lib/shortenAddress";

function OrdersList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryResult, reExecuteQuery] = useOrderQuery({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
    },
  });

  const total = queryResult.data?.order_aggregate.aggregate?.count || undefined;
  // const data = queryResult.data?.order || [];

  // @ts-ignore
  function onChange(pagination, filters, sorter, extra) {
    const { current, pageSize } = pagination;
    router.push(
      {
        query: {
          ...router.query,
          page: current,
          pageSize: pageSize,
        },
      },
      undefined,
      { scroll: false }
    );
    setCurrentPage(current);
    setPageSize(pageSize);
    // refreshDataTable();
  }

  useEffect(() => {
    if (router.query?.page)
      setCurrentPage(
        typeof router.query?.page === "string"
          ? parseInt(router.query?.page)
          : 1
      );
    setPageSize(
      typeof router.query?.pageSize === "string"
        ? parseInt(router.query?.pageSize)
        : 10
    );
  }, [router]);

  const [orderS] = useOrderSubscriptionSubscription({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
    },
  })
  const data = orderS.data?.order || [];

  const columns: ColumnsType<Order> = [
    {
      title: "Bot",
      render: (_, record) => <Text>{record.bot.name}</Text>,
      key: "name",
    },
    {
      title: "Interval",
      render: (_, record) => <Text>{record.bot.interval}</Text>,
      key: "interval",
    },
    // {
    //   title: "Token out/Amount",
    //   render: (_, data) => `${shortenAddress(data.bot.sell_token)} / ${data.sell_amount}`,
    //   key: "sell_token",
    // },
    {
      title: "Token in/Amount",
      render: (_, data) =>
        `${shortenAddress(data.bot.buy_token)} / ${data.buy_amount}`,
      key: "buy_token",
    },
    {
      title: "Price",
      render: (_, record) => (
        <Text>{new BigNumber(record.price).toFormat(18)}</Text>
      ),
      key: "step_buy_amount",
    },
    {
      title: "Tx Hash",
      render: (_, record) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://testnet.bscscan.com/tx/${record.transaction_hash}`}
        >
          <Text>{shortenAddress(record.transaction_hash)}</Text>
        </a>
      ),
      key: "total_buy_amount",
    },
  ];

  return (
    <div>
      <Card title="Order List">
        <Table
          loading={queryResult.fetching}
          columns={columns}
          bordered
          // @ts-ignore
          dataSource={data}
          onChange={onChange}
          pagination={{
            current: currentPage,
            total: total,
            pageSize: pageSize,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}

export default OrdersList;
