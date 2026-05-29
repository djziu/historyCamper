import { useState, useEffect } from 'react'
import { Tent, Compass, Map as MapIcon, ShieldCheck, MapPin, Clock, Star, Award, CheckCircle2, XCircle, AlertCircle, Database, X, BookOpen } from 'lucide-react'
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
    tags: ['안전점검 완료', '#송광사', '#마이산탑사', '#화암사'],
    distanceToHistoric: 4.1,
    nearbyHeritageIds: ['songgwangsa', 'byeokgolje', 'maisan_tapsa', 'hwaamsa', 'jeoksangsanseong'],
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
    tags: ['거리순 1위', '#경기전', '#풍남문', '#오목대', '#전주향교'],
    distanceToHistoric: 0.5,
    nearbyHeritageIds: ['gyeonggijeon', 'omokdae', 'pungnammun', 'jeonju_hyanggyo'],
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
    tags: ['공기 맑음', '조용한 분위기', '#광한루원', '#만인의총'],
    distanceToHistoric: 3.1,
    nearbyHeritageIds: ['gwanghallu', 'maninui_chong'],
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
    tags: ['안전점검 완료', '유적지 근접', '#미륵사지', '#쌍릉'],
    distanceToHistoric: 6.7,
    nearbyHeritageIds: ['mireuksa_site', 'wanggungri', 'ssangneung'],
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
    tags: ['호수뷰', '도심 인접', '#동고산성', '#전주향교'],
    distanceToHistoric: 3.3,
    nearbyHeritageIds: ['donggosanseong', 'seungamsan_fortress', 'jeonju_hyanggyo'],
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
    tags: ['자연 친화적', '계곡 인근', '#금산사', '#황토현전적지'],
    distanceToHistoric: 0.2,
    nearbyHeritageIds: ['geumsansa', 'byeokgolje', 'hwangtojae', 'museongseowon', 'pihyangjeong'],
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
    tags: ['생태공원 인접', '#석조여래입상', '#쌍릉'],
    distanceToHistoric: 1.9,
    nearbyHeritageIds: ['godori_buddha', 'ssangneung'],
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
    tags: ['생태탐방', '지리산 인접', '#만복사지', '#실상사'],
    distanceToHistoric: 14.5,
    nearbyHeritageIds: ['manboksa_site', 'silsangsa', 'sangiam'],
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
    tags: ['가족캠핑 추천', '#근대역사박물관', '#히로쓰가옥', '#내소사', '#선운사'],
    distanceToHistoric: 7.8,
    nearbyHeritageIds: ['modern_museum', 'hirotsu_house', 'naesosa', 'seonunsa', 'gochang_eupseong', 'gochang_dolmen'],
    resveCl: '온라인야영장예약,전화',
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
    id: 'gochang_dolmen',
    name: 'heritages.gochang_dolmen.name',
    description: 'heritages.gochang_dolmen.desc',
    lat: 35.4478,
    lng: 126.6496,
    era: 'prehistoric'
  },
  {
    id: 'gochang_eupseong',
    name: 'heritages.gochang_eupseong.name',
    description: 'heritages.gochang_eupseong.desc',
    lat: 35.4332,
    lng: 126.7042,
    era: 'joseon'
  },
  {
    id: 'museongseowon',
    name: 'heritages.museongseowon.name',
    description: 'heritages.museongseowon.desc',
    lat: 35.6174,
    lng: 126.9604,
    era: 'joseon'
  },
  {
    id: 'naesosa',
    name: 'heritages.naesosa.name',
    description: 'heritages.naesosa.desc',
    lat: 35.6322,
    lng: 126.5828,
    era: 'joseon'
  },
  {
    id: 'byeokgolje',
    name: 'heritages.byeokgolje.name',
    description: 'heritages.byeokgolje.desc',
    lat: 35.7915,
    lng: 126.8522,
    era: 'baekje'
  },
  {
    id: 'jeoksangsanseong',
    name: 'heritages.jeoksangsanseong.name',
    description: 'heritages.jeoksangsanseong.desc',
    lat: 35.9734,
    lng: 127.6712,
    era: 'joseon'
  },
  {
    id: 'pihyangjeong',
    name: 'heritages.pihyangjeong.name',
    description: 'heritages.pihyangjeong.desc',
    lat: 35.6985,
    lng: 126.8672,
    era: 'joseon'
  },
  {
    id: 'silsangsa',
    name: 'heritages.silsangsa.name',
    description: 'heritages.silsangsa.desc',
    lat: 35.3934,
    lng: 127.6255,
    era: 'goryeo'
  },
  {
    id: 'ssangneung',
    name: 'heritages.ssangneung.name',
    description: 'heritages.ssangneung.desc',
    lat: 35.9812,
    lng: 127.0585,
    era: 'baekje'
  },
  {
    id: 'sangiam',
    name: 'heritages.sangiam.name',
    description: 'heritages.sangiam.desc',
    lat: 35.6322,
    lng: 127.4215,
    era: 'goryeo'
  },
  {
    id: 'maisan_tapsa',
    name: 'heritages.maisan_tapsa.name',
    description: 'heritages.maisan_tapsa.desc',
    lat: 35.7624,
    lng: 127.4208,
    era: 'joseon'
  },
  {
    id: 'jeonju_hyanggyo',
    name: 'heritages.jeonju_hyanggyo.name',
    description: 'heritages.jeonju_hyanggyo.desc',
    lat: 35.8122,
    lng: 127.1555,
    era: 'joseon'
  },
  {
    id: 'hwangtojae',
    name: 'heritages.hwangtojae.name',
    description: 'heritages.hwangtojae.desc',
    lat: 35.6980,
    lng: 126.8152,
    era: 'joseon'
  },
  {
    id: 'seonunsa',
    name: 'heritages.seonunsa.name',
    description: 'heritages.seonunsa.desc',
    lat: 35.4988,
    lng: 126.6185,
    era: 'goryeo'
  },
  {
    id: 'maninui_chong',
    name: 'heritages.maninui_chong.name',
    description: 'heritages.maninui_chong.desc',
    lat: 35.4190,
    lng: 127.3820,
    era: 'joseon'
  },
  {
    id: 'hwaamsa',
    name: 'heritages.hwaamsa.name',
    description: 'heritages.hwaamsa.desc',
    lat: 36.0153,
    lng: 127.2084,
    era: 'goryeo'
  }];

