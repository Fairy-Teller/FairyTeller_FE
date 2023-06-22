import "../../assets/css/header.scss";
import { useNavigate } from "react-router-dom";



const Header = (props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home")
   };
  return (
    <div className='header-wrap'>
      <header className={`header ${props.className === undefined ? "" : props.className}`}>
        {/* <h1 className='logo'>{props.mode === "default" ? "FairyTeller" : "pagename..?"}</h1> */}
        <button id={"logo"} onClick={handleClick}><img src="../../logo-bright.png"  /></button>
        
        
        {props.children}
      </header>
    </div>
  );
};

export default Header;
