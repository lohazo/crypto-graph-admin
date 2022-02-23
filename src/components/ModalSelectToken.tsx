import { Avatar, Button, List, Modal } from "antd";
import React, { useState } from "react";
import VirtualList from "rc-virtual-list";
import { useWalletQuery } from "../generated/graphql";
import tokenList from "../constants/pancake-default.tokenlist.json";
import { DownOutlined } from "@ant-design/icons";

function ModalSelectToken({
  onTokenSelect,
}: {
  onTokenSelect: (wallet: any) => void;
}) {
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

  const handleSelectToken = (token: any) => {
    onTokenSelect(token);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} className="flex items-center">
        Select token <DownOutlined />
      </Button>
      <Modal
        title="Selec Token"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List header="asd">
          <VirtualList
            data={tokenList.tokens}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="email"
            // onScroll={onScroll}
          >
            {(item) => (
              <List.Item
                // @ts-ignore
                key={item.id}
                onClick={() => handleSelectToken(item)}
                actions={[<a key="list-loadmore-edit">Select</a>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logoURI} />}
                  title={<p>{item.symbol}</p>}
                  description={item.address}
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

export default ModalSelectToken;
