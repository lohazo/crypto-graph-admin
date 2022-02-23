import MainLayout from "../layout/MainLayout";
import React from "react";
import DashBoard from "../components/DashBoard";

function index() {
  return (
    <MainLayout>
      <DashBoard />
    </MainLayout>
  );
}

export default index;
