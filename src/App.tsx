import { useState, useEffect } from 'react'
import { Tent, Compass, Map as MapIcon, ShieldCheck, MapPin, Clock, Flame, Accessibility, Info, Star, Navigation, Award, CheckCircle2, XCircle, AlertCircle, Database } from 'lucide-react'
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
    nearbyHeritageIds: ['donggosanseong'],
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
    id: 'gomanaru',
    name: 'campsites.gomanaru.name',
    description: 'campsites.gomanaru.desc',
    lat: 36.4678,
    lng: 127.1022,
    era: 'baekje',
    tags: ['솔밭야영', '#공산성', '#무령왕릉'],
    distanceToHistoric: 2.1,
    nearbyHeritageIds: ['gongsanseong', 'muryeong_tomb'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'baekmagang',
    name: 'campsites.baekmagang.name',
    description: 'campsites.baekmagang.desc',
    lat: 36.2698,
    lng: 126.8995,
    era: 'baekje',
    tags: ['강변뷰', '#부소산성', '#정림사지', '#왕릉원'],
    distanceToHistoric: 2.7,
    nearbyHeritageIds: ['busosanseong', 'jeonglimsa_site', 'neungsanri_tombs'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'munjangdae',
    name: 'campsites.munjangdae.name',
    description: 'campsites.munjangdae.desc',
    lat: 36.4522,
    lng: 127.9733,
    era: 'later_baekje',
    tags: ['계곡 인접', '속리산', '#견훤산성'],
    distanceToHistoric: 3.8,
    nearbyHeritageIds: ['gyeonhwon_sanseong'],
    resveCl: '전화',
    resveUrl: ''
  },
  {
    id: 'goryeosan',
    name: 'campsites.goryeosan.name',
    description: 'campsites.goryeosan.desc',
    lat: 37.7262,
    lng: 126.4385,
    era: 'goryeo',
    tags: ['숲속 캠핑', '조용한 분위기', '#고려궁지'],
    distanceToHistoric: 4.8,
    nearbyHeritageIds: ['goryeogung_site'],
    resveCl: '온라인야영장예약,전화',
    resveUrl: ''
  },
  {
    id: 'nonsan_camp',
    name: 'campsites.nonsan_camp.name',
    description: 'campsites.nonsan_camp.desc',
    lat: 36.1750,
    lng: 127.1120,
    era: 'goryeo',
    tags: ['산림욕', '#은진미륵'],
    distanceToHistoric: 1.8,
    nearbyHeritageIds: ['gwanchoksa_buddha'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'nanji',
    name: 'campsites.nanji.name',
    description: 'campsites.nanji.desc',
    lat: 37.5702,
    lng: 126.8732,
    era: 'joseon',
    tags: ['한강뷰', '도심지 야영', '#경복궁', '#창덕궁', '#종묘'],
    distanceToHistoric: 9.3,
    nearbyHeritageIds: ['gyeongbokgung', 'changdeokgung', 'jongmyo'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'gwanggyo',
    name: 'campsites.gwanggyo.name',
    description: 'campsites.gwanggyo.desc',
    lat: 37.2722,
    lng: 127.0601,
    era: 'joseon',
    tags: ['호수공원', '시설 상급', '#수원화성'],
    distanceToHistoric: 4.8,
    nearbyHeritageIds: ['suwon_hwaseong'],
    resveCl: '온라인야영장예약',
    resveUrl: ''
  },
  {
    id: 'songdo',
    name: 'campsites.songdo.name',
    description: 'campsites.songdo.desc',
    lat: 37.3712,
    lng: 126.6022,
    era: 'modern',
    tags: ['대형 레저', '#개항장거리'],
    distanceToHistoric: 11.4,
    nearbyHeritageIds: ['incheon_open_port'],
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
    id: 'godori_buddha',
    name: 'heritages.godori_buddha.name',
    description: 'heritages.godori_buddha.desc',
    lat: 35.9868,
    lng: 127.1264,
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
    id: 'gongsanseong',
    name: 'heritages.gongsanseong.name',
    description: 'heritages.gongsanseong.desc',
    lat: 36.4601,
    lng: 127.1264,
    era: 'baekje'
  },
  {
    id: 'muryeong_tomb',
    name: 'heritages.muryeong_tomb.name',
    description: 'heritages.muryeong_tomb.desc',
    lat: 36.4605,
    lng: 127.1147,
    era: 'baekje'
  },
  {
    id: 'busosanseong',
    name: 'heritages.busosanseong.name',
    description: 'heritages.busosanseong.desc',
    lat: 36.2912,
    lng: 126.9142,
    era: 'baekje'
  },
  {
    id: 'jeonglimsa_site',
    name: 'heritages.jeonglimsa_site.name',
    description: 'heritages.jeonglimsa_site.desc',
    lat: 36.2789,
    lng: 126.9141,
    era: 'baekje'
  },
  {
    id: 'neungsanri_tombs',
    name: 'heritages.neungsanri_tombs.name',
    description: 'heritages.neungsanri_tombs.desc',
    lat: 36.2683,
    lng: 126.9328,
    era: 'baekje'
  },
  {
    id: 'gyeonhwon_sanseong',
    name: 'heritages.gyeonhwon_sanseong.name',
    description: 'heritages.gyeonhwon_sanseong.desc',
    lat: 36.4820,
    lng: 127.9944,
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
    id: 'goryeogung_site',
    name: 'heritages.goryeogung_site.name',
    description: 'heritages.goryeogung_site.desc',
    lat: 37.7511,
    lng: 126.4844,
    era: 'goryeo'
  },
  {
    id: 'gwanchoksa_buddha',
    name: 'heritages.gwanchoksa_buddha.name',
    description: 'heritages.gwanchoksa_buddha.desc',
    lat: 36.1868,
    lng: 127.0986,
    era: 'goryeo'
  },
  {
    id: 'gyeongbokgung',
    name: 'heritages.gyeongbokgung.name',
    description: 'heritages.gyeongbokgung.desc',
    lat: 37.5796,
    lng: 126.9770,
    era: 'joseon'
  },
  {
    id: 'changdeokgung',
    name: 'heritages.changdeokgung.name',
    description: 'heritages.changdeokgung.desc',
    lat: 37.5794,
    lng: 126.9910,
    era: 'joseon'
  },
  {
    id: 'jongmyo',
    name: 'heritages.jongmyo.name',
    description: 'heritages.jongmyo.desc',
    lat: 37.5746,
    lng: 126.9941,
    era: 'joseon'
  },
  {
    id: 'suwon_hwaseong',
    name: 'heritages.suwon_hwaseong.name',
    description: 'heritages.suwon_hwaseong.desc',
    lat: 37.2897,
    lng: 127.0118,
    era: 'joseon'
  },
  {
    id: 'mokpo_modern',
    name: 'heritages.mokpo_modern.name',
    description: 'heritages.mokpo_modern.desc',
    lat: 34.7865,
    lng: 126.3811,
    era: 'modern'
  },
  {
    id: 'incheon_open_port',
    name: 'heritages.incheon_open_port.name',
    description: 'heritages.incheon_open_port.desc',
    lat: 37.4727,
    lng: 126.6212,
    era: 'modern'
  },
  {
    id: 'daegu_modern',
    name: 'heritages.daegu_modern.name',
    description: 'heritages.daegu_modern.desc',
    lat: 35.8718,
    lng: 128.5911,
    era: 'modern'
  }
];

// Mock nationwide region public campsites data (Fallback for Open API)
const MOCK_NATIONWIDE_CAMPS = [
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
  { id: 'public-mock-13', name: '인천 영흥도 솔밭캠핑장', addr: '인천 옹진군 영흥면 내리 8-2', lat: 37.2515, lng: 126.4985, tel: '032-899-2114', induty: '일반야영장', description: '영흥도 서쪽 해변 소나무 숲속에 위치한 오션뷰 캠핑장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-14', name: '공주 계룡산 오토캠핑장', addr: '충남 공주시 반포면 학봉리 12-5', lat: 36.3545, lng: 127.2120, tel: '041-856-7700', induty: '오토캠핑', description: '국립공원 계룡산 자락에 안겨 맑은 공기와 절경을 즐기는 캠핑장.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-15', name: '부여 만수산자연휴양림 야영장', addr: '충남 부여군 외산면 삼용리 산41-3', lat: 36.2145, lng: 126.7380, tel: '041-830-2348', induty: '일반야영장', description: '만수산 골짜기의 울창한 천연림 속에 자리 잡아 시원하고 쾌적한 휴식처.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-16', name: '상주 성주봉자연휴양림 야영장', addr: '경북 상주시 은척면 남곡리 산50', lat: 36.4185, lng: 128.0085, tel: '054-541-6512', induty: '일반야영장', description: '성주봉 산마루 아래 맑은 계곡물과 울창한 숲이 어우러진 숲속 야영장.', resveCl: '현장', resveUrl: '' },
  { id: 'public-mock-17', name: '강화도 함허동천 야영장', addr: '인천 강화군 화도면 사기리 산86', lat: 37.6185, lng: 126.4715, tel: '032-930-7066', induty: '일반야영장', description: '마니산 기슭 계곡을 끼고 들어서 구름 한 점 없는 맑은 하늘을 벗 삼는 곳.', resveCl: '온라인야영장예약,현장', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-18', name: '논산 탑정호 오토캠핑장', addr: '충남 논산시 가야곡면 종연리 117', lat: 36.1915, lng: 127.1585, tel: '041-746-5114', induty: '오토캠핑', description: '아름다운 출렁다리가 있는 탑정호 호숫가에 위치한 전망 좋은 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-19', name: '서울 중랑캠핑숲', addr: '서울 중랑구 망우동 241-20', lat: 37.6045, lng: 127.1085, tel: '02-434-4371', induty: '오토캠핑', description: '도심 속에서 자연을 그대로 느끼는 생태 학습 및 여가 활용형 프리미엄 캠핑장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' },
  { id: 'public-mock-20', name: '수원 매송오토캠핑장', addr: '경기 수원시 권선구 매송고색로 52', lat: 37.2488, lng: 126.9288, tel: '031-228-2000', induty: '오토캠핑', description: '도시 외곽 한적하고 넓은 부지에 안전하고 쾌적하게 조성된 시립 오토캠핑장.', resveCl: '', resveUrl: '' },
  { id: 'public-mock-21', name: '목포 대반동 카라반파크', addr: '전남 목포시 죽교동 440-5', lat: 34.7925, lng: 126.3685, tel: '061-270-8430', induty: '카라반, 글램핑', description: '목포대교가 눈앞에 펼쳐지는 환상적인 밤바다 오션뷰 카라반 야영지.', resveCl: '전화', resveUrl: '' },
  { id: 'public-mock-22', name: '대구 팔공산 동화지구 야영장', addr: '대구 동구 용수동 72-5', lat: 36.0125, lng: 128.7020, tel: '053-980-0300', induty: '일반야영장', description: '팔공산 올레길 입구, 소나무와 참나무가 어우러진 계곡 옆 도심 근교 야영장.', resveCl: '온라인야영장예약', resveUrl: 'https://gocamping.or.kr' }
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

  // Fetch Public campsites from Korea Tourism Organization Open API (with Local Proxy support)
  const fetchPublicCamps = async () => {
    if (publicCamps.length > 0) return;
    setLoadingPublicCamps(true);

    if (isGocampingConfigured) {
      try {
        const isDev = import.meta.env.DEV;
        // Use Vite Proxy in local dev mode to bypass CORS
        const baseUrl = isDev ? '/api-gocamping' : 'https://apis.data.go.kr';
        const url = `${baseUrl}/B551011/GoCamping/basedList?serviceKey=${gocampingApiKey}&numOfRows=2500&pageNo=1&MobileOS=ETC&MobileApp=historyCamper&_type=json`;

        console.log("Fetching GoCamping Public API:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        const items = result?.response?.body?.items?.item;

        if (Array.isArray(items)) {
          // Map all items from GoCamping API without regional filtering
          const mapped = items.map((item: any) => ({
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

          setPublicCamps(mapped);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Failed to load GoCamping API, falling back to mock nationwide list:", err);
        setPublicCamps(MOCK_NATIONWIDE_CAMPS);
      } finally {
        setLoadingPublicCamps(false);
      }
    } else {
      // Fallback to local mock dataset if API key isn't provided
      setPublicCamps(MOCK_NATIONWIDE_CAMPS);
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
  
  const targetPublicSource = publicCamps.length > 0 ? publicCamps : MOCK_NATIONWIDE_CAMPS;
  
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
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <div className="time">
                            {index === 0 ? "DAY 1 - 16:00" : `DAY 2 - 10:00`}
                          </div>
                          <div className="title">{t(heritage.name)}</div>
                          <div className="desc">{t(heritage.description)}</div>
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
    </div>
  )
}

export default App
