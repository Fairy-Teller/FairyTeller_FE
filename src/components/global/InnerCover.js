import "../../assets/css/inner-cover.scss";

const InnerCover = (props) => {
  return (
    <div className={`inner-wrap ${props.className === undefined ? "" : props.className}`}>
      {props.children}
    </div>
  );
};

export default InnerCover;
