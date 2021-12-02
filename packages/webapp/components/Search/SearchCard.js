import React from "react";
import { Button, Card, CardBody, Row, Col } from "reactstrap";

import Ratings from "../RatingStars";

const SearchCard = ({
  image,
  title,
  description,
  avg_rating,
  total_rating,
  ...props
}) => {
  return (
    <Card className="rounded-lg shadow-lg">
      <CardBody>
        <Row className="align-items-center">
          <Col sm="12" md="5" className="border-right">
            <img
              src={image}
              className="search__results__card__image img-fluid rounded-lg"
            />
          </Col>
          <Col sm="12" md="7">
            <div className=" mt-3">
              <h1 className="font-weight-800">{name}</h1>
              <p className="search__results__card__description">
                {description}
              </p>
              <div className="d-flex align-items-baseline">
                <Ratings rating={avg_rating || 0} />
                <h5 className="ml-2 text-primary">
                  {`${total_rating || 0}`} reviews
                </h5>
              </div>
              <Button className="mt-3" outline>
                Learn more <i className="fas fa-arrow-right" />
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SearchCard;
