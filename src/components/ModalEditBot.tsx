import { Button, Form, InputNumber, Modal, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Bot, useUpdateBotMutation } from "../generated/graphql";

interface ModalEditBotProps {
  bot: Bot;
  onBotUpdate: (bot: Bot) => void;
}

function ModalEditBot({ bot }: ModalEditBotProps) {
  const [botInterval, setBotInterval] = useState<number>();

  useEffect(() => {
    if (bot) {
      const interval = bot.interval?.split(" ")[0];
      setBotInterval(Number(interval));
    }
  }, [bot]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [form] = Form.useForm();

  const [updateBotM, updateBot] = useUpdateBotMutation();

  const onFinish = async (values: any) => {
    console.log("Update bot with values: ", values);
    try {
      const res = await updateBot({
        where: {
          name: { _eq: bot.name },
        },
        set: {
          interval: `${values.interval} seconds`,
          additional_data: {
            ...bot.additional_data,
            amount: values.amount,
            highPrice: values.highPrice,
            lowPrice: values.lowPrice,
            slipPage: values.slipPage,
            tolerant: values.tolerant,
          },
        },
      });
      console.log(
        "🚀 ~> file: ModalEditBot.tsx ~> line 48 ~> onFinish ~> res",
        res
      );
      if (!res.error) {
        notification.success({ message: "Update BOT success" });
      } else {
        notification.error({ message: res.error.message });
      }
    } catch (error) {
      console.log(error);
    }
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
    <>
      <Button onClick={showModal} className="flex items-center">
        Edit
      </Button>
      <Modal
        title="Update Bot config"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="interval"
            label="Interval"
            initialValue={botInterval}
          >
            <InputNumber placeholder="Interval" addonAfter={selectAfter} />
          </Form.Item>
          <Form.Item
            name="highPrice"
            label="Sell if price above"
            initialValue={bot.additional_data?.highPrice}
          >
            <InputNumber placeholder="highPrice" />
          </Form.Item>
          <Form.Item
            name="lowPrice"
            label="Buy if price below"
            initialValue={bot.additional_data?.lowPrice}
          >
            <InputNumber placeholder="lowPrice" />
          </Form.Item>

          <Form.Item
            name="slipPage"
            label="Slip"
            initialValue={bot.additional_data?.slipPage}
          >
            <InputNumber placeholder="slipPage" addonAfter={"%"} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            initialValue={bot.additional_data?.amount}
          >
            <InputNumber placeholder="Amount" />
          </Form.Item>
          <Form.Item
            name="tolerant"
            label="Tolerant"
            initialValue={bot.additional_data?.tolerant}
          >
            <InputNumber placeholder="Tolerant" addonAfter={"%"} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // loading={createWalletM.fetching}
            >
              Update BOT
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ModalEditBot;
