import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Popconfirm, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Text from "antd/lib/typography/Text";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { User, useUserQuery } from "../generated/graphql";
import { shortenAddress } from "../lib/shortenAddress";

function User() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryResult, reExecuteQuery] = useUserQuery({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
      where: {
        address: {
          _like: search ? search : undefined,
        },
      },
    },
  });

  const total = queryResult.data?.user_aggregate.aggregate?.count || 0;
  const data = queryResult.data?.user || [];

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
        // <Highlighter
        //   highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        //   searchWords={[search]}
        //   autoEscape
        //   textToHighlight={text ? text.toString() : ""}
        // />
        <Typography.Link
          target="_blank"
          rel="noreferrer"
          href={`https://bscscan.com/address/${text}`}
        >
          {shortenAddress(text)}
        </Typography.Link>
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
  const columns: ColumnsType<User> = [
    {
      title: "Address",
      // key: "recipient",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Email",
      // dataIndex: "email",
      key: "email",
      render: (_, record) => {
        return record.email ?? "Not connected yet"
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Confirm to approve transaction?"
            // onConfirm={() => handleApproveTransaction(record.id)}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Ban</a>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <Card title="Users">
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

export default User;
