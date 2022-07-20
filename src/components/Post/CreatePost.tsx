import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  TimePicker,
} from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import slugify from "slugify";
import SelectCategory from "./SelectCategory";
import SelectTags from "./SelectTag";
// import TextEditor from "../TextEditor";
import StyledDropzone from "./UploadPostAvatar";
import UploadAvatar from "./UploadPostAvatarV2";

const TextEditor = dynamic(() => import("../TextEditor"), {
  ssr: false,
});

function CreatePost() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const getData = async () => {
    const [catRes, tagRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/post/category?limit=1000`
      ).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_REST_API}/post/tag?limit=1000`).then(
        (res) => res.json()
      ),
    ]);

    setCategories(catRes.data?.result);
    setTags(tagRes.data?.result);
  };

  useEffect(() => {
    getData();
  }, []);

  const [form] = Form.useForm();
  const titleValue = Form.useWatch("title", form) || "";
  const slug = slugify(titleValue, { lower: true });

  const onSubmit = async (values: any) => {
    // logic to submit form to server
    console.log(values);
    // form.resetFields();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/post/createPost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, slug }),
      }
    ).then((res) => res.json());

    console.log(
      "🚀 ~> file: CreatePost.tsx ~> line 48 ~> onSubmit ~> res",
      res
    );
    if (res.error) {
      notification.error({
        message: "Create Post Error",
        description: res.error,
        duration: 4,
      });
      return;
    }

    router.replace("/post/[slug]", `/post/${res.data.slug}`);
  };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 md:col-span-8">
            <Card title="Post">
              <Form.Item label="Title" name="title">
                <Input size="large" />
              </Form.Item>
              <p>SLUG: {slug}</p>

              <Form.Item
                label="Published"
                name="published"
                initialValue={moment(new Date(), "HH:mm dd/MM/yyyy")}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item label="Lead text" name="leadText">
                <Input />
              </Form.Item>

              <Form.Item
                name="bodyText"
                rules={[
                  {
                    required: true,
                    message: "Please enter body of post",
                  },
                ]}
              >
                {/* @ts-ignore */}
                <TextEditor
                // key={post?.id}
                // value={postContent}
                // onChange={handleChange}
                // placeholder="Insert content here!"
                // onBlur={setPostContent}
                />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Card>
          </div>

          <div className="col-span-12 md:col-span-4">
            <Card title="Category">
              <Form.Item name="category">
                <SelectCategory categories={categories} />
              </Form.Item>
            </Card>
            <Card title="Tag" className="mt-4">
              <Form.Item name="tags">
                {/* @ts-ignore */}
                <SelectTags tags={tags} placeholder="Select tags" />
              </Form.Item>
            </Card>
            <Card title="Author" className="mt-4"></Card>
            <Card title="Avatar" className="mt-4">
              {/* <StyledDropzone /> */}
              <Form.Item name="avatar">
                <UploadAvatar />
              </Form.Item>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default CreatePost;
