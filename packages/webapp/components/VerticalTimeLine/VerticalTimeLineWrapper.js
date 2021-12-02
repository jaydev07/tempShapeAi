const VerticalTimeLineWrapper = ({ children }) => {
  return (
    <div
      className="timeline timeline-one-side"
      data-timeline-axis-style="dashed"
      data-timeline-content="axis"
    >
      {children}
    </div>
  );
};

export default VerticalTimeLineWrapper;
