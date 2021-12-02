import { gql, useMutation } from "@apollo/client";
import dynamic from "next/dynamic";
import React from "react";
import axios from "axios";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import PropTypes from "prop-types";
import { FormGroup, Row, Button } from "reactstrap";
const ImageUploader = dynamic(
  () => import('react-images-upload'),
  { ssr: false }
)
const GET_S3 = gql`
  mutation getS3SignedKey($purpose: UploadPurpose, $files: [UploadReqParams]) {
    getPublicUploadSignedUrl(purpose: $purpose, files: $files) {
      filename
      key
      objectUrl
      signedUrl
    }
  }
`;

const Upload = ({
  label,
  btnText,
  shouldUploadOnDrop,
  onUploadComplete,
  purpose,
  singleImage,
  showPreview = true,
  allowedExtensions,
  acceptType,
  uploadButtonText
}) => {
  const [pictures, setPictures] = React.useState([
    {
      name: "",
      type: "",
      file: null,
    },
  ]);
  const [filesHashT, setFilesHashT] = React.useState({});
  const [blocking, setBlocking] = React.useState(false);
  const [getS3SignedUrl] = useMutation(GET_S3, {
    context: {
      headers: {
        Authorization: sessionStorage.getItem("memberToken"),
      },
    },
    onCompleted: async (data) => {
      const promises = [];
      for (const resp of data.getPublicUploadSignedUrl) {
        promises.push(
          axios.put(resp.signedUrl, filesHashT[resp.filename], {
            headers: {
              "Content-Type": filesHashT[resp.filename].type,
              "x-amz-acl": "public-read",
            },
          })
        );
      }
      Promise.all(promises).then((promises) => {
        setBlocking(false);
        return onUploadComplete(data.getPublicUploadSignedUrl);
      });
    },
  });

  const submit = async (pictures) => {
    console.log("submit called");
    const tempStore = {};
    const files = pictures.map((pic) => {
      tempStore[pic.name] = pic.file;
      return { filename: pic.name, contentType: pic.type };
    });
    setFilesHashT(tempStore);
    setBlocking(true);
    console.log({ purpose, files });
    getS3SignedUrl({
      variables: {
        purpose,
        files,
      },
    });
  };

  const onDrop = async (files, dataUrls) => {
    if (files && files.length > 0) {
      const temp = files.map((f) => ({ name: f.name, type: f.type, file: f }));
      setPictures(temp);
      if (shouldUploadOnDrop) await submit(temp);
    }
  };

  return (
    <>
      <div>
        <BlockUi
          tag="div"
          blocking={blocking}
          className="block-overlay-dark"
          loader={
            <>
              <Loader color="#ffffff" active type={"ball-triangle-path"} />
            </>
          }
        >
          <Row
            style={{
              marginTop: "10%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormGroup>
              <ImageUploader
                withIcon={true}
                onChange={onDrop}
                imgExtension={allowedExtensions}
                maxFileSize={5242880}
                singleImage={singleImage}
                label={label}
                buttonText={btnText}
                withPreview={showPreview}
                accept={acceptType}
              />
            </FormGroup>
          </Row>

          <Button
            disabled={!pictures[0].file}
            style={{
              marginBottom: "50px",
              display: shouldUploadOnDrop ? "none" : "block",
            }}
            onClick={() => submit(pictures)}
            size={"lg"}
            block
            color={"primary"}
          >
            {uploadButtonText}
          </Button>
        </BlockUi>
      </div>
    </>
  );
};

Upload.defaultProps = {
  allowedExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
  acceptType: 'image/*',
  uploadButtonText: 'Update / Upload Image'
};

Upload.propTypes = {
  label: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  shouldUploadOnDrop: PropTypes.bool.isRequired,
  onUploadComplete: PropTypes.func.isRequired,
  singleImage: true,
  showPreview: true,
  allowedExtensions: PropTypes.array,
  acceptType: PropTypes.string,
  uploadButtonText: PropTypes.string,
};

export default Upload;
