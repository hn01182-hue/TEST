// config.js
const firebaseConfig = {
        apiKey: "AIzaSyDSu0rmCC6S5Wa82X1ITHAFFfzwChQjLO8",
        authDomain: "trickcal-calc.firebaseapp.com",
        projectId: "trickcal-calc",
        storageBucket: "trickcal-calc.firebasestorage.app",
        messagingSenderId: "138255593289",
        appId: "1:138255593289:web:110381aad65cf8b3b53498",
        measurementId: "G-X4MLP8ZXLV"
    }; // 파이어베이스 설정
const STORAGE_KEY = 'trickcal_calc_v10_final';
const constantPackages = [
        { name: "데일리 엘리프", price: 9900, contents: { p_elif: 1500, f_elif: 2000, manual: 2139, r_low: 124 } },
        { name: "데일리 별사탕", price: 9900, contents: { scandy: 4460 } },
        { name: "데일리 왕사탕", price: 5500, contents: { kcandy: 4850, nuru: 31 } },
        { name: "월간 크레파스 패키지", price: 29500, contents: { p_elif: 900, gold: 200, crayon_highest: 4 } },
        { name: "월간 교단 증명서 패키지", price: 49500, contents: { p_elif: 1500, f_elif: 1500, cert: 500 } },
        { name: "은총 패키지", price: 99000, contents: { p_elif: 6000, crayon_highest: 10, scandy: 500, kcandy: 500 } },
        { name: "트릭컬 패스 (기본)", price: 11000, contents: {"gold":66,"p_elif":700,"t_card":6,"t_apostle":6,"kcandy":300,"scandy":200,"m_high":10,"m_mid":40,"m_low":60,"r_high":3,"r_mid":6,"r_low":9,"crayon_high":3,"crayon_highest":2} },
        { name: "트릭컬 패스 (업그레이드)", price: 13000, contents: { p_elif: 800, thumbs: 30} }
    ]; //데일리, 월간, 은총, 패스
const defaultConfig = {
        price: 0,
        items: [
            { id: 'p_elif', name: '유료 엘리프', val: 2, icon: 'images/엘리프.png', count: "" },
            { id: 'f_elif', name: '무료 엘리프', val: 1, fixed: true, icon: 'images/엘리프.png', count: "" },
            { id: 'thumbs', name: '따봉', val: 20, icon: 'images/따봉.png', count: "" },
            { id: 'kcandy', name: '왕사탕', val: 0.5, icon: 'images/왕사탕.png', count: "" },
            { id: 'scandy', name: '별사탕', val: 2, icon: 'images/별사탕.png', count: "" },
            { id: 'crayon_low', name: '하급 크레파스', val: 0, icon: 'images/일반크레파스.png', count: "" },
            { id: 'crayon_mid', name: '중급 크레파스', val: 0, icon: 'images/파란크레파스.png', count: "" },
            { id: 'crayon_high', name: '상급 크레파스', val: 60, icon: 'images/보라크레파스.png', count: "" },
            { id: 'crayon_highest', name: '최상급 크레파스', val: 668, icon: 'images/황금크레파스.png', count: "" },
            { id: 'gold', name: '골드 (1만 단위)', val: 4, icon: 'images/골드.png', count: "" },
            { id: 'cert', name: '교단 증명서', val: 8.5, icon: 'images/교단증명서.png', count: "" },
            { id: 'spec_ticket', name: '특별 모집권', val: 130, icon: 'images/사도랜덤(10).png', count: "" },
            { id: 'adv_ticket', name: '초고급 모집권', val: 260, icon: 'images/초고급모집권(20).png', count: "" },
            { id: 'select_ticket', name: '일반 사도 선택권', val: 2550, icon: 'images/일반선택권.png', count: "" },
            { id: 'attr_ticket', name: '속성 모집권', val: 260, icon: 'images/속성뽑기권.png', count: "" },
            { id: 'elch_ticket', name: '엘다인 선택권', val: 6800, icon: 'images/선택엘다인.png', count: "" },
            { id: 'elch_yeon', name: '엘다인 연성권', val: 680, icon: 'images/엘다인 연성권.png', count: "" },
            { id: 'light_box', name: '무작위 빛 상자', val: 0, icon: 'images/빛상자.png', count: "" },
            { id: 'food_blue', name: '요리(파랑)', val: 0, icon: 'images/파란랜덤밥.png', count: "" },
            { id: 'food_purple', name: '요리(보라)', val: 0, icon: 'images/보라랜덤밥.png', count: "" },
            { id: 't_apostle', name: '사도뽑기권', val: 60, icon: 'images/사도뽑기.png', count: "" },
            { id: 't_card', name: '카드뽑기권', val: 40, icon: 'images/카드뽑기.png', count: "" },
            { id: 'nuru', name: '누루링', val: 40, icon: 'images/누루링.png', count: "" },
            { id: 'manual', name: '장비의 정석', val: 0.125, icon: 'images/장비의 정석.png', count: "" },
            { id: 'r_low', name: '하급 제련석', val: 3, icon: 'images/하급제련석.png', count: "" },
            { id: 'r_mid', name: '중급 제련석', val: 6, icon: 'images/중급제련석.png', count: "" },
            { id: 'r_high', name: '상급 제련석', val: 13, icon: 'images/상급제련석.png', count: "" },
            { id: 'm_low', name: '하급 마시멜로', val: 0, icon: 'images/하급 마시맬로.png', count: "" },
            { id: 'm_mid', name: '중급 마시멜로', val: 0, icon: 'images/중급마시맬로.png', count: "" },
            { id: 'm_high', name: '상급 마시멜로', val: 0, icon: 'images/상급마시맬로.png', count: "" },
            { id: 'deco_box', name: '방 꾸미기 상자', val: 0, icon: 'images/꾸미기상자.png', count: "" },
            { id: 'growth_box', name: '교단 성장 상자', val: 0, icon: 'images/교단성장재료상자.png', count: "" }
        ]    
    };
let config = JSON.parse(JSON.stringify(defaultConfig));
let dbPackages = []; 
let releasedChartObj = null;
