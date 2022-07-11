import { Button } from "antd";
import React, { useEffect } from "react";
import ReactQuill from "react-quill";

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "code",
  "image",
];

interface OnChangeHandler {
  (e: any): void;
}

type Props = {
  value: string;
  placeholder: string;
  onChange: OnChangeHandler;
  onBlur: OnChangeHandler;
};

const TextEditor: React.FC<Props> = ({
  value = "",
  onChange,
  placeholder,
  onBlur,
  ...props
}) => {
  const quillRef = React.useRef<any>();

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

      // Upload file

      const range = quillObj.getEditorSelection();

      // const res = "siteUrl" + "/" + "listName" + "/" + filename;
      const res = "http://maccenter.vn/MacFamily/iPhone13-Pro-2021.jpg";

      quillObj.getEditor().insertEmbed(range.index, "image", res);
    };
  };

  const handleOnBlur = (range, source, editor) => {
    // this.setState({ text: editor.getContents() });
    // setText(editor.getHTML());
    onBlur?.(editor.getHTML());
    onChange?.(editor.getHTML());
  };

  const handleChange = (value) => {
    onChange?.(value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "code"],
        ["image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      modules={modules}
      formats={formats}
      onChange={handleChange}
      placeholder={placeholder}
      onBlur={handleOnBlur}
    />
  );
};

export default TextEditor;
