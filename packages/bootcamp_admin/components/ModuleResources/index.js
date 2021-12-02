import React, { useEffect, useState, useCallback } from "react";
import { Input, Row, Col, Label } from "reactstrap";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import BlockUi from "react-block-ui";

const ImageUpload = dynamic(() => import("../ImageUpload"), {
  ssr: false,
});

// Redux Action
import { updateModuleResources } from "../../redux/reducers/courses/courses.action";

const ModuleResources = ({
  resourcesList,
  setModuleList,
  modulesList,
  focusModule,
  setFocusModule,
}) => {
  const [resourceName, setResourceName] = useState("");

  const dispatch = useDispatch();

  const handleResource = async (
    id,
    action,
    resources,
    resourcesIds,
    newName
  ) => {
    const { payload } = await dispatch(
      updateModuleResources(id, action, resources, resourcesIds, newName)
    );

    setModuleList({
      ...modulesList,
      sub: modulesList.sub.map((module) => {
        if (module._id === payload._id) {
          return {
            ...module,
            resources: payload.resources,
          };
        }
        return module;
      }),
    });
    setFocusModule({ ...focusModule, resources: payload.resources });
  };

  const deleteResource = async (e) => {
    const { payload } = await dispatch(
      updateModuleResources(focusModule._id, "remove", [], [e.target.id])
    );
    console.log({ payload });
    setModuleList({
      ...modulesList,
      sub: modulesList.sub.map((module) => {
        if (module._id === payload._id) {
          return {
            ...module,
            resources: payload.resources,
          };
        }
        return module;
      }),
    });
    setFocusModule({ ...focusModule, resources: payload.resources });
  };

  return (
    <>
      <Row>
        <Col md="6">
          {resourcesList.length ? (
            resourcesList.map((resource) => (
              <div
                className="d-flex justify-content-between align-items-center"
                key={resource._id}
              >
                <div>
                  <i className="fas fa-file-download" />
                  <a href={resource.location} download>
                    {resource.name}
                  </a>
                </div>
                <i
                  className="fas fa-times text-danger pointer"
                  id={resource._id}
                  onClick={deleteResource}
                />
              </div>
            ))
          ) : (
            <i>No resources associated with this module..</i>
          )}
        </Col>
        <Col md="6">
          <div className="card-body bg-white">
            <Label>Resource Name</Label>
            <Input
              type="text"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              placeholder="Resource Name"
            />
            <ImageUpload
              btnText={"Select Resources to upload"}
              onUploadComplete={(data) =>
                handleResource(
                  focusModule._id,
                  "add",
                  data.map((d) => {
                    const { objectUrl, filename } = d;
                    const parts = objectUrl.split("/");
                    return {
                      key: parts[parts.length - 1],
                      location: objectUrl,
                      name: filename
                    };
                  }),
                  [],
                  resourceName
                )
              }
              label={"Add Resources to the module"}
              purpose={"courseResources"}
              shouldUploadOnDrop={true}
              showPreview={false}
              singleImage={false}
              acceptType={"*/*"}
              allowedExtensions={[".pdf", ".zip", ".txt"]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ModuleResources;
