import { Button, List, Modal } from "antd";
import React, { useState } from "react";
import VirtualList from "rc-virtual-list";
import { useWalletQuery, Wallet } from "../generated/graphql";
import { DownOutlined } from "@ant-design/icons";

function ModalSelectWallet({
  onWalletSelect,
}: {
  onWalletSelect: (wallet: Wallet) => void;
}) {
  const [queryResult, reExecuteQuery] = useWalletQuery({
    variables: {
      offset: 0,
      limit: 100,
    },
  });
  const data = queryResult.data?.wallet || [];

  const ContainerHeight = 400;

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

  const handleSelectWallet = (wallet: Wallet) => {
    console.log(wallet.id);
    onWalletSelect(wallet);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} className="flex items-center">
        Select wallet <DownOutlined />
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List header="">
          <VirtualList
            data={data}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="email"
            // onScroll={onScroll}
          >
            {(item) => (
              <List.Item
                key={item.id}
                // @ts-ignore
                onClick={() => handleSelectWallet(item)}
                actions={[<a key="list-loadmore-edit">Select</a>]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={item.picture.large} />}
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={item.public_key}
                />
                {/* <div>---</div> */}
              </List.Item>
            )}
          </VirtualList>
        </List>
      </Modal>
    </>
  );
}

export default ModalSelectWallet;
