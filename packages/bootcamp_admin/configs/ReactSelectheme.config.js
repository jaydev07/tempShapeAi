export const CustomThemeReactSelect = {
  option: (provided, state) => ({
    ...provided,
    borderRaduis: "10px",
    backgroundColor: "#fff",
    color: "#212529",
    padding: 20,

    ":hover": {
      backgroundColor: "#d0d3d4",
    },
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: "#fff",
    border: "2px solid #fff",
    color: "#8898aa",
    boxShadow: "0 1px 3px rgb(50 50 93 / 15%), 0 1px 0 rgb(0 0 0 / 2%)",
  }),
  input: (styles) => ({
    ...styles,
    color: "white",
  }),
  singleValue: (styles) => ({ ...styles, color: "#8898aa" }),
  multiValueLabel: (styles) => ({ ...styles, color: "#16213e" }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#16213e",
  }),
  placeholder: (styles) => ({ ...styles, color: "#8898aa" }),
};
