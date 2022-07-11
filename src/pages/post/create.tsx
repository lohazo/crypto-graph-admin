import React from "react";
import CreatePost from "../../components/Post/CreatePost";
import MainLayout from "../../layout/MainLayout";

function create() {
  return (
    <MainLayout>
      <CreatePost />
    </MainLayout>
  );
}

export default create;
