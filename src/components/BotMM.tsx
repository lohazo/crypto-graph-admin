import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useCreateWalletMutation,
  useBotQuery,
  Bot,
  useDeleteBotMutation,
} from "../generated/graphql";
import { getErc20Contract } from "../lib/contract-accessor";
import { shortenAddress } from "../lib/shortenAddress";
import ModalEditBot from "./ModalEditBot";
import ModalSelectToken from "./ModalSelectToken";
import ModalSelectWallet from "./ModalSelectWallet";
import OrdersList from "./OrdersList";

function BotMM() {
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

  const handleStartJob = async (jobName: string) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER_HTTP_ENDPOINT + "/job/run-mm-bot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: jobName,
        }),
      }
    );

    if (res.ok) {
      message.success("Job started");
      const data = await res.json();
      if (data.error) {
        console.log(data.message);
      } else {
        console.log("Job started", data);
      }
    } else {
      message.error("Job failed");
      console.log("Job failed", await res.text());
    }
  };
  const handleStopJob = async (jobName: string) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER_HTTP_ENDPOINT + "/job/cancel-mm-bot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: jobName,
        }),
      }
    );

    if (res.ok) {
      message.success("Job stopped");
      const data = await res.json();
      if (data.error) {
        message.error(data.message);
      } else {
        console.log("Job started", data);
      }
    } else {
      message.error("Job failed");
      console.log("Job failed", await res.text());
    }
  };

  const [jobList, setJobList] = useState([]);

  const getJobList = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_SERVER_HTTP_ENDPOINT + "/job"
      );
      if (res.ok) {
        const data = await res.json();
        setJobList(data?.data);
      } else {
        console.log("Job list failed", await res.text());
      }
    } catch (error) {
      console.log("Job list failed", error);
    }
  };

  useEffect(() => {
    getJobList();
  }, []);

  const [deleteBotM, deleteBot] = useDeleteBotMutation();
  const confirm = async (data: Bot) => {
    try {
      // const res = await deleteBot({
      //   id: data.id,
      // });
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_SERVER_HTTP_ENDPOINT + "/job/delete-mm-bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
          }),
        }
      );
      if (res.ok) {
        notification.success({ message: "Bot deleted" });
      } else {
        notification.error({ message: "Bot delete failed" });
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: "Bot delete failed" });
    }
  };

  const columns: ColumnsType<Bot> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "divergence",
    //   dataIndex: "divergence",
    //   key: "divergence",
    // },
    {
      title: "Interval",
      dataIndex: "interval",
      key: "interval",
    },
    {
      title: "Token Out",
      render: (_, data) => `${shortenAddress(data.sell_token)}`,
      key: "sell_token",
    },
    {
      title: "Token In",
      render: (_, data) => `${shortenAddress(data.buy_token)}`,
      key: "buy_token",
    },
    // {
    //   title: "step_buy_amount",
    //   dataIndex: "step_buy_amount",
    //   key: "step_buy_amount",
    // },
    // {
    //   title: "total_buy_amount",
    //   dataIndex: "total_buy_amount",
    //   key: "total_buy_amount",
    // },
    {
      title: "Status",
      key: "status",
      render: (data, record) => {
        return (
          <span>
            <Badge
              status={record.status === "RUNNING" ? "success" : "default"}
            />{" "}
            {record.status}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const isStarted = jobList.find((i: any) => i.name === record.name);
        return (
          <Space size="middle">
            <Button
              onClick={() => handleStartJob(record.name)}
              // disabled={record.status?.toLowerCase() === "running"}
              type="primary"
            >
              Start
            </Button>
            <Button
              // disabled={record.status?.toLowerCase() === "stopped"}
              onClick={() => handleStopJob(record.name)}
            >
              Stop
            </Button>
            <ModalEditBot
              bot={record}
              onBotUpdate={() => console.log("Bot updated")}
            />
            <Popconfirm
              placement="top"
              title={"Are you sure？"}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="text">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 py-4">
      <CreateBotForm />

      <Card title="BOT List">
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

      <OrdersList />
    </div>
  );
}

export default BotMM;

function CreateBotForm() {
  const [form] = Form.useForm();

  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [sellToken, setSellToken] = useState<any>(null);

  const [createWalletM, createWallet] = useCreateWalletMutation();

  const onFinish = async (values: any) => {
    try {
      console.log("Received values of form: ", values);
      console.log("Received values of form: ", {
        wallet: selectedWallet.public_key,
        tokenIn: sellToken.address,
      });
      // const r = await createWallet({
      //   object: {
      //     ...values,
      //     is_enabled: true,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   },
      // });

      // console.log(r);

      // if (r.error) {
      //   message.error(r.error.message);
      // } else {
      //   message.success("Create wallet success");
      // }

      const request = await fetch(
        process.env.NEXT_PUBLIC_API_SERVER_HTTP_ENDPOINT + "/job/create-mm-bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            wallet: selectedWallet.public_key,
            tokenIn: sellToken.address,
            interval: `${values.interval} seconds`,
          }),
        }
      );
      if (request.ok) {
        const data = await request.json();
        if (!data.error) {
          message.success("Create BOT success");
        } else {
          message.error(data.message);
        }
      } else {
        message.error("Crete BOT failed");
      }
    } catch (error) {
      console.log(error);
      // message.error(error.message);
    }
  };

  const handleBuyTokenChange = async (e: any) => {
    const value = e.target.value;
    console.log(value);
    const erc20Contract = getErc20Contract(value);
  };

  const selectAfter = (
    <Select
      defaultValue="seconds"
      style={{ width: 60 }}
      className="min-w-[100px]"
    >
      <Select.Option value="seconds">seconds</Select.Option>
      <Select.Option value="minutes">minutes</Select.Option>
      <Select.Option value="hours">hours</Select.Option>
    </Select>
  );

  return (
    <Card title="Create bot">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col">
            <Form.Item name="name" label="Display Name">
              <Input placeholder="Display name" />
            </Form.Item>

            <Form.Item name="interval" label="Interval">
              <InputNumber placeholder="Interval" addonAfter={selectAfter} />
            </Form.Item>

            <Form.Item name="tokenIn" label="Token In">
              <div className="flex">
                <ModalSelectToken
                  onTokenSelect={(token) => setSellToken(token)}
                />
                <Input
                  placeholder="Token In"
                  value={sellToken?.address}
                  addonAfter={sellToken?.symbol || "???"}
                />
              </div>
            </Form.Item>

            <div className="flex items-center">
              <Form.Item name="amount" label="Amount In">
                <InputNumber placeholder="amount" />
              </Form.Item>

              <div className="mx-2">±</div>

              <Form.Item name="tolerant" label="Torerant">
                <InputNumber placeholder="tolerant" addonAfter="%" />
              </Form.Item>
            </div>

            <Form.Item name="tokenOut" label="Token Out">
              <Input placeholder="Token Out" onChange={handleBuyTokenChange} />
            </Form.Item>
          </div>

          <div className="flex flex-col">
            <Form.Item name="highPrice" label="Sell if price above">
              <InputNumber placeholder="highPrice" />
            </Form.Item>
            <Form.Item name="lowPrice" label="Buy if price below">
              <InputNumber placeholder="lowPrice" />
            </Form.Item>

            <Form.Item name="slipPage" label="Slip">
              <InputNumber placeholder="slipPage" addonAfter={"%"} />
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
