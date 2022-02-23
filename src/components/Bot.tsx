import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCreateWalletMutation,
  useBotQuery,
  Bot,
  useWalletQuery,
} from "../generated/graphql";
import { getErc20Contract } from "../lib/contract-accessor";
import ModalSelectToken from "./ModalSelectToken";
import ModalSelectWallet from "./ModalSelectWallet";

function Wallet() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryResult, reExecuteQuery] = useBotQuery({
    variables: {
      offset: (currentPage - 1) * pageSize || 0,
      limit: pageSize,
    },
  });

  const total = queryResult.data?.bot_aggregate.aggregate?.count || undefined;
  const data = queryResult.data?.bot || [];

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

  const columns: ColumnsType<Bot> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "divergence",
      dataIndex: "divergence",
      key: "divergence",
    },
    {
      title: "Interval",
      dataIndex: "interval",
      key: "interval",
    },
    {
      title: "Sell Token",
      dataIndex: "sell_token",
      key: "sell_token",
    },
    {
      title: "step_buy_amount",
      dataIndex: "step_buy_amount",
      key: "step_buy_amount",
    },
    {
      title: "total_buy_amount",
      dataIndex: "total_buy_amount",
      key: "total_buy_amount",
    },
    {
      title: "Wallet",
      key: "wallet",
      render: (data) => `${data.wallet.name} - ${data.wallet.public_key}`,
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

  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [sellToken, setSellToken] = useState<any>(null);

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

  const handleBuyTokenChange = async (e: any) => {
    const value = e.target.value;
    console.log(value)
    const erc20Contract = getErc20Contract(value);
  }

  const selectAfter = (
    <Select defaultValue="USD" style={{ width: 60 }} className="min-w-[100px]">
      <Select.Option value="seconds">seconds</Select.Option>
      <Select.Option value="minutes">minutes</Select.Option>
      <Select.Option value="hours">hours</Select.Option>
    </Select>
  );

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col">
            <Form.Item name="name" label="Display Name">
              <Input placeholder="Display name" />
            </Form.Item>

            <Form.Item name="interval" label="Interval">
              <InputNumber placeholder="Interval" addonAfter={selectAfter} />
            </Form.Item>
            <Form.Item name="sell_token" label="Sell Token">
              <div className="flex">
                <ModalSelectToken
                  onTokenSelect={(token) => setSellToken(token)}
                />
                <Input
                  placeholder="Sell Token"
                  value={sellToken?.address}
                  addonAfter={sellToken?.symbol || "???"}
                />
              </div>
            </Form.Item>
            <Form.Item name="buy_token" label="Buy Token">
              <Input placeholder="Buy Token" onChange={handleBuyTokenChange} />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <Form.Item name="step_buy_amount" label="Step Buy Amount">
              <InputNumber placeholder="step_buy_amount" />
            </Form.Item>
            <Form.Item name="divergence" label="Divergence">
              <InputNumber placeholder="divergence" addonAfter={"%"} />
            </Form.Item>
            <Form.Item name="total_buy_amount" label="Total Buy Amount">
              <InputNumber placeholder="total_buy_amount" width={"100%"} />
            </Form.Item>
            <Form.Item name="wallet" label="Wallet">
              {/* <Select loading={queryResult.fetching}>
                <Select.Option value="1">Option 1</Select.Option>
                <Select.Option value="2">Option 2</Select.Option>
                <Select.Option value="3">Option 3</Select.Option>
              </Select> */}
              <div className="flex items-center">
                <ModalSelectWallet
                  onWalletSelect={(wallet) => setSelectedWallet(wallet)}
                />
                <div className="ml-2">
                  <p>
                    {selectedWallet?.name} - {selectedWallet?.public_key}
                  </p>
                </div>
              </div>
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            // loading={createWalletM.fetching}
          >
            Create BOT
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
