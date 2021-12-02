import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import React from "react";
import { Row, Col } from "reactstrap";
import ReactTooltip from "react-tooltip";

const ColorBlock = ({ color, label }) => {
  return (
    <div className="d-flex align-items-baseline">
      <div
        style={{
          backgroundColor: color,
          width: "15px",
          height: "15px",
        }}
      />
      <div>
        <p>{label}</p>
      </div>
    </div>
  );
};

const CommitHeatmap = ({ data }) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31);
  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        classForValue={(data) => {
          if (!data) {
            return "color-empty";
          }
          const value = data.count;
          if (value > 0 && value < 5) return "color-scale-1";
          if (value > 5 && value < 10) return "color-scale-2";
          if (value > 10 && value < 15) return "color-scale-3";
          if (value > 15) return "color-scale-4";
        }}
        tooltipDataAttrs={(value) => {
          if (value.date) console.log(typeof value.date);
          if (!value.count) return "";
          return {
            "data-tip": `${new Date(value.date).toISOString().slice(0, 10)} : ${
              value.count
            }`,
          };
        }}
      />
      <ReactTooltip />
      <p>What the color says:</p>
      <Row>
        <Col>
          <ColorBlock color={"#ccdef9"} label={"0 - 5 Units"} />
        </Col>
        <Col>
          <ColorBlock color={"#81acf0"} label={"5 - 10 Units"} />
        </Col>
        <Col>
          <ColorBlock color={"#357ae6"} label={"10 - 15 Units"} />
        </Col>
        <Col>
          <ColorBlock color={"#012d70"} label={"15+ Units"} />
        </Col>
      </Row>
    </>
  );
};

export default CommitHeatmap;
