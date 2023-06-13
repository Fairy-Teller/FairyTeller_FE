import { FairytailImg } from '../recoil/Fairytailstate';
import { useRecoilValue } from 'recoil';
import React from 'react';

function Start() {
    const UidCheck = useRecoilValue(FairytailImg);
    console.log(UidCheck);

    return <div className="App">{UidCheck}</div>;
}

export default Start;
