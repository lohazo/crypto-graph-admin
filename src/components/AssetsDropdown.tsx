/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";

interface OptionItem {
  key: string;
  component: React.ReactNode;
}

interface PropsType {
  options: Array<any> | [];
  value?: any | null;
  handleChange?: Function;
}

export default function AssetsDropdown(props: PropsType) {
  const { options, value, handleChange } = props;

  const menu = (
    <Menu>
      {options?.map((option: any, index: number) => (
        <Menu.Item
          key={index}
          onClick={() => {
            if (handleChange) {
              handleChange(option);
            }
          }}
        >
          <div className="flex">
            <img src={option?.logoUrl || ""} />
            <p className="mr-4 text-base font-bold">{option?.symbol}</p>
            <p className="text-base">{option?.name}</p>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    if (!value && handleChange && options?.length > 0) {
      handleChange(options[0]);
    }
  }, [handleChange, options, value]);

  return (
    <>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={["click"]}>
        <Button className="w-full h-auto py-2">
          <div className="flex">
            <img src={value?.logoUrl || ""} />
            <p className="mr-4 text-base font-bold">{value?.symbol}</p>
            <p className="text-base">{value?.name}</p>
          </div>
        </Button>
      </Dropdown>
    </>
  );
}
