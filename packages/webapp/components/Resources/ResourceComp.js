import React from "react";
const ResourceComp = ({ location, _id, key }) => {
  return (
    <a href={location} download target="_blank" referrerPolicy="no-referrer">
      <>
        <i className="fas fa-file-download" id={_id} />
        <i>{`${_id}`}</i>
      </>
    </a>
  );
};

export default ResourceComp;
