import dynamic from "next/dynamic";
import { Label, Input } from "reactstrap";

// Configs
import { CustomThemeReactSelect } from "../../configs/ReactSelectheme.config";

// Importing react-select as client-side rendering
const ReactSelectNoSSR = dynamic(() => import("react-select/creatable"), {
  loading: () => <Input />,
  ssr: false,
});

const CreateableSelectField = ({ label, ...props }) => {
  return (
    <>
      <Label className="text-gray font-weight-700">{label}</Label>
      <ReactSelectNoSSR styles={CustomThemeReactSelect} {...props} />
    </>
  );
};

export default CreateableSelectField;
