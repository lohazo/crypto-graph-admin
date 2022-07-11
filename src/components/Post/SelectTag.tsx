import { Select } from "antd";
import React from "react";

function SelectTags({ tags = [], ...props }: { tags: any[] }) {
  return (
    <Select
      style={{ width: "100%" }}
      mode="multiple"
      allowClear
      showSearch
      placeholder="Select tags"
      optionFilterProp="children"
      // onChange={props?.onChange}
      // onSearch={props?.onSearch}
      filterOption={(input, option) =>
        (option!.children as unknown as string)
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      {...props}
    >
      {tags.map((tag: any) => (
        <Select.Option value={tag._id} key={tag._id}>
          {tag.title}
        </Select.Option>
      ))}
    </Select>
  );
}

export default SelectTags;
