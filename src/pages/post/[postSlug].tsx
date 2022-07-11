import { useRouter } from "next/router";
import React from "react";
import EditPostt from "../../components/Post/EditPost";
import MainLayout from "../../layout/MainLayout";

function EditPost() {
  const router = useRouter();
  const { postSlug } = router.query;
  return (
    <MainLayout>
      <EditPostt slug={postSlug as string} />
    </MainLayout>
  );
}

export default EditPost;
