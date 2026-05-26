import { useState, useEffect } from 'react'
import { Tent, Compass, Map as MapIcon, ShieldCheck, MapPin, Clock, Flame, Accessibility, Info, Star, Navigation, Award, CheckCircle2, XCircle, AlertCircle, Database, X } from 'lucide-react'
import { Map, MapMarker, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured, QuizQuestion, Campsite, HeritageSite } from './supabaseClient'

// Campsites Master Data (Historical Campsites)
const MASTER_CAMPSITES: Campsite[] = [
  {
    id: 'moaksan',
    name: 'campsites.moaksan.name',
    description: 'campsites.moaksan.desc',
    lat: 35.7535,
    lng: 127.0658,
    era: 'joseon',
    tags: ['안전점검 완료', '#송광사'],
    distanceToHistoric: 4.1,
    nearbyHeritageIds: ['songgwangsa'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'hanok',
    name: 'campsites.hanok.name',
    description: 'campsites.hanok.desc',
    lat: 35.8125,
    lng: 127.1558,
    era: 'joseon',
    tags: ['거리순 1위', '#경기전', '#풍남문', '#오목대'],
    distanceToHistoric: 0.5,
    nearbyHeritageIds: ['gyeonggijeon', 'omokdae', 'pungnammun'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'gyoryongsan',
    name: 'campsites.gyoryongsan.name',
    description: 'campsites.gyoryongsan.desc',
    lat: 35.4218,
    lng: 127.3522,
    era: 'joseon',
    tags: ['공기 맑음', '조용한 분위기', '#광한루원'],
    distanceToHistoric: 3.1,
    nearbyHeritageIds: ['gwanghallu'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'mireuksa',
    name: 'campsites.mireuksa.name',
    description: 'campsites.mireuksa.desc',
    lat: 35.9892,
    lng: 127.1009,
    era: 'baekje',
    tags: ['안전점검 완료', '유적지 근접', '#미륵사지'],
    distanceToHistoric: 6.7,
    nearbyHeritageIds: ['mireuksa_site', 'wanggungri'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'ajung',
    name: 'campsites.ajung.name',
    description: 'campsites.ajung.desc',
    lat: 35.8395,
    lng: 127.1855,
    era: 'later_baekje',
    tags: ['호수뷰', '도심 인접', '#동고산성'],
    distanceToHistoric: 3.3,
    nearbyHeritageIds: ['donggosanseong', 'seungamsan_fortress'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'geumsansa_camp',
    name: 'campsites.geumsansa_camp.name',
    description: 'campsites.geumsansa_camp.desc',
    lat: 35.7360,
    lng: 127.0515,
    era: 'later_baekje',
    tags: ['자연 친화적', '계곡 인근', '#금산사'],
    distanceToHistoric: 0.2,
    nearbyHeritageIds: ['geumsansa'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'geumma',
    name: 'campsites.geumma.name',
    description: 'campsites.geumma.desc',
    lat: 36.0022,
    lng: 127.1351,
    era: 'goryeo',
    tags: ['생태공원 인접', '#석조여래입상'],
    distanceToHistoric: 1.9,
    nearbyHeritageIds: ['godori_buddha'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'baekdudaegan',
    name: 'campsites.baekdudaegan.name',
    description: 'campsites.baekdudaegan.desc',
    lat: 35.5022,
    lng: 127.5028,
    era: 'goryeo',
    tags: ['생태탐방', '지리산 인접', '#만복사지'],
    distanceToHistoric: 14.5,
    nearbyHeritageIds: ['manboksa_site'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'cheongamsan',
    name: 'campsites.cheongamsan.name',
    description: 'campsites.cheongamsan.desc',
    lat: 35.9388,
    lng: 126.7725,
    era: 'modern',
    tags: ['가족캠핑 추천', '#근대역사박물관', '#히로쓰가옥'],
    distanceToHistoric: 7.8,
    nearbyHeritageIds: ['modern_museum', 'hirotsu_house'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'mokpo_football',
    name: 'campsites.mokpo_football.name',
    description: 'campsites.mokpo_football.desc',
    lat: 34.8218,
    lng: 126.4182,
    era: 'modern',
    tags: ['가족야영', '#목포근대역사관'],
    distanceToHistoric: 4.1,
    nearbyHeritageIds: ['mokpo_modern'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  }
];

// Heritage Sites Master Data
const MASTER_HERITAGES: HeritageSite[] = [
  {
    id: 'songgwangsa',
    name: 'heritages.songgwangsa.name',
    description: 'heritages.songgwangsa.desc',
    lat: 35.7277,
    lng: 127.0987,
    era: 'joseon'
  },
  {
    id: 'gyeonggijeon',
    name: 'heritages.gyeonggijeon.name',
    description: 'heritages.gyeonggijeon.desc',
    lat: 35.8145,
    lng: 127.1504,
    era: 'joseon'
  },
  {
    id: 'omokdae',
    name: 'heritages.omokdae.name',
    description: 'heritages.omokdae.desc',
    lat: 35.8122,
    lng: 127.1550,
    era: 'joseon'
  },
  {
    id: 'pungnammun',
    name: 'heritages.pungnammun.name',
    description: 'heritages.pungnammun.desc',
    lat: 35.8134,
    lng: 127.1472,
    era: 'joseon'
  },
  {
    id: 'gwanghallu',
    name: 'heritages.gwanghallu.name',
    description: 'heritages.gwanghallu.desc',
    lat: 35.4039,
    lng: 127.3787,
    era: 'joseon'
  },
  {
    id: 'mireuksa_site',
    name: 'heritages.mireuksa_site.name',
    description: 'heritages.mireuksa_site.desc',
    lat: 36.0125,
    lng: 127.0310,
    era: 'baekje'
  },
  {
    id: 'wanggungri',
    name: 'heritages.wanggungri.name',
    description: 'heritages.wanggungri.desc',
    lat: 35.9732,
    lng: 127.0638,
    era: 'baekje'
  },
  {
    id: 'donggosanseong',
    name: 'heritages.donggosanseong.name',
    description: 'heritages.donggosanseong.desc',
    lat: 35.8118,
    lng: 127.1706,
    era: 'later_baekje'
  },
  {
    id: 'seungamsan_fortress',
    name: 'heritages.seungamsan_fortress.name',
    description: 'heritages.seungamsan_fortress.desc',
    lat: 35.8112,
    lng: 127.1654,
    era: 'later_baekje'
  },
  {
    id: 'geumsansa',
    name: 'heritages.geumsansa.name',
    description: 'heritages.geumsansa.desc',
    lat: 35.7361,
    lng: 127.0508,
    era: 'later_baekje'
  },
  {
    id: 'godori_buddha',
    name: 'heritages.godori_buddha.name',
    description: 'heritages.godori_buddha.desc',
    lat: 35.9868,
    lng: 127.1264,
    era: 'goryeo'
  },
  {
    id: 'manboksa_site',
    name: 'heritages.manboksa_site.name',
    description: 'heritages.manboksa_site.desc',
    lat: 35.4144,
    lng: 127.3712,
    era: 'goryeo'
  },
  {
    id: 'modern_museum',
    name: 'heritages.modern_museum.name',
    description: 'heritages.modern_museum.desc',
    lat: 35.9895,
    lng: 126.7118,
    era: 'modern'
  },
  {
    id: 'hirotsu_house',
    name: 'heritages.hirotsu_house.name',
    description: 'heritages.hirotsu_house.desc',
    lat: 35.9877,
    lng: 126.7095,
    era: 'modern'
  },
  {
    id: 'mokpo_modern',
    name: 'heritages.mokpo_modern.name',
    description: 'heritages.mokpo_modern.desc',
    lat: 34.7865,
    lng: 126.3811,
    era: 'modern'
  }
];

// Mock Jeolla region public campsites data (Fallback for Open API)
const MOCK_JEOLLA_CAMPS = [
  { id: 'public-mock-1', name: '전주 교동 오토캠핑장', addr: '전북 전주시 완산구 교동 12-3', lat: 35.8115, lng: 127.1585, tel: '063-222-1111', induty: '일반야영장', description: '전주 한옥마을 도보 거리에 위치한 도심 속 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-2', name: '완주 대둔산 캠핑파크', addr: '전북 완주군 운주면 산북리 55', lat: 36.1245, lng: 127.3120, tel: '063-263-0000', induty: '일반야영장, 글램핑', description: '대둔산 도립공원 자락에 위치한 수려한 경관의 캠핑장.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-3', name: '익산 웅포관광지 곰개나루 캠핑장', addr: '전북 익산시 웅포면 웅포리 738', lat: 36.0745, lng: 126.8580, tel: '063-859-3846', induty: '일반야영장, 오토캠핑', description: '금강변의 아름다운 낙조를 감상할 수 있는 가족 야영장.', resveCl: '온라인야영장예약,전화', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-4', name: '군산 청암산 오토캠핑장', addr: '전북 군산시 회현면 세제길 27', lat: 35.9388, lng: 126.7725, tel: '063-465-3357', induty: '오토캠핑장', description: '청암산 호수공원 인근의 깨끗하고 넓은 오토캠핑장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-5', name: '고창 선운산도립공원 야영장', addr: '전북 고창군 아산면 선운사로 205', lat: 35.4988, lng: 126.6185, tel: '063-560-8600', induty: '일반야영장', description: '선운산의 사계절 아름다움을 만끽할 수 있는 자연 친화 야영장.', resveCl: '현장', resveUrl: '' },
  { id: 'public-mock-6', name: '부안 고사포야영장', addr: '전북 부안군 변산면 변산로 2065-1', lat: 35.6845, lng: 126.4715, tel: '063-582-7888', induty: '일반야영장', description: '변산반도 국립공원 고사포 해수욕장 송림 속 야영장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-7', name: '남원 지리산백무동야영장', addr: '전북 남원시 아영면 지리산로', lat: 35.3785, lng: 127.5855, tel: '055-970-1000', induty: '일반야영장', description: '지리산 천왕봉 코스 기점에 있는 계곡 옆 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-8', name: '여수 더스타 오토캠핑장', addr: '전남 여수시 돌산읍 평사리 12-4', lat: 34.6855, lng: 127.7985, tel: '061-644-0000', induty: '오토캠핑, 카라반', description: '돌산 바다가 한눈에 내려다보이는 오션뷰 오토캠핑장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-9', name: '순천만 국가정원 글램핑', addr: '전남 순천시 홍내동 11-2', lat: 34.9255, lng: 127.5020, tel: '061-744-1111', induty: '글램핑', description: '순천만 습지와 국가정원 관광에 최적화된 럭셔리 글램핑.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-10', name: '담양 메타프로방스 카라반', addr: '전남 담양군 담양읍 깊은실길 22', lat: 35.3288, lng: 127.0088, tel: '061-380-0000', induty: '카라반', description: '담양 메타세쿼이아길 바로 옆 유럽풍 프로방스 마을 카라반.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-11', name: '장성 백양사 가인야영장', addr: '전남 장성군 북하면 백양로 1114', lat: 35.4385, lng: 126.8785, tel: '061-392-7288', induty: '일반야영장', description: '내장산 국립공원 백양사 지구에 위치한 수려한 계곡 야영장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-12', name: '보성 율포솔밭오토캠핑장', addr: '전남 보성군 회천면 우암길 24', lat: 34.7015, lng: 127.0815, tel: '061-850-8600', induty: '오토캠핑, 카라반', description: '보성 율포 솔밭 해수욕장 백사장 인근의 소나무 숲 캠핑장.', resveCl: '온라인야영장예약,현장', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-13', name: '남원 백두대간 캠핑장', addr: '전북 남원시 운봉읍 바래봉길 10', lat: 35.4415, lng: 127.5312, tel: '063-630-0000', induty: '일반야영장', description: '지리산 바래봉 자락에 위치해 시원하고 자연 친화적인 야영지.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-14', name: '임실 옥정호 산들바람 캠핑장', addr: '전북 임실군 운암면 국사봉로 23', lat: 35.6120, lng: 127.1215, tel: '063-640-0000', induty: '오토캠핑', description: '아름다운 옥정호 호수 뷰를 감상할 수 있는 호숫가 야영지.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-15', name: '진안 운일암반일암 국민여가캠핑장', addr: '전북 진안군 주천면 동상주천로 1928', lat: 35.9188, lng: 127.2845, tel: '063-430-8359', induty: '일반야영장, 오토캠핑', description: '기암절벽과 맑은 계곡물이 흐르는 운일암반일암 계곡 옆 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-16', name: '무주 덕유산 국민여가캠핑장', addr: '전북 무주군 설천면 백련사로 2', lat: 35.8912, lng: 127.7685, tel: '063-322-1097', induty: '일반야영장, 카라반', description: '덕유산 국립공원 입구 구천동 계곡 옆에 펼쳐진 대규모 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-17', name: '완주 자연을닮은 캠핑장', addr: '전북 완주군 소양면 해학로 12-4', lat: 35.8855, lng: 127.2515, tel: '063-240-0000', induty: '일반야영장, 글램핑', description: '완주 소양 고즈넉한 산자락 아래 위치하여 힐링하기 최적의 장소.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-18', name: '영광 불갑산 상사화야영장', addr: '전남 영광군 불갑면 불갑사로 32', lat: 35.2515, lng: 126.5412, tel: '061-350-0000', induty: '일반야영장', description: '불갑사 도립공원 인근 상사화 축제장 옆에 조성된 조용한 캠핑 공간.', resveCl: '현장', resveUrl: '' },
  { id: 'public-mock-19', name: '해남 땅끝 오토캠핑장', addr: '전남 해남군 송지면 땅끝해안로 17', lat: 34.3015, lng: 126.5312, tel: '061-530-5733', induty: '오토캠핑, 카라반', description: '한반도 최남단 땅끝마을 바다 바로 앞에 펼쳐진 아름다운 카라반 야영지.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-20', name: '구례 지리산피아골 오토캠핑장', addr: '전남 구례군 토지면 피아골로 12', lat: 35.2612, lng: 127.5685, tel: '061-780-2733', induty: '오토캠핑', description: '지리산 피아골 단풍 계곡 아래 맑고 웅장한 자연 속에 위치한 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-21', name: '고흥 나로우주해수욕장 야영장', addr: '전남 고흥군 동일면 우주로 15', lat: 34.4612, lng: 127.4385, tel: '061-830-5114', induty: '일반야영장', description: '울창한 소나무 숲과 나로우주해수욕장 모래사장이 맞닿아 있는 야영장.', resveCl: '현장', resveUrl: '' },
  { id: 'public-mock-22', name: '장흥 천관산자연휴양림 야영장', addr: '전남 장흥군 관산읍 칠관로 23', lat: 34.5488, lng: 126.9185, tel: '061-867-6974', induty: '일반야영장', description: '천관산 기슭에 자리 잡아 맑은 공기와 조용한 숲속에서 힐링할 수 있는 야영지.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' }
];

// Mock Quiz Data - Korean
const MOCK_QUIZZES_KO: QuizQuestion[] = [
  {
    id: 1,
    era: 'joseon',
    region: '전주',
    question: '태조 이성계의 어진(초상화)을 모시고 있는 전주의 대표적인 유적지는 어디일까요?',
    options: ['경기전', '풍남문', '오목대', '전주향교'],
    correct_option_index: 0,
    explanation: '전주 경기전(慶基殿)은 조선 태조 이성계의 어진을 봉안하고 있는 유서 깊은 유적지입니다.'
  },
  {
    id: 2,
    era: 'joseon',
    region: '완주',
    question: '완주 송광사에 있는 조선 시대 대표적인 불교 건축물로, 보물 제1243호로 지정된 것은 무엇일까요?',
    options: ['대웅전', '지장전', '극락전', '미륵전'],
    correct_option_index: 0,
    explanation: '완주 송광사 대웅전은 조선 중기 불교 목조건축의 뛰어난 가치를 간직한 보물 문화재입니다.'
  },
  {
    id: 3,
    era: 'baekje',
    region: '익산',
    question: '백제 무왕이 창건한 동양 최대의 절터로, 국보 제11호 미륵사지 석탑이 있는 곳은 어디일까요?',
    options: ['익산 미륵사지', '부여 정림사지', '공주 무령왕릉', '익산 왕궁리유적'],
    correct_option_index: 0,
    explanation: '익산 미륵사지는 백제 무왕 때 창건되어 3탑 3금당의 독특한 가람배치를 보여주는 유적입니다.'
  }
];

// Mock Quiz Data - English
const MOCK_QUIZZES_EN: QuizQuestion[] = [
  {
    id: 1,
    era: 'joseon',
    region: 'Jeonju',
    question: 'Where is the representative historic site in Jeonju that houses the portrait of King Taejo Yi Seong-gye?',
    options: ['Gyeonggijeon', 'Pungnammun', 'Omokdae', 'Jeonju Hyanggyo'],
    correct_option_index: 0,
    explanation: 'Gyeonggijeon in Jeonju is a historical site built to enshrine the portrait of King Taejo, the founder of the Joseon Dynasty.'
  },
  {
    id: 2,
    era: 'joseon',
    region: 'Wanju',
    question: 'What is the representative Joseon era Buddhist building in Wanju Songgwangsa Temple, designated as Treasure No. 1243?',
    options: ['Daeungjeon Hall', 'Jijangjeon Hall', 'Geukrakjeon Hall', 'Mireukjeon Hall'],
    correct_option_index: 0,
    explanation: 'Songgwangsa Daeungjeon in Wanju is a national treasure that shows the outstanding value of mid-Joseon Buddhist wooden architecture.'
  },
  {
    id: 3,
    era: 'baekje',
    region: 'Iksan',
    question: 'Where is the largest temple site in East Asia founded by King Mu of Baekje, home to the Stone Pagoda of Mireuksa Temple Site (National Treasure No. 11)?',
    options: ['Iksan Mireuksa Temple Site', 'Buyeo Jeongrimsa Temple Site', 'Gongju Tomb of King Muryeong', 'Iksan Wanggung-ri Ruins'],
    correct_option_index: 0,
    explanation: 'Mireuksa Temple Site in Iksan was founded during the reign of King Mu of Baekje and is a unique site showcasing three pagodas and three main halls.'
  }
];

interface HeritageQuiz {
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

const HERITAGE_QUIZZES: Record<string, { ko: HeritageQuiz; en: HeritageQuiz }> = {
  songgwangsa: {
    ko: {
      question: "완주 송광사에 있는 문화유산 중 하나인 보물 제1243호 대웅전과 관련된 특징으로 옳은 것은 무엇인가요?",
      options: [
        "벽면 전체가 도자기 타일로 마감되어 있다.",
        "임진왜란 때 소실된 후 조선 인조 대에 재건되었으며 삼세불상이 봉안되어 있다.",
        "지하에 석굴암과 같은 인공 석굴이 존재한다.",
        "국내에서 가장 오래된 철조 비로자나불좌상이 있다."
      ],
      correct_option_index: 1,
      explanation: "완주 송광사 대웅전은 보물 제1243호로 지정되어 있으며, 광해군/인조 대에 활발히 이루어진 사찰 중건 과정에서 재건되었습니다. 대웅전 내에는 흙으로 빚어 만든 삼세불상(소조석가여래삼존불좌상)이 모셔져 있습니다."
    },
    en: {
      question: "Which of the following is correct about the Daeungjeon Hall (Treasure No. 1243) of Wanju Songgwangsa Temple?",
      options: [
        "The walls are fully covered with porcelain tiles.",
        "It was rebuilt in the reign of King Injo after being burned during the Imjin War, housing the Clay Triad Buddhas.",
        "It has an artificial stone cave underground like Seokguram.",
        "It houses the oldest iron Vairocana Buddha in Korea."
      ],
      correct_option_index: 1,
      explanation: "Daeungjeon of Wanju Songgwangsa Temple is designated as Treasure No. 1243. It was reconstructed during the reconstruction projects of Buddhist temples under Gwanghaegun and King Injo, and enshrines massive clay Buddhas."
    }
  },
  gyeonggijeon: {
    ko: {
      question: "전주 경기전(사적)에 봉안되어 있는 조선의 국왕 어진(초상화)은 누구의 어진인가요?",
      options: ["태종 이방원", "태조 이성계", "세종 이도", "정조 이산"],
      correct_option_index: 1,
      explanation: "경기전은 조선을 건국한 태조 이성계의 영정(초상화인 어진, 국보)을 봉안하기 위해 태종 10년(1410년)에 창건되었습니다."
    },
    en: {
      question: "Whose royal portrait (Eojin) is enshrined in Jeonju Gyeonggijeon Shrine?",
      options: ["King Taejong (Yi Bang-won)", "King Taejo (Yi Seong-gye)", "King Sejong (Yi Do)", "King Jeongjo (Yi San)"],
      correct_option_index: 1,
      explanation: "Gyeonggijeon was founded in 1410 (10th year of King Taejong) to enshrine the royal portrait (Eojin) of King Taejo, the founder of the Joseon Dynasty."
    }
  },
  omokdae: {
    ko: {
      question: "오목대는 태조 이성계가 고려 우왕 시절 어느 전투에서 왜구를 크게 무찌르고 개경으로 돌아가던 길에 종친들과 잔치를 베푼 곳인가요?",
      options: ["홍산대첩", "진포대첩", "황산대첩", "관음포대첩"],
      correct_option_index: 2,
      explanation: "이성계는 1380년 삼남 지방을 약탈하던 왜구를 황산(현재 전북 남원)에서 크게 격퇴한 '황산대첩'을 거두고 개경으로 귀환하던 도중, 전주 오목대에서 친지들과 잔치를 벌이며 왕조 창업의 야망을 한시로 읊었습니다."
    },
    en: {
      question: "At Omokdae, Yi Seong-gye hosted a celebratory banquet after defeating Japanese pirates in which battle during the late Goryeo Dynasty?",
      options: ["Battle of Hongsan", "Battle of Jinpo", "Battle of Hwangsan", "Battle of Gwaneumpo"],
      correct_option_index: 2,
      explanation: "Yi Seong-gye defeated the pillaging Japanese pirates in the Battle of Hwangsan (in present-day Namwon) in 1380. On his way back to Gaegyeong, he stopped at Omokdae in Jeonju to hold a feast and recite a poem expressing his ambition to found a new dynasty."
    }
  },
  pungnammun: {
    ko: {
      question: "조선시대 전라감영의 소재지였던 전주를 둘러싸고 있던 전주부성의 남문이자, 성문 중 유일하게 남아있는 보물은 무엇인가요?",
      options: ["풍남문", "동고문", "서평문", "패엽문"],
      correct_option_index: 0,
      explanation: "풍남문은 전주부성의 남문으로 임진왜란 때 파괴되었다가 영조 때 재건되었습니다. 전주부성의 4대문 중 유일하게 현존하는 유적이며 보물로 지정되어 있습니다."
    },
    en: {
      question: "What is the only remaining gate of the Jeonju Fortress and a designated Treasure that served as the south gate of the Jeonju administrative center during the Joseon Dynasty?",
      options: ["Pungnammun", "Donggomun", "Seopyeongmun", "Paeyeopmun"],
      correct_option_index: 0,
      explanation: "Pungnammun is the southern gate of Jeonju Fortress. Rebuilt in the reign of King Yeongjo after being destroyed in the Imjin War, it is the sole surviving gate of the fortress's four gates."
    }
  },
  gwanghallu: {
    ko: {
      question: "남원의 광한루원에 대한 설명으로 가장 알맞은 것은 무엇인가요?",
      options: [
        "견훤이 고려에 대항하여 축성한 산성 정원이다.",
        "백제 무왕이 궁궐 연못으로 조성한 정원이다.",
        "조선의 명승이자 소설 '춘향전'의 배경으로 신선사상과 전통 정원 양식이 조화를 이룬 곳이다.",
        "구한말 의병들이 연합 전선을 펼쳤던 역사적 격전지이다."
      ],
      correct_option_index: 2,
      explanation: "광한루원은 조선 시대의 대표적인 정원으로, 신선들이 산다는 전설 속 삼신산을 연못 위에 구현한 전통 조경 양식을 보여줍니다. 고대 소설 '춘향전'에서 이몽룡과 성춘향이 처음 만난 장소로 유명합니다."
    },
    en: {
      question: "Which of the following describes Gwanghalluwon Garden in Namwon?",
      options: [
        "A mountain fortress garden constructed by Gyeon Hwon against Goryeo.",
        "A palace pond garden created by King Mu of Baekje.",
        "A scenic Joseon garden, setting of 'Chunhyangjeon', combining Taoist immortal beliefs and traditional garden styles.",
        "A historic battlefield where late Joseon righteous armies formed an alliance."
      ],
      correct_option_index: 2,
      explanation: "Gwanghalluwon is a representative traditional garden of the Joseon Dynasty, embodying the Taoist concept of the mythical dwelling of deities. It is also famous as the place where Sung Chun-hyang and Yi Mong-ryong first met in the classical novel 'Chunhyangjeon'."
    }
  },
  mireuksa_site: {
    ko: {
      question: "백제 무왕 때 건립된 동양 최대의 사찰 터인 익산 미륵사지에서 발견된 국보 제11호 미륵사지 석탑과 관련된 설명으로 옳은 것은?",
      options: [
        "목탑의 양식을 석재로 구현한 과도기적 석탑이자 한국 석탑의 시원(시작)으로 평가된다.",
        "고구려의 양식을 완벽히 이어받은 육각형 탑이다.",
        "1990년대에 한반도 최초로 발굴된 유리 탑이다.",
        "돌이 아닌 붉은 벽돌만을 쌓아서 만든 전탑이다."
      ],
      correct_option_index: 0,
      explanation: "익산 미륵사지 석탑(국보)은 목조건축의 기법을 석재로 충실히 구현한 독특한 과도기 양식을 띠고 있어, 한국 석탑의 출발점으로 역사적 가치가 큽니다."
    },
    en: {
      question: "Which of the following is correct about the Stone Pagoda of Mireuksa Temple Site (National Treasure No. 11) in Iksan?",
      options: [
        "It is a transitional pagoda imitating wooden architecture in stone and is regarded as the origin of Korean stone pagodas.",
        "It is a hexagonal pagoda that perfectly inherited the Goguryeo style.",
        "It was the first glass pagoda excavated in the Korean Peninsula in the 1990s.",
        "It is a brick pagoda constructed entirely of red clay bricks."
      ],
      correct_option_index: 0,
      explanation: "The Stone Pagoda at the Mireuksa Temple Site in Iksan (National Treasure) represents a unique transitional style, applying wooden construction techniques to stone materials, making it highly valuable as the starting point of Korean stone pagodas."
    }
  },
  wanggungri: {
    ko: {
      question: "백제 무왕 시기 왕궁으로 조성된 익산 왕궁리 유적에서 확인된 독특하고 선진적인 고대 생활사 유적은 무엇인가요?",
      options: [
        "온수 순환 방식의 구들장(보일러)",
        "대형 화장실 유적과 똥분석을 통한 기생충 흔적",
        "지하식 천문대(혼천의)",
        "천연 탄산수 온천탕 복합시설"
      ],
      correct_option_index: 1,
      explanation: "익산 왕궁리 유적에서는 한국 고대 유적 최초로 대형 공동화장실 터와 나무 주걱(뒤처리용), 그리고 화장실 흙 분석을 통한 회충 등 기생충 알이 검출되어 고대인들의 청결/위생 생활상을 직접 증명해 주었습니다."
    },
    en: {
      question: "Which unique and advanced ancient lifestyle relic was discovered at the Wanggung-ri ruins in Iksan, a Baekje royal palace site?",
      options: [
        "A hot-water circulation underfloor heating system (Ondol)",
        "Large-scale public restroom ruins and parasite eggs identified via soil analysis",
        "An underground astronomical observatory",
        "A natural carbonated hot spring complex"
      ],
      correct_option_index: 1,
      explanation: "Wanggung-ri in Iksan revealed Korea's first ancient large-scale public restrooms, wooden scrapers for toilet paper, and parasite eggs in the soil, which provided direct evidence of sanitation and hygiene practices in ancient times."
    }
  },
  donggosanseong: {
    ko: {
      question: "전주 동고산성은 삼국사기에 기록된 어느 나라의 궁성(도성) 터로 비정되고 있나요?",
      options: ["백제", "후고구려", "가야", "후백제"],
      correct_option_index: 3,
      explanation: "전주 동고산성은 900년 견훤이 완산주(현재의 전주)에 도읍을 정하고 세운 후백제의 궁성(도성) 터로 유력하게 추정되며, 대형 건물지 유적이 발굴되었습니다."
    },
    en: {
      question: "Jeonju Donggosanseong Fortress is presumed to be the palace site of which ancient state founded in 900 AD?",
      options: ["Baekje", "Later Goguryeo", "Gaya", "Later Baekje"],
      correct_option_index: 3,
      explanation: "Donggosanseong is strongly presumed to be the royal castle site of Later Baekje, established in 900 AD by King Gyeon Hwon when he made Wansanju (present-day Jeonju) his capital."
    }
  },
  seungamsan_fortress: {
    ko: {
      question: "전주 승암산성(치명자산성)의 주된 역사적 역할은 무엇이었나요?",
      options: [
        "가야의 대일본 해상 무역 전초 기지",
        "후백제의 도성(완산주) 방어를 위한 동방 외곽 방어 요새",
        "임진왜란 당시 전주사고의 실록을 보관한 장소",
        "일제강점기 쌀 수탈을 감시하던 감시탑"
      ],
      correct_option_index: 1,
      explanation: "승암산성은 완산주(전주)의 동쪽을 병풍처럼 둘러싸고 있는 승암산 일대에 축성되어 후백제 도성의 동쪽 방어를 담당했던 핵심 보루이자 전략 요새였습니다."
    },
    en: {
      question: "What was the primary historical role of Jeonju Seungamsan Fortress?",
      options: [
        "An maritime trade outpost of Gaya with Japan",
        "An eastern fortress for defending Later Baekje's capital, Wansanju",
        "A storage facility for royal records during the Imjin War",
        "A watchtower to monitor rice exploitation during the Japanese colonial era"
      ],
      correct_option_index: 1,
      explanation: "Seungamsan Fortress was located on Mt. Seungamsan bordering the east of Wansanju (Jeonju), serving as a crucial military stronghold defending the eastern perimeter of the Later Baekje capital."
    }
  },
  geumsansa: {
    ko: {
      question: "후백제의 시조 견훤이 넷째 아들 금강에게 왕위를 물려주려 하자, 이에 분노한 큰아들 신검 등에 의해 유배당했던 비극적인 역사의 현장은 어디인가요?",
      options: ["김제 금산사", "익산 미륵사", "완주 송광사", "남원 만복사"],
      correct_option_index: 0,
      explanation: "견훤은 왕위 계승 분쟁 과정에서 큰아들 신검과 그 무리에 의해 김제 금산사에 3개월 동안 유금(유배)당했다가 탈출하여 고려 태조 왕건에게 투항하였습니다."
    },
    en: {
      question: "Where was King Gyeon Hwon, the founder of Later Baekje, imprisoned by his eldest son Singeom after trying to pass the throne to his fourth son Geumgang?",
      options: ["Geumsansa Temple in Gimje", "Mireuksa Temple in Iksan", "Songgwangsa Temple in Wanju", "Manboksa Temple in Namwon"],
      correct_option_index: 0,
      explanation: "Gyeon Hwon was confined at Geumsansa Temple in Gimje for about three months by his rebellious eldest son Singeom, before escaping to surrender to King Wang Geon of the Goryeo Dynasty."
    }
  },
  godori_buddha: {
    ko: {
      question: "보물로 지정된 익산 고도리 석조여래입상은 약 200m 거리를 두고 두 석상이 마주 보고 서 있습니다. 이 둘의 흥미로운 전설은 무엇인가요?",
      options: [
        "해마다 단오 날이 되면 동서로 마주보고 춤을 춘다.",
        "평소에는 떨어져 있다가, 섣달그믐날 밤 음력 12월 말에 냇물이 얼면 만나 포옹을 나눈다.",
        "왕궁리 5층석탑을 함께 옮겼다는 전설이 있다.",
        "나라에 큰 난리가 나기 전에 석상에서 눈물이 흘러내린다."
      ],
      correct_option_index: 1,
      explanation: "고도리 석조여래입상은 동서로 약 200미터 떨어져 냇물을 사이에 두고 서 있습니다. 전설에 따르면 평소에는 서로 만나지 못하다가, 일 년 중 마지막 날 밤(섣달그믐날)에 냇물이 얼어붙으면 두 불상이 건너와서 만났다가 새벽 닭이 울면 다시 제자리로 돌아간다고 전해집니다."
    },
    en: {
      question: "The two stone Buddhas of Iksan Godori (Treasure) stand facing each other across a stream. What is the legendary romance associated with them?",
      options: [
        "They perform a face-to-face dance every year on Dano Festival.",
        "Separated by a stream, they meet and embrace on the last night of the lunar year when the water freezes.",
        "Legend says they physically moved the Wanggung-ri Pagoda together.",
        "They are said to shed tears before national crises."
      ],
      correct_option_index: 1,
      explanation: "The Godori Stone Buddhas face each other about 200m apart across a stream. Legend has it that they cannot meet usually, but on the last night of the lunar year when the stream freezes, they cross to meet and return before dawn."
    }
  },
  manboksa_site: {
    ko: {
      question: "남원 만복사지는 고려 시대에 세워져 김시습의 한문 소설의 배경이 된 절터입니다. 이 소설의 이름은 무엇인가요?",
      options: ["구운몽", "홍길동전", "만복사저포기", "춘향전"],
      correct_option_index: 2,
      explanation: "만복사지는 매월당 김시습이 지은 한국 최초의 한문 소설집 '금오신화'에 수록된 '만복사저포기(萬福寺樗蒲記)'의 배경입니다. 주인공 양생이 만복사 불당에서 부처님과 저포(주사위 놀이)를 해 이겨 아름다운 여인의 영혼과 애틋한 사랑을 나누는 이야기입니다."
    },
    en: {
      question: "The Manboksa Temple Site in Namwon is the setting of a famous story in Korea's first classical Chinese novel collection by Kim Si-seup. What is the title of this story?",
      options: ["Guunmong", "Hong Gildongjeon", "Manboksa Jeopogi", "Chunhyangjeon"],
      correct_option_index: 2,
      explanation: "Manboksa Temple Site is the backdrop of 'Manboksa Jeopogi' (A Dice Game at Manboksa) in Kim Si-seup's novel collection 'Geumo Shinhwa'. The story features a bachelor who plays a dice game against Buddha to meet a beautiful lady's ghost."
    }
  },
  modern_museum: {
    ko: {
      question: "군산 근대역사박물관이 위치한 군산항은 일제강점기 당시 어떤 역사적 수탈과 연관이 깊은 곳인가요?",
      options: [
        "평양 대동강 유역의 철광석 수탈",
        "호남 평야 일대의 쌀 수탈과 일본 반출",
        "한라산의 울창한 목재 수탈",
        "태백산맥의 석탄 자원 수탈"
      ],
      correct_option_index: 1,
      explanation: "군산은 일제강점기 호남평야에서 생산된 쌀을 일본으로 수탈해 가던 핵심 항구 도시였습니다. 박물관은 이 같은 아픈 역사와 일제에 저항한 군산 시민들의 항일 운동을 상세히 다루고 있습니다."
    },
    en: {
      question: "Gunsan Port, near the Modern History Museum, is associated with which major colonial exploitation during the Japanese occupation?",
      options: [
        "Extraction of iron ore from Pyongyang",
        "Looting and exporting rice harvested from the Honam plains to Japan",
        "Deforestation of Jeju Island's timber",
        "Exploitation of coal from the Taebaek Mountains"
      ],
      correct_option_index: 1,
      explanation: "Gunsan was a primary port used by the Japanese colonial government to export rice plundered from the fertile Honam Plain. The museum displays this painful history alongside Gunsan's active anti-Japanese resistance movements."
    }
  },
  hirotsu_house: {
    ko: {
      question: "군산 신흥동 일본식 가옥은 일제강점기 군산에서 대규모 포목상과 농장을 운영했던 일본인이 지은 주택입니다. 이 가옥의 건축사적 가치는 무엇인가요?",
      options: [
        "전형적인 조선 후기 사대부 가옥의 양식을 보여준다.",
        "한옥과 양식 건축이 결합한 절충형 기독교 예배당이다.",
        "일제강점기 일본인 지주나 부유층의 전형적인 일본식 주택 및 정원의 모습을 고스란히 간직하고 있다.",
        "백제 전통 점토 가마터의 구조를 따르고 있다."
      ],
      correct_option_index: 2,
      explanation: "신흥동 일본식 가옥(구 히로쓰 가옥)은 목조 2층 주택으로, 일제강점기 당시 부유한 일본인 지주의 전형적인 주택 양식과 일본식 정원 배치를 온전히 유지하고 있어 근대 주거 생활사를 연구하는 데 중요한 사료가 됩니다."
    },
    en: {
      question: "The Hirotsu House in Sinheung-dong, Gunsan is an architectural relic of the Japanese colonial era. What is its significance?",
      options: [
        "It shows the typical upper-class Joseon dynasty house style.",
        "It is a hybrid Christian chapel combining Hanok and Western architectures.",
        "It preserves the typical residential style and garden layout of wealthy Japanese landlords during the colonial period.",
        "It follows the structure of Baekje traditional clay kilns."
      ],
      correct_option_index: 2,
      explanation: "The Sinheung-dong Japanese House (formerly Hirotsu House) is a two-story wooden house that perfectly preserves the residential architecture and garden style of wealthy Japanese merchants during the colonial era."
    }
  },
  mokpo_modern: {
    ko: {
      question: "목포 근대역사관 1관은 붉은 벽돌과 르네상스 건축 양식이 특징인 근대 건축물입니다. 원래 이 건물은 어떤 목적으로 건립되었나요?",
      options: [
        "일제의 동양척식주식회사 목포지점",
        "구 목포 일본영사관",
        "대한제국의 목포 해관(세관)",
        "조선총독부 전라남도 청사"
      ],
      correct_option_index: 1,
      explanation: "목포 근대역사관 1관은 1900년에 지어진 구 목포 일본영사관 건물입니다. 붉은 벽돌을 사용하여 화려하게 지어진 목포에서 가장 오래된 근대 서양식 건축물 중 하나입니다."
    },
    en: {
      question: "Mokpo Modern History Hall 1 is a red-brick Renaissance building. What was its original purpose when constructed in 1900?",
      options: [
        "Mokpo branch of the Oriental Development Company",
        "Former Japanese Consulate in Mokpo",
        "Customs office of the Korean Empire",
        "Jeollanam-do Provincial Government Building under the Governor-General"
      ],
      correct_option_index: 1,
      explanation: "Mokpo Modern History Hall 1 is the former Japanese Consulate built in 1900. It is one of the oldest modern Western-style buildings in Mokpo, designed using red bricks and Renaissance architectural elements."
    }
  }
};

// Geolocation Haversine Distance Calculator (computed locally in device memory)
const calculateHaversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

function App() {
  const { t, i18n } = useTranslation();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const KAKAO_KEY = isLocal ? "2a9acbfdf57b3822c73494498fc87389" : "0bf5fc207b57b96ebcce8a4a17f33a5c";

  useKakaoLoader({
    appkey: KAKAO_KEY,
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [activeEra, setActiveEra] = useState('all');

  // GoCamping API setup
  const gocampingApiKey = import.meta.env.VITE_GOCAMPING_API_KEY || '';
  const isGocampingConfigured = !!(gocampingApiKey && gocampingApiKey !== 'your-gocamping-decoding-service-key');

  const [showPublicCamps, setShowPublicCamps] = useState(false);
  const [showReservableOnly, setShowReservableOnly] = useState(false);
  const [publicCamps, setPublicCamps] = useState<any[]>([]);
  const [loadingPublicCamps, setLoadingPublicCamps] = useState(false);
  const [activeInfoWindowCampId, setActiveInfoWindowCampId] = useState<string | null>(null);

  // Client-side user geolocation tracking (retained in smartphone memory only)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Device identifier
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('history_camper_device_id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      localStorage.setItem('history_camper_device_id', id);
    }
    return id;
  });

  // Campsite statuses: { [campsiteId]: 'planned' | 'visited' }
  const [campsiteStatuses, setCampsiteStatuses] = useState<Record<string, 'planned' | 'visited'>>({});

  // Heritage statuses: { [heritageId]: 'planned' | 'visited' }
  const [heritageStatuses, setHeritageStatuses] = useState<Record<string, 'planned' | 'visited'>>({});
  // Heritage reviews: { [heritageId]: string }
  const [heritageReviews, setHeritageReviews] = useState<Record<string, string>>({});
  // Active heritage quiz states
  const [activeQuizHeritage, setActiveQuizHeritage] = useState<HeritageSite | null>(null);
  const [activeQuizTargetStatus, setActiveQuizTargetStatus] = useState<'planned' | 'visited' | null>(null);
  const [heritageQuizAnswered, setHeritageQuizAnswered] = useState(false);
  const [heritageQuizSelectedIdx, setHeritageQuizSelectedIdx] = useState<number | null>(null);
  const [heritageQuizReviewText, setHeritageQuizReviewText] = useState('');

  // Status filter: 'all' | 'planned' | 'visited'
  const [statusFilter, setStatusFilter] = useState<'all' | 'planned' | 'visited'>('all');

  // Selected Campsite for interactive mapping (defaults to Moaksan)
  const [selectedCampsiteId, setSelectedCampsiteId] = useState('moaksan');

  // Map Center controller state
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 35.7336, lng: 127.0928 });

  // Supabase & Quiz States
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [quizState, setQuizState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Filters for Quiz
  const [filterEra, setFilterEra] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  const Eras = [
    { id: 'all', label: t('era.eras.all') },
    { id: 'baekje', label: t('era.eras.baekje') },
    { id: 'later_baekje', label: t('era.eras.later_baekje') },
    { id: 'goryeo', label: t('era.eras.goryeo') },
    { id: 'joseon', label: t('era.eras.joseon') },
    { id: 'modern', label: t('era.eras.modern') }
  ];

  // Retrieve Campsite Statuses from Supabase or LocalStorage
  useEffect(() => {
    async function loadStatuses() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('campsite_id, status')
            .eq('device_id', deviceId);
          
          if (error) throw error;
          if (data) {
            const mapping: Record<string, 'planned' | 'visited'> = {};
            data.forEach(item => {
              mapping[item.campsite_id] = item.status || 'planned';
            });
            setCampsiteStatuses(mapping);
          }
        } catch (err) {
          console.error("Failed to load statuses from Supabase, loading from LocalStorage:", err);
          const saved = localStorage.getItem('history_camper_statuses');
          if (saved) {
            setCampsiteStatuses(JSON.parse(saved));
          }
        }
      } else {
        const saved = localStorage.getItem('history_camper_statuses');
        if (saved) {
          setCampsiteStatuses(JSON.parse(saved));
        }
      }
    }
    loadStatuses();

    // Load heritage statuses and reviews from LocalStorage
    try {
      const savedHStatuses = localStorage.getItem('history_camper_heritage_statuses');
      if (savedHStatuses) {
        setHeritageStatuses(JSON.parse(savedHStatuses));
      }
      const savedHReviews = localStorage.getItem('history_camper_heritage_reviews');
      if (savedHReviews) {
        setHeritageReviews(JSON.parse(savedHReviews));
      }
    } catch (e) {
      console.error("Failed to load heritage data from localStorage", e);
    }
  }, [deviceId]);

  // Toggle status
  const toggleStatus = async (campsiteId: string, targetStatus: 'planned' | 'visited') => {
    const currentStatus = campsiteStatuses[campsiteId];
    const isRemoving = currentStatus === targetStatus;

    const updated = { ...campsiteStatuses };
    if (isRemoving) {
      delete updated[campsiteId];
    } else {
      updated[campsiteId] = targetStatus;
    }

    setCampsiteStatuses(updated);
    localStorage.setItem('history_camper_statuses', JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        if (isRemoving) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('device_id', deviceId)
            .eq('campsite_id', campsiteId);
          if (error) throw error;
        } else {
          // If status existed before, update it. Otherwise, insert.
          if (currentStatus) {
            const { error } = await supabase
              .from('favorites')
              .update({ status: targetStatus })
              .eq('device_id', deviceId)
              .eq('campsite_id', campsiteId);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('favorites')
              .insert({
                device_id: deviceId,
                campsite_id: campsiteId,
                status: targetStatus
              });
            if (error) throw error;
          }
        }
      } catch (err) {
        console.error("Failed to update status in Supabase:", err);
      }
    }
  };

  // Heritage actions and quiz handlers
  const [editingHeritageId, setEditingHeritageId] = useState<string | null>(null);
  const [editingReviewText, setEditingReviewText] = useState<string>('');

  const handleHeritageStatusClick = (heritage: HeritageSite, targetStatus: 'planned' | 'visited') => {
    const current = heritageStatuses[heritage.id];
    if (current === targetStatus) {
      // Toggle off
      const updatedStatuses = { ...heritageStatuses };
      delete updatedStatuses[heritage.id];
      setHeritageStatuses(updatedStatuses);
      localStorage.setItem('history_camper_heritage_statuses', JSON.stringify(updatedStatuses));
      
      if (targetStatus === 'visited') {
        const updatedReviews = { ...heritageReviews };
        delete updatedReviews[heritage.id];
        setHeritageReviews(updatedReviews);
        localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
      }
      return;
    }
    
    // Otherwise trigger Quiz Modal
    setActiveQuizHeritage(heritage);
    setActiveQuizTargetStatus(targetStatus);
    setHeritageQuizAnswered(false);
    setHeritageQuizSelectedIdx(null);
    setHeritageQuizReviewText(heritageReviews[heritage.id] || '');
  };

  const handleHeritageQuizSubmit = (optionIdx: number) => {
    setHeritageQuizSelectedIdx(optionIdx);
    setHeritageQuizAnswered(true);
  };

  const handleHeritageQuizComplete = () => {
    if (!activeQuizHeritage || !activeQuizTargetStatus) return;

    // Update status
    const updatedStatuses = { ...heritageStatuses, [activeQuizHeritage.id]: activeQuizTargetStatus };
    setHeritageStatuses(updatedStatuses);
    localStorage.setItem('history_camper_heritage_statuses', JSON.stringify(updatedStatuses));

    // Update review if visited
    if (activeQuizTargetStatus === 'visited') {
      const updatedReviews = { ...heritageReviews };
      if (heritageQuizReviewText.trim()) {
        updatedReviews[activeQuizHeritage.id] = heritageQuizReviewText.trim();
      } else {
        delete updatedReviews[activeQuizHeritage.id];
      }
      setHeritageReviews(updatedReviews);
      localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
    }

    // Reset states
    setActiveQuizHeritage(null);
    setActiveQuizTargetStatus(null);
    setHeritageQuizAnswered(false);
    setHeritageQuizSelectedIdx(null);
    setHeritageQuizReviewText('');
  };

  const handleSaveEditedReview = (heritageId: string) => {
    const updatedReviews = { ...heritageReviews };
    if (editingReviewText.trim()) {
      updatedReviews[heritageId] = editingReviewText.trim();
    } else {
      delete updatedReviews[heritageId];
    }
    setHeritageReviews(updatedReviews);
    localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
    setEditingHeritageId(null);
  };

  const handleDeleteReview = (heritageId: string) => {
    if (window.confirm(i18n.language === 'ko' ? '후기를 삭제하시겠습니까?' : 'Are you sure you want to delete this review?')) {
      const updatedReviews = { ...heritageReviews };
      delete updatedReviews[heritageId];
      setHeritageReviews(updatedReviews);
      localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
    }
  };

  // Fetch Public campsites from Korea Tourism Organization Open API (with Local Proxy support)
  const fetchPublicCamps = async () => {
    if (publicCamps.length > 0) return;
    setLoadingPublicCamps(true);

    if (isGocampingConfigured) {
      try {
        const isDev = import.meta.env.DEV;
        // Use Vite Proxy in local dev mode to bypass CORS
        const baseUrl = isDev ? '/api-gocamping' : 'https://apis.data.go.kr';
        const url = `${baseUrl}/B551011/GoCamping/basedList?serviceKey=${gocampingApiKey}&numOfRows=1500&pageNo=1&MobileOS=ETC&MobileApp=historyCamper&_type=json`;

        console.log("Fetching GoCamping Public API:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const items = result?.response?.body?.items?.item;

        if (Array.isArray(items)) {
          // Filter Jeolla province (Jeonbuk + Jeannam)
          const filtered = items.filter((item: any) => {
            const doNm = item.doNm || '';
            return doNm.includes('전라') || doNm.includes('전북') || doNm.includes('전남');
          }).map((item: any) => ({
            id: `public-${item.contentId}`,
            name: item.facltNm,
            addr: item.addr1 || item.addr2 || '',
            lat: parseFloat(item.mapY),
            lng: parseFloat(item.mapX),
            tel: item.tel || '',
            induty: item.induty || '일반야영장',
            description: item.intro || item.lineIntro || '',
            resveCl: item.resveCl || '',
            resveUrl: item.resveUrl || ''
          })).filter((item: any) => !isNaN(item.lat) && !isNaN(item.lng));

          setPublicCamps(filtered);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Failed to load GoCamping API, falling back to mock Jeolla list:", err);
        setPublicCamps(MOCK_JEOLLA_CAMPS);
      } finally {
        setLoadingPublicCamps(false);
      }
    } else {
      // Fallback to local mock dataset if API key isn't provided
      setPublicCamps(MOCK_JEOLLA_CAMPS);
      setLoadingPublicCamps(false);
    }
  };

  // Automatically fetch public campsites on mount to populate the historical eras
  useEffect(() => {
    fetchPublicCamps();
  }, []);

  // Load Quiz Data
  useEffect(() => {
    async function loadQuizzes() {
      if (isSupabaseConfigured && supabase) {
        setLoadingQuizzes(true);
        try {
          const { data, error } = await supabase
            .from('quizzes')
            .select('*');
          if (error) throw error;
          
          if (data && data.length > 0) {
            const formatted = data.map((q: any) => ({
              ...q,
              options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]')
            })).sort((a: any, b: any) => (a.id || 0) - (b.id || 0));
            setQuizzes(formatted);
          } else {
            setQuizzes(i18n.language === 'en' ? MOCK_QUIZZES_EN : MOCK_QUIZZES_KO);
          }
        } catch (err) {
          console.error("Failed to load quizzes from Supabase, loading mock fallback:", err);
          setQuizzes(i18n.language === 'en' ? MOCK_QUIZZES_EN : MOCK_QUIZZES_KO);
        } finally {
          setLoadingQuizzes(false);
        }
      } else {
        setQuizzes(i18n.language === 'en' ? MOCK_QUIZZES_EN : MOCK_QUIZZES_KO);
      }
    }
    loadQuizzes();
  }, [i18n.language]);

  // Master merge displaying campsites - includes historical ones + ALL public campsites (dynamically matched to historical eras)
  const allDisplayCampsites = [...MASTER_CAMPSITES];
  
  const targetPublicSource = publicCamps.length > 0 ? publicCamps : MOCK_JEOLLA_CAMPS;
  
  targetPublicSource.forEach(found => {
    const publicId = found.id;
    if (!allDisplayCampsites.some(c => c.id === publicId)) {
      // Find the closest historical site to dynamically map the era
      let closestHeritage: any = null;
      let minDistance = 99999;
      
      MASTER_HERITAGES.forEach(h => {
        const dist = calculateHaversineDistance(found.lat, found.lng, h.lat, h.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestHeritage = h;
        }
      });

      // If the campground is within 30km of a historic site, associate it with that era!
      const isNearHistoric = closestHeritage && minDistance <= 30;
      const mappedEra = isNearHistoric ? closestHeritage.era : 'all';
      const heritageName = isNearHistoric ? (i18n.language === 'ko' ? t(closestHeritage.name) : closestHeritage.name) : '';
      
      const tags = [found.induty || (i18n.language === 'ko' ? '공공 캠핑장' : 'Public Camp')];
      if (isNearHistoric) {
        tags.push(`#${heritageName}`);
      } else {
        tags.push(i18n.language === 'ko' ? '공공 데이터' : 'Public Data');
      }

      allDisplayCampsites.push({
        id: found.id,
        name: found.name,
        description: found.addr,
        lat: found.lat,
        lng: found.lng,
        era: mappedEra,
        tags: tags,
        distanceToHistoric: isNearHistoric ? minDistance : 0,
        nearbyHeritageIds: isNearHistoric ? [closestHeritage.id] : [],
        resveCl: found.resveCl || '',
        resveUrl: found.resveUrl || ''
      });
    }
  });

  const selectedCampsite = allDisplayCampsites.find(c => c.id === selectedCampsiteId) || allDisplayCampsites[0];
  const nearbyHeritages = MASTER_HERITAGES.filter(h => selectedCampsite.nearbyHeritageIds.includes(h.id));

  // Path coordinates for polyline route starting at campground and drawing lines to historical landmarks
  const polylinePaths = nearbyHeritages.map(h => [
    { lat: selectedCampsite.lat, lng: selectedCampsite.lng },
    { lat: h.lat, lng: h.lng }
  ]);

  // Helper to determine if campsite is reservable
  const isCampsiteReservable = (camp: any) => {
    const cl = camp.resveCl || '';
    const url = camp.resveUrl || '';
    return (cl.trim() !== '' && cl !== '정보없음') || url.trim() !== '';
  };

  // Helper to render the reservation status badge
  const getReservationBadge = (camp: any) => {
    const cl = camp.resveCl || '';
    const url = camp.resveUrl || '';
    const isReservable = (cl.trim() !== '' && cl !== '정보없음') || url.trim() !== '';

    if (!isReservable) {
      return (
        <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', color: 'var(--red-accent)', borderColor: 'rgba(239, 68, 68, 0.15)', borderWidth: '1px', borderStyle: 'solid', display: 'inline-flex', alignItems: 'center', padding: '2px 6px', fontSize: '0.7rem' }}>
          ❌ {i18n.language === 'ko' ? '예약 정보없음' : 'No Booking'}
        </span>
      );
    }

    let method = cl;
    if (!method && url) {
      method = i18n.language === 'ko' ? '온라인' : 'Online';
    }

    return (
      <span className="badge" style={{ backgroundColor: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', borderColor: 'rgba(22, 101, 52, 0.15)', borderWidth: '1px', borderStyle: 'solid', display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px 6px', fontSize: '0.7rem' }}>
        📅 {i18n.language === 'ko' ? `예약 (${method})` : `Book (${method})`}
      </span>
    );
  };

  // Helper to render a campsite card
  const renderCampsiteCard = (campsite: any) => {
    return (
      <div key={campsite.id} className="card" style={{ marginBottom: 0, position: 'relative' }}>
        <div className="list-item" style={{ borderBottom: 'none', padding: 0 }}>
          <div className="list-icon historic" style={{ cursor: 'pointer' }} onClick={() => viewHeritageRoute(campsite.id)}>
            <Tent size={24} />
          </div>
          <div className="list-content" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div 
                className="list-title" 
                style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}
                onClick={() => viewHeritageRoute(campsite.id)}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                <span>{campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}</span>
                {getReservationBadge(campsite)}
              </div>
            </div>
            
            <div className="list-desc">
              {getCampsiteDistanceText(campsite)}
            </div>
            
            <div className="tag-container" style={{ marginTop: '6px' }}>
              {campsite.tags.map((tag: any, idx: number) => (
                <span key={idx} className={`badge ${tag.startsWith('#') ? 'gold' : ''}`}>{tag}</span>
              ))}
            </div>

            {/* Status buttons: [Plan to Visit] and [Visited] */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(campsite.id, 'planned');
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  border: campsiteStatuses[campsite.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                  background: campsiteStatuses[campsite.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
                  color: campsiteStatuses[campsite.id] === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)'
                }}
              >
                <span>📌</span>
                {t('era.status_planned')}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(campsite.id, 'visited');
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                  border: campsiteStatuses[campsite.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: campsiteStatuses[campsite.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'var(--surface)',
                  color: campsiteStatuses[campsite.id] === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)'
                }}
              >
                <span>✅</span>
                {t('era.status_visited')}
              </button>
            </div>

            {/* Reservation Links (Naver / Kakao) for Reservable Campsites */}
            {isCampsiteReservable(campsite) && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const queryName = campsite.id.startsWith('public-') ? campsite.name : t(campsite.name);
                    window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(queryName + ' 예약')}`, '_blank');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(22, 163, 74, 0.06)',
                    border: '1px solid rgba(22, 163, 74, 0.2)',
                    color: '#16a34a',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#16a34a';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(22, 163, 74, 0.06)';
                    e.currentTarget.style.color = '#16a34a';
                  }}
                >
                  <span>🔍</span>
                  {t('route.map.naver_booking')}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const queryName = campsite.id.startsWith('public-') ? campsite.name : t(campsite.name);
                    window.open(`https://map.kakao.com/?q=${encodeURIComponent(queryName)}`, '_blank');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(202, 138, 4, 0.06)',
                    border: '1px solid rgba(202, 138, 4, 0.2)',
                    color: '#ca8a04',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ca8a04';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(202, 138, 4, 0.06)';
                    e.currentTarget.style.color = '#ca8a04';
                  }}
                >
                  <span>📍</span>
                  {t('route.map.kakao_booking')}
                </button>
              </div>
            )}

            {/* Button to view dynamic heritage routes */}
            <button
              onClick={() => viewHeritageRoute(campsite.id)}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px',
                background: 'rgba(22, 101, 52, 0.06)',
                border: '1px solid rgba(22, 101, 52, 0.15)',
                color: 'var(--primary)',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(22, 101, 52, 0.06)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              <MapIcon size={14} />
              {t('era.view_heritage')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter and sort campsites based on distance to user (computed locally)
  const filteredCampsites = allDisplayCampsites.filter(c => {
    if (statusFilter !== 'all' && campsiteStatuses[c.id] !== statusFilter) {
      return false;
    }
    if (statusFilter === 'all' && activeEra !== 'all' && c.era !== activeEra) {
      return false;
    }
    if (showReservableOnly && !isCampsiteReservable(c)) {
      return false;
    }
    return true;
  });

  const sortedCampsites = [...filteredCampsites].sort((a, b) => {
    if (userLocation) {
      const distA = calculateHaversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateHaversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    }
    return 0;
  });

  // Center on selected campsite when it changes
  useEffect(() => {
    if (selectedCampsite) {
      setMapCenter({ lat: selectedCampsite.lat, lng: selectedCampsite.lng });
    }
  }, [selectedCampsiteId]);

  // Navigate to route tab and load clicked campsite
  const viewHeritageRoute = (campsiteId: string) => {
    setSelectedCampsiteId(campsiteId);
    setActiveTab('route');
  };

  // Request browser location permission and center map (client-side only, no server updates)
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(t('route.map.gps_error'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setMapCenter({ lat, lng });
        setGpsError(null);
      },
      (error) => {
        console.error("GPS retrieval error:", error);
        setGpsError(t('route.map.gps_error'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Helper text builder for campground cards to display local distance
  const getCampsiteDistanceText = (campsite: Campsite | any) => {
    if (userLocation) {
      const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, campsite.lat, campsite.lng);
      return t('route.map.distance_from_me', { distance: dist });
    }
    if (campsite.distanceToHistoric) {
      return t('era.distance_km', { distance: campsite.distanceToHistoric }) + ` (${i18n.language === 'ko' ? '유적지와의 거리' : 'to heritage'})`;
    }
    return campsite.description;
  };

  // Filtered Quiz List
  const filteredQuizzes = quizzes.filter(q => {
    const qEra = q.era?.toLowerCase() || '';
    const matchEra = filterEra === 'all' || qEra === filterEra.toLowerCase();
    
    const qRegion = q.region || '';
    const matchRegion = filterRegion === 'all' || 
      qRegion.toLowerCase().includes(filterRegion.toLowerCase()) || 
      (filterRegion === '전주' && qRegion.includes('Jeonju')) ||
      (filterRegion === '완주' && qRegion.includes('Wanju')) ||
      (filterRegion === '익산' && qRegion.includes('Iksan'));

    return matchEra && matchRegion;
  });

  // Quiz Mechanics
  const handleStartQuiz = () => {
    if (filteredQuizzes.length > 0) {
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setScore(0);
      setQuizState('playing');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);
    
    const currentQuestion = filteredQuizzes[currentQuestionIndex];
    if (optionIndex === currentQuestion.correct_option_index) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuizzes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      setQuizState('result');
    }
  };

  const handleRestartQuiz = () => {
    setQuizState('intro');
  };

  // Helper to determine empty state translation
  const getEmptyStateMessage = () => {
    if (statusFilter === 'planned') return t('era.empty_planned');
    if (statusFilter === 'visited') return t('era.empty_visited');
    return i18n.language === 'ko' ? '해당 조건의 캠핑지가 없습니다.' : 'No campsites matching current filters.';
  };

  return (
    <div className="app-container">
      <header className="top-header">
        <div className="header-title">
          <Tent size={22} className="text-primary" />
          {t('header.title')}
        </div>
        
        {/* Desktop Navigation Link Tabs */}
        <nav className="desktop-nav">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>{t('tabs.home')}</button>
          <button className={`nav-link ${activeTab === 'era' ? 'active' : ''}`} onClick={() => setActiveTab('era')}>{t('tabs.era')}</button>
          <button className={`nav-link ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}>{t('tabs.route')}</button>
          <button className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>{t('tabs.quiz')}</button>
          <button className={`nav-link ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>{t('tabs.safety')}</button>
        </nav>

        <button 
          className="lang-btn" 
          onClick={() => i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')}
        >
          {i18n.language === 'ko' ? 'EN' : 'KO'}
        </button>
      </header>

      <div className="scroll-area">
        {/* =========================================
            HOME (Curation Overview)
        ========================================= */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
              {t('home.title1')}<br />
              <span style={{ color: 'var(--primary)' }}>{t('home.title2')}</span>
            </h2>
            <p style={{ color: 'var(--surface-foreground)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {t('home.desc')}
            </p>

            <div className="home-grid">
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-title">
                  <Clock size={20} color="var(--primary)" />
                  {t('home.card1.title')}
                </div>
                <div className="card-text">
                  {t('home.card1.desc')}
                </div>
                <div className="tag-container">
                  <span className="badge"><Tent size={14}/> {t('home.card1.tag1')}</span>
                  <span className="badge gold"><Star size={14}/> {t('home.card1.tag2')}</span>
                </div>
              </div>

              <div className="card gold-accent" style={{ marginBottom: 0 }}>
                <div className="card-title">
                  <MapIcon size={20} color="var(--gold)" />
                  {t('home.card2.title')}
                </div>
                <div className="card-text">
                  {t('home.card2.desc')}
                </div>
              </div>

              <div className="card red-accent" style={{ marginBottom: 0 }}>
                <div className="card-title">
                  <ShieldCheck size={20} color="var(--red-accent)" />
                  {t('home.card3.title')}
                </div>
                <div className="card-text">
                  {t('home.card3.desc')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            ERA: 시대별 역사 캠핑지 매칭 & 상태 관리
        ========================================= */}
        {activeTab === 'era' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('era.title')}</h3>
            
            <div className="era-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {/* Category selector based on status */}
              <button
                className={`era-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('all');
                  setActiveEra('all');
                }}
              >
                {t('era.eras.all')}
              </button>

              <button
                className={`era-btn ${statusFilter === 'planned' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('planned');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  borderColor: statusFilter === 'planned' ? 'var(--gold)' : '',
                  backgroundColor: statusFilter === 'planned' ? 'rgba(217, 119, 6, 0.05)' : '',
                  color: statusFilter === 'planned' ? 'var(--gold)' : ''
                }}
              >
                <span>📌</span> {t('era.status_planned')}
              </button>

              <button
                className={`era-btn ${statusFilter === 'visited' ? 'active' : ''}`}
                onClick={() => {
                  setStatusFilter('visited');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  borderColor: statusFilter === 'visited' ? 'var(--primary)' : '',
                  backgroundColor: statusFilter === 'visited' ? 'rgba(22, 101, 52, 0.05)' : '',
                  color: statusFilter === 'visited' ? 'var(--primary)' : ''
                }}
              >
                <span>✅</span> {t('era.status_visited')}
              </button>

              {/* Show divider and Era selectors only when status is 'all' */}
              {statusFilter === 'all' && (
                <>
                  <div style={{ height: '20px', width: '1px', background: 'var(--border)', margin: '0 4px' }} />
                  {Eras.filter(e => e.id !== 'all').map(era => (
                    <button 
                      key={era.id} 
                      className={`era-btn ${activeEra === era.id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveEra(era.id);
                      }}
                    >
                      {era.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Filter and GPS bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary)' }}>
                <input 
                  type="checkbox" 
                  checked={showReservableOnly} 
                  onChange={(e) => setShowReservableOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                {t('route.map.reservable_only')}
              </label>

              <button
                onClick={handleFindMyLocation}
                style={{
                  padding: '6px 12px',
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--surface-foreground)'
                }}
              >
                <span>🎯</span>
                {userLocation 
                  ? (i18n.language === 'ko' ? '내 위치 기준 거리순 정렬됨' : 'Sorted by distance') 
                  : t('route.map.find_my_location')
                }
              </button>
            </div>

            {gpsError && activeTab === 'era' && (
              <div className="quiz-alert mock" style={{ marginBottom: '10px', background: 'rgba(185, 28, 28, 0.05)', borderColor: 'rgba(185, 28, 28, 0.15)', color: 'var(--red-accent)' }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '0.75rem' }}>{gpsError}</span>
              </div>
            )}

            {sortedCampsites.length > 0 ? (
              activeEra === 'all' && statusFilter === 'all' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {['baekje', 'later_baekje', 'goryeo', 'joseon', 'modern', 'all'].map(eraId => {
                    const eraCamps = sortedCampsites.filter(c => c.era === eraId);
                    if (eraCamps.length === 0) return null;
                    
                    const eraLabel = Eras.find(e => e.id === eraId)?.label || (i18n.language === 'ko' ? '일반' : 'General');
                    return (
                      <div key={eraId} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ 
                          fontSize: '1rem', 
                          fontWeight: 800, 
                          color: 'var(--primary)', 
                          borderLeft: '4px solid var(--primary)', 
                          paddingLeft: '8px',
                          marginTop: '0.5rem',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>⏳</span> {eraLabel} {i18n.language === 'ko' ? '시대 캠핑지' : 'Era Campsites'}
                          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--surface-foreground)' }}>({eraCamps.length})</span>
                        </h4>
                        <div className="era-grid">
                          {eraCamps.map(campsite => renderCampsiteCard(campsite))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="era-grid">
                  {sortedCampsites.map(campsite => renderCampsiteCard(campsite))}
                </div>
              )
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', marginBottom: 0 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {statusFilter === 'planned' ? '📌' : statusFilter === 'visited' ? '✅' : '⛺'}
                </div>
                <div className="card-title" style={{ justifyContent: 'center', fontSize: '1rem', color: 'var(--surface-foreground)', marginBottom: '0.5rem' }}>
                  {statusFilter !== 'all' ? t(`era.status_${statusFilter}`) : t('era.title')}
                </div>
                <div className="card-text" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {getEmptyStateMessage()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            ROUTE: 도슨트 맞춤형 방문 경로 & KAKAO MAP (Dynamic Integration)
        ========================================= */}
        {activeTab === 'route' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('route.title')}</h3>
            
            {/* Open API Toggle controller */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={showPublicCamps} 
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowPublicCamps(checked);
                      if (checked) {
                        fetchPublicCamps();
                      }
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  {t('route.map.load_public')}
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--primary)' }}>
                  <input 
                    type="checkbox" 
                    checked={showReservableOnly} 
                    onChange={(e) => setShowReservableOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  {t('route.map.reservable_only')}
                </label>
              </div>

              {/* Local GPS Finder button */}
              <button
                onClick={handleFindMyLocation}
                style={{
                  padding: '8px 12px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = ''}
              >
                <span>🎯</span>
                {t('route.map.find_my_location')}
              </button>
            </div>

            {loadingPublicCamps && (
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} className="animate-spin" /> {i18n.language === 'ko' ? '공공 캠핑장 API 데이터를 불러오는 중...' : 'Loading public api campsites...'}
              </div>
            )}

            {/* API key fallback alert */}
            {showPublicCamps && !isGocampingConfigured && (
              <div className="quiz-alert mock" style={{ marginBottom: '10px', marginTop: 0 }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{t('route.map.api_key_alert')}</span>
              </div>
            )}

            {/* GPS permissions error */}
            {gpsError && (
              <div className="quiz-alert mock" style={{ marginBottom: '10px', marginTop: 0, background: 'rgba(185, 28, 28, 0.05)', borderColor: 'rgba(185, 28, 28, 0.15)', color: 'var(--red-accent)' }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '0.75rem' }}>{gpsError}</span>
              </div>
            )}

            <div className="route-layout">
              {/* KAKAO MAP COMPONENT */}
              <div className="route-map-container">
                <Map
                  center={mapCenter}
                  style={{ width: "100%", height: "100%" }}
                  level={selectedCampsiteId.startsWith('public-') || showPublicCamps ? 9 : (selectedCampsiteId === 'mireuksa' ? 6 : 8)}
                >
                  {/* Selected Campsite Marker */}
                  <MapMarker 
                    position={{ lat: selectedCampsite.lat, lng: selectedCampsite.lng }}
                    image={{
                      src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                      size: { width: 24, height: 35 }
                    }}
                  >
                    <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", borderRadius: "4px", fontWeight: "bold" }}>
                      ⛺ {selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name)}
                    </div>
                  </MapMarker>
                  
                  {/* Dynamic Nearby Heritage Markers (Only render if there are matching ones) */}
                  {nearbyHeritages.map(heritage => (
                    <MapMarker key={heritage.id} position={{ lat: heritage.lat, lng: heritage.lng }}>
                      <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", fontWeight: 'bold' }}>
                        🏛️ {t(heritage.name)}
                      </div>
                    </MapMarker>
                  ))}

                  {/* Render user's local GPS coordinates marker (Does NOT leave device memory) */}
                  {userLocation && (
                    <MapMarker
                      position={userLocation}
                      image={{
                        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                        size: { width: 24, height: 35 }
                      }}
                    >
                      <div style={{ padding: "3px 6px", color: "var(--primary)", fontSize: "0.75rem", textAlign: "center", fontWeight: "bold" }}>
                        📍 {t('route.map.my_location')}
                      </div>
                    </MapMarker>
                  )}

                  {/* Render public campsites markers from Open API if enabled */}
                  {showPublicCamps && publicCamps
                    .filter(camp => camp.id !== selectedCampsite.id)
                    .filter(camp => !showReservableOnly || isCampsiteReservable(camp))
                    .map(camp => (
                    <MapMarker
                      key={camp.id}
                      position={{ lat: camp.lat, lng: camp.lng }}
                      onClick={() => {
                        setActiveInfoWindowCampId(camp.id);
                      }}
                    >
                      {activeInfoWindowCampId === camp.id && (
                        <div style={{ 
                          padding: '10px', 
                          minWidth: '240px', 
                          background: 'white', 
                          borderRadius: '12px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          fontSize: '0.8rem',
                          color: '#333',
                          zIndex: 99999
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>{camp.name}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveInfoWindowCampId(null);
                              }}
                              style={{ background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#999', padding: '2px' }}
                            >
                              ✕
                            </button>
                          </div>
                          <div style={{ marginBottom: '6px', lineHeight: 1.4 }}>
                            <strong>📍 {t('route.map.address')}:</strong> {camp.addr}
                          </div>
                          {camp.tel && (
                            <div style={{ marginBottom: '6px', lineHeight: 1.4 }}>
                              <strong>📞 {t('route.map.tel')}:</strong> {camp.tel}
                            </div>
                          )}
                          {camp.induty && (
                            <div style={{ marginBottom: '6px', lineHeight: 1.4 }}>
                              <strong>⛺ {t('route.map.induty')}:</strong> {camp.induty}
                            </div>
                          )}
                          <div style={{ marginBottom: '6px', lineHeight: 1.4 }}>
                            <strong>📅 {i18n.language === 'ko' ? '예약 방법' : 'Reservation'}:</strong> {camp.resveCl || (camp.resveUrl ? (i18n.language === 'ko' ? '온라인' : 'Online') : (i18n.language === 'ko' ? '정보없음' : 'No Info'))}
                          </div>
                          {isCampsiteReservable(camp) && (
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(camp.name + ' 예약')}`, '_blank');
                                }}
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  background: 'rgba(22, 163, 74, 0.08)',
                                  border: '1px solid rgba(22, 163, 74, 0.2)',
                                  color: '#16a34a',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                {t('route.map.naver_booking')}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://map.kakao.com/?q=${encodeURIComponent(camp.name)}`, '_blank');
                                }}
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  background: 'rgba(202, 138, 4, 0.08)',
                                  border: '1px solid rgba(202, 138, 4, 0.2)',
                                  color: '#ca8a04',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                {t('route.map.kakao_booking')}
                              </button>
                            </div>
                          )}
                          
                          {/* Bookmarking / Status selection inside InfoWindow */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatus(camp.id, 'planned');
                              }}
                              style={{
                                flex: 1,
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: campsiteStatuses[camp.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                background: campsiteStatuses[camp.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'white',
                                color: campsiteStatuses[camp.id] === 'planned' ? 'var(--gold)' : '#555'
                              }}
                            >
                              📌 {t('era.status_planned')}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStatus(camp.id, 'visited');
                              }}
                              style={{
                                flex: 1,
                                padding: '6px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: campsiteStatuses[camp.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: campsiteStatuses[camp.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'white',
                                color: campsiteStatuses[camp.id] === 'visited' ? 'var(--primary)' : '#555'
                              }}
                            >
                              ✅ {t('era.status_visited')}
                            </button>
                          </div>
                        </div>
                      )}
                    </MapMarker>
                  ))}

                  {/* Draw connection route lines */}
                  {polylinePaths.map((path, idx) => (
                    <Polyline
                      key={idx}
                      path={[path]}
                      strokeWeight={4}
                      strokeColor={"#166534"}
                      strokeOpacity={0.8}
                      strokeStyle={"dashed"}
                    />
                  ))}
                </Map>
              </div>

              <div className="card gold-accent route-info-container" style={{ marginBottom: 0 }}>
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="var(--gold)"/>
                    {t('route.card.title', { campsiteName: selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name) })}
                  </div>
                  
                  {/* Quick toggle statuses in the map detail panel */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => toggleStatus(selectedCampsite.id, 'planned')}
                      style={{
                        padding: '4px 8px',
                        background: campsiteStatuses[selectedCampsite.id] === 'planned' ? 'var(--gold)' : 'none',
                        color: campsiteStatuses[selectedCampsite.id] === 'planned' ? 'white' : 'var(--surface-foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title={t('era.status_planned')}
                    >
                      📌
                    </button>
                    <button
                      onClick={() => toggleStatus(selectedCampsite.id, 'visited')}
                      style={{
                        padding: '4px 8px',
                        background: campsiteStatuses[selectedCampsite.id] === 'visited' ? 'var(--primary)' : 'none',
                        color: campsiteStatuses[selectedCampsite.id] === 'visited' ? 'white' : 'var(--surface-foreground)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title={t('era.status_visited')}
                    >
                      ✅
                    </button>
                  </div>
                </div>
                
                <div className="card-text">
                  {t('route.card.desc', { campsiteName: selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name) })}
                </div>

                {/* Show reservation info badge & button in route details */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px', marginBottom: '5px' }}>
                  {getReservationBadge(selectedCampsite)}
                  {isCampsiteReservable(selectedCampsite) && (
                    <>
                      <button
                        onClick={() => {
                          const queryName = selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name);
                          window.open(`https://search.naver.com/search.naver?query=${encodeURIComponent(queryName + ' 예약')}`, '_blank');
                        }}
                        style={{
                          padding: '2px 8px',
                          background: 'none',
                          border: '1px solid #16a34a',
                          color: '#16a34a',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>🔍</span> {t('route.map.naver_booking')}
                      </button>
                      
                      <button
                        onClick={() => {
                          const queryName = selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name);
                          window.open(`https://map.kakao.com/?q=${encodeURIComponent(queryName)}`, '_blank');
                        }}
                        style={{
                          padding: '2px 8px',
                          background: 'none',
                          border: '1px solid #ca8a04',
                          color: '#ca8a04',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>📍</span> {t('route.map.kakao_booking')}
                      </button>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => window.open(`https://map.kakao.com/link/to/${selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name)},${selectedCampsite.lat},${selectedCampsite.lng}`)}
                  style={{ width: '100%', padding: '12px', marginTop: '1rem', marginBottom: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Navigation size={18} />
                  {t('route.card.btn')}
                </button>

                <div className="timeline">
                  {/* Campground Check-in step */}
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="time">DAY 1 - 14:00</div>
                      <div className="title">
                        {selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name)} {i18n.language === 'ko' ? '체크인' : 'Check-in'}
                      </div>
                      <div className="desc">
                        {selectedCampsite.id.startsWith('public-') ? selectedCampsite.description : t(selectedCampsite.description)}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic heritage steps (Only show if this campsite has preconfigured historical sites) */}
                  {nearbyHeritages.length > 0 ? (
                    nearbyHeritages.map((heritage, index) => (
                      <div className="timeline-item" key={heritage.id}>
                        <div className="timeline-dot" style={{
                          background: heritageStatuses[heritage.id] === 'visited' ? 'var(--primary)' : (heritageStatuses[heritage.id] === 'planned' ? 'var(--gold)' : 'var(--border)')
                        }}></div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                            <div>
                              <div className="time">
                                {index === 0 ? "DAY 1 - 16:00" : `DAY 2 - 10:00`}
                              </div>
                              <div className="title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span>{t(heritage.name)}</span>
                                {heritageStatuses[heritage.id] === 'planned' && (
                                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(217, 119, 6, 0.1)', color: 'var(--gold)', border: '1px solid rgba(217, 119, 6, 0.2)', borderRadius: '4px', fontWeight: 'bold' }}>
                                    📌 {t('era.status_planned')}
                                  </span>
                                )}
                                {heritageStatuses[heritage.id] === 'visited' && (
                                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(22, 101, 52, 0.1)', color: 'var(--primary)', border: '1px solid rgba(22, 101, 52, 0.2)', borderRadius: '4px', fontWeight: 'bold' }}>
                                    ✅ {t('era.status_visited')}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Toggle buttons */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleHeritageStatusClick(heritage, 'planned')}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  border: heritageStatuses[heritage.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                  background: heritageStatuses[heritage.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
                                  color: heritageStatuses[heritage.id] === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)'
                                }}
                                title={i18n.language === 'ko' ? '갈 예정 등록 (역사 퀴즈)' : 'Register Planned (History Quiz)'}
                              >
                                📌 {i18n.language === 'ko' ? '갈 예정' : 'Plan'}
                              </button>
                              <button
                                onClick={() => handleHeritageStatusClick(heritage, 'visited')}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  border: heritageStatuses[heritage.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                  background: heritageStatuses[heritage.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'var(--surface)',
                                  color: heritageStatuses[heritage.id] === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)'
                                }}
                                title={i18n.language === 'ko' ? '갔다옴 등록 (역사 퀴즈 및 후기)' : 'Register Visited (History Quiz & Review)'}
                              >
                                ✅ {i18n.language === 'ko' ? '갔다옴' : 'Visited'}
                              </button>
                            </div>
                          </div>
                          
                          <div className="desc" style={{ marginTop: '6px' }}>{t(heritage.description)}</div>

                          {/* Review display/edit section */}
                          {heritageStatuses[heritage.id] === 'visited' && (
                            <div className="heritage-review-box">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  📝 {i18n.language === 'ko' ? '나의 탐방 후기' : 'My Visit Review'}
                                </span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {editingHeritageId === heritage.id ? (
                                    <>
                                      <button 
                                        onClick={() => handleSaveEditedReview(heritage.id)}
                                        style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                      >
                                        {i18n.language === 'ko' ? '저장' : 'Save'}
                                      </button>
                                      <button 
                                        onClick={() => setEditingHeritageId(null)}
                                        style={{ border: 'none', background: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                      >
                                        {i18n.language === 'ko' ? '취소' : 'Cancel'}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => {
                                          setEditingHeritageId(heritage.id);
                                          setEditingReviewText(heritageReviews[heritage.id] || '');
                                        }}
                                        style={{ border: 'none', background: 'none', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                      >
                                        {i18n.language === 'ko' ? '수정' : 'Edit'}
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteReview(heritage.id)}
                                        style={{ border: 'none', background: 'none', color: 'var(--red-accent)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                      >
                                        {i18n.language === 'ko' ? '삭제' : 'Delete'}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {editingHeritageId === heritage.id ? (
                                <textarea
                                  value={editingReviewText}
                                  onChange={(e) => setEditingReviewText(e.target.value)}
                                  className="heritage-review-textarea"
                                  placeholder={i18n.language === 'ko' ? '이 유적지에 대한 탐방 후기를 작성해 보세요.' : 'Write your review about this historic site.'}
                                />
                              ) : (
                                <p style={{ fontSize: '0.85rem', color: 'var(--foreground)', fontStyle: heritageReviews[heritage.id] ? 'normal' : 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                  {heritageReviews[heritage.id] || (i18n.language === 'ko' ? '작성된 후기가 없습니다. [수정]을 눌러 등록해 보세요!' : 'No review written. Click [Edit] to write one!')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="timeline-item">
                      <div className="timeline-dot" style={{ background: 'var(--border)' }}></div>
                      <div className="timeline-content">
                        <div className="time">DAY 1 - 16:00</div>
                        <div className="title">{i18n.language === 'ko' ? '자유 캠핑 및 힐링' : 'Free Camping & Relaxation'}</div>
                        <div className="desc">
                          {i18n.language === 'ko' 
                            ? '특별히 지정된 주변 역사 연계 코스가 없는 일반 야영지입니다. 자연 속에서 편안한 캠핑을 즐겨보세요.' 
                            : 'This is a general public campsite without pre-configured historical routes. Enjoy cozy camping in nature.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            QUIZ: 역사 탐방 퀴즈 탭
        ========================================= */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t('quiz.title')}</h3>
            <p style={{ color: 'var(--surface-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t('quiz.subtitle')}</p>

            {/* Connection Status Banner */}
            {isSupabaseConfigured ? (
              <div className="quiz-alert supabase">
                <Database size={16} />
                <span>{t('quiz.supabase_alert')}</span>
              </div>
            ) : (
              <div className="quiz-alert mock">
                <AlertCircle size={16} />
                <span>{t('quiz.mock_alert')}</span>
              </div>
            )}

            {loadingQuizzes ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Clock size={36} className="text-primary animate-spin" style={{ margin: '0 auto 1rem' }} />
                <div>Loading Quizzes...</div>
              </div>
            ) : (
              <>
                {/* 1. INTRO STATE */}
                {quizState === 'intro' && (
                  <div className="card">
                    <div className="card-title">
                      <Award size={20} color="var(--primary)" />
                      {i18n.language === 'ko' ? '퀴즈 필터 설정' : 'Quiz Filter Setup'}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                          {t('quiz.era_select')}
                        </label>
                        <select className="quiz-filter-select" value={filterEra} onChange={e => setFilterEra(e.target.value)}>
                          <option value="all">{t('quiz.all')}</option>
                          <option value="joseon">{t('era.eras.joseon')}</option>
                          <option value="baekje">{t('era.eras.baekje')}</option>
                          <option value="goryeo">{t('era.eras.goryeo')}</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                          {t('quiz.region_select')}
                        </label>
                        <select className="quiz-filter-select" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
                          <option value="all">{t('quiz.all')}</option>
                          <option value="전주">{i18n.language === 'ko' ? '전주' : 'Jeonju'}</option>
                          <option value="완주">{i18n.language === 'ko' ? '완주' : 'Wanju'}</option>
                          <option value="익산">{i18n.language === 'ko' ? '익산' : 'Iksan'}</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ margin: '1.5rem 0 1rem', fontSize: '0.95rem', color: 'var(--foreground)', fontWeight: 600, textAlign: 'center' }}>
                      {i18n.language === 'ko' 
                        ? `총 ${filteredQuizzes.length}개의 퀴즈가 필터링되었습니다.` 
                        : `${filteredQuizzes.length} quizzes found for these filters.`}
                    </div>

                    <button 
                      className="lang-btn" 
                      style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'block', marginTop: '1.5rem' }}
                      onClick={handleStartQuiz}
                      disabled={filteredQuizzes.length === 0}
                    >
                      {t('quiz.start')}
                    </button>
                  </div>
                )}

                {/* 2. PLAYING STATE */}
                {quizState === 'playing' && filteredQuizzes.length > 0 && (
                  <div>
                    {/* Progress indicator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                      <span style={{ color: 'var(--primary)' }}>
                        {i18n.language === 'ko' ? `문제 ${currentQuestionIndex + 1} / ${filteredQuizzes.length}` : `Question ${currentQuestionIndex + 1} of ${filteredQuizzes.length}`}
                      </span>
                      <span style={{ color: 'var(--gold)' }}>
                        {i18n.language === 'ko' ? `맞춘 개수: ${score}` : `Correct: ${score}`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          background: 'var(--primary)', 
                          width: `${((currentQuestionIndex + 1) / filteredQuizzes.length) * 100}%`,
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </div>

                    <div className="card">
                      {/* Question Text */}
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                        {filteredQuizzes[currentQuestionIndex].question}
                      </h4>

                      {/* Options List */}
                      <div>
                        {filteredQuizzes[currentQuestionIndex].options.map((option, idx) => {
                          const isCorrect = idx === filteredQuizzes[currentQuestionIndex].correct_option_index;
                          const isSelected = idx === selectedOptionIndex;
                          
                          let btnClass = "quiz-option-btn";
                          if (isAnswered) {
                            if (isSelected) {
                              btnClass += isCorrect ? " correct" : " incorrect";
                            } else if (isCorrect) {
                              btnClass += " reveal-correct";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              className={btnClass}
                              disabled={isAnswered}
                              onClick={() => handleSelectOption(idx)}
                            >
                              <span style={{ marginRight: '8px', opacity: 0.5 }}>{idx + 1}.</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {isAnswered && (
                        <div 
                          className="animate-fade-in" 
                          style={{ 
                            marginTop: '1.5rem', 
                            padding: '1.25rem', 
                            borderRadius: '12px', 
                            background: selectedOptionIndex === filteredQuizzes[currentQuestionIndex].correct_option_index ? 'rgba(22, 101, 52, 0.05)' : 'rgba(185, 28, 28, 0.05)',
                            border: `1px solid ${selectedOptionIndex === filteredQuizzes[currentQuestionIndex].correct_option_index ? 'rgba(22, 101, 52, 0.15)' : 'rgba(185, 28, 28, 0.15)'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, marginBottom: '6px', fontSize: '0.95rem', color: selectedOptionIndex === filteredQuizzes[currentQuestionIndex].correct_option_index ? 'var(--primary)' : 'var(--red-accent)' }}>
                            {selectedOptionIndex === filteredQuizzes[currentQuestionIndex].correct_option_index ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <XCircle size={18} />
                            )}
                            {selectedOptionIndex === filteredQuizzes[currentQuestionIndex].correct_option_index ? t('quiz.correct') : t('quiz.incorrect')}
                          </div>
                          
                          <p style={{ fontSize: '0.85rem', color: 'var(--surface-foreground)', lineHeight: 1.5 }}>
                            {filteredQuizzes[currentQuestionIndex].explanation}
                          </p>

                          <button 
                            className="lang-btn" 
                            style={{ width: '100%', padding: '10px', marginTop: '1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                            onClick={handleNextQuestion}
                          >
                            {currentQuestionIndex < filteredQuizzes.length - 1 ? t('quiz.next') : (i18n.language === 'ko' ? '결과 보기' : 'Show Result')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. RESULT STATE */}
                {quizState === 'result' && (
                  <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                    <Award size={48} color="var(--gold)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                    
                    <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                      {t('quiz.result')}
                    </h4>
                    
                    <div style={{ fontSize: '1.05rem', color: 'var(--surface-foreground)', margin: '1rem 0 2rem' }}>
                      {t('quiz.score', { total: filteredQuizzes.length, score: score })}
                    </div>

                    <button 
                      className="lang-btn" 
                      style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
                      onClick={handleRestartQuiz}
                    >
                      {t('quiz.restart')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* =========================================
            SAFETY: 실시간 안전 및 편의 정보 통합 (Dynamic Selected Campsite)
        ========================================= */}
        {activeTab === 'safety' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('safety.title')}</h3>
            
            <div className="safety-grid">
              <div className="card red-accent" style={{ marginBottom: 0 }}>
                <div className="card-title">
                  <Tent size={20} color="var(--red-accent)"/>
                  {selectedCampsite.id.startsWith('public-') ? selectedCampsite.name : t(selectedCampsite.name)} {i18n.language === 'ko' ? '안전 정보' : 'Safety Info'}
                </div>
                <div className="list-item">
                  <div className="list-icon safety"><Flame size={20} /></div>
                  <div className="list-content">
                    <div className="list-title">{t('safety.card1.list1.title')}</div>
                    <div className="list-desc">{t('safety.card1.list1.desc')}</div>
                    <span className="badge red" style={{marginTop: '4px'}}>{t('safety.card1.list1.tag')}</span>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-icon safety"><Info size={20} /></div>
                  <div className="list-content">
                    <div className="list-title">{t('safety.card1.list2.title')}</div>
                    <div className="list-desc" dangerouslySetInnerHTML={{ __html: t('safety.card1.list2.desc') }} />
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-title">
                  <Compass size={20} color="var(--primary)"/>
                  {i18n.language === 'ko' ? '주변 유적지 관람 정보' : 'Nearby Heritage Info'}
                </div>
                <div className="list-item">
                  <div className="list-icon"><Clock size={20} /></div>
                  <div className="list-content">
                    <div className="list-title">{t('safety.card2.list1.title')}</div>
                    <div className="list-desc">{t('safety.card2.list1.desc')}</div>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-icon"><Accessibility size={20} /></div>
                  <div className="list-content">
                    <div className="list-title">{t('safety.card2.list2.title')}</div>
                    <div className="list-desc">{t('safety.card2.list2.desc')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Compass /><span>{t('tabs.home')}</span></button>
        <button className={`nav-item ${activeTab === 'era' ? 'active' : ''}`} onClick={() => setActiveTab('era')}><Clock /><span>{t('tabs.era')}</span></button>
        <button className={`nav-item ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}><MapPin /><span>{t('tabs.route')}</span></button>
        <button className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}><Award /><span>{t('tabs.quiz')}</span></button>
        <button className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}><ShieldCheck /><span>{t('tabs.safety')}</span></button>
      </nav>

      {/* Heritage Quiz & Review Modal overlay */}
      {activeQuizHeritage && activeQuizTargetStatus && (() => {
        const quizObj = HERITAGE_QUIZZES[activeQuizHeritage.id];
        if (!quizObj) return null;
        const quiz = i18n.language === 'ko' ? quizObj.ko : quizObj.en;
        return (
          <div className="modal-backdrop" onClick={() => {
            setActiveQuizHeritage(null);
            setActiveQuizTargetStatus(null);
          }}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  {activeQuizTargetStatus === 'visited' 
                    ? (i18n.language === 'ko' ? '방문 인증 역사 퀴즈' : 'Visit Verification History Quiz')
                    : (i18n.language === 'ko' ? '여행 계획 역사 퀴즈' : 'Travel Plan History Quiz')
                  }
                </div>
                <button className="modal-close-btn" onClick={() => {
                  setActiveQuizHeritage(null);
                  setActiveQuizTargetStatus(null);
                }}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-quiz-meta">
                {t(activeQuizHeritage.name)}
              </div>
              <div className="modal-quiz-question">
                {quiz.question}
              </div>
              
              <div className="modal-quiz-options">
                {quiz.options.map((option, idx) => {
                  const isCorrect = idx === quiz.correct_option_index;
                  const isSelected = idx === heritageQuizSelectedIdx;
                  
                  let btnClass = "quiz-option-btn";
                  if (heritageQuizAnswered) {
                    if (isSelected) {
                      btnClass += isCorrect ? " correct" : " incorrect";
                    } else if (isCorrect) {
                      btnClass += " reveal-correct";
                    }
                  }
                  
                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      disabled={heritageQuizAnswered}
                      onClick={() => handleHeritageQuizSubmit(idx)}
                    >
                      <span style={{ marginRight: '8px', opacity: 0.5 }}>{idx + 1}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>
              
              {heritageQuizAnswered && (
                <div className={`modal-quiz-feedback ${heritageQuizSelectedIdx === quiz.correct_option_index ? 'correct' : 'incorrect'}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, marginBottom: '6px', fontSize: '0.95rem', color: heritageQuizSelectedIdx === quiz.correct_option_index ? 'var(--primary)' : 'var(--red-accent)' }}>
                    {heritageQuizSelectedIdx === quiz.correct_option_index ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {heritageQuizSelectedIdx === quiz.correct_option_index 
                      ? (i18n.language === 'ko' ? '정답입니다!' : 'Correct!') 
                      : (i18n.language === 'ko' ? '오답입니다.' : 'Incorrect')
                    }
                  </div>
                  
                  <p style={{ fontSize: '0.85rem', color: 'var(--surface-foreground)', lineHeight: 1.5 }}>
                    {quiz.explanation}
                  </p>
                  
                  {/* If visited flow, show review form. Otherwise, just show complete button */}
                  {activeQuizTargetStatus === 'visited' ? (
                    <div className="modal-review-form">
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)', display: 'block', marginBottom: '8px' }}>
                        📝 {i18n.language === 'ko' ? '나의 탐방 후기 작성 (선택사항)' : 'Write Visit Review (Optional)'}
                      </label>
                      <textarea
                        value={heritageQuizReviewText}
                        onChange={(e) => setHeritageQuizReviewText(e.target.value)}
                        className="heritage-review-textarea"
                        placeholder={i18n.language === 'ko' 
                          ? '유적지를 방문하고 느낀 점이나 역사적 배경에 대한 감상을 적어보세요.' 
                          : 'Write your thoughts or impressions about visiting this historic site.'
                        }
                      />
                      <button 
                        className="lang-btn" 
                        style={{ width: '100%', padding: '12px', marginTop: '1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                        onClick={handleHeritageQuizComplete}
                      >
                        {i18n.language === 'ko' ? '저장 및 완료' : 'Save and Complete'}
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="lang-btn" 
                      style={{ width: '100%', padding: '12px', marginTop: '1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                      onClick={handleHeritageQuizComplete}
                    >
                      {i18n.language === 'ko' ? '확인 및 계획 등록' : 'Confirm & Register Plan'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  )
}

export default App
