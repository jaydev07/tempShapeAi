import { Spinner } from "reactstrap";

export default function CustomSpinner(props) {
  return (
    <div className="d-flex justify-content-center">
      <Spinner className="text-center" {...props} />
    </div>
  );
}
