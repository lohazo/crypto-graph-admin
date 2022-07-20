import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, notification, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function PostList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);

  // @ts-ignore
  function onChange(pagination, filters, sorter, extra) {
    const { current, pageSize } = pagination;
    router.push(
      {
        query: {
          ...router.query,
          page: current,
          pageSize: pageSize,
        },
      },
      undefined,
      { scroll: false }
    );
    setCurrentPage(current);
    setPageSize(pageSize);
    // refreshDataTable();
  }

  useEffect(() => {
    if (router.query?.page) {
      setCurrentPage(
        typeof router.query?.page === "string"
          ? parseInt(router.query?.page)
          : 1
      );
      setPageSize(
        typeof router.query?.pageSize === "string"
          ? parseInt(router.query?.pageSize)
          : 10
      );
    }
    if (router.query?.search != undefined) {
      // @ts-ignore
      setSearch(router.query?.search);
      setCurrentPage(1);
    }
    getData();
  }, [router]);

  const [posts, setPosts] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState<any>({});

  const getData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/post?limit=${pageSize}&skip=${
        (currentPage - 1) * pageSize
      }`
    );
    const data = await response.json();
    setPosts(data.data?.result);
    setCount(data.data?.count);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: ColumnsType<any> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Avatar",
      key: "avatar",
      render: (text, record) => (
        <img
          src={record.avatar}
          alt="avatar"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Published",
      key: "published",
      render: (text, record) => (
        <span>{new Date(record.published).toLocaleDateString()}</span>
      ),
    },
    { title: "Lead", dataIndex: "leadText", key: "leadText" },
    {
      title: "action",
      key: "content",
      render: (text, record) => (
        <div>
          {/* <Button type="link">View</Button> */}
          <Link href={`/post/${record.slug}`}>
            <Button type="link">Edit</Button>
          </Link>
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeletePost(record._id)}
          >
            <a href="#" style={{ color: "red" }}>
              Delete
            </a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDeletePost = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/post/deletePost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id }),
      }
    );
    const data = await response.json();
    if (data.error) {
      notification.error({
        message: "Delete Post Error",
        description: data.error,
        duration: 4,
      });
      return;
    }
    notification.success({
      message: "Delete Post Success",
      description: "Post has been deleted",
      duration: 4,
    });
    getData();
  };

  return (
    <div>
      <Card>
        <Link href="/post/create">
          <Button>Create Post</Button>
        </Link>
      </Card>

      <Card title="Posts">
        <Table
          dataSource={posts}
          columns={columns}
          onChange={onChange}
          pagination={{
            current: currentPage,
            total: count,
            pageSize: pageSize,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      </Card>
    </div>
  );
}

export default PostList;
