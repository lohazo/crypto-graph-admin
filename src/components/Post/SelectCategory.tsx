import { Select } from "antd";
import React from "react";

function SelectCategory({ categories, ...props }: { categories: any[] }) {
  return (
    <Select
      style={{ width: "100%" }}
      showSearch
      placeholder="Select a category"
      optionFilterProp="children"
      // defaultValue={props.initialValue}
      // onChange={props?.onChange}
      // onSearch={props?.onSearch}
      filterOption={(input, option) =>
        (option!.children as unknown as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...props}
    >
      {categories.map((category: any) => (
        <Select.Option value={category._id} key={category._id}>
          {category.title}
        </Select.Option>
      ))}
    </Select>
  );
}

export default SelectCategory;
