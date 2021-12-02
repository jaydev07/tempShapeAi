import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

const CategoryDropDown = ({ categoryList,selectCategory }) => {
  return (
    <UncontrolledButtonDropdown>
      <DropdownToggle caret color="primary" outline>
        Categories
      </DropdownToggle>
      <DropdownMenu>
        {categoryList.map(({ _id, name }) => (
          <DropdownItem key={_id} id={_id} onClick={selectCategory}>
            {name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  );
};

export default CategoryDropDown;
