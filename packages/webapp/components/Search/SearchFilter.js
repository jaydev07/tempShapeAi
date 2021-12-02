import React from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";
const SearchFilter = ({ CategoriesList }) => {
  return (
    <div>
      <h4 className="font-weight-700 text-gray">Filter By</h4>
      <Row>
        <Col xs="12">
          <UncontrolledDropdown>
            <DropdownToggle
              caret
              color="primary"
              id="dropdownMenuButton"
              type="button"
              outline
              size="lg"
            >
              Categories
            </DropdownToggle>

            <DropdownMenu aria-labelledby="dropdownMenuButton">
              {CategoriesList.map(({ name, id }) => (
                <DropdownItem
                  href="#pablo"
                  id={id}
                  onClick={(e) => e.preventDefault()}
                >
                  {name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter;
