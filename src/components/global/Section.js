const Section = (props) => {
  return (
    <section className={`section ${props.className == undefined ? "" : props.className}`}>
      {props.children}
    </section>
  );
};

export default Section;
