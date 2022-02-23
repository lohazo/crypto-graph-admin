import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  Reward_Transaction,
  useApproveRefundTransactionMutation,
  useRewardTransactionsQuery,
} from "../generated/graphql";
import { shortenAddress } from "../lib/shortenAddress";
// @ts-ignore
import Highlighter from "react-highlight-words";

function RewardTransaction() {
  const router = useRouter();

  const [status, setStatus] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryResult, reExecuteQuery] = useRewardTransactionsQuery({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
      where: {
        recipient: {
          _eq: search ? search : undefined,
        },
        status: {
          _in: status.length > 0 ? status : undefined,
        },
      },
    },
  });

  const total =
    queryResult.data?.reward_transaction_aggregate.aggregate?.count || 0;
  const data = queryResult.data?.reward_transaction || [];

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
    if (router.query?.page) {
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
    }
    if (router.query?.search != undefined) {
      // @ts-ignore
      setSearch(router.query?.search);
      setCurrentPage(1);
    }
    if (router.query?.status != undefined) {
      const selectedStatus: string[] =
        // @ts-ignore
        router.query.status?.split(",").filter(Boolean) || [];
      // @ts-ignore
      setStatus(selectedStatus);
      setCurrentPage(1);
    }
  }, [router]);

  // @ts-ignore
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  // @ts-ignore
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch("");
  };

  let searchInput = useRef(null);
  // @ts-ignore
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      // @ts-ignore
      setSelectedKeys,
      // @ts-ignore
      selectedKeys,
      // @ts-ignore
      confirm,
      // @ts-ignore
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              // handleReset(clearFilters);
              clearFilters();
              setSearch("");
              setSearchColumn(dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearch(selectedKeys[0]);
              setSearchColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    // @ts-ignore
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    // @ts-ignore
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    // @ts-ignore
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // @ts-ignore
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // @ts-ignore
    render: (text) =>
      searchColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[search]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        <Typography.Link
          target="_blank"
          rel="noreferrer"
          href={`https://bscscan.com/address/${text}`}
        >
          {shortenAddress(text)}
        </Typography.Link>
      ),
  });

  const columns: ColumnsType<Reward_Transaction> = [
    {
      title: "Date",
      key: "created_at",
      render: (_, record) => {
        return moment(record.created_at).format("MMM DD YYYY, H:mm:ss");
      },
    },
    {
      title: "Recipient",
      // key: "recipient",
      dataIndex: "recipient",
      // render: (_, record) => (
      //   <Typography.Link
      //     target="_blank"
      //     rel="noreferrer"
      //     href={`https://bscscan.com/address/${record.recipient}`}
      //   >
      //     {shortenAddress(record.recipient)}
      //   </Typography.Link>
      // ),
      ...getColumnSearchProps("recipient"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Text
          type={
            record.status === "SUCCESS"
              ? "success"
              : record.status === "ERROR"
              ? "danger"
              : "warning"
          }
        >
          {record.status}
        </Text>
      ),
    },
    // {
    //   title: "Is approved",
    //   key: "is_approved",
    //   render: (_, record) =>
    //     record.status === "ERROR" ? (record.is_approved ? "Yes" : "No") : "N/A",
    // },
    // {
    //   title: "Is refunded",
    //   key: "refunded",
    //   render: (_, record) =>
    //     record.status === "ERROR" ? (record.refunded ? "Yes" : "No") : "N/A",
    // },
    {
      title: "TxHash",
      key: "transaction_hash",
      render: (_, record) => {
        return (
          <Typography.Link
            target="_blank"
            rel="noreferrer"
            href={`https://bscscan.com/tx/${record.transaction_hash}`}
          >
            {shortenAddress(record.transaction_hash)}
          </Typography.Link>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isShowApproveButton =
          record.status === "ERROR" && !record.is_approved;
        return isShowApproveButton ? (
          <Popconfirm
            title="Confirm to approve transaction?"
            onConfirm={() => handleApproveTransaction(record.id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Approve</a>
          </Popconfirm>
        ) : record.status === "ERROR" ? (
          "Refunded"
        ) : (
          ""
        );
      },
    },
  ];

  const onSearch = (value: string) => {
    console.log(value);
    router.push(
      {
        query: { ...router.query, search: value },
      },
      undefined,
      { scroll: false }
    );
  };

  const handleFilterStatus = (statusSelected: string) => {
    if (status.includes(statusSelected)) {
      const newFilter = status.filter((i) => i !== statusSelected).join(",");
      console.log(
        "🚀 ~> file: RewardTransaction.tsx ~> line 279 ~> handleFilterStatus ~> newFilter",
        newFilter
      );
      router.push(
        {
          query: { ...router.query, status: newFilter },
        },
        undefined,
        { scroll: false }
      );
    } else {
      const newFilter = [...status, statusSelected].filter(Boolean).join(",");
      router.push(
        {
          query: { ...router.query, status: newFilter },
        },
        undefined,
        { scroll: false }
      );
    }
  };

  const [approveTxM, approveTx] = useApproveRefundTransactionMutation();
  const handleApproveTransaction = async (id: number) => {
    const res = await approveTx({
      id: id,
      is_approved: true,
    });
    console.log(
      "🚀 ~> file: RewardTransaction.tsx ~> line 336 ~> handleApproveTransaction ~> res",
      res
    );
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Card>
        <div className="flex">
          <Text className="mr-2">Status:</Text>
          <div className="flex">
            <Checkbox
              onChange={() => handleFilterStatus("SUCCESS")}
              checked={status.includes("SUCCESS")}
              className="mb-4"
            >
              SUCCESS
            </Checkbox>
            <Checkbox
              onChange={() => handleFilterStatus("ERROR")}
              checked={status.includes("ERROR")}
            >
              ERROR
            </Checkbox>
          </div>
        </div>
        <Input.Search
          placeholder="Search by wallet address"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </Card>
      <Card title="Reward transactions">
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

export default RewardTransaction;
