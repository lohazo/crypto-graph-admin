import { Button, notification } from "antd";
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
      let file: any = input.files[0];
      let formData = new FormData();

      formData.append("avatar", file);

      const fileName = file.name;

      const res = await uploadFiles(formData, fileName, quillRef.current);
    };

    const uploadFiles = async (
      uploadFileObj: FormData,
      filename: string,
      quillObj
    ) => {
      // Upload file
      try {
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
          method: "POST",
          body: uploadFileObj,
        }).then((res) => res.json());

        if (uploadRes.data) {
          const range = quillObj.getEditorSelection();
          quillObj
            .getEditor()
            .insertEmbed(range.index, "image", uploadRes.data);
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Upload Failed",
        });
      }
    };
  };

  const handleOnBlur = (range, source, editor) => {
    onBlur?.(editor.getHTML());
    onChange?.(editor.getHTML());
  };

  // const handleChange = (value) => {
  // console.log("🚀 ~> file: TextEditor.tsx ~> line 101 ~> handleChange ~> value", value)
  //   onChange?.(value);
  // };

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
      // onChange={handleChange}
      placeholder={placeholder}
      onBlur={handleOnBlur}
    />
  );
};

export default TextEditor;
