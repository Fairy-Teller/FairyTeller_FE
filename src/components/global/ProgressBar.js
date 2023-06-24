import "../../assets/css/progress-bar.scss";

const ProgressBar = (props) => {
  return (
    <img
      src={`/images/loding_${props.step}.png`}
      className='progress-bar'
      alt={`step${props.step}`}
    />
  );
};
//marginTop: "2%", maxWidth: "100%", maxHeight: "100%"
export default ProgressBar;
