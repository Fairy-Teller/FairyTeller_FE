import "../../assets/css/common.scss";
const Row = (props) => {
  return (
    <div className={`row  ${props.className == undefined ? "" : props.className}`}>
      {props.children}
    </div>
  );
};

export default Row;
