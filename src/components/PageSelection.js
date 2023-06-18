import styled, { css } from 'styled-components';

const Image = styled.div`
    ${(props) =>
        props.src &&
        css`
            background-image: url(${props.src});
        `}
    min-height: 160px;
    background-color: rgba(217, 217, 217, 0.4);

`;

const PageSelection = (props) => {
    return (
        <div className="page-selection" onClick={props.onClick}>
            <div className="image-frame">
                <Image id={props.idx + '-page'} src={props.src} alt={props.idx + ' image generated by AI'} />
            </div>
        </div>
    );
};

export default PageSelection;
