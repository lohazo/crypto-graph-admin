import { Card } from "antd";
import Search from "antd/lib/input/Search";
import { useRouter } from "next/dist/client/router";
import React from "react";

export default function TitlePageAndSearchUser() {
  const router = useRouter();

  function handleSearch(keyword: string) {
    router.push(
      {
        query: {
          ...router.query,
          username: keyword,
        },
      },
      undefined,
      { scroll: false }
    );
    // refreshDataTable();
  }

  const routes = [
    { key: "1", pathname: "/", title: "" },
    { key: "2", pathname: "/transactions", title: "Danh sách giao dịch" },
    { key: "3", pathname: "/list-user", title: "Danh sách tài khoản" },
    {
      key: "4",
      pathname: "/list-buy-ico",
      title: "Danh sách tài khoản mua ICO",
    },
    { key: "5", pathname: "/leader-board", title: "Bảng xếp hạng Leader" },
  ];

  return (
    <Card>
      <div className="flex flex-col items-center justify-between md:flex-row">
        <p className="my-2 text-xl font-medium md:my-0">
          {
            routes.filter((route) => route.pathname === router.pathname)[0]
              ?.title
          }
        </p>
        <Search
          className="h-max w-max"
          placeholder="Nhập tên tài khoản"
          onSearch={handleSearch}
          enterButton="Tìm kiếm"
          size="large"
        />
      </div>
    </Card>
  );
}
