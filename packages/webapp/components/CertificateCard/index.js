import { Card, CardImg, CardBody, Badge } from "reactstrap";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import {
  getSingleBootCampAction,
  getAllModulesAction,
} from "../../Redux/reducer/bootcamp/bootcamp.action";

const CertificateCard = ({
  imgUrl,
  createdAt,
  course,
  module,
  _id,
  credentialId,
  ...props
}) => {
  const [certData, setCertData] = useState({ course: "", module: "" });

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const getCourse = await dispatch(
        getSingleBootCampAction("", course, true)
      );
      setCertData({
        course: getCourse.payload.name,
        module: props.accomplishmentType === 'module' ? (await dispatch(getAllModulesAction("", [module]))).payload[0].name : '',
      });
    };
    loadData();
  }, []);

  return (
    <Link href={`/student/certificates/${credentialId}`}>
      <Card className="img-hover-zoom shadow-2lg pointer">
        <CardImg src={imgUrl} alt="certificate" top />
        <CardBody>
          <Badge className="bg-gradient-primary text-white">
            {moment(Date(createdAt)).format("DD MMM YYYY")}
          </Badge>
          <h3 className=" mt-2 font-weight-700">{certData.course}</h3>
          <h4>{certData.module}</h4>
          <span className="text-right"> </span>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CertificateCard;
