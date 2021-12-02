import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Label,
} from "reactstrap";

// Components
import CourseListCard from "../../components/CourseCard/CourseCard";
import CategoryDropButton from "../../components/CourseCard/CategoryDropButton";
import TextField from "../../components/FormFields/InputField";

// Redux action
import {
  getSearchedBootcampsAction,
  getAllBootcampsAction,
} from "../../Redux/reducer/bootcamp/bootcamp.action";
import { getCurrentUserAction } from "../../Redux/reducer/user/user.action";

// layout for this page
import Layout from "layouts/Admin.js";

// Styles
import "../../assets/scss/styles/search.module.scss";
import "../../assets/scss/courses/create.module.scss";

const CoursesIndex = () => {
  const [courseList, setCourseList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageNumber, setPageNumber] = useState({
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 0,
    page: 0,
    prevPage: null,
    totalPages: false,
    getPage: 1,
  });
  const [searchFields, setSearchFields] = useState({
    searchCourses: "",
    searchCategory: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const reduxState = useSelector(({ bootcampReducer, userReducer }) => ({
    bootcampReducer,
    userReducer,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      // GQL request to fetch required data
      const { payload } = await dispatch(
        getAllBootcampsAction(pageNumber.getPage)
      );
      if (!reduxState.userReducer.token) await dispatch(getCurrentUserAction());

      setCourseList(payload.getCourses.courses);
      setPageNumber(payload.getCourses);
      setCategories(payload.getCategories);
    };
    loadData();
  }, []);

  useEffect(() => {
    // Sort the category list on the sidebar based on the search string
    if (searchFields.searchCategory) {
      const categoryList = reduxState.bootcampReducer.categories.filter(
        ({ name }) => name.toLowerCase().includes(searchFields.searchCategory)
      );
      setCategories(categoryList);
    } else {
      setCategories(reduxState.bootcampReducer.categories);
    }
  }, [searchFields.searchCategory]);

  useEffect(() => {
    // Sort the course list by the category selected
    if (selectedCategories.length > 0) {
      const courses = reduxState.bootcampReducer.bootcampList.filter(
        ({ category }) => searchFields.searchCategory.includes(category)
      );
      setCourseList(courses);
    } else {
      setCourseList(reduxState.bootcampReducer.bootcampList);
    }
  }, [selectedCategories]);

  const paginationNextPage = async () => {
    if (!pageNumber.hasNextPage) return;
    // GQL request to fetch required data
    const { payload } = await dispatch(
      getAllBootcampsAction(pageNumber.nextPage)
    );
    setCourseList(payload.getCourses.courses);
    setPageNumber(payload.getCourses);
    return;
  };
  const paginationPreviousPage = async () => {
    if (!pageNumber.hasPrevPage) return;
    // GQL request to fetch required data
    const { payload } = await dispatch(
      getAllBootcampsAction(pageNumber.prevPage)
    );
    setCourseList(payload.getCourses.courses);
    setPageNumber(payload.getCourses);
    return;
  };

  const updateSearchFields = (e) =>
    setSearchFields({ ...searchFields, [e.target.name]: e.target.value });

  // GQL request to fetch courses based on name search
  const searchCourseOnName = async () => {
    const { payload } = await dispatch(
      getSearchedBootcampsAction(searchFields.searchCourses)
    );
    setCourseList(payload.getCourses.courses || []);
    return setPageNumber(payload.getCourses);
  };

  // GQL request to fetch courses based on category selected
  const searchCourseOnCategory = async (e) => {
    const { payload } = await dispatch(
      getSearchedBootcampsAction(e.target.id, "category")
    );
    setCourseList(payload.getCourses.courses || []);
    return setPageNumber(payload.getCourses);
  };

  return (
    <>
      <Container className="mt-4">
        <h1 className="display-3 mb-4 text-center">Course Catalog</h1>

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

        <Row>
          <Col lg="2">
            <Label className="text-default font-weight-700">Filter by:</Label>
            <br />
            <CategoryDropButton
              categoryList={categories}
              selectCategory={searchCourseOnCategory}
            />
          </Col>
          <Col lg="10">
            <Row>
              <Col lg="10">
                <CourseListCard
                  CourseList={courseList}
                  isLoading={reduxState.bootcampReducer.loading}
                />
                <div className="mt-3 d-flex justify-content-center">
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                      <PaginationLink
                        previous
                        href="#"
                        onClick={paginationPreviousPage}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">
                        {pageNumber.page}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        next
                        href="#"
                        onClick={paginationNextPage}
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

CoursesIndex.layout = Layout;
export default CoursesIndex;
