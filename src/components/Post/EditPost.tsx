import { Button, Card, Form, Input, TimePicker } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "./Quill.module.css";
import SelectCategory from "./SelectCategory";
import SelectTags from "./SelectTag";
import StyledDropzone from "./UploadPostAvatar";
import UploadAvatar from "./UploadPostAvatarV2";

const TextEditor = dynamic(() => import("../TextEditor"), {
  ssr: false,
});

interface IPostCreate {
  id: number;
  slug: string;
  title: string;
  published: string;
  leadText: string;
  bodyText: string;
}

function EditPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<IPostCreate>();

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [form] = Form.useForm();

  const fetchData = async () => {
    const [catRes, tagRes, postRes] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_REST_API}/post/category?limit=1000`
      ).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_REST_API}/post/tag?limit=1000`).then(
        (res) => res.json()
      ),
      fetch(`${process.env.NEXT_PUBLIC_REST_API}/post/${slug}`).then((res) =>
        res.json()
      ),
    ]);

    setPost(postRes.data);
    setCategories(catRes.data?.result);
    setTags(tagRes.data?.result);

    const post = postRes.data;
    const categories = catRes.data?.result;
    const tags = tagRes.data?.result;
    const selectedCategory = categories.find(
      (i: any) => i._id === post.category._id
    );
    const selectedTags = tags
      .filter((i: any) => post.tags.some((j) => j._id === i._id))
      .map((i: any) => i._id);

    form.setFieldsValue({
      title: post.title,
      published: moment(post.published),
      leadText: post.leadText,
      bodyText: post.bodyText,
      avatar: post.avatar,
      tags: selectedTags,
      category: selectedCategory._id,
    });
  };

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const onSubmit = async (values: IPostCreate) => {
    // logic to submit form to server
    console.log(values);
    // form.resetFields();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/post/updatePost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, slug }),
      }
    ).then((res) => res.json());
    fetchData();
  };

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-12 md:col-span-8">
          <Card title="Post">
            {/* <TextEditor
          value={postContent}
          onChange={handleChange}
          key={post?.id}
          placeholder="Insert content here!"
          onBlur={setPostContent}
        /> */}

            <Form.Item label="Title" name="title" initialValue={post?.title}>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Published"
              name="published"
              // initialValue={post?.published}
            >
              <TimePicker
                // @ts-ignore
                // defaultValue={moment(new Date(), "HH:mm")}
                format={"HH:mm"}
              />
            </Form.Item>

            <Form.Item
              label="Lead text"
              name="leadText"
              initialValue={post?.leadText}
            >
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
              initialValue={post?.bodyText}
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
                Submit
              </Button>
            </Form.Item>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-4">
          <Card title="Category">
            <Form.Item
              name="category"
              // initialValue={{
              //   value: selectedCategory?._id,
              //   label: selectedCategory?.name,
              // }}
            >
              <SelectCategory categories={categories} />
            </Form.Item>
          </Card>
          <Card title="Tag" className="mt-4">
            <Form.Item name="tags">
              {/* @ts-ignore */}
              <SelectTags tags={tags} placeholder="Select tags" />
            </Form.Item>
          </Card>
          {/* <Card title="Author" className="mt-4"></Card> */}
          <Card title="Avatar" className="mt-4">
            {/* <StyledDropzone /> */}
            {post?.avatar && <img src={post?.avatar} alt="avatar" />}
            <Form.Item name="avatar">
              <UploadAvatar />
            </Form.Item>
          </Card>
        </div>
      </div>
    </Form>
  );
}

export default EditPost;
