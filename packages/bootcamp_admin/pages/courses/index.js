import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

// Components
import CourseListCard from "../../components/CourseCard/CourseCard";
import TextField from "../../components/FormFields/InputField";
import CheckBox from "../../components/FormFields/CheckBox";
import Spinner from "../../components/Spinner/Spinner";

// Redux action
import {
  getAllCourseAndCategoriesAction,
  getSearchBasedCourseAction,
  deleteCourseAction,
} from "../../redux/reducers/courses/courses.action";

import "../../assets/scss/CoursesPage/CousesPage.styles.scss";

const CoursesIndex = () => {
  const [courseList, setCourseList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchFields, setSearchFields] = useState({
    searchCourses: "",
    searchCategory: "",
  });
  const [pageNumber, setPageNumber] = useState({
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 0,
    page: 0,
    prevPage: null,
    totalPages: false,
    getPage: 1,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  const reduxState = useSelector(({ courses }) => ({ courses }));

  const dispatch = useDispatch();

  useEffect(() => {
    // GQL request to fetch required data
    const getAllCourseAndCategories = async () => {
      const { payload } = await dispatch(
        getAllCourseAndCategoriesAction(pageNumber.getPage)
      );
      console.log(payload);
      setCourseList(payload.getCourses.courses);
      setPageNumber(payload.getCourses);
      setCategories(payload.getCategories);
    };
    getAllCourseAndCategories();
  }, []);

  useEffect(() => {
    // GQL request to fetch courses based on search
    const searchCourse = async () => {
      if (searchFields.searchCourses) {
        const { payload } = await dispatch(
          getSearchBasedCourseAction(searchFields.searchCourses)
        );
        setCourseList(payload);
      }
    };
    searchCourse();
  }, [searchFields.searchCourses]);

  useEffect(() => {
    // Sort the category list on the sidebar based on the search string
    if (searchFields.searchCategory) {
      const categoryList = reduxState.courses.categories.filter(({ name }) =>
        name.toLowerCase().includes(searchFields.searchCategory)
      );
      setCategories(categoryList);
    } else {
      setCategories(reduxState.courses.categories);
    }
  }, [searchFields.searchCategory]);

  useEffect(() => {
    // Sort the course list by the category selected
    if (selectedCategories.length > 0) {
      const courses = reduxState.courses.courses.filter(({ category }) =>
        searchFields.searchCategory.includes(category)
      );
      setCourseList(courses);
    } else {
      setCourseList(reduxState.courses.courses);
    }
  }, [selectedCategories]);

  const updateSearchFields = (e) =>
    setSearchFields({ ...searchFields, [e.target.name]: e.target.value });

  const updateSelectedCategories = (e) => {
    let selectedCategoriesList = selectedCategories;
    if (e.target.checked) {
      selectedCategoriesList.push(e.target.name);
    } else {
      selectedCategoriesList = selectedCategoriesList.filter(
        (list) => list !== e.target.name
      );
    }
    setSelectedCategories(selectedCategoriesList);
  };

  const paginationNextPage = async () => {
    if (!pageNumber.hasNextPage) return;
    // GQL request to fetch required data
    const { payload } = await dispatch(
      getAllCourseAndCategoriesAction(pageNumber.nextPage)
    );
    setCourseList(payload.getCourses.courses);
    setPageNumber(payload.getCourses);
    return;
  };
  const paginationPreviousPage = async () => {
    if (!pageNumber.hasPrevPage) return;
    // GQL request to fetch required data
    const { payload } = await dispatch(
      getAllCourseAndCategoriesAction(pageNumber.prevPage)
    );
    setCourseList(payload.getCourses.courses);
    setPageNumber(payload.getCourses);
    return;
  };

  // GQL request to fetch courses based on name search
  const searchCourseOnName = async () => {
    const { payload } = await dispatch(
      getSearchBasedCourseAction({ name: searchFields.searchCourses })
    );
    setCourseList(payload.getCourses.courses || []);
    return setPageNumber(payload.getCourses);
  };

  // GQL request to fetch courses based on category selected
  const searchCourseOnCategory = async (e) => {
    const { payload } = await dispatch(
      getSearchBasedCourseAction({ category: e.target.id })
    );
    setCourseList(payload.getCourses.courses || []);
    return setPageNumber(payload.getCourses);
  };

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md="6">
            <TextField
              placeholder="Search Course"
              type="search"
              alt
              icon="search"
              name="searchCourses"
              className="shadow-lg"
              onChange={updateSearchFields}
              value={searchFields.searchCourses}
              onBlur={searchCourseOnName}
            />
          </Col>
        </Row>

        <h1 className="display-3 mb-4">All Courses</h1>
        <Row>
          <Col md="4">
            <div>
              <TextField
                placeholder="Search Category"
                type="search"
                icon="search"
                name="searchCategory"
                onChange={updateSearchFields}
                value={searchFields.searchCategory}
              />
              {categories.length > 0 ? (
                categories.map(({ _id, name }) => (
                  <CheckBox
                    id={_id}
                    name={name}
                    key={_id}
                    onChange={updateSelectedCategories}
                  >
                    {name}
                  </CheckBox>
                ))
              ) : (
                <Spinner size="sm" color="primary" />
              )}
            </div>
          </Col>
          <Col md="8">
            {reduxState.courses.loading ? (
              <Spinner color="primary" />
            ) : (
              <CourseListCard CourseList={courseList} />
            )}
            <div className="mt-3 d-flex justify-content-center">
              <Pagination aria-label="Page navigation example">
                <PaginationItem>
                  <PaginationLink
                    previous
                    href="#"
                    onClick={
                      pageNumber.hasPrevPage
                        ? paginationPreviousPage
                        : () => alert("No previous page available")
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{pageNumber.page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    next
                    href="#"
                    onClick={
                      pageNumber.hasNextPage
                        ? paginationNextPage
                        : () => alert("No next page available")
                    }
                  />
                </PaginationItem>
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CoursesIndex;
