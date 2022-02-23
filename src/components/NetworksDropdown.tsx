/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";

interface PropsType {
  options: Array<any> | [];
  value?: any;
  handleChange?: Function;
}

export default function NetworksDropdown(props: PropsType) {
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
            <p className="mr-4 text-base font-bold uppercase">
              {option?.network}
            </p>
            <p className="mr-1 text-base">{option?.name}</p>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={["click"]}>
        <Button className="w-full h-auto py-2">
          <div className="flex">
            {value ? (
              <>
                <p className="mr-4 text-base font-bold uppercase">
                  {value?.network}
                </p>
                <p className="mr-1 text-base">{value?.name}</p>
              </>
            ) : (
              <p className="mr-1 text-base font-bold uppercase opacity-70">
                Chọn mạng
              </p>
            )}
          </div>
        </Button>
      </Dropdown>
    </>
  );
}
