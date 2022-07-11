import { useRouter } from "next/router";
import React from "react";
import EditPost from "../../components/Post/EditPost";
import MainLayout from "../../layout/MainLayout";

function editPost() {
  const router = useRouter();
  const { postSlug } = router.query;
  return (
    <MainLayout>
      <EditPost slug={postSlug as string} />
    </MainLayout>
  );
}

export default editPost;
