// @ts-nocheck
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu } from "antd";
import React from "react";
// import { useUserInfoQuery } from "../generated/graphql";
// import Button from "../../../components/Button/Button";
// import { useWalletModal } from "../../WalletModal";

export type Login = (connectorId: string) => void;

interface Props {
  account?: string;
  login: Login;
  logout: () => void;
}

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  // const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account);
  const [query, reQuery] = useUserInfoQuery();

  const accountEllipsis = account
    ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}`
    : null;

  const menu = (
    <Menu>
      <Menu.Item>
        <p className="text-base" onClick={logout}>
          Đăng xuất
        </p>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-end w-full mx-4">
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        trigger={["click"]}
        className="hidden md:flex"
      >
        <div className="flex items-center cursor-pointer">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className="flex items-center justify-center"
          />
          <p className="ml-2 text-xl font-semibold">
            {query?.data?.me?.username}
          </p>
        </div>
      </Dropdown>

      <div className="flex items-center cursor-pointer md:hidden">
        <Avatar
          size={36}
          icon={<UserOutlined />}
          className="flex items-center justify-center"
        />
        <p className="ml-2 text-xl font-semibold">
          {query?.data?.me?.username}
        </p>
      </div>

      {/* {account ? (
        <Button
          shape="round"
          onClick={() => {
            logout();
          }}
        >
          {accountEllipsis}
        </Button>
      ) : (
        <Button
          shape="round"
          onClick={() => {
            console.log("login");
            login("injected");
          }}
        >
          Connect
        </Button>
      )} */}
    </div>
  );
};

// export default UserBlock;

export default React.memo(
  UserBlock,
  (prevProps, nextProps) =>
    prevProps.account === nextProps.account &&
    prevProps.login === nextProps.login &&
    prevProps.logout === nextProps.logout
);
