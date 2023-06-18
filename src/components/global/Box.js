const Box = (props) => {
  return (
    <div className={`box ${props.className === undefined ? "" : props.className}`}>
      {props.children}
      <div className='yellow-bar'></div>
    </div>
  );
};

export default Box;
