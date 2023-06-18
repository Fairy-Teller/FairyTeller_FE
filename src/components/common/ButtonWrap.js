const ButtonWrap = (props) => {
  return (
    <div className={`button-wrap ${props.className == undefined ? "" : props.className}`}>
      {props.children}
    </div>
  );
};

export default ButtonWrap;
