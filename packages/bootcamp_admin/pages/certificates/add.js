import { useEffect, useState } from "react";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import InputGroup from "reactstrap/lib/InputGroup";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Card from "reactstrap/lib/Card";
import CardBody from "reactstrap/lib/CardBody";
import Button from "reactstrap/lib/Button";
import dynamic from 'next/dynamic';

import TemplateGen from "../../configs/cert-temp-create";
import graphQlClient from "../../configs/ApolloClient.config";
import { ADD_CERTIFICATE_TEMPLATE_QUERY } from "../../gql/courses";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ImageUpload from "../../components/ImageUpload";

const AddCertificate = () => {
  const [tags, setTags] = useState({});
  const [tagsCount, setTagsCount] = useState([0]);
  const [certTemplateUrl, setCertTemplateUrl] = useState("");
  const [horizontalPositionEnabled, setHorizontalPositionStatus] = useState(
    true
  );
  const [certTemplateHtml, setTemplateHtml] = useState("");
  const [templateImageDimension, setTemplateImageDimension] = useState({
    height: 0,
    width: 0,
  });

  const router = useRouter();
  const handleTagInput = (e) => {
    const temp = e.target.id.split("-");
    const tempTags = { ...tags };
    tempTags[temp[1]] = { ...tempTags[temp[1]], [temp[0]]: e.target.value };
    setTags(tempTags);
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const iframe = document.getElementById("iframe");
    const serializer = new XMLSerializer();
    const certHtmlString = serializer.serializeToString(
      iframe.contentWindow.document
    );
    const tagsArray = [];
    Object.keys(tags).forEach((key) => {
      const tag = tags[key];
      if (tag.key && tag.value) tagsArray.push(tags[key]);
    });
    try {
        await graphQlClient.mutate({
        mutation: ADD_CERTIFICATE_TEMPLATE_QUERY,
        variables: {
          certificate: {
            name: document.getElementById("course-name").value,
            dimensions: templateImageDimension,
            imageUrl: certTemplateUrl,
            type: "custom",
            tags: tagsArray,
            html: certHtmlString,
          },
        },
      });
      toast("Certificate Template Added Successfully");
      router.push("/certificates");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (certTemplateUrl) {
      const { height, width } = templateImageDimension;
      const tempHtml = TemplateGen(
        "$name",
        "cred_id",
        certTemplateUrl,
        height,
        width,
        { bottom: 50, left: 50 }
      );
      setTemplateHtml(tempHtml);
      const iframe = document.getElementById("iframe");
      iframe.width = width;
      iframe.height = height;
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(tempHtml);
      iframe.contentWindow.document.close();
    }
  }, [templateImageDimension.height, templateImageDimension.width]);

  const modifyIframeElementStyleById = (id, styleName, styleValue) => {
    document
      .getElementById("iframe")
      .contentWindow.document.getElementById(id).style[styleName] = styleValue;
  };
  const modifyIframeElementStyleBySelector = (sel, styleName, styleValue) => {
    document
      .getElementById("iframe")
      .contentWindow.document.querySelector(sel).style[styleName] = styleValue;
  };
  const modifyIframeElementStyleBySelectorAll = (sel, styleName, styleValue) => {
    document
      .getElementById("iframe")
      .contentWindow.document.querySelectorAll(sel).forEach(el => el.style[styleName] = styleValue);
  };
  return (
    <>
      <Container style={{ marginTop: "10px" }}>
        <Card className="bg-transparent shadow-none">
          {" "}
          <CardBody className="shadow-none">
            <form onSubmit={formSubmit}>
              <Container className="my-4">
                <Row>
                  <Col md="8" lg="6">
                    <InputGroup>
                      <Label>
                        Course Name
                        <Input
                          required
                          id={"course-name"}
                          placeholder="Course Name"
                          className="form-control-alternative"
                        />
                      </Label>
                    </InputGroup>
                    <InputGroup>
                      <Label>
                        Tags (Tags with empty key/value will be ignored)
                        {tagsCount.map((count) => (
                          <>
                            <Row>
                              <Col>
                                <Input
                                  placeholder={"Key"}
                                  id={`key-${count}`}
                                  onChange={handleTagInput}
                                  className="form-control-alternative"
                                />
                              </Col>
                              <Col>
                                <Input
                                  placeholder={"Value"}
                                  id={`value-${count}`}
                                  onChange={handleTagInput}
                                  className="form-control-alternative"
                                />
                              </Col>
                              <Col>
                                {count === 0 && (
                                  <Button
                                    color={"info"}
                                    onClick={() =>
                                      setTagsCount(
                                        tagsCount.concat(tagsCount.length)
                                      )
                                    }
                                  >
                                    {" "}
                                    +{" "}
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          </>
                        ))}
                      </Label>
                    </InputGroup>
                  </Col>
                  <Col md="4" lg="6">
                    {" "}
                    <InputGroup>
                      <Label>Select Certificate Image</Label>

                      <ImageUpload
                        btnText={"Select Image"}
                        onUploadComplete={(d) => {
                          const img = new Image();
                          img.src = d[0].objectUrl;
                          setCertTemplateUrl(d[0].objectUrl);
                          img.onload = function () {
                            setTemplateImageDimension({
                              height: this.height,
                              width: this.width,
                            });
                          };
                        }}
                        label={"Select Certificate Image"}
                        purpose={"certificateTemplate"}
                        singleImage={true}
                        shouldUploadOnDrop={true}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Container>
              <Row
                style={{ margin: "20px" }}
                className="flex-column-reverse align-items-center"
              >
                <Col className="mt-5">
                  <Row>
                    <Col>
                      <h2>Name Positioning</h2>
                      <InputGroup>
                        <Label>
                          Alignment
                          <Input
                            type={"select"}
                            className="form-control-alternative"
                            onChange={(e) => {
                              const styleValue = e.target.value;
                              if (styleValue === "center") {
                                setHorizontalPositionStatus(false);
                                modifyIframeElementStyleById(
                                  "name-div",
                                  "left",
                                  `0px`
                                );
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "textAlign",
                                  styleValue
                                );
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "width",
                                  '100%'
                                );
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "left",
                                  '0px'
                                );
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "padding-left",
                                  '0px'
                                );
                              } else {
                                setHorizontalPositionStatus(true);
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "textAlign",
                                  styleValue
                                );
                                modifyIframeElementStyleBySelector(
                                  ".centered",
                                  "padding-left",
                                  `${document.getElementById('horizontal-pos-input').value}px`,
                                );
                              }
                            }}
                          >
                            <option value={"left"} defaultChecked={true}>
                              left
                            </option>
                            <option value={"center"}>center</option>
                          </Input>
                        </Label>
                      </InputGroup>
                      <InputGroup>
                        <Label>
                          Vertical positioning
                          <Input
                            defaultValue={templateImageDimension.height / 2}
                            className="form-control-alternative"
                            type={"number"}
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "name-div",
                                "bottom",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>
                      <InputGroup>
                        <Label
                          style={{
                            textDecoration: horizontalPositionEnabled
                              ? ""
                              : "line-through",
                          }}
                        >
                          Horizontal positioning
                          <Input
                            id={"horizontal-pos-input"}
                            disabled={!horizontalPositionEnabled}
                            className="form-control-alternative"
                            type={"number"}
                            defaultValue={templateImageDimension.width / 2}
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "name-div",
                                "padding-left",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                        <i
                          style={{
                            display: horizontalPositionEnabled
                              ? "none"
                              : "block",
                          }}
                          className={"text-danger"}
                        >
                          Horizontal Positioning disabled to have proper center
                          alignment
                        </i>
                      </InputGroup>
                    </Col>
                    <Col>
                      <h2>Name Font Styling </h2>
                      <InputGroup>
                        <Label>
                          Font Size
                          <Input
                            type={"number"}
                            min={0}
                            defaultValue={44}
                            className="form-control-alternative"
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "name",
                                "fontSize",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>

                      <InputGroup>
                        <Label>
                          Font Color (hex/rgb/colorName)
                          <Input
                            defaultValue={"blue"}
                            className="form-control-alternative"
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "name",
                                "color",
                                e.target.value
                              )
                            }
                          />
                        </Label>
                      </InputGroup>

                      <InputGroup>
                        <Label>
                          Font Family
                          <Input
                            type={"textarea"}
                            height={20}
                            width={50}
                            onChange={(e) => {
                              const urlQuery = e.target.value.split("?")[1];
                              const fontFamilyParam = urlQuery.split("&")[0];
                              const fontFamily = fontFamilyParam
                                .split("=")[1]
                                .replace(/\+/g, " ");
                              let fontFamilyClean;
                              let fontWeight;
                              if (fontFamily.includes(":")) {
                                fontFamilyClean = fontFamily.split(":")[0];
                                fontWeight = fontFamily.split("@")[1];
                              } else fontFamilyClean = fontFamily;
                              const iframe = document.getElementById("iframe");
                              iframe.contentWindow.document.querySelector(
                                "head"
                              ).innerHTML += e.target.value;
                              modifyIframeElementStyleById(
                                "name",
                                "fontFamily",
                                fontFamilyClean
                              );
                              if (fontWeight)
                                modifyIframeElementStyleById(
                                  "name",
                                  "fontWeight",
                                  fontWeight
                                );
                            }}
                            className="form-control-alternative"
                          />
                        </Label>
                      </InputGroup>
                    </Col>
                    <Col>
                      <h2>Credential Positioning</h2>
                      <InputGroup>
                        <Label>
                          Vertical positioning
                          <Input
                            type={"number"}
                            defaultValue={50}
                            className="form-control-alternative"
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "bottom-right",
                                "bottom",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>
                      <InputGroup>
                        <Label>
                          Horizontal positioning
                          <Input
                            type={"number"}
                            className="form-control-alternative"
                            defaultValue={10}
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "bottom-right",
                                "right",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>
                      <InputGroup>
                        <Label>
                          Font Size
                          <Input
                            type={"number"}
                            min={0}
                            defaultValue={12}
                            className="form-control-alternative"
                            onChange={(e) =>
                              modifyIframeElementStyleBySelectorAll(
                                ".creds",
                                "fontSize",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>
                    </Col>
                    <Col>
                      <h2>QR</h2>
                      <InputGroup>
                        <Label>
                          Size
                          <Input
                            type={"number"}
                            className="form-control-alternative"
                            defaultValue={220}
                            min={100}
                            onChange={(e) =>
                              modifyIframeElementStyleById(
                                "qr",
                                "width",
                                `${e.target.value}px`
                              )
                            }
                          />
                        </Label>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <iframe width={700} height={600} id={"iframe"} />
                </Col>
              </Row>
              <Button type={"submit"} color={"primary"} block>
                Create Certificate
              </Button>
            </form>{" "}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default AddCertificate;
