import "../../assets/css/common.scss";
const Container = (props) => {
  return (
    <div className={`container ${props.className == undefined ? "" : props.className}`}>
      {props.children}
    </div>
  );
};

export default Container;
