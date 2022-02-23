import { useWeb3React } from "@web3-react/core";
import { Button, Card, Form, Input, message, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCreateWalletMutation,
  useWalletQuery,
  Wallet,
} from "../generated/graphql";
import { simpleRpcProvider } from "../lib/providers";

function Wallet() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryResult, reExecuteQuery] = useWalletQuery({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
    },
  });

  const total =
    queryResult.data?.wallet_aggregate.aggregate?.count || undefined;
  const data = queryResult.data?.wallet || [];

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

  const [balanceMap, setBalanceMap] = useState<any[]>([]);

  const getBalance = async () => {
    const balanceP = data.map(async (wallet) => {
      const balance = await simpleRpcProvider.getBalance(wallet.public_key);
      return {
        id: wallet.id,
        address: wallet.public_key,
        balance: ethers.utils.formatEther(balance),
      };
    });
    const balance = await Promise.all(balanceP);
    setBalanceMap(balance);
  };

  useEffect(() => {
    if (data.length > 0) {
      getBalance();
    }
  }, [data]);

  const columns: ColumnsType<Wallet> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "public_key",
      key: "public_key",
    },
    // {
    //   title: "Prv",
    //   dataIndex: "private_key",
    //   key: "private_key",
    // },
    {
      title: "Is Enabled",
      key: "is_enabled",
      render: (data) => (data.is_enabled ? "Yes" : "No"),
    },
    {
      title: "BNB",
      key: "bnb",
      render: (_, data) => {
        const balanceData = balanceMap.find((b) => b.id === data.id);
        return <p>{new BigNumber(balanceData?.balance).toFormat(4)} BNB</p>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <CreateWalletForm />

      <Card>
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

export default Wallet;

function CreateWalletForm() {
  const [form] = Form.useForm();

  const [walletAddress, setWalletAddress] = useState("");

  const handlePrivatekeyChange = (e: any) => {
    const val = e.target.value;
    try {
      const wallet = new ethers.Wallet(
        val,
        // provider
        simpleRpcProvider
      );
      setWalletAddress(wallet?.address);
      form.setFieldsValue({
        public_key: wallet?.address,
      });
    } catch {
      console.log("Wallet invalid");
    }
  };

  const [createWalletM, createWallet] = useCreateWalletMutation();

  const onFinish = async (values: any) => {
    try {
      console.log("Received values of form: ", values);
      const r = await createWallet({
        object: {
          ...values,
          is_enabled: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      console.log(r);

      if (r.error) {
        message.error(r.error.message);
      } else {
        message.success("Create wallet success");
      }
    } catch (error) {
      console.log(error);
      // message.error(error.message);
    }
  };

  return (
    <Card>
      <Form form={form} onFinish={onFinish}>
        <div className="flex gap-4">
          <Form.Item name="name" label="Name">
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item name="public_key" label="Address">
            <Input
              // placeholder="address"
              readOnly
              disabled
            />
          </Form.Item>
          <Form.Item name="private_key" label="Private key">
            <Input.Password
              placeholder="Private key"
              onChange={handlePrivatekeyChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // loading={createWalletM.fetching}
            >
              Create Wallet
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