// Mock Jeolla region public campsites data (Fallback for Open API)
const MOCK_JEOLLA_CAMPS = [
  { id: 'public-mock-1', name: '전주 교동 오토캠핑장', addr: '전북 전주시 완산구 교동 12-3', lat: 35.8115, lng: 127.1585, tel: '063-222-1111', induty: '일반야영장', description: '전주 한옥마을 도보 거리에 위치한 도심 속 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-2', name: '완주 대둔산 캠핑파크', addr: '전북 완주군 운주면 산북리 55', lat: 36.1245, lng: 127.3120, tel: '063-263-0000', induty: '일반야영장, 글램핑', description: '대둔산 도립공원 자락에 위치한 수려한 경관의 캠핑장.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-3', name: '익산 웅포관광지 곰개나루 캠핑장', addr: '전북 익산시 웅포면 웅포리 738', lat: 36.0745, lng: 126.8580, tel: '063-859-3846', induty: '일반야영장, 오토캠핑', description: '금강변의 아름다운 낙조를 감상할 수 있는 가족 야영장.', resveCl: '온라인야영장예약,전화', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-4', name: '군산 청암산 오토캠핑장', addr: '전북 군산시 회현면 세제길 27', lat: 35.9388, lng: 126.7725, tel: '063-465-3357', induty: '오토캠핑장', description: '청암산 호수공원 인근의 깨끗하고 넓은 오토캠핑장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-5', name: '고창 선운산도립공원 야영장', addr: '전북 고창군 아산면 선운사로 205', lat: 35.4988, lng: 126.6185, tel: '063-560-8600', induty: '일반야영장', description: '선운산의 사계절 아름다움을 만끽할 수 있는 자연 친화 야영장.', resveCl: '현장', resveUrl: '' },
  { id: 'public-mock-6', name: '부안 고사포야영장', addr: '전북 부안군 변산면 변산로 2065-1', lat: 35.6845, lng: 126.4715, tel: '063-582-7888', induty: '일반야영장', description: '변산반도 국립공원 고사포 해수욕장 송림 속 야영장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-7', name: '남원 지리산백무동야영장', addr: '전북 남원시 아영면 지리산로', lat: 35.3785, lng: 127.5855, tel: '055-970-1000', induty: '일반야영장', description: '지리산 천왕봉 코스 기점에 있는 계곡 옆 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-13', name: '남원 백두대간 캠핑장', addr: '전북 남원시 운봉읍 바래봉길 10', lat: 35.4415, lng: 127.5312, tel: '063-630-0000', induty: '일반야영장', description: '지리산 바래봉 자락에 위치해 시원하고 자연 친화적인 야영지.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-14', name: '임실 옥정호 산들바람 캠핑장', addr: '전북 임실군 운암면 국사봉로 23', lat: 35.6120, lng: 127.1215, tel: '063-640-0000', induty: '오토캠핑', description: '아름다운 옥정호 호수 뷰를 감상할 수 있는 호숫가 야영지.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-15', name: '진안 운일암반일암 국민여가캠핑장', addr: '전북 진안군 주천면 동상주천로 1928', lat: 35.9188, lng: 127.2845, tel: '063-430-8359', induty: '일반야영장, 오토캠핑', description: '기암절벽과 맑은 계곡물이 흐르는 운일암반일암 계곡 옆 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-16', name: '무주 덕유산 국민여가캠핑장', addr: '전북 무주군 설천면 백련사로 2', lat: 35.8912, lng: 127.7685, tel: '063-322-1097', induty: '일반야영장, 카라반', description: '덕유산 국립공원 입구 구천동 계곡 옆에 펼쳐진 대규모 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-17', name: '완주 자연을닮은 캠핑장', addr: '전북 완주군 소양면 해학로 12-4', lat: 35.8855, lng: 127.2515, tel: '063-240-0000', induty: '일반야영장, 글램핑', description: '완주 소양 고즈넉한 산자락 아래 위치하여 힐링하기 최적의 장소.', resveCl: '전화', resveUrl: '' }
];

// Mock Quiz Data - Korean & English are dynamically generated below HERITAGE_QUIZZES to support all 30 Jeonbuk heritage sites.

interface HeritageQuiz {
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

const HERITAGE_QUIZZES: Record<string, { ko: HeritageQuiz; en: HeritageQuiz }> = {
  maisan_tapsa: {
    ko: {
      question: "진안 마이산 탑사에 약 80여 개의 돌탑을 쌓아 올렸으며, 비바람에도 무너지지 않는 신비한 탑사 풍경을 일군 조선 후기 처사는 누구인가요?",
      options: ["이갑용 처사", "임경업 장군", "서산대사", "원효대사"],
      correct_option_index: 0,
      explanation: "진안 마이산 탑사는 이갑용 처사가 1800년대 후반부터 평생 동안 접착제나 시멘트 없이 자연석만으로 80여 개의 돌탑을 쌓아 올린 신비로운 역사 유적입니다."
    },
    en: {
      question: "Who is the late Joseon lay devotee who built about 80 stone pagodas at Jinan Maisan Tapsa Temple that stand firm without collapsing?",
      options: ["Lay devotee Lee Gap-yong", "General Im Gyeong-eop", "Master Seosan", "Master Wonhyo"],
      correct_option_index: 0,
      explanation: "Jinan Maisan Tapsa Temple features about 80 stone pagodas built solely from natural stones without glue or cement by lay devotee Lee Gap-yong from the late 1800s."
    }
  },
  jeonju_hyanggyo: {
    ko: {
      question: "조선시대 전라도의 대표적인 교육기관이었던 전주향교에는 공자를 비롯한 성현들의 위패를 모신 전각이 있습니다. 이 전각의 이름은 무엇인가요?",
      options: ["대성전", "명륜당", "동무", "서무"],
      correct_option_index: 0,
      explanation: "전주향교 대성전(보물)은 공자를 비롯한 유교 성현들의 위패를 모시고 제사를 지내는 전주향교의 핵심 전각입니다."
    },
    en: {
      question: "What is the name of the main hall in Jeonju Hyanggyo that houses the memorial tablets of Confucius and other ancient sages?",
      options: ["Daeseongjeon", "Myeongryundang", "Dongmu", "Seomu"],
      correct_option_index: 0,
      explanation: "Daeseongjeon Hall (Treasure) of Jeonju Hyanggyo is the central shrine enshrining the memorial tablets of Confucius and other Confucian sages."
    }
  },
  hwangtojae: {
    ko: {
      question: "1894년 전봉준이 이끄는 동학농민군이 전라감영의 관군을 상대로 첫 대승을 거두었던 전투의 장소이자, 현재 사적으로 지정된 이곳은 어디일까요?",
      options: ["황토현 전적지", "우금치 전적지", "황룡촌 전적지", "백산 전적지"],
      correct_option_index: 0,
      explanation: "정읍 황토현 전적(사적)은 1894년 동학농민군이 관군과의 첫 전면전에서 대승을 거둠으로써 동학농민혁명이 전국적으로 확산되는 결정적 계기가 된 격전지입니다."
    },
    en: {
      question: "Where is the historic battlefield where the Donghak Peasant Army led by Jeon Bong-jun won its first major victory against the government forces in 1894?",
      options: ["Hwangtojae Battleground", "Ugeumchi Battleground", "Hwangryongchon Battleground", "Baeksan Battleground"],
      correct_option_index: 0,
      explanation: "The Hwangtojae Battleground (Historic Site) is where the Donghak Peasant Army defeated government troops in their first full-scale battle, triggering the nationwide expansion of the revolution."
    }
  },
  seonunsa: {
    ko: {
      question: "고창 선운사는 천연기념물로 지정된 동백나무 숲으로도 유명합니다. 대웅보전(보물) 뒤편에 위치한 이 동백나무 숲은 주로 어떤 실용적 목적으로 조성되었다고 전해지나요?",
      options: [
        "사찰에 화재가 발생했을 때 불길을 막는 방화림 역할",
        "동백기름을 만들어 왕실에 상공하기 위한 용도",
        "왜구의 침입을 감시하기 위한 은폐막",
        "차나무 그늘을 만들기 위한 용도"
      ],
      correct_option_index: 0,
      explanation: "선운사 대웅전 뒤편 산기슭에는 약 3천여 그루 of 동백나무가 숲을 이루고 있습니다. 동백나무의 두껍고 수분이 많은 잎은 산불이나 화재 시 불길이 전각으로 번지는 것을 막아주는 천연 방화림 역할을 했습니다."
    },
    en: {
      question: "Gochang Seonunsa Temple is famous for its natural monument camellia forest. For what practical purpose was this forest behind the main hall planted?",
      options: [
        "To act as a firebreak forest to block wildfires from spreading to pavilions",
        "To produce camellia oil to offer to the royal family",
        "To serve as a camouflage screen to monitor Japanese pirate raids",
        "To provide shade for tea trees"
      ],
      correct_option_index: 0,
      explanation: "The camellia forest of Seonunsa acts as a natural firebreak. The thick, moisture-rich leaves of the camellias helped block forest fires from spreading to the temple buildings."
    }
  },
  maninui_chong: {
    ko: {
      question: "조선 선조 때 정유재란 당시, 남원성 전투에서 침략한 왜군에 맞서 싸우다 순국한 민·관·군 의사들의 유해를 함께 모신 호국 무덤의 이름은 무엇인가요?",
      options: ["만인의총", "칠백의총", "칠천량묘", "삼백의총"],
      correct_option_index: 0,
      explanation: "남원 만인의총(사적)은 1597년 정유재란 당시 왜군에 맞서 최후까지 남원성을 지키다 순절한 피난민, 관군, 의병 등 약 1만여 명의 호국영령들을 한곳에 합장하여 모신 무덤입니다."
    },
    en: {
      question: "What is the name of the historic tomb in Namwon that enshrines the remains of the soldiers, citizens, and righteous volunteers who died fighting Japanese invaders in the 1597 battle?",
      options: ["Maninui Chong", "Chilbaegui Chong", "Chilcheonryang Grave", "Sambaegui Chong"],
      correct_option_index: 0,
      explanation: "Namwon Maninui Chong (Historic Site) is a collective tomb enshrining about 10,000 patriotic souls who sacrificed their lives defending Namwon Castle during the 1597 Japanese invasion."
    }
  },
  hwaamsa: {
    ko: {
      question: "완주 화암사 극락전은 국보로 지정되어 있습니다. 이 건물은 한국 건축 문화재 중 유일하게 지붕 처마의 무게를 분산시키는 어떤 특별한 건축 공법을 사용했나요?",
      options: ["하앙(하앙) 구조", "다포(多包) 구조", "주심포(柱心包) 구조", "민도리 구조"],
      correct_option_index: 0,
      explanation: "완주 화암사 극락전(국보)은 중국이나 일본에는 흔하지만 한국 목조건축 중에서는 유일하게 보존되어 있는 '하앙(下昂) 구조'를 채택한 건물입니다. 하앙은 기둥 위에서 처마를 길게 내밀 수 있도록 지탱해 주는 목재 부재입니다."
    },
    en: {
      question: "Geungnakjeon Hall of Wanju Hwaamsa Temple is a National Treasure. What unique architectural structure does it employ to distribute the weight of the roof eaves?",
      options: ["Haang (downward-pointing cantilever) structure", "Dapo (multi-bracket) structure", "Jusimpo (column-head bracket) structure", "Mindori (simple bracketless) structure"],
      correct_option_index: 0,
      explanation: "Wanju Hwaamsa Geungnakjeon is the only surviving wooden building in Korea that uses the 'Haang structure', a cantilever system common in China and Japan that helps project roof eaves further."
    }
  },
  museongseowon: {
    ko: {
      question: "정읍 무성서원은 최치원 선생을 모시기 위해 세워진 조선시대의 사원입니다. 이곳이 다른 서원들과 비교해 가지는 특별한 역사적 가치는 무엇인가요?",
      options: [
        "을사늑약 체결 당시 호남 지역 최초로 의병을 일으킨 역사적 항일 발상지이다.",
        "조선 왕조의 불교 억압 정책에 맞서 일어난 절터이다.",
        "동학 농민 운동의 마지막 전투가 열렸던 지휘소였다.",
        "우리나라 최초의 여성 유학자를 배출한 서원이다."
      ],
      correct_option_index: 0,
      explanation: "정읍 무성서원은 1906년 면암 최익현 선생이 을사늑약에 항거하여 호남 최초의 의병을 일으켰던 항일 독립운동의 유서 깊은 발상지이기도 합니다."
    },
    en: {
      question: "Jeongeup Museongseowon is a Confucian academy commemorating scholar Choi Chi-won. What is its unique historical value?",
      options: [
        "It was the launching site of the Honam region's first righteous army against the Eulsa Treaty.",
        "It was a Buddhist temple built against the Joseon suppression policy.",
        "It was the command center of the last battle of Donghak Peasant Movement.",
        "It was the first Confucian academy to admit female scholars."
      ],
      correct_option_index: 0,
      explanation: "Jeongeup Museongseowon is historically significant as the birthplace of the Honam region's first righteous army led by Choi Ik-hyeon to protest the Eulsa Treaty in 1906."
    }
  },
  naesosa: {
    ko: {
      question: "부안 내소사의 대웅보전(보물) 꽃살문 조각에 대한 설명으로 가장 어울리는 것은 무엇인가요?",
      options: [
        "정교한 불교 조각 예술의 정수로, 나뭇결 그대로 연꽃과 국화 무늬를 세련되게 조각했다.",
        "삼국시대 백제 양식의 화려한 청동 꽃 장식을 박아 넣었다.",
        "중국 당나라 수입 목재를 사용해 웅장한 용 무늬를 조각했다.",
        "서양 기하학 무늬를 적용한 현대적인 디자인이다."
      ],
      correct_option_index: 0,
      explanation: "내소사 대웅보전의 문살은 연꽃과 국화꽃 등을 쇠못을 쓰지 않고 나무로만 정교하게 맞추어 조각한 조선 중기 전통 목조건축 미술의 극치로 꼽힙니다."
    },
    en: {
      question: "Which of the following describes the famous wooden floral lattice doors of Naesosa Temple's Daeungjeon Hall?",
      options: [
        "They represent the pinnacle of Buddhist wood carving, displaying natural wood-grained lotuses and chrysanthemums without nails.",
        "They feature magnificent bronze flower decorations imported from the Baekje era.",
        "They are decorated with grand dragon patterns imported from Tang Dynasty China.",
        "They are modern geometric patterns influenced by Western architecture."
      ],
      correct_option_index: 0,
      explanation: "The flower-patterned lattice doors of Naesosa's Daeungjeon are considered a masterpiece of Joseon Dynasty woodcraft, featuring delicate carvings of lotus and chrysanthemum blossoms joined without using metal nails."
    }
  },
  byeokgolje: {
    ko: {
      question: "김제 벽골제는 백제 비류왕 때 축조된 우리나라 역사상 가장 오래된 대표적인 수리시설입니다. 벽골제가 축조된 주목적은 무엇인가요?",
      options: [
        "농업 생산력을 높이기 위해 드넓은 김제 평야에 물을 대는 저수지 둑이었다.",
        "적들의 침입에 대비해 도성을 방어하는 거대한 해자였다.",
        "조선 건국을 기념하기 위해 조성한 왕실 인공 연못이었다.",
        "근대 해상 물류의 중심지로 기능한 인공 운하였다."
      ],
      correct_option_index: 0,
      explanation: "김제 벽골제는 삼국시대 당시 벼농사 중심의 농업 생산력을 획기적으로 증대시키기 위해 건설된 거대 인공 방조제이자 우리나라 최초의 고대 저수지 둑입니다."
    },
    en: {
      question: "What was the primary purpose of Gimje Byeokgolje, built during the reign of King Biryu of the Baekje Dynasty?",
      options: [
        "An ancient reservoir embankment to irrigate the vast Gimje plains for rice farming.",
        "A giant moat surrounding the capital to defend against foreign invasions.",
        "An artificial royal pond constructed to celebrate the founding of the Joseon Dynasty.",
        "An artificial canal that served as the center of modern maritime logistics."
      ],
      correct_option_index: 0,
      explanation: "Gimje Byeokgolje is the oldest and largest ancient reservoir embankment in Korea, constructed to manage water resource and dramatically increase rice agricultural productivity in the Honam plains."
    }
  },
  jeoksangsanseong: {
    ko: {
      question: "무주 적상산성(사적) 내에 건립되어 조선왕조실록과 왕실 족보 등을 임진왜란 이후 안전하게 보관했던 역사의 보고는 무엇인가요?",
      options: [
        "적상산 사고 (Sagobang)",
        "적상사 미륵전",
        "태조 영당",
        "적상 해인사"
      ],
      correct_option_index: 0,
      explanation: "적상산성은 사방이 깎아지른 절벽으로 둘러싸인 천혜의 요새로, 임진왜란 이후 조선 왕조의 핵심 역사 기록물인 '조선왕조실록'을 안전하게 영구 보존하기 위해 적상산 사고가 건립되었습니다."
    },
    en: {
      question: "What is the name of the royal archives inside Muju Jeoksangsanseong Fortress that safely preserved the Joseon Royal Annals after the Imjin War?",
      options: [
        "Jeoksangsan Sago (Royal Archives)",
        "Jeoksangsa Mireukjeon",
        "Taejo Yeongdang Portrait Hall",
        "Jeoksang Haeinsa"
      ],
      correct_option_index: 0,
      explanation: "Jeoksangsanseong is a natural fortress surrounded by steep cliffs. Due to its strategic invulnerability, Jeoksangsan Sago was built inside to store and preserve the Joseon Dynasty's royal annals and royal genealogies."
    }
  },
  pihyangjeong: {
    ko: {
      question: "호남 제일의 누각이라 불리는 정읍 피향정은 여름에 연못 위에 펼쳐지는 어떤 식물의 아름다운 풍경과 향기로 유명한가요?",
      options: [
        "연꽃",
        "매화",
        "벚꽃",
        "대나무"
      ],
      correct_option_index: 0,
      explanation: "피향정(보물)은 연못에 가득 핀 연꽃의 향기가 사방에 그윽하게 번진다는 뜻에서 붙여진 이름으로, 신라의 최치원 선생이 연못가를 거닐며 풍류를 즐겼다는 설화가 전해집니다."
    },
    en: {
      question: "Jeongeup Pihyangjeong, widely known as the finest pavilion in Honam, is famous for the fragrant scent of which flower blooming in its pond?",
      options: [
        "Lotus",
        "Plum Blossom",
        "Cherry Blossom",
        "Bamboo"
      ],
      correct_option_index: 0,
      explanation: "The name Pihyangjeong means 'pavilion where the fragrance of lotus flower spreads in all directions'. According to local folklore, legendary Silla scholar Choi Chi-won spent time here enjoying the scenic view."
    }
  },
  silsangsa: {
    ko: {
      question: "지리산 자락에 위치한 남원 실상사는 구산선문 중 최초로 문을 연 유서 깊은 사찰입니다. 실상사가 가진 독특한 풍수지리적 설립 배경은 무엇인가요?",
      options: [
        "일본이나 외부의 나쁜 기운이 한반도로 들어오는 것을 지리산에서 누르기 위해 세워졌다.",
        "백제 왕실의 무덤 자리를 수호하기 위해 세워졌다.",
        "근대 항일 운동의 비밀 화약고를 숨기기 위해 세워졌다.",
        "가장 비옥한 영토의 풍요를 기원하는 신전이었다."
      ],
      correct_option_index: 0,
      explanation: "실상사는 신라 선종의 발상지로, 풍수지리적으로 한반도의 기운이 일본으로 빠져나가는 것을 막고 왜의 나쁜 기운을 지리산 자락에서 제압하려는 호국 사상의 배경을 품고 있습니다."
    },
    en: {
      question: "Namwon Silsangsa Temple was the first temple founded among the Nine Mountain Zen Gates. What unique feng-shui belief is associated with its founding?",
      options: [
        "It was built on Jirisan to suppress bad energy coming from Japan into the peninsula.",
        "It was constructed to guard the ancient tombs of the Baekje royal family.",
        "It was built to conceal a secret gunpowder storage for late Joseon righteous armies.",
        "It was a temple built to pray for the agricultural fertility of the plains."
      ],
      correct_option_index: 0,
      explanation: "Silsangsa was founded as the first Seon (Zen) sect temple in the late Silla Dynasty. It is geomantically positioned to block domestic energy from draining away and to subdue hostile foreign energy from across the sea."
    }
  },
  ssangneung: {
    ko: {
      question: "익산 쌍릉은 대왕묘와 소왕묘로 구성된 백제 시대의 고분입니다. 이 무덤들의 역사적 주인공으로 가장 높게 비정되는 인물은 누구인가요?",
      options: [
        "백제 무왕 (King Mu)",
        "백제 근초고왕",
        "백제 의자왕",
        "백제 온조왕"
      ],
      correct_option_index: 0,
      explanation: "익산 쌍릉(사적)은 백제 말기 무왕(대왕묘)과 그의 왕비 선화공주(소왕묘)의 능으로 추정되며, 백제의 익산 천도 혹은 복도(수도를 두 군데 둠) 설을 증명하는 고대 고분 유적입니다."
    },
    en: {
      question: "Iksan Ssangneung consists of two Baekje royal tombs. Who is widely believed to be the historical figure buried in the larger tomb (Daewangmyo)?",
      options: [
        "King Mu of Baekje",
        "King Geunchogo of Baekje",
        "King Uija of Baekje",
        "King Onjo of Baekje"
      ],
      correct_option_index: 0,
      explanation: "Iksan Ssangneung is highly estimated as the royal tombs of King Mu and his queen consort Seonhwa of the Baekje Dynasty, providing major archaeological evidence of Baekje's historical presence in Iksan."
    }
  },
  sangiam: {
    ko: {
      question: "임실 성수산에 위치한 상이암은 두 태조와 인연이 깊습니다. 상이암에서 기도를 드려 건국을 이루었다고 전해지는 두 인물은 누구인가요?",
      options: [
        "고려 태조 왕건과 조선 태조 이성계",
        "백제 온조왕과 고려 태조 왕건",
        "신라 경순왕과 조선 태조 이성계",
        "고려 태조 왕건과 조선 태종 방원"
      ],
      correct_option_index: 0,
      explanation: "임실 상이암은 고려를 건국한 왕건과 조선을 건국한 이성계가 하늘의 계시(삼청동 성수산의 맑은 기운)를 받고 건국 대업을 이루었다는 창업 설화가 함께 전해지는 유서 깊은 암자입니다."
    },
    en: {
      question: "Imsil Sangiam Hermitage is deeply associated with two dynastic founders who prayed here to establish their kingdoms. Who are they?",
      options: [
        "Wang Geon of Goryeo and Yi Seong-gye of Joseon",
        "Onjo of Baekje and Wang Geon of Goryeo",
        "King Gyeongsun of Silla and Yi Seong-gye of Joseon",
        "Wang Geon of Goryeo and King Taejong Yi Bang-won"
      ],
      correct_option_index: 0,
      explanation: "Sangiam is legendary for having hosted both Goryeo's founder Wang Geon and Joseon's founder Yi Seong-gye, who allegedly received cosmic signs during their prayers here to succeed in establishing their new empires."
    }
  },
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
  },
  gochang_dolmen: {
    ko: {
      question: "고창 고인돌 유적은 유네스코 세계문화유산으로 지정된 대표적인 선사시대 유적입니다. 이곳에 조밀하게 분포한 고인돌은 청동기 시대의 어떤 성격을 보여주는 무덤인가요?",
      options: [
        "지배계급의 무덤이자 거석문화의 상징",
        "불교 식장 제례를 위한 탑",
        "기우제를 지내던 제단",
        "사료를 저장하던 창고"
      ],
      correct_option_index: 0,
      explanation: "고창 고인돌 유적은 청동기 시대의 대표적인 무덤 형식인 고인돌이 단일 구역 내에 세계에서 가장 조밀하게 분포한 곳입니다. 이는 당시 지배 계급의 발생과 거석문화의 발전 양상을 잘 보여줍니다."
    },
    en: {
      question: "The Gochang Dolmen Site is a UNESCO World Heritage site. What type of prehistoric structure are these dolmens primarily considered?",
      options: [
        "Tombs of the ruling class and symbols of megalithic culture",
        "Towers for Buddhist cremation rituals",
        "Altars for praying for rain",
        "Storehouses for grain storage"
      ],
      correct_option_index: 0,
      explanation: "The Gochang Dolmen Site features the world's densest concentration of prehistoric dolmens in a single area. They serve as tombs of the ruling class and clear evidence of megalithic culture during the Bronze Age."
    }
  },
  suncheon_nagan: {
    ko: {
      question: "순천 낙안읍성(사적)이 다른 성곽 유적들과 비교하여 가지는 독특한 특징으로 옳은 것은 무엇인가요?",
      options: [
        "성 내부에 왕의 침전이 대규모로 남아있다.",
        "실제 주민들이 초가집에서 생활하며 전통 생활 양식을 이어가는 민속마을이다.",
        "백제 무왕 때 흙으로 쌓아 만든 토성이다.",
        "화강암을 정교하게 깎아 만든 아치형 다리만 남아있다."
      ],
      correct_option_index: 1,
      explanation: "순천 낙안읍성은 조선 시대 성곽뿐만 아니라 관아와 민가(초가집)가 원형대로 보존되어 있으며, 현재까지도 주민들이 직접 살아가고 있는 살아있는 민속 마을이자 문화유산입니다."
    },
    en: {
      question: "What is a unique characteristic of Suncheon Naganeupseong Walled Town compared to other historic fortress sites?",
      options: [
        "It houses a massive royal bedchamber inside.",
        "It is a living folk village where local residents still reside in traditional thatched houses.",
        "It is an earthen fortress built during King Mu of Baekje's reign.",
        "Only a sophisticated granite arched bridge remains."
      ],
      correct_option_index: 1,
      explanation: "Naganeupseong is a historic Joseon fortress town where the local government offices and traditional thatched-roof houses are preserved, and local residents still live, making it a living heritage site."
    }
  },
  damyang_soswaewon: {
    ko: {
      question: "조선 중기 조광조의 제자인 양산보가 지은 담양 소쇄원의 조경 미학적 특징을 가장 잘 설명한 것은 무엇인가요?",
      options: [
        "화려한 단청과 대칭 구조를 자랑하는 인공 정원",
        "자연의 훼손을 최소화하고 계곡과 바위, 나무가 인공 건축물과 조화를 이루는 별서 정원",
        "중국 황실의 정원 방식을 모방한 평지 정원",
        "일본식 돌과 모래 위주의 고산수식 정원"
      ],
      correct_option_index: 1,
      explanation: "담양 소쇄원은 조선 중기 선비 양산보가 기묘사화 이후 은둔하며 가꾼 한국 전통 정원(별서정원)으로, 계곡을 자연스럽게 살려 자연과 인공 정자가 물아일체의 조화를 이루는 뛰어난 차경 기법과 친자연주의 미학을 보여줍니다."
    },
    en: {
      question: "Which of the following best describes the landscaping aesthetic of Damyang Soswaewon Garden constructed by Yang San-bo?",
      options: [
        "An artificial garden boasting brilliant colors and symmetrical structures",
        "A villa garden that minimizes damage to nature, harmonizing valleys, rocks, and trees with traditional pavilions",
        "A flat garden imitating the Chinese lifestyle of scholar Yang San-bo",
        "A Japanese Zen garden consisting mainly of stones and sand"
      ],
      correct_option_index: 1,
      explanation: "Soswaewon is a classic Korean traditional villa garden built by scholar Yang San-bo during the Joseon Dynasty. It features an ecocentric design that keeps the natural creek and surroundings intact, demonstrating outstanding harmony between nature and human architecture."
    }
  },
  yeosu_jinnamgwan: {
    ko: {
      question: "여수 진남관(국보)은 임진왜란 당시 이순신 장군이 전라좌수영의 본영으로 사용하던 건물을 중건한 역사적 목조 건물입니다. 이 건물의 주된 역할은 무엇이었나요?",
      options: [
        "임금의 어진을 봉안하고 제사를 지내던 사당",
        "전라좌수영의 삼도수군통제영 지휘소 및 객사",
        "의병들의 훈련소와 무기 제조 공장",
        "외국 사신들을 맞이하던 연회장"
      ],
      correct_option_index: 1,
      explanation: "여수 진남관은 전라좌수영의 본영이자 삼도수군통제영 지휘소로 사용되었던 곳으로, 현존하는 관아용 객사 건물 중 국내에서 가장 큰 규모를 자랑하는 기념비적인 목조 건축물입니다."
    },
    en: {
      question: "What was the primary historical function of Yeosu Jinnamgwan Hall, a National Treasure that served as the base of Admiral Yi Sun-sin's naval force?",
      options: [
        "A shrine to enshrine and perform rituals for royal portraits",
        "The guest house and military command center of the Jeolla-jwa-suyeong naval headquarters",
        "A training camp and weapons factory for righteous armies",
        "A banquet hall to welcome foreign diplomats"
      ],
      correct_option_index: 1,
      explanation: "Yeosu Jinnamgwan was used as the headquarters of the Jeolla-jwa-suyeong naval base and command post. It is the largest surviving wooden government guest house building in Korea, carrying significant historical legacy from the Imjin War."
    }
  },
  haenam_daehungsa: {
    ko: {
      question: "해남 대흥사는 유네스코 세계문화유산 '산사, 한국의 산지승원' 중 하나로 등재된 유서 깊은 사찰입니다. 임진왜란 때 승병을 이끌었으며 이 사찰에 그의 의발이 보관되어 있는 조선의 위대한 승려는 누구인가요?",
      options: [
        "원효대사",
        "의상대사",
        "서산대사",
        "자장율사"
      ],
      correct_option_index: 2,
      explanation: "해남 대흥사는 임진왜란 당시 승병장으로 큰 활약을 펼쳤던 서산대사의 유언에 따라 그의 의발(옷과 발우)이 전해진 곳으로, 조선 후기 불교 문화의 중심지이자 호국 불교의 상징적인 장소입니다."
    },
    en: {
      question: "Haenam Daehungsa Temple is a UNESCO World Heritage mountain temple. Which great Joseon monk led the Buddhist righteous army during the Imjin War and had his robes and alms bowl preserved here?",
      options: [
        "Master Wonhyo",
        "Master Uisang",
        "Master Seosan",
        "Master Jajang"
      ],
      correct_option_index: 2,
      explanation: "Following the final wishes of Master Seosan, who led the Buddhist militia during the Imjin War, his monastic robes and alms bowl were housed at Haenam Daehungsa, making it a symbolic center of national protection and Buddhism in the late Joseon Dynasty."
    }
  },
  suncheon_seonamsa: {
    ko: {
      question: "순천 선암사(사적)의 대표적인 보물이자, 자연 계곡과 무지개 모양의 화강암이 아름답게 조화를 이루는 아치형 석조 다리의 이름은 무엇인가요?",
      options: ["승선교", "극락교", "수피아교", "오작교"],
      correct_option_index: 0,
      explanation: "순천 선암사 승선교(보물)는 자연 계곡 위에 화강암으로 축조한 아름다운 무지개 모양(홍예교)의 석조 아치교입니다. 기단부와 계곡 바위가 완벽한 조화를 이루는 한국 전통 석조 건축의 걸작입니다."
    },
    en: {
      question: "What is the name of the famous Treasure and rainbow-shaped granite arch stone bridge at Suncheon Seonamsa Temple?",
      options: ["Seungseongyo", "Geungnakgyo", "Supiagyo", "Ojakgyo"],
      correct_option_index: 0,
      explanation: "Seungseongyo Bridge (Treasure) at Seonamsa Temple is a beautiful rainbow-shaped stone arch bridge built over a natural valley stream. It is a masterpiece of Korean traditional stone architecture."
    }
  },
  hwasun_dolmen: {
    ko: {
      question: "화순 고인돌 유적은 강화, 고창과 함께 유네스코 세계문화유산에 등재되었습니다. 이곳의 특징으로 가장 알맞은 것은 무엇인가요?",
      options: [
        "석기 제작용 채석장과 고인돌 축조 과정이 고스란히 남은 거대한 돌 채석 채취지가 함께 보존되어 있다.",
        "성곽 내부에 위치해 있다.",
        "왕릉의 호석으로 사용되었다.",
        "모두 지상 벽돌 무덤 형태를 띤다."
      ],
      correct_option_index: 0,
      explanation: "화순 고인돌 유적은 산기슭 계곡을 따라 수많은 고인돌이 분포되어 있으며, 특히 고인돌을 만들기 위해 돌을 떼어내던 채석장(돌을 캐던 곳)이 유일하게 함께 보존되어 있어 축조 기술 연구에 매우 중요한 세계유산입니다."
    },
    en: {
      question: "Which of the following is correct about the Hwasun Dolmen Site, a UNESCO World Heritage site?",
      options: [
        "It preserves massive stone quarry sites showing how stones were cut and dolmens were constructed.",
        "It is located inside a fortress town.",
        "It was used as protective stones for royal tombs.",
        "They are all above-ground brick tombs."
      ],
      correct_option_index: 0,
      explanation: "The Hwasun Dolmen Site preserves a unique stone quarry where large slabs of stone were cut and moved to build the dolmens, making it a critical archaeological site for understanding ancient engineering."
    }
  },
  gochang_eupseong: {
    ko: {
      question: "고창읍성(모양성)에서 전해지는 전통 풍습으로, 돌을 머리에 이고 성곽을 돌며 무병장수와 사후 극락행을 기원하는 민속 행사는 무엇인가요?",
      options: ["답성놀이 (성밟기)", "차전놀이", "놋다리밟기", "고싸움놀이"],
      correct_option_index: 0,
      explanation: "고창읍성에서는 머리에 돌을 이고 성곽을 도는 '답성놀이(성밟기)' 풍습이 유명합니다. 한 바퀴 돌면 다리병이 낫고, 두 바퀴 돌면 무병장수하며, 세 바퀴 돌면 극락에 간다는 설화가 전해집니다."
    },
    en: {
      question: "What is the name of the traditional folk custom at Gochang Eupseong Fortress where people walk along the fortress walls carrying a stone on their heads to pray for health and longevity?",
      options: ["Dapseongnori (Wall Walking)", "Chajeonnori", "Notdaribapgi", "Gossaumnori"],
      correct_option_index: 0,
      explanation: "Gochang Eupseong is famous for 'Dapseongnori' (Fortress Wall Walking). According to local legend, walking around the wall once cures leg ailments, twice ensures a long and healthy life, and three times guarantees entry to paradise."
    }
  },
  gurye_hwayeomsa: {
    ko: {
      question: "지리산 자락에 위치한 천년고찰 구례 화엄사(사적)의 대표적인 국보 건축물로, 현존하는 목조 건물 중 최고의 웅장함과 층고를 자랑하며 2층 구조의 대웅전 격인 이 전각의 이름은 무엇인가요?",
      options: ["각황전", "대웅전", "극락전", "범종각"],
      correct_option_index: 0,
      explanation: "구례 화엄사 각황전(국보)은 조선 숙종 대에 중건된 중층(2층) 구조의 웅장한 법당으로, 당시 불교 목조 건축의 정수를 보여주는 대표적인 건축물입니다."
    },
    en: {
      question: "What is the name of the National Treasure wooden building at Gurye Hwaeomsa Temple, famous for its magnificent scale and double-story structure?",
      options: ["Gakhwangjeon", "Daeungjeon", "Geungnakjeon", "Beomjonggak"],
      correct_option_index: 0,
      explanation: "Gakhwangjeon Hall (National Treasure) of Hwaeomsa Temple is a double-story wooden building rebuilt during the reign of King Sukjong of the Joseon Dynasty, representing the pinnacle of late Joseon Buddhist architecture."
    }
  },
  jangseong_pilam: {
    ko: {
      question: "장성 필암서원은 유네스코 세계문화유산 '한국의 서원' 중 하나로 등재된 유서 깊은 교육 기관입니다. 이곳은 조선 중기의 어느 유학자이자 사림의 영수를 기리기 위해 건립되었나요?",
      options: ["하서 김인후", "퇴계 이황", "율곡 이이", "남명 조식"],
      correct_option_index: 0,
      explanation: "장성 필암서원은 조선 중기 문신이자 유학자인 하서 김인후(1510~1560)를 추모하고 후학을 양성하기 위해 선조 대에 창건된 사액서원입니다."
    },
    en: {
      question: "Jangseong Pilam Seowon is a UNESCO World Heritage site. Which Joseon Confucian scholar is this academy built to enshrine?",
      options: ["Haseo Kim In-hu", "Toegye Yi Hwang", "Yulgok Yi I", "Nammyeong Jo Sik"],
      correct_option_index: 0,
      explanation: "Pilam Seowon is a private Confucian academy founded in 1590 to enshrine the academic legacy and memory of Haseo Kim In-hu, one of the most prominent neo-Confucian scholars of the mid-Joseon period."
    }
  },
  gangjin_koryo: {
    ko: {
      question: "강진 대구면 일대에 분포한 강진 고려청자 요지(사적)가 한국 요업사(도자기 역사)에서 차지하는 의의는 무엇인가요?",
      options: [
        "한반도 최대 규모의 백제 토기 가마터",
        "고려청자 전성기인 10~14세기 동안 우수한 비색 청자를 대규모로 생산하던 핵심 가마터 유적",
        "조선 후기 분청사기를 제작하던 곳",
        "일제강점기 옹기 가마터"
      ],
      correct_option_index: 1,
      explanation: "강진 고려청자 요지는 전국에서 가장 많은 가마터가 집중된 곳으로, 고려 청자 생산량의 절대다수를 담당했으며 비색 청자 및 상감 청자의 발상지이자 최대 제작지입니다."
    },
    en: {
      question: "What is the historical significance of the Gangjin Celadon Kiln Sites in Korean ceramic history?",
      options: [
        "The largest Baekje earthenware kiln site on the Korean Peninsula",
        "The core kiln site that mass-produced premium jade-green celadon during the peak Goryeo period (10th to 14th centuries)",
        "A production center of Buncheong ware in late Joseon",
        "An Onggi earthenware kiln site under the Japanese colonial rule"
      ],
      correct_option_index: 1,
      explanation: "The Gangjin Celadon Kiln Sites represent the absolute center of Goryeo celadon production, where numerous historic kilns are concentrated, generating top-tier jade-green and inlaid celadon works."
    }
  },
  wando_cheonghaejin: {
    ko: {
      question: "완도 청해진 유적(사적)은 9세기 당나라와 왜, 한반도를 잇는 해상 무역을 지배했던 역사적 인물 장보고가 설치한 해군기지이자 무역 거점입니다. 이 인물의 직책이자 청해진의 우두머리를 일컫는 호칭은 무엇인가요?",
      options: ["청해진 대사", "수군통제사", "해상방어사", "동북면병마사"],
      correct_option_index: 0,
      explanation: "통일신라 후기 완도에 청해진을 설치한 장보고는 흥덕왕에 의해 '청해진 대사'로 임명되어 당나라와 왜를 잇는 황해의 제해권을 장악하고 국제 해상 무역을 주도하였습니다."
    },
    en: {
      question: "The Wando Cheonghaejin Archaeological Site was a maritime trade base established in the 9th century. What was the title of its founder, Jang Bogo?",
      options: ["Commissioner of Cheonghaejin", "Commander-in-Chief of Naval Forces", "Maritime Defense Commander", "Dongbuk-myeon Military Governor"],
      correct_option_index: 0,
      explanation: "Jang Bogo established Cheonghaejin on Wando Island during the late Unified Silla period and was appointed 'Commissioner of Cheonghaejin' (Cheonghaejin Daesa) by King Heungdeok, dominating maritime trade between Tang China, Japan, and Silla."
    }
  }
};

const HERITAGE_REGION_MAP: Record<string, { ko: string; en: string }> = {
  songgwangsa: { ko: '완주', en: 'Wanju' },
  gyeonggijeon: { ko: '전주', en: 'Jeonju' },
  omokdae: { ko: '전주', en: 'Jeonju' },
  pungnammun: { ko: '전주', en: 'Jeonju' },
  gwanghallu: { ko: '남원', en: 'Namwon' },
  mireuksa_site: { ko: '익산', en: 'Iksan' },
  wanggungri: { ko: '익산', en: 'Iksan' },
  donggosanseong: { ko: '전주', en: 'Jeonju' },
  seungamsan_fortress: { ko: '전주', en: 'Jeonju' },
  geumsansa: { ko: '김제', en: 'Gimje' },
  godori_buddha: { ko: '익산', en: 'Iksan' },
  manboksa_site: { ko: '남원', en: 'Namwon' },
  modern_museum: { ko: '군산', en: 'Gunsan' },
  hirotsu_house: { ko: '군산', en: 'Gunsan' },
  gochang_dolmen: { ko: '고창', en: 'Gochang' },
  gochang_eupseong: { ko: '고창', en: 'Gochang' },
  museongseowon: { ko: '정읍', en: 'Jeongeup' },
  naesosa: { ko: '부안', en: 'Buan' },
  byeokgolje: { ko: '김제', en: 'Gimje' },
  jeoksangsanseong: { ko: '무주', en: 'Muju' },
  pihyangjeong: { ko: '정읍', en: 'Jeongeup' },
  silsangsa: { ko: '남원', en: 'Namwon' },
  ssangneung: { ko: '익산', en: 'Iksan' },
  sangiam: { ko: '임실', en: 'Imsil' },
  maisan_tapsa: { ko: '진안', en: 'Jinan' },
  jeonju_hyanggyo: { ko: '전주', en: 'Jeonju' },
  hwangtojae: { ko: '정읍', en: 'Jeongeup' },
  seonunsa: { ko: '고창', en: 'Gochang' },
  maninui_chong: { ko: '남원', en: 'Namwon' },
  hwaamsa: { ko: '완주', en: 'Wanju' }
};

// Generate the full quiz list dynamically from MASTER_HERITAGES and HERITAGE_QUIZZES
const MOCK_QUIZZES_KO: QuizQuestion[] = MASTER_HERITAGES.map((h, index) => {
  const quizObj = HERITAGE_QUIZZES[h.id];
  const regionInfo = HERITAGE_REGION_MAP[h.id] || { ko: '기타', en: 'Other' };
  
  if (!quizObj) {
    return {
      id: index + 1,
      era: h.era,
      region: regionInfo.ko,
      question: `${h.id} 에 대한 퀴즈 준비 중입니다.`,
      options: ['정답', '오답1', '오답2', '오답3'],
      correct_option_index: 0,
      explanation: '해설 준비 중'
    };
  }
  
  return {
    id: index + 1,
    era: h.era,
    region: regionInfo.ko,
    question: quizObj.ko.question,
    options: quizObj.ko.options,
    correct_option_index: quizObj.ko.correct_option_index,
    explanation: quizObj.ko.explanation
  };
});

const MOCK_QUIZZES_EN: QuizQuestion[] = MASTER_HERITAGES.map((h, index) => {
  const quizObj = HERITAGE_QUIZZES[h.id];
  const regionInfo = HERITAGE_REGION_MAP[h.id] || { ko: '기타', en: 'Other' };
  
  if (!quizObj) {
    return {
      id: index + 1,
      era: h.era,
      region: regionInfo.en,
      question: `Quiz for ${h.id} is under preparation.`,
      options: ['Correct', 'Incorrect 1', 'Incorrect 2', 'Incorrect 3'],
      correct_option_index: 0,
      explanation: 'Explanation under preparation.'
    };
  }
  
  return {
    id: index + 1,
    era: h.era,
    region: regionInfo.en,
    question: quizObj.en.question,
    options: quizObj.en.options,
    correct_option_index: quizObj.en.correct_option_index,
    explanation: quizObj.en.explanation
  };
});

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
  const [solvedQuizzes, setSolvedQuizzes] = useState<Record<string, { heritageId?: string, questionText: string, isCorrect: boolean, selectedAnswer: string, correctAnswer: string, timestamp: string }>>(() => {
    const saved = localStorage.getItem('history_camper_solved_quizzes');
    return saved ? JSON.parse(saved) : {};
  });
  const visitedHeritages = MASTER_HERITAGES.filter(h => heritageStatuses[h.id] === 'visited');
  // Active heritage quiz states
  const [activeQuizHeritage, setActiveQuizHeritage] = useState<HeritageSite | null>(null);
  const [activeQuizTargetStatus, setActiveQuizTargetStatus] = useState<'planned' | 'visited' | null>(null);
  const [heritageQuizAnswered, setHeritageQuizAnswered] = useState(false);
  const [heritageQuizSelectedIdx, setHeritageQuizSelectedIdx] = useState<number | null>(null);
  const [heritageQuizReviewText, setHeritageQuizReviewText] = useState('');
  
  // Selected campsite for route modal layer
  const [activeRouteCampsiteId, setActiveRouteCampsiteId] = useState<string | null>(null);
  // Selected heritage for info window in history map tab
  const [activeMapHeritageId, setActiveMapHeritageId] = useState<string | null>(null);
  // Selected campsite for info window in history map tab
  const [activeMapCampsiteId, setActiveMapCampsiteId] = useState<string | null>(null);

  // Status filter: 'all' | 'planned' | 'visited'
  const [statusFilter, setStatusFilter] = useState<'all' | 'planned' | 'visited'>('all');

  // Selected Campsite for interactive mapping (defaults to Moaksan)
  const [selectedCampsiteId, setSelectedCampsiteId] = useState('moaksan');

  // Map Center controller state
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 35.6, lng: 126.9 });

  // Supabase & Quiz States
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [supabaseError, setSupabaseError] = useState(false);
  const [isFavoritesTableMissing, setIsFavoritesTableMissing] = useState(false);
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
    { id: 'prehistoric', label: t('era.eras.prehistoric') },
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
        } catch (err: any) {
          console.error("Failed to load statuses from Supabase, loading from LocalStorage:", err);
          if (err && err.code === 'PGRST205') {
            setIsFavoritesTableMissing(true);
          } else {
            setSupabaseError(true);
          }
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
      } catch (err: any) {
        console.error("Failed to update status in Supabase:", err);
        if (err && err.code === 'PGRST205') {
          setIsFavoritesTableMissing(true);
        } else {
          setSupabaseError(true);
        }
      }
    }
  };

  // Heritage actions and quiz handlers
  const [editingHeritageId, setEditingHeritageId] = useState<string | null>(null);
  const [editingReviewText, setEditingReviewText] = useState<string>('');

  const handleHeritageStatusClick = (heritage: HeritageSite, targetStatus: 'planned' | 'visited') => {
    const current = heritageStatuses[heritage.id];
    const updatedStatuses = { ...heritageStatuses };
    
    if (current === targetStatus) {
      // Toggle off
      delete updatedStatuses[heritage.id];
      setHeritageStatuses(updatedStatuses);
      localStorage.setItem('history_camper_heritage_statuses', JSON.stringify(updatedStatuses));
      
      if (targetStatus === 'visited') {
        const updatedReviews = { ...heritageReviews };
        delete updatedReviews[heritage.id];
        setHeritageReviews(updatedReviews);
        localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
      }
    } else {
      // Set status immediately without opening the quiz modal
      updatedStatuses[heritage.id] = targetStatus;
      setHeritageStatuses(updatedStatuses);
      localStorage.setItem('history_camper_heritage_statuses', JSON.stringify(updatedStatuses));
      
      // If switching to planned, remove review
      if (targetStatus === 'planned') {
        const updatedReviews = { ...heritageReviews };
        delete updatedReviews[heritage.id];
        setHeritageReviews(updatedReviews);
        localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
      }
    }
  };

  const handleHeritageQuizSubmit = (optionIdx: number) => {
    setHeritageQuizSelectedIdx(optionIdx);
    setHeritageQuizAnswered(true);

    if (activeQuizHeritage) {
      const quizObj = HERITAGE_QUIZZES[activeQuizHeritage.id];
      if (quizObj) {
        const quiz = i18n.language === 'ko' ? quizObj.ko : quizObj.en;
        const isCorrect = optionIdx === quiz.correct_option_index;
        const newSolved = {
          ...solvedQuizzes,
          [`heritage_${activeQuizHeritage.id}`]: {
            heritageId: activeQuizHeritage.id,
            questionText: quiz.question,
            isCorrect,
            selectedAnswer: quiz.options[optionIdx],
            correctAnswer: quiz.options[quiz.correct_option_index],
            timestamp: new Date().toISOString()
          }
        };
        setSolvedQuizzes(newSolved);
        localStorage.setItem('history_camper_solved_quizzes', JSON.stringify(newSolved));
      }
    }
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
            return (doNm.includes('전북') || doNm.includes('전라북도')) && !doNm.includes('전남') && !item.addr1?.includes('전남');
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
          setSupabaseError(true);
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

  // const selectedCampsite = allDisplayCampsites.find(c => c.id === selectedCampsiteId) || allDisplayCampsites[0];

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
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
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
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
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



  // Open detailed route modal layer and load clicked campsite
  const viewHeritageRoute = (campsiteId: string) => {
    setSelectedCampsiteId(campsiteId);
    setActiveRouteCampsiteId(campsiteId);
    if (selectedCampsiteId) {} // Read to avoid TS unused variable error
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
    let matchRegion = false;
    if (filterRegion === 'all') {
      matchRegion = true;
    } else {
      const regionMatchMap: Record<string, string> = {
        '전주': 'jeonju',
        '완주': 'wanju',
        '익산': 'iksan',
        '군산': 'gunsan',
        '정읍': 'jeongeup',
        '남원': 'namwon',
        '김제': 'gimje',
        '진안': 'jinan',
        '무주': 'muju',
        '임실': 'imsil',
        '고창': 'gochang',
        '부안': 'buan'
      };
      const englishName = regionMatchMap[filterRegion] || '';
      matchRegion = 
        qRegion.toLowerCase().includes(filterRegion.toLowerCase()) ||
        (englishName ? qRegion.toLowerCase().includes(englishName.toLowerCase()) : false);
    }

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
    const isCorrect = optionIndex === currentQuestion.correct_option_index;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const key = `general_${currentQuestion.id || currentQuestion.question}`;
    const newSolved = {
      ...solvedQuizzes,
      [key]: {
        questionText: currentQuestion.question,
        isCorrect,
        selectedAnswer: currentQuestion.options[optionIndex],
        correctAnswer: currentQuestion.options[currentQuestion.correct_option_index],
        timestamp: new Date().toISOString()
      }
    };
    setSolvedQuizzes(newSolved);
    localStorage.setItem('history_camper_solved_quizzes', JSON.stringify(newSolved));
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
                  level={10}
                >
                  {/* Render all 15 heritage sites */}
                  {MASTER_HERITAGES.map(heritage => (
                    <MapMarker 
                      key={heritage.id} 
                      position={{ lat: heritage.lat, lng: heritage.lng }}
                      onClick={() => setActiveMapHeritageId(heritage.id)}
                    >
                      {activeMapHeritageId === heritage.id && (
                        <div style={{ 
                          padding: '10px', 
                          minWidth: '220px', 
                          background: 'white', 
                          borderRadius: '12px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          fontSize: '0.85rem',
                          color: '#333',
                          zIndex: 99999
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>{t(heritage.name)}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMapHeritageId(null);
                              }}
                              style={{ background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#999', padding: '2px' }}
                            >
                              ✕
                            </button>
                          </div>
                          <div style={{ marginBottom: '6px', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>
                            ⏳ {Eras.find(e => e.id === heritage.era)?.label || heritage.era}
                          </div>
                          <div style={{ marginBottom: '8px', lineHeight: 1.4, fontSize: '0.75rem' }}>
                            {t(heritage.description)}
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleHeritageStatusClick(heritage, 'planned')}
                              style={{
                                flex: 1,
                                padding: '4px 6px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: heritageStatuses[heritage.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                background: heritageStatuses[heritage.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'white',
                                color: heritageStatuses[heritage.id] === 'planned' ? 'var(--gold)' : '#555'
                              }}
                            >
                              📌 {t('era.status_planned')}
                            </button>
                            <button
                              onClick={() => handleHeritageStatusClick(heritage, 'visited')}
                              style={{
                                flex: 1,
                                padding: '4px 6px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: heritageStatuses[heritage.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: heritageStatuses[heritage.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'white',
                                color: heritageStatuses[heritage.id] === 'visited' ? 'var(--primary)' : '#555'
                              }}
                            >
                              ✅ {t('era.status_visited')}
                            </button>
                            <button
                              onClick={() => {
                                setActiveQuizHeritage(heritage);
                                setActiveQuizTargetStatus('visited');
                                setHeritageQuizAnswered(false);
                                setHeritageQuizSelectedIdx(null);
                                setHeritageQuizReviewText(heritageReviews[heritage.id] || '');
                              }}
                              style={{
                                flex: 1,
                                padding: '4px 6px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: '1px solid var(--primary)',
                                background: 'var(--primary)',
                                color: 'white'
                              }}
                            >
                              ❓ {i18n.language === 'ko' ? '역사퀴즈' : 'Quiz'}
                            </button>
                          </div>                        </div>
                      )}
                    </MapMarker>
                  ))}

                  {/* Render all campsites on the map */}
                  {(() => {
                    const mapCampsites = showPublicCamps ? allDisplayCampsites : MASTER_CAMPSITES;
                    const filteredMapCampsites = mapCampsites.filter(c => {
                      if (showReservableOnly && !isCampsiteReservable(c)) {
                        return false;
                      }
                      return true;
                    });

                    return filteredMapCampsites.map(campsite => {
                      const isCurated = MASTER_CAMPSITES.some(mc => mc.id === campsite.id);
                      return (
                        <MapMarker 
                          key={campsite.id} 
                          position={{ lat: campsite.lat, lng: campsite.lng }}
                          image={isCurated ? {
                            src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                            size: { width: 24, height: 35 }
                          } : undefined}
                          onClick={() => {
                            setActiveMapCampsiteId(campsite.id);
                            setActiveMapHeritageId(null);
                          }}
                        >
                          {activeMapCampsiteId === campsite.id && (
                            <div style={{ 
                              padding: '10px', 
                              minWidth: '220px', 
                              background: 'white', 
                              borderRadius: '12px', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              fontSize: '0.85rem',
                              color: '#333',
                              zIndex: 99999
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                                  ⛺ {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMapCampsiteId(null);
                                  }}
                                  style={{ background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#999', padding: '2px' }}
                                >
                                  ✕
                                </button>
                              </div>
                              <div style={{ marginBottom: '6px', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>
                                ⏳ {Eras.find(e => e.id === campsite.era)?.label || campsite.era}
                              </div>
                              <div style={{ marginBottom: '8px', lineHeight: 1.4, fontSize: '0.75rem' }}>
                                {campsite.id.startsWith('public-') ? campsite.description : t(campsite.description)}
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={() => toggleStatus(campsite.id, 'planned')}
                                  style={{
                                    flex: 1,
                                    padding: '4px 6px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    border: campsiteStatuses[campsite.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                    background: campsiteStatuses[campsite.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'white',
                                    color: campsiteStatuses[campsite.id] === 'planned' ? 'var(--gold)' : '#555'
                                  }}
                                >
                                  📌 {t('era.status_planned')}
                                </button>
                                <button
                                  onClick={() => toggleStatus(campsite.id, 'visited')}
                                  style={{
                                    flex: 1,
                                    padding: '4px 6px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    border: campsiteStatuses[campsite.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: campsiteStatuses[campsite.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'white',
                                    color: campsiteStatuses[campsite.id] === 'visited' ? 'var(--primary)' : '#555'
                                  }}
                                >
                                  ✅ {t('era.status_visited')}
                                </button>
                              </div>
                            </div>
                          )}
                        </MapMarker>
                      );
                    });
                  })()}
                </Map>
              </div>

              {/* RIGHT PANEL: ALL 15 HERITAGES GROUPED BY ERA */}
              <div className="card gold-accent route-info-container" style={{ 
                marginBottom: 0, 
                display: 'flex', 
                flexDirection: 'column',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} color="var(--gold)"/>
                  {i18n.language === 'ko' ? '전라도 역사 유적지 목록' : 'Jeolla Historical Heritage Sites'}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                  {userLocation ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(() => {
                        const heritagesWithDistance = MASTER_HERITAGES.map(h => {
                          const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, h.lat, h.lng);
                          return { ...h, distance: dist };
                        });
                        heritagesWithDistance.sort((a, b) => a.distance - b.distance);

                        return heritagesWithDistance.map(heritage => {
                          const status = heritageStatuses[heritage.id];
                          return (
                            <div key={heritage.id} className="campsite-card" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div 
                                  onClick={() => {
                                    setMapCenter({ lat: heritage.lat, lng: heritage.lng });
                                    setActiveMapHeritageId(heritage.id);
                                    setActiveMapCampsiteId(null);
                                  }}
                                  className="interactive-heritage-link" style={{ cursor: 'pointer', flex: 1, paddingRight: '8px' }}
                                  title={i18n.language === 'ko' ? '지도로 보기' : 'Show on Map'}
                                >
                                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                                    <span className="heritage-title">🏛️ {t(heritage.name)}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                                      ({t('route.map.distance_from_me', { distance: heritage.distance.toFixed(1) })})
                                    </span>
                                    {status === 'planned' && (
                                      <span className="badge warning" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                        📌 {t('era.status_planned')}
                                      </span>
                                    )}
                                    {status === 'visited' && (
                                      <span className="badge success" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                        ✅ {t('era.status_visited')}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 'bold', marginTop: '2px' }}>
                                    ⏳ {Eras.find(e => e.id === heritage.era)?.label || heritage.era}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--surface-foreground)', marginTop: '6px', lineHeight: 1.4 }}>
                                    {t(heritage.description)}
                                  </div>
                                </div>
                                
                                {/* Toggle buttons */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    onClick={() => handleHeritageStatusClick(heritage, 'planned')}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      border: status === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                      background: status === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
                                      color: status === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)'
                                    }}
                                    title={i18n.language === 'ko' ? '갈 예정 등록 (역사 퀴즈)' : 'Register Planned (History Quiz)'}
                                  >
                                    📌 {i18n.language === 'ko' ? '갈 예정' : 'Plan'}
                                  </button>
                                  <button
                                    onClick={() => handleHeritageStatusClick(heritage, 'visited')}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      border: status === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                      background: status === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'var(--surface)',
                                      color: status === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)'
                                    }}
                                    title={i18n.language === 'ko' ? '갔다옴 등록 (역사 퀴즈 및 후기)' : 'Register Visited (History Quiz & Review)'}
                                  >
                                    ✅ {i18n.language === 'ko' ? '갔다옴' : 'Visited'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveQuizHeritage(heritage);
                                      setActiveQuizTargetStatus('visited');
                                      setHeritageQuizAnswered(false);
                                      setHeritageQuizSelectedIdx(null);
                                      setHeritageQuizReviewText(heritageReviews[heritage.id] || '');
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      border: '1px solid var(--primary)',
                                      background: 'var(--primary)',
                                      color: 'white'
                                    }}
                                  >
                                    ❓ {i18n.language === 'ko' ? '역사퀴즈' : 'Quiz'}
                                  </button>
                                </div>
                              </div>

                              {/* Review display/edit section */}
                              {status === 'visited' && (
                                <div className="heritage-review-box" style={{ marginTop: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                                    <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontStyle: heritageReviews[heritage.id] ? 'normal' : 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>
                                      {heritageReviews[heritage.id] || (i18n.language === 'ko' ? '작성된 후기가 없습니다. [수정]을 눌러 등록해 보세요!' : 'No review written. Click [Edit] to write one!')}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  ) : (
                    ['prehistoric', 'baekje', 'later_baekje', 'goryeo', 'joseon', 'modern'].map(eraId => {
                      const eraHeritages = MASTER_HERITAGES.filter(h => h.era === eraId);
                      if (eraHeritages.length === 0) return null;
                      const eraLabel = Eras.find(e => e.id === eraId)?.label || eraId;
                      
                      return (
                        <div key={eraId} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <h4 style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 800, 
                            color: 'var(--primary)', 
                            borderLeft: '4px solid var(--primary)', 
                            paddingLeft: '8px',
                            marginBottom: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>⏳</span> {eraLabel}
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--surface-foreground)' }}>({eraHeritages.length})</span>
                          </h4>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {eraHeritages.map(heritage => {
                              const status = heritageStatuses[heritage.id];
                              return (
                                <div key={heritage.id} className="campsite-card" style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--surface)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div 
                                       onClick={() => {
                                         setMapCenter({ lat: heritage.lat, lng: heritage.lng });
                                         setActiveMapHeritageId(heritage.id);
                                         setActiveMapCampsiteId(null);
                                       }}
                                       className="interactive-heritage-link"
                                       style={{ cursor: 'pointer', flex: 1, paddingRight: '8px' }}
                                       title={i18n.language === 'ko' ? '지도로 보기' : 'Show on Map'}
                                     >
                                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span className="heritage-title">🏛️ {t(heritage.name)}</span>
                                        {status === 'planned' && (
                                          <span className="badge warning" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                            📌 {t('era.status_planned')}
                                          </span>
                                        )}
                                        {status === 'visited' && (
                                          <span className="badge success" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                            ✅ {t('era.status_visited')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Toggle buttons */}
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        onClick={() => handleHeritageStatusClick(heritage, 'planned')}
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          transition: 'all 0.2s',
                                          border: status === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                          background: status === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
                                          color: status === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)'
                                        }}
                                        title={i18n.language === 'ko' ? '갈 예정 등록 (역사 퀴즈)' : 'Register Planned (History Quiz)'}
                                      >
                                        📌 {i18n.language === 'ko' ? '갈 예정' : 'Plan'}
                                      </button>
                                      <button
                                        onClick={() => handleHeritageStatusClick(heritage, 'visited')}
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          cursor: 'pointer',
                                          transition: 'all 0.2s',
                                          border: status === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                          background: status === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'var(--surface)',
                                          color: status === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)'
                                        }}
                                        title={i18n.language === 'ko' ? '갔다옴 등록 (역사 퀴즈 및 후기)' : 'Register Visited (History Quiz & Review)'}
                                      >
                                        ✅ {i18n.language === 'ko' ? '갔다옴' : 'Visited'}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div style={{ fontSize: '0.8rem', color: 'var(--surface-foreground)', marginTop: '6px', lineHeight: 1.4 }}>
                                    {t(heritage.description)}
                                  </div>

                                  {/* Review display/edit section */}
                                  {status === 'visited' && (
                                    <div className="heritage-review-box" style={{ marginTop: '8px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                                        <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontStyle: heritageReviews[heritage.id] ? 'normal' : 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>
                                          {heritageReviews[heritage.id] || (i18n.language === 'ko' ? '작성된 후기가 없습니다. [수정]을 눌러 등록해 보세요!' : 'No review written. Click [Edit] to write one!')}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
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
            {!isSupabaseConfigured ? (
              <div className="quiz-alert mock">
                <AlertCircle size={16} />
                <span>{t('quiz.mock_alert')}</span>
              </div>
            ) : supabaseError ? (
              <div className="quiz-alert paused">
                <AlertCircle size={16} />
                <span>{t('quiz.supabase_paused_alert')}</span>
              </div>
            ) : isFavoritesTableMissing ? (
              <div className="quiz-alert missing">
                <AlertCircle size={16} />
                <span>{t('quiz.supabase_missing_table_alert')}</span>
              </div>
            ) : (
              <div className="quiz-alert supabase">
                <Database size={16} />
                <span>{t('quiz.supabase_alert')}</span>
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
                          <option value="prehistoric">{t('era.eras.prehistoric')}</option>
                          <option value="baekje">{t('era.eras.baekje')}</option>
                          <option value="later_baekje">{t('era.eras.later_baekje')}</option>
                          <option value="goryeo">{t('era.eras.goryeo')}</option>
                          <option value="joseon">{t('era.eras.joseon')}</option>
                          <option value="modern">{t('era.eras.modern')}</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>
                          {t('quiz.region_select')}
                        </label>
                        <select className="quiz-filter-select" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
                          <option value="all">{t('quiz.all')}</option>
                          <option value="전주">{i18n.language === 'ko' ? '전주' : 'Jeonju'}</option>
                          <option value="군산">{i18n.language === 'ko' ? '군산' : 'Gunsan'}</option>
                          <option value="익산">{i18n.language === 'ko' ? '익산' : 'Iksan'}</option>
                          <option value="정읍">{i18n.language === 'ko' ? '정읍' : 'Jeongeup'}</option>
                          <option value="남원">{i18n.language === 'ko' ? '남원' : 'Namwon'}</option>
                          <option value="김제">{i18n.language === 'ko' ? '김제' : 'Gimje'}</option>
                          <option value="완주">{i18n.language === 'ko' ? '완주' : 'Wanju'}</option>
                          <option value="진안">{i18n.language === 'ko' ? '진안' : 'Jinan'}</option>
                          <option value="무주">{i18n.language === 'ko' ? '무주' : 'Muju'}</option>
                          <option value="임실">{i18n.language === 'ko' ? '임실' : 'Imsil'}</option>
                          <option value="고창">{i18n.language === 'ko' ? '고창' : 'Gochang'}</option>
                          <option value="부안">{i18n.language === 'ko' ? '부안' : 'Buan'}</option>
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
            MY LOG: 나의 기록 (Reviews & Solved Quizzes)
        ========================================= */}
        {activeTab === 'safety' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{t('tabs.safety')}</h3>
            <p style={{ color: 'var(--surface-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {i18n.language === 'ko' 
                ? '내가 다녀온 유적지의 생생한 후기와 역사 퀴즈 풀이 결과를 모아봅니다.' 
                : 'Collect my vivid reviews of visited heritage sites and historical quiz results.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }} className="safety-grid">
              {/* Column 1: Reviews */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <BookOpen size={20} color="var(--primary)" />
                  {i18n.language === 'ko' ? '나의 탐방 후기' : 'My Visit Reviews'}
                </div>

                {visitedHeritages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--surface-foreground)' }}>
                    <MapIcon size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5, display: 'block' }} />
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {i18n.language === 'ko'
                        ? '아직 다녀온 유적지가 없습니다.'
                        : 'No visited heritage sites yet.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                    {visitedHeritages.map(heritage => {
                      const isEditing = editingHeritageId === heritage.id;
                      return (
                        <div key={heritage.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t(heritage.name)}</span>
                            <span className="badge green" style={{ margin: 0 }}>갔다옴 ✅</span>
                          </div>
                          
                          {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                              <textarea
                                value={editingReviewText}
                                onChange={(e) => setEditingReviewText(e.target.value)}
                                style={{
                                  width: '100%',
                                  minHeight: '60px',
                                  padding: '8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--primary)',
                                  fontSize: '0.8rem',
                                  resize: 'vertical',
                                  background: 'var(--surface)',
                                  color: 'var(--foreground)'
                                }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                                <button
                                  onClick={() => setEditingHeritageId(null)}
                                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  {i18n.language === 'ko' ? '취소' : 'Cancel'}
                                </button>
                                <button
                                  onClick={() => handleSaveEditedReview(heritage.id)}
                                  style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  {i18n.language === 'ko' ? '저장' : 'Save'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ marginTop: '4px' }}>
                              <p style={{ fontSize: '0.8rem', color: 'var(--surface-foreground)', margin: '0 0 6px 0', minHeight: '20px', whiteSpace: 'pre-wrap' }}>
                                {heritageReviews[heritage.id] || (i18n.language === 'ko' ? '등록된 후기가 없습니다.' : 'No review registered.')}
                              </p>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                  onClick={() => {
                                    setEditingHeritageId(heritage.id);
                                    setEditingReviewText(heritageReviews[heritage.id] || '');
                                  }}
                                  style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                >
                                  {i18n.language === 'ko' ? '수정' : 'Edit'}
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(heritage.id)}
                                  style={{ border: 'none', background: 'none', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                                >
                                  {i18n.language === 'ko' ? '삭제' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Column 2: Quiz Log */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <Award size={20} color="var(--gold)" />
                  {i18n.language === 'ko' ? '나의 퀴즈 기록' : 'My Quiz Logs'}
                </div>

                {Object.keys(solvedQuizzes).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--surface-foreground)' }}>
                    <Award size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5, display: 'block' }} />
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {i18n.language === 'ko'
                        ? '아직 해결한 퀴즈가 없습니다.'
                        : 'No solved quizzes yet.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                    {Object.entries(solvedQuizzes)
                      .sort((a, b) => new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime())
                      .map(([key, solved]) => {
                        const isHeritage = key.startsWith('heritage_');
                        return (
                          <div key={key} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--surface-foreground)' }}>
                                {isHeritage ? (i18n.language === 'ko' ? '🏛️ 유적지 퀴즈' : '🏛️ Heritage Quiz') : (i18n.language === 'ko' ? '❓ 일반 퀴즈' : '❓ General Quiz')}
                              </span>
                              <span className={`badge ${solved.isCorrect ? 'green' : 'red'}`} style={{ margin: 0 }}>
                                {solved.isCorrect ? (i18n.language === 'ko' ? '정답 👏' : 'Correct 👏') : (i18n.language === 'ko' ? '오답 😢' : 'Incorrect 😢')}
                              </span>
                            </div>
                            
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: '2px 0 6px 0', lineHeight: 1.4 }}>
                              Q. {solved.questionText}
                            </p>
                            
                            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px 8px', borderRadius: '6px', background: 'var(--surface)' }}>
                              <div>
                                <span style={{ color: 'var(--surface-foreground)' }}>
                                  {i18n.language === 'ko' ? '선택한 답: ' : 'Your Answer: '}
                                </span>
                                <span style={{ fontWeight: 700, color: solved.isCorrect ? 'var(--primary)' : '#dc2626' }}>
                                  {solved.selectedAnswer}
                                </span>
                              </div>
                              {!solved.isCorrect && (
                                <div>
                                  <span style={{ color: 'var(--surface-foreground)' }}>
                                    {i18n.language === 'ko' ? '정답: ' : 'Correct Answer: '}
                                  </span>
                                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                    {solved.correctAnswer}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.65rem', color: 'var(--surface-foreground)', marginTop: '2px' }}>
                              {new Date(solved.timestamp).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
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
        <button className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}><BookOpen /><span>{t('tabs.safety')}</span></button>
      </nav>



      {/* Campsite Route & Map Modal Layer */}
      {activeRouteCampsiteId && (() => {
        const campsite = allDisplayCampsites.find(c => c.id === activeRouteCampsiteId);
        if (!campsite) return null;

        const routeHeritages = MASTER_HERITAGES.filter(h => campsite.nearbyHeritageIds.includes(h.id));
        const routePolylinePaths = routeHeritages.map(h => [
          { lat: campsite.lat, lng: campsite.lng },
          { lat: h.lat, lng: h.lng }
        ]);

        return (
          <div className="modal-backdrop" onClick={() => setActiveRouteCampsiteId(null)}>
            <div className="route-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⛺ {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
                </div>
                <button className="modal-close-btn" onClick={() => setActiveRouteCampsiteId(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="route-layout">
                {/* Kakao Map Component */}
                <div className="route-map-container">
                  <Map
                    center={{ lat: campsite.lat, lng: campsite.lng }}
                    style={{ width: "100%", height: "100%" }}
                    level={campsite.id.startsWith('public-') ? 9 : (campsite.id === 'mireuksa' ? 6 : 8)}
                  >
                    {/* Campsite Marker */}
                    <MapMarker
                      position={{ lat: campsite.lat, lng: campsite.lng }}
                      image={{
                        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                        size: { width: 24, height: 35 }
                      }}
                    >
                      <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", borderRadius: "4px", fontWeight: "bold" }}>
                        ⛺ {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
                      </div>
                    </MapMarker>

                    {/* Nearby Heritage Markers */}
                    {routeHeritages.map(heritage => (
                      <MapMarker key={heritage.id} position={{ lat: heritage.lat, lng: heritage.lng }}>
                        <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", fontWeight: 'bold' }}>
                          🏛️ {t(heritage.name)}
                        </div>
                      </MapMarker>
                    ))}

                    {/* Connection lines */}
                    {routePolylinePaths.map((path, idx) => (
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

                {/* Timeline Info Panel */}
                <div className="card gold-accent route-info-container" style={{ marginBottom: 0 }}>
                  <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={20} color="var(--gold)"/>
                      {t('route.card.title', { campsiteName: campsite.id.startsWith('public-') ? campsite.name : t(campsite.name) })}
                    </div>
                    
                    {/* Campsite statuses planned/visited toggle */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => toggleStatus(campsite.id, 'planned')}
                        style={{
                          padding: '4px 8px',
                          background: campsiteStatuses[campsite.id] === 'planned' ? 'var(--gold)' : 'none',
                          color: campsiteStatuses[campsite.id] === 'planned' ? 'white' : 'var(--surface-foreground)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        📌 {t('era.status_planned')}
                      </button>
                      <button
                        onClick={() => toggleStatus(campsite.id, 'visited')}
                        style={{
                          padding: '4px 8px',
                          background: campsiteStatuses[campsite.id] === 'visited' ? 'var(--primary)' : 'none',
                          color: campsiteStatuses[campsite.id] === 'visited' ? 'white' : 'var(--surface-foreground)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✅ {t('era.status_visited')}
                      </button>
                    </div>
                  </div>

                  <div className="route-timeline" style={{ position: 'relative', paddingLeft: '1.5rem', marginTop: '1rem' }}>
                    <div className="timeline-line"></div>
                    
                    {/* Day 1 Check-in */}
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="time">DAY 1 - 14:00</div>
                        <div className="title">
                          {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)} {i18n.language === 'ko' ? '체크인' : 'Check-in'}
                        </div>
                        <div className="desc">
                          {campsite.id.startsWith('public-') ? campsite.description : t(campsite.description)}
                        </div>
                      </div>
                    </div>

                    {/* Heritage steps */}
                    {routeHeritages.length > 0 ? (
                      routeHeritages.map((heritage, index) => (
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
                              
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleHeritageStatusClick(heritage, 'planned')}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: heritageStatuses[heritage.id] === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                                    background: heritageStatuses[heritage.id] === 'planned' ? 'rgba(217, 119, 6, 0.08)' : 'var(--surface)',
                                    color: heritageStatuses[heritage.id] === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)'
                                  }}
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
                                    border: heritageStatuses[heritage.id] === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: heritageStatuses[heritage.id] === 'visited' ? 'rgba(22, 101, 52, 0.08)' : 'var(--surface)',
                                    color: heritageStatuses[heritage.id] === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)'
                                  }}
                                >
                                  ✅ {i18n.language === 'ko' ? '갔다옴' : 'Visited'}
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveQuizHeritage(heritage);
                                    setActiveQuizTargetStatus('visited');
                                    setHeritageQuizAnswered(false);
                                    setHeritageQuizSelectedIdx(null);
                                    setHeritageQuizReviewText(heritageReviews[heritage.id] || '');
                                  }}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '1px solid var(--primary)',
                                    background: 'var(--primary)',
                                    color: 'white'
                                  }}
                                >
                                  ❓ {i18n.language === 'ko' ? '역사퀴즈' : 'Quiz'}
                                </button>
                              </div>
                            </div>
                            
                            <div className="desc" style={{ marginTop: '6px' }}>{t(heritage.description)}</div>

                            {/* Review Box */}
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
          </div>
        );
      })()}

      {/* Heritage Quiz & Review Modal overlay */}
      {activeQuizHeritage && activeQuizTargetStatus && (() => {
        const quizObj = HERITAGE_QUIZZES[activeQuizHeritage.id];
        if (!quizObj) return null;
        const quiz = i18n.language === 'ko' ? quizObj.ko : quizObj.en;
        return (
          <div className="modal-backdrop" style={{ zIndex: 3000 }} onClick={() => {
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
