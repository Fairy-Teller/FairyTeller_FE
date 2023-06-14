const Container = (props) => {
  return (
    <div className={`container ${props.className === undefined ? "" : props.className}`}>
      {props.children}
      <div className='yellow-bar'></div>
    </div>
  );
};

export default Container;
