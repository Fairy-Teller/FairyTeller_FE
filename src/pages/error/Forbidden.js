import { useEffect } from 'react';

function Forbidden() {
    useEffect(() => {
        // 홈으로 이동하는 동작
        const goHome = () => {
            window.location.replace('/'); // 홈으로 이동
            alert('접근 권한이 없습니다.'); // 알림 메시지 띄우기
        };

        goHome(); // 컴포넌트가 마운트될 때 바로 실행

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null; // Forbidden 컴포넌트는 실제로 화면에 보이지 않도록 null 반환
}

export default Forbidden;
