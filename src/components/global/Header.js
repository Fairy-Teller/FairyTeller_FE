import "../../assets/css/header.scss";

const Header = (props) => {
  return (
    <div className='header-wrap'>
      <header className={`header ${props.className === undefined ? "" : props.className}`}>
        <h1 className='logo'>{props.mode === "default" ? "FairyTeller" : "pagename..?"}</h1>
        {props.children}
      </header>
    </div>
  );
};

export default Header;
