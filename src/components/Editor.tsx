import { Button } from "antd";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import CustomToolbar from "./CustomToolBar";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function Editor() {
  const [text, setText] = useState("");
  const quillRef = useRef<any>();

  const handleChange = (html) => {
    console.log(
      "🚀 ~> file: Editor.tsx ~> line 9 ~> handleChange ~> html",
      html
    );
    setText(html);
  };

  const imageHandler = async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      var file: any = input.files[0];
      var formData = new FormData();

      formData.append("image", file);

      var fileName = file.name;

      const res = await uploadFiles(file, fileName, quillRef.current);
      console.log(
        "🚀 ~> file: Editor.tsx ~> line 23 ~> input.onchange= ~> res",
        res
      );
    };

    const uploadFiles = async (
      uploadFileObj: File,
      filename: string,
      quillObj
    ) => {
      console.log(
        "🚀 ~> file: Editor.tsx ~> line 26 ~> uploadFile ~> file",
        uploadFileObj,
        filename
      );

      const currentdate = new Date();
      const fileNamePredecessor =
        currentdate.getDate().toString() +
        currentdate.getMonth().toString() +
        currentdate.getFullYear().toString() +
        currentdate.getTime().toString();

      filename = fileNamePredecessor + filename;
      console.log(
        "🚀 ~> file: Editor.tsx ~> line 45 ~> uploadFiles ~> filename",
        filename
      );

      // Upload file

      const range = quillObj.getEditorSelection();
      console.log(
        "🚀 ~> file: Editor.tsx ~> line 53 ~> uploadFiles ~> range",
        range
      );

      // const res = "siteUrl" + "/" + "listName" + "/" + filename;
      const res = "http://maccenter.vn/MacFamily/iPhone13-Pro-2021.jpg";

      quillObj.getEditor().insertEmbed(range.index, "image", res);
    };
  };

  const handleSubmit = async () => {
    console.log("submit");
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
        [{ color: [] }],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  return (
    <div>
      {/* <CustomToolbar /> */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
      <Button onClick={handleSubmit} type="primary">
        save
      </Button>
    </div>
  );
}

export default Editor;
