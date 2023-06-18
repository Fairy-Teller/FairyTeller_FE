const CenteredWrap = (props) => {
  return (
    <div className={`centered-wrap ${props.className === undefined ? "" : props.className}`}>
      {props.children}
    </div>
  );
};

export default CenteredWrap;
