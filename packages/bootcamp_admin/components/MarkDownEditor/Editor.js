import React from "react";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import * as Showdown from "showdown";
import { useDispatch } from "react-redux";

import { uploadImageAction } from "../../redux/reducers/courses/courses.action";

import "../../assets/scss/courses/editor.module.scss";

const Editor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

export default function IndexPage({ value, setValue, getHtml }) {
  const dispatch = useDispatch();

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  const handleEditorChange = ({ html, text }) => {
    setValue(text);
  };

  async function onImageUpload(file) {
    const { payload } = await dispatch(
      uploadImageAction("courseImage", {
        filename: file.name,
        contentType: file.type,
      })
    );
    return payload.getPublicUploadSignedUrl[0].objectUrl;
  }

  return (
    <div>
      <Editor
        value={value}
        style={{
          height: "500px",
        }}
        onChange={handleEditorChange}
        renderHTML={(text) => {
          return new Promise((resolve, reject) => {
           Promise.resolve(converter.makeHtml(text)).then(html => {
             getHtml(html);
              resolve(html);
            })
          })
        }}
        onImageUpload={onImageUpload}
        config={{
          imageAccept: ".jpg,.png,.jpeg",
          syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
        }}
      />
    </div>
  );
}
