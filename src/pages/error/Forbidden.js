import { useEffect } from 'react';

function Forbidden() {
    useEffect(() => {
        localStorage.removeItem('ACCESS_TOKEN'); // 토큰 지워주기
        // 홈으로 이동하는 동작
        const goHome = () => {
            window.location.replace('/Login'); // 홈으로 이동
            alert('로그인을 진행해 주세요'); // 알림 메시지 띄우기
        };

        goHome();
    }, []);

    return null; // Forbidden 컴포넌트는 실제로 화면에 보이지 않도록 null 반환
}

export default Forbidden;
