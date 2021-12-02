import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
import classnames from "classnames";
// react plugin used to create charts
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
// reactstrap components
import { Card, CardHeader, CardBody } from "reactstrap";
// core components
import {
  // global options for the charts
  chartOptions,
  // function that adds the global options to our charts
  parseOptions,
  chartExample3,
} from "variables/charts.js";

class Charts extends React.Component {
  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
  render() {
    return (
      <>
        <Card>
          <CardHeader>
            <h5 className="h3 mb-0">{this.props.heading}</h5>
          </CardHeader>
          <CardBody>
            <div
              className={classnames({
                chart: !this.props.chartSmall,
                "chart-sm": this.props.chartSmall,
              })}
            >
              {/* <Line
                data={chartExample3.data}
                options={chartExample3.options}
                id="chart-sales"
                className="chart-canvas"
              /> */}
              Analytics will available soon.
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Charts;
