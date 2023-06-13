import { FairytailImg } from '../recoil/Fairytailstate';
import { useRecoilState } from 'recoil';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [Tests, setTest] = useRecoilState(FairytailImg);
    const navigate = useNavigate();

    const handleGoToStart = () => {
        navigate('/start'); 
    };

    setTest('가나다라');

    return (
        <div className="App">
            {Tests}
            <button onClick={handleGoToStart}>Go to Start</button>
        </div>
    );
}

export default Home;
