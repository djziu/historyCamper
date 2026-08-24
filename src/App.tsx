import { useState, useEffect, useRef, useMemo } from 'react'
import { Tent, Map as MapIcon, MapPin, Clock, Award, CheckCircle2, XCircle, AlertCircle, X, BookOpen, ChevronLeft, LogIn, LogOut, User } from 'lucide-react'
import { Map, MapMarker, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured, QuizQuestion, Campsite, HeritageSite } from './supabaseClient'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

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

// Gamification: Badges & Stamp Tour configuration
export interface Badge {
  id: string;
  nameKo: string;
  nameEn: string;
  descKo: string;
  descEn: string;
  icon: string;
  color: string;
  checkUnlocked: (
    heritageStatuses: Record<string, 'planned' | 'visited'>,
    solvedQuizzes: Record<string, any>,
    heritageReviews: Record<string, string>
  ) => boolean;
}

const BADGES: Badge[] = [
  {
    id: 'first_step',
    nameKo: '첫 역사적인 발걸음',
    nameEn: 'First Step',
    descKo: '처음으로 유적지 탐방(탐방 완료)을 등록해 보세요.',
    descEn: 'Mark your very first heritage site as visited.',
    icon: '👣',
    color: '#60a5fa',
    checkUnlocked: (statuses) => Object.values(statuses).some(s => s === 'visited')
  },
  {
    id: 'baekje_explorer',
    nameKo: '찬란한 백제의 탐험가',
    nameEn: 'Baekje Explorer',
    descKo: '전북 백제 시대의 모든 유적지를 다녀오세요.',
    descEn: 'Visit all Baekje era heritage sites in Jeonbuk.',
    icon: '👑',
    color: '#34d399',
    checkUnlocked: (statuses) => {
      const targets = MASTER_HERITAGES.filter(h => h.era === 'baekje');
      return targets.length > 0 && targets.every(h => statuses[h.id] === 'visited');
    }
  },
  {
    id: 'joseon_scholar',
    nameKo: '학식 깊은 조선의 선비',
    nameEn: 'Joseon Scholar',
    descKo: '전북 조선 시대의 모든 유적지를 다녀오세요.',
    descEn: 'Visit all Joseon era heritage sites in Jeonbuk.',
    icon: '📜',
    color: '#f59e0b',
    checkUnlocked: (statuses) => {
      const targets = MASTER_HERITAGES.filter(h => h.era === 'joseon');
      return targets.length > 0 && targets.every(h => statuses[h.id] === 'visited');
    }
  },
  {
    id: 'modern_collector',
    nameKo: '모던 전북 수집가',
    nameEn: 'Modern Collector',
    descKo: '전북 근대 시대의 모든 유적지를 다녀오세요.',
    descEn: 'Visit all Modern era heritage sites in Jeonbuk.',
    icon: '🎩',
    color: '#ec4899',
    checkUnlocked: (statuses) => {
      const targets = MASTER_HERITAGES.filter(h => h.era === 'modern');
      return targets.length > 0 && targets.every(h => statuses[h.id] === 'visited');
    }
  },
  {
    id: 'patriotic_hero',
    nameKo: '호국의 영웅',
    nameEn: 'Patriotic Hero',
    descKo: '남원 만인의총, 정읍 황토현 전적지, 고창읍성을 모두 방문해 보세요.',
    descEn: 'Visit all three historical defense sites in Jeonbuk.',
    icon: '🛡️',
    color: '#ef4444',
    checkUnlocked: (statuses) => {
      const targets = ['maninsuichong', 'hwangtohyon', 'gochang_eupseong'];
      return targets.every(id => statuses[id] === 'visited');
    }
  },
  {
    id: 'camp_master',
    nameKo: '별빛 아래 캠퍼',
    nameEn: 'Camping Master',
    descKo: '역사지 탐방 후기를 3개 이상 작성해 보세요.',
    descEn: 'Write at least 3 reviews for visited heritage sites.',
    icon: '⛺',
    color: '#10b981',
    checkUnlocked: (_, __, reviews) => Object.keys(reviews).length >= 3
  },
  {
    id: 'quiz_king',
    nameKo: '전북 역사 퀴즈왕',
    nameEn: 'Quiz Conqueror',
    descKo: '역사 퀴즈 정답을 5개 이상 맞혀보세요.',
    descEn: 'Correctly answer at least 5 history quizzes.',
    icon: '🏆',
    color: '#d97706',
    checkUnlocked: (_, quizzes) => Object.values(quizzes).filter((q: any) => q.isCorrect).length >= 5
  },
  {
    id: 'perfect_historian',
    nameKo: '완벽한 역사학자',
    nameEn: 'Grand Historian',
    descKo: '다른 모든 7개의 배지를 획득하여 최고 등급 배지를 해금하세요.',
    descEn: 'Unlock all other 7 badges to receive this ultimate honor.',
    icon: '✨',
    color: '#8b5cf6',
    checkUnlocked: (statuses, quizzes, reviews) => {
      const isFirst = Object.values(statuses).some(s => s === 'visited');
      const bTargets = MASTER_HERITAGES.filter(h => h.era === 'baekje');
      const isBaekje = bTargets.length > 0 && bTargets.every(h => statuses[h.id] === 'visited');
      const jTargets = MASTER_HERITAGES.filter(h => h.era === 'joseon');
      const isJoseon = jTargets.length > 0 && jTargets.every(h => statuses[h.id] === 'visited');
      const mTargets = MASTER_HERITAGES.filter(h => h.era === 'modern');
      const isModern = mTargets.length > 0 && mTargets.every(h => statuses[h.id] === 'visited');
      const isPatriotic = ['maninsuichong', 'hwangtohyon', 'gochang_eupseong'].every(id => statuses[id] === 'visited');
      const isCamp = Object.keys(reviews).length >= 3;
      const isQuiz = Object.values(quizzes).filter((q: any) => q.isCorrect).length >= 5;
      return isFirst && isBaekje && isJoseon && isModern && isPatriotic && isCamp && isQuiz;
    }
  }
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
const BASE_MOCK_QUIZZES_KO: QuizQuestion[] = MASTER_HERITAGES.map((h, index) => {
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

const BASE_MOCK_QUIZZES_EN: QuizQuestion[] = MASTER_HERITAGES.map((h, index) => {
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

const EXTRA_QUIZZES_KO: Omit<QuizQuestion, 'id'>[] = [
  {
    era: 'prehistoric',
    region: '김제',
    question: "전라북도 김제는 예로부터 한국 최대의 곡창지대로 알려져 있습니다. 김제에서 가을마다 열리는 대표적인 농경 문화 축제의 이름은 무엇인가요?",
    options: ["김제지평선축제", "정읍구절초축제", "고창모양성제", "임실N치즈축제"],
    correct_option_index: 0,
    explanation: "김제지평선축제는 황금벌판과 지평선을 배경으로 우리나라 최고(最古)의 저수지인 벽골제 일대에서 고대 농경 문화를 계승하고 벼농사의 역사를 기념하기 위해 열리는 축제입니다."
  },
  {
    era: 'baekje',
    region: '익산',
    question: "백제 무왕이 어릴 적 마(서동)를 캐며 신라 선화공주와 결혼하기 위해 아이들에게 부르게 했다는, 한국 역사상 최초의 4구체 향가의 제목은 무엇인가요?",
    options: ["서동요", "제망매가", "찬기파랑가", "처용가"],
    correct_option_index: 0,
    explanation: "서동요는 백제 30대 무왕(서동)이 신라 진평왕의 셋째 딸인 선화공주를 사모하여 아이들에게 마를 나누어 주며 부르게 한 백제 가요이자 신라의 향가입니다."
  },
  {
    era: 'joseon',
    region: '기타',
    question: "임진왜란과 정유재란 당시 이순신 장군이 남긴 한문 문구 중, '만약 전라도가 없었다면 나라 또한 없었을 것이다'라는 뜻의 유명한 문구는 무엇인가요?",
    options: ["약무호남 시무국가", "필사즉생 필생즉사", "물령망동 정중여산", "금신전선 상유십이"],
    correct_option_index: 0,
    explanation: "이순신 장군은 정유재란을 앞두고 사헌부 지평 현덕승에게 보낸 편지에서 '약무호남 시무국가(若無湖南 吾無國家)' 즉, '호남이 없으면 국가도 없다'는 말로 충무공의 나라 사랑과 호남의 전략적 중요성을 강조했습니다."
  },
  {
    era: 'modern',
    region: '정읍',
    question: "1894년 동학농민군이 고부 백산에 집결하여 발표한 행동 강령이자 혁명의 정당성을 밝힌 4대 행동 지침을 무엇이라고 하나요?",
    options: ["백산 사대명의", "무장포고문", "폐정개혁안", "홍범14조"],
    correct_option_index: 0,
    explanation: "동학농민군은 백산에 모여 전봉준을 대장으로 추대하고 '사람을 죽이지 말고 가축을 해치지 말라(불살인 불살물)' 등을 담은 '사대명의'를 선포하며 본격적인 농민혁명을 개시했습니다."
  },
  {
    era: 'joseon',
    region: '장수',
    question: "조선 태조 이성계의 태(탯줄)를 묻었던 곳이자, 백두대간의 맑은 정기가 서린 전라북도 장수의 대표적인 역사적 유적은 어디인가요?",
    options: ["장수 태조태실", "무주 사각사고", "임실 상이암", "남원 만인의총"],
    correct_option_index: 0,
    explanation: "장수 태조태실(전북 유형문화재)은 조선 건국 후 태조 이성계의 탯줄을 항아리에 담아 소중하게 보관하여 묻었던 왕실 역사 유적입니다."
  },
  {
    era: 'goryeo',
    region: '남원',
    question: "남원 실상사에 봉안되어 있는 보물 제41호 철조여래좌상에 대한 설명으로 옳은 것은 무엇인가요?",
    options: [
      "통일신라 후기 철로 만든 불상으로, 당시 발달한 제철 기술과 불교 예술의 융합을 보여준다.",
      "청동에 금을 두껍게 입힌 도금 불상이다.",
      "고려 후기 원나라 기술자가 진흙으로 빚은 소조상이다.",
      "화강암을 깎아 만든 거대 마애불이다."
    ],
    correct_option_index: 0,
    explanation: "실상사 철조여래좌상(보물)은 통일신라 후기(9세기)에 유행한 철조불상의 대표적인 유물로, 당시 발달했던 선종의 기풍과 호남 지역의 발달한 주철 기술을 잘 나타내어 줍니다."
  },
  {
    era: 'goryeo',
    region: '정읍',
    question: "신라 말기의 대문장가이자 유학자로, 태인 현감 시절 정읍 피향정 가를 거닐며 시를 읊고 풍류를 즐겼다고 전해지는 인물은 누구인가요?",
    options: ["최치원", "설총", "강수", "원효"],
    correct_option_index: 0,
    explanation: "신라의 천재 학자 고운 최치원 선생은 태산(현재의 정읍 태인) 태수로 재임하던 시절, 연못에 핀 연꽃 향에 반해 피향정을 짓고 풍류를 즐겼다는 역사적 전설을 남겼습니다."
  },
  {
    era: 'baekje',
    region: '익산',
    question: "익산 미륵사지 남쪽에 나란히 서 있는 보물 제236호로 지정된 두 돌기둥의 명칭이자, 사찰의 깃발(당)을 다는 지지대 역할을 했던 문화유산은 무엇인가요?",
    options: ["당간지주", "석등", "석탑 기단", "석조"],
    correct_option_index: 0,
    explanation: "미륵사지 당간지주(보물)는 사찰 행사나 의식 때 깃발을 다는 당간(깃대)을 흔들리지 않게 고정해 주던 한 쌍의 돌기둥입니다. 백제 통일신라 시기 석조 공예의 미학을 간직하고 있습니다."
  },
  {
    era: 'modern',
    region: '정읍',
    question: "키가 작아 '녹두장군'이라는 별명으로 불렸으며, 고부 민란을 주도하고 동학농민혁명의 최고 지도자 역할을 했던 역사적 인물은 누구인가요?",
    options: ["전봉준", "손화중", "김개남", "최제우"],
    correct_option_index: 0,
    explanation: "전봉준 장군은 몸집이 작아 녹두장군이라 불렸으며, 고부 군수 조병갑의 탐학에 항거해 백성들을 모아 고부 민란을 이끌고 1894년 동학농민운동의 총대장으로 활약했습니다."
  },
  {
    era: 'joseon',
    region: '고창',
    question: "고창 선운사 영산전에 봉안되어 있는 보물 제279호 금동아미타여래삼존상에 대한 설명으로 옳은 것은 무엇인가요?",
    options: ["조선 초기의 세련되고 온화한 조각 양식을 보여주는 불상으로, 도난당했다가 기적적으로 회수되었다.", "고려 무신정권 시절 최충헌의 원찰 불상이다.", "삼국시대 백제 가마에서 직접 구워낸 도자기 불상이다.", "조선 후기 흥선대원군이 직접 주조하여 기증한 불상이다."],
    correct_option_index: 0,
    explanation: "선운사 금동아미타여래삼존상(보물)은 조선 초기 정교하고 우아한 불교 조각 양식을 대표하는 불상입니다. 2000년대 후반 문화재 도굴범들에게 도난당했다가 기적적으로 온전히 회수되었습니다."
  },
  {
    era: 'joseon',
    region: '전주',
    question: "조선시대 임진왜란 당시, 전국에 있던 4대 사고 중 유일하게 불타지 않고 조선왕조실록을 온전히 지켜낸 전주의 사고는 어디인가요?",
    options: ["전주사고", "춘추관사고", "충주사고", "성주사고"],
    correct_option_index: 0,
    explanation: "임진왜란 때 서울(춘추관), 충주, 성주 사고에 보관되던 실록은 모두 유실되었으나, 전주사고의 실록은 내장산 등으로 안전하게 대피시켜 유일하게 보존되었습니다. 이를 바탕으로 실록이 재출판되어 역사가 이어졌습니다."
  },
  {
    era: 'joseon',
    region: '군산',
    question: "군산 임피면에 있는 조선시대 지방 관청 건물로, 인근에 살았던 소설 '탁류'의 작가 채만식과도 깊은 역사적 연관을 띠며 전통 객사 양식을 보존하고 있는 이곳은 어디인가요?",
    options: ["임피객사", "군산부청", "구 군산세관", "임피역사"],
    correct_option_index: 0,
    explanation: "임피객사는 조선 시대 임피현의 지방 관청(객사)으로, 국왕의 위패를 모시고 매달 망궐례를 올리거나 지방에 온 관리들의 숙소로 사용되던 대표적인 목조건축물입니다."
  },
  {
    era: 'joseon',
    region: '부안',
    question: "부안 변산반도 개암사에 봉안된 보물 제292호 대웅전 내부 천장에 조각되어 있으며, 용머리와 함께 화려한 천장 문양을 채우고 있어 조선 후기 불교 조각의 백미로 꼽히는 것은 무엇인가요?",
    options: ["대웅전 봉황과 청룡 조각", "철조 미륵불상", "석탑 부도군", "사천왕 벽화"],
    correct_option_index: 0,
    explanation: "부안 개암사 대웅전(보물) 내부 천장에는 대들보 위로 튀어나온 용머리와 봉황 조각이 매우 역동적이고 화려하게 장식되어 있어, 조선 후기 불교 목조 공예의 뛰어난 예술성을 보여줍니다."
  },
  {
    era: 'baekje',
    region: '익산',
    question: "2009년 익산 미륵사지 석탑 해체 보수 과정에서 탑 내부 심초석에서 발견된, 백제 왕실의 석탑 건립 경위와 기증자(사택적덕의 딸인 백제 왕후)가 명확히 기록되어 백제 역사를 새로 쓰게 만든 유물은 무엇인가요?",
    options: ["미륵사지 석탑 사리장엄구", "왕궁리 금강경판", "무령왕릉 지석", "칠지도"],
    correct_option_index: 0,
    explanation: "미륵사지 석탑 사리장엄구(국보)는 금제사리봉영기를 비롯해 다양한 장신구로 구성되어 있으며, 백제 왕후가 재물을 희사하여 미륵사를 창건하고 사리를 봉안했다는 기록이 선명히 남아있어 역사학계를 놀라게 했습니다."
  },
  {
    era: 'joseon',
    region: '완주',
    question: "조선 후기 유사시 전주 경기전에 봉안된 태조 이성계의 어진과 조경묘의 위패를 임진왜란이나 민란 등으로부터 대피시키기 위해 완주에 16km에 달하는 둘레로 쌓았던 산성은 어디인가요?",
    options: ["위봉산성", "남고산성", "동고산성", "적상산성"],
    correct_option_index: 0,
    explanation: "위봉산성(사적)은 1675년(숙종 1년)에 축성되어 실제로 동학농민운동 당시 전주성이 함락되자 경기전의 태조 어진과 위패를 이곳으로 피난시켜 보관하기도 하였습니다."
  },
  {
    era: 'joseon',
    region: '순창',
    question: "순창군 구림면 만일사에 보존되어 있으며, 조선 태조 이성계가 등극하기 전에 무학대사와 함께 이곳에서 나라를 위해 기도하고 중건했음을 전하는 비석의 이름은 무엇인가요?",
    options: ["순창 만일사비", "남원 황산대첩비", "북한산 진흥왕 순수비", "광개토대왕비"],
    correct_option_index: 0,
    explanation: "순창 만일사비(전북 유형문화재)는 태조 이성계가 등극하기 전 만일사에서 기도할 때, 무학대사가 이 절을 중창하여 왕조 창업을 도왔다는 역사적 전설을 기록하고 있는 비석입니다."
  },
  {
    era: 'joseon',
    region: '진안',
    question: "진안군 마령면 섬진강 상류 암벽 아래 천연 동굴 모양의 홈에 마치 제비집처럼 세워진 독특한 2층 누각으로, 보물 제2055호로 지정된 이 아름다운 유적은 무엇인가요?",
    options: ["수선루", "한벽당", "피향정", "광한루"],
    correct_option_index: 0,
    explanation: "수선루(보물)는 암벽에 자연적으로 생긴 굴 안쪽에 지어진 정자로, 신선이 노니는 누각이라는 뜻을 지니며 주변 자연지형을 극적으로 활용한 한국 전통 정자 건축의 독특한 예입니다."
  },
  {
    era: 'joseon',
    region: '무주',
    question: "전라북도 무주에 위치해 있으며, 삼남(충청, 전라, 경상)의 3대 누각 중 하나로 불리며 수많은 시인 묵객들이 시를 읊었던 보물 지정 누각은 무엇인가요?",
    options: ["한풍루", "희풍루", "풍남문", "망경루"],
    correct_option_index: 0,
    explanation: "무주 한풍루(보물)는 전주의 한벽당, 삼척의 죽서루 등과 함께 삼남의 대표적 명승 누각으로 꼽힙니다. 임진왜란 때 왜군에 의해 소실되었다가 중건되는 등 파란만장한 역사를 겪었습니다."
  },
  {
    era: 'goryeo',
    region: '익산',
    question: "익산 왕궁리 오층석탑(국보)을 해체 수리할 때 탑의 옥개석에서 발견된, 정교한 금제 사리함과 녹색 유리 사리병 등으로 대표되는 국보 제123호 유물의 명칭은 무엇인가요?",
    options: ["왕궁리 오층석탑 사리장엄구", "미륵사지 석탑 사리장엄구", "감은사지 석탑 사리장엄구", "무량사 5층석탑 사리구"],
    correct_option_index: 0,
    explanation: "왕궁리 오층석탑 사리장엄구(국보 제123호)는 순금으로 만든 금강경판, 정교한 금제 사리외함, 녹색 유리 사리병 등으로 구성되어 백제와 고려 시대 금속공예와 불교 문화의 우수성을 입증합니다."
  },
  {
    era: 'goryeo',
    region: '고창',
    question: "고창 선운사 도솔암의 거대한 절벽 암벽에 새겨진 마애불로, 가슴 부위에 비기(비밀스러운 편지)가 숨겨져 있다는 전설이 있어 구한말 동학농민군이나 민중들에게 혁명의 희망을 주었던 보물은 무엇인가요?",
    options: ["선운사 도솔암 마애여래좌상", "미륵사지 석조여래입상", "남원 실상사 철조여래좌상", "여산 송불암 마애불"],
    correct_option_index: 0,
    explanation: "도솔암 마애불(보물)은 거대한 절벽에 새겨진 불상으로, 그 가슴 속에 숨겨진 비결(비기)이 꺼내어지는 날 한양이 망하고 새로운 세상이 열린다는 전설이 있어 1892년 동학 접주들이 실제로 비기를 꺼내어 농민 혁명의 도화선이 되었습니다."
  }
];

const EXTRA_QUIZZES_EN: Omit<QuizQuestion, 'id'>[] = [
  {
    era: 'prehistoric',
    region: 'Gimje',
    question: "Gimje in Jeollabuk-do has historically been Korea's largest granary. What is the name of the agricultural culture festival held every autumn in Gimje?",
    options: ["Gimje Horizon Festival", "Jeongeup Gujeolcho Festival", "Gochang Moyangseong Festival", "Imsil N-Cheese Festival"],
    correct_option_index: 0,
    explanation: "The Gimje Horizon Festival is held around the ancient Byeokgolje reservoir, celebrating ancient agricultural history and traditional rice farming."
  },
  {
    era: 'baekje',
    region: 'Iksan',
    question: "What is the title of the earliest surviving 4-line Hyangga (native song) in Korean history, sung by children to help Baekje's King Mu (Seodong) marry Silla's Princess Seonhwa?",
    options: ["Seodongyo", "Jemangmaega", "Chankiparangga", "Cheoyongga"],
    correct_option_index: 0,
    explanation: "Seodongyo is a Baekje/Silla folksong that Seodong (later King Mu) taught to children, offering them sweet potatoes, to win Princess Seonhwa of Silla."
  },
  {
    era: 'joseon',
    region: 'Other',
    question: "What is the famous phrase left by Admiral Yi Sun-sin meaning 'If there were no Jeolla, there would be no nation' during the Japanese invasions?",
    options: ["Yakmu Honam Simu Gukga", "Pilsajeoksaeng Pilsaengjeoksa", "Mulryeongmangdong Jeongjungyeosan", "Geumshinjeonseon Sangyusibi"],
    correct_option_index: 0,
    explanation: "'Yakmu Honam Simu Gukga' means 'If there were no Honam, we would have no country,' highlighting the strategic importance of the Jeolla region."
  },
  {
    era: 'modern',
    region: 'Jeongeup',
    question: "What is the name of the 4-point manifesto announced by the Donghak Peasant Army when they gathered at Baeksan in 1894 to declare their code of conduct?",
    options: ["Baeksan Sadaemyeongui", "Mujang Proclamation", "Pejeong Reform Proposals", "Hongbeom 14 Articles"],
    correct_option_index: 0,
    explanation: "The Baeksan Sadaemyeongui (Four Great Proclamations) declared the peasants' intention to protect citizens, refrain from unnecessary violence, and expel corrupt officers."
  },
  {
    era: 'joseon',
    region: 'Jangsu',
    question: "Where in Jangsu, Jeollabuk-do, is the historic site where the placenta and umbilical cord (Taesil) of Joseon's founder King Taejo Yi Seong-gye were enshrined?",
    options: ["Jangsu Taejo Taesil", "Muju Sagaksago", "Imsil Sangiam", "Namwon Maninui Chong"],
    correct_option_index: 0,
    explanation: "Taejo Taesil in Jangsu is a historic royal site where the umbilical cord of King Taejo was buried in a stone chamber to pray for the longevity of the dynasty."
  },
  {
    era: 'goryeo',
    region: 'Namwon',
    question: "Which of the following is correct about the Iron Seated Buddha (Treasure No. 41) at Silsangsa Temple in Namwon?",
    options: [
      "An iron Buddha from the late Unified Silla, showing the fusion of casting technology and Buddhist art.",
      "A gold-plated bronze statue made by late Joseon artists.",
      "A clay statue crafted by Yuan dynasty artisans during Goryeo.",
      "A massive rock-carved granite Buddha."
    ],
    correct_option_index: 0,
    explanation: "The Silsangsa Iron Seated Buddha (Treasure) is a prime example of iron Buddha statues that became popular in the 9th century, showcasing Silla's iron-casting technology."
  },
  {
    era: 'goryeo',
    region: 'Jeongeup',
    question: "Who is the legendary Silla scholar and writer who is said to have walked by Jeongeup Pihyangjeong to enjoy poetry during his term as a local magistrate?",
    options: ["Choi Chi-won", "Seol Chong", "Gang Su", "Wonhyo"],
    correct_option_index: 0,
    explanation: "The celebrated scholar Choi Chi-won built and frequented Pihyangjeong during his tenure as magistrate of Taesan (modern Jeongeup)."
  },
  {
    era: 'baekje',
    region: 'Iksan',
    question: "What is the name of the flagpole supports (Treasure No. 236) standing in Iksan Mireuksa Temple Site that held decorative banners for temple rituals?",
    options: ["Danggangeoju (Flagpole supports)", "Seokdeung (Stone lantern)", "Stone pagoda base", "Seokjo (Stone basin)"],
    correct_option_index: 0,
    explanation: "The Flagpole Supports (Danggangeoju) at Mireuksa Temple Site are twin stone pillars built to hold the flagpole during major Buddhist gatherings."
  },
  {
    era: 'modern',
    region: 'Jeongeup',
    question: "Who is the legendary leader of the Donghak Peasant Revolution who was nicknamed the 'Nokdu (Mung Bean) General' due to his short stature?",
    options: ["Jeon Bong-jun", "Son Hwa-jung", "Kim Gae-nam", "Choe Je-woo"],
    correct_option_index: 0,
    explanation: "General Jeon Bong-jun was nicknamed 'Nokdu General' because of his short height. He led the peasants against corrupt local officials in the 1894 revolution."
  },
  {
    era: 'joseon',
    region: 'Gochang',
    question: "Which of the following is correct about the Gilt-Bronze Amitabha Buddha Triad (Treasure No. 279) at Seonunsa Temple in Gochang?",
    options: [
      "A refined early Joseon gilt-bronze Buddha that was once stolen but miraculously recovered.",
      "A personal temple Buddha of military leader Choe Chung-heon during Goryeo.",
      "A ceramic Buddha baked directly in a Baekje clay kiln during the Three Kingdoms period.",
      "An iron Buddha cast and donated by the Regent Heungseon Daewongun in late Joseon."
    ],
    correct_option_index: 0,
    explanation: "The Gilt-Bronze Amitabha Triad of Seonunsa represents the elegant Buddhist sculpture style of the early Joseon period. It was stolen by thieves but successfully recovered and returned to the temple."
  },
  {
    era: 'joseon',
    region: 'Jeonju',
    question: "During the Imjin War of the Joseon Dynasty, which history archive (Sago) in Jeonju was the only one that survived fire, safely preserving the Joseon Wangjo Sillok (Annals)?",
    options: ["Jeonju Sago", "Chunchugwan Sago", "Chungju Sago", "Seongju Sago"],
    correct_option_index: 0,
    explanation: "While the archives in Seoul, Chungju, and Seongju were destroyed by fire, the Annals kept in Jeonju Sago were moved to Mount Naejangsan for safety, becoming the only copy to survive."
  },
  {
    era: 'joseon',
    region: 'Gunsan',
    question: "What is the name of the Joseon Dynasty local government lodging (Gaeksa) located in Impi-myeon, Gunsan, which retains traditional wooden architecture?",
    options: ["Impi Gaeksa", "Gunsan City Hall", "Old Gunsan Customshouse", "Impi Station"],
    correct_option_index: 0,
    explanation: "Impi Gaeksa served as the local government guest house where officials from the central government stayed and performed ceremonies bowing toward the king."
  },
  {
    era: 'joseon',
    region: 'Buan',
    question: "What is the famous wooden sculpture decoration in the ceiling of the Daeungjeon Hall (Treasure No. 292) at Gaeamsa Temple in Buan, representing late Joseon Buddhist art?",
    options: ["Phoenix and Blue Dragon carvings", "Iron Maitreya Buddha", "Stone Stupas", "Four Heavenly Kings mural"],
    correct_option_index: 0,
    explanation: "The ceiling of Gaeamsa Temple's Daeungjeon Hall features highly detailed carvings of dragon heads and phoenixes, representing the artistic height of late Joseon Dynasty woodcraft."
  },
  {
    era: 'baekje',
    region: 'Iksan',
    question: "What is the name of the national treasure reliquary set discovered in 2009 during the disassembly of the West Pagoda at Iksan Mireuksa Temple Site, which recorded the exact founder (Baekje Queen)?",
    options: ["Mireuksa Pagoda Sarira Reliquary", "Wanggung-ri Geumgang Gyeongpan", "King Muryeong's Tomb Epitaph", "Chiljido (Seven-Branched Sword)"],
    correct_option_index: 0,
    explanation: "The Mireuksa Temple Sarira Reliquary set (National Treasure) includes a gold plaque (Sarira Bongyeonggi) detailing that the queen of Baekje funded the construction of the pagoda in 639 AD."
  },
  {
    era: 'joseon',
    region: 'Wanju',
    question: "Which fortress in Wanju was built during the late Joseon Dynasty to evacuate the royal portrait of King Taejo and ancestral tablets in times of emergency?",
    options: ["Wibong Fortress (Wibongsanseong)", "Namgosanseong", "Donggosanseong", "Jeoksangsanseong"],
    correct_option_index: 0,
    explanation: "Wibong Fortress was built in 1675 to protect royal treasures. During the Donghak Peasant Revolution when Jeonju Fortress fell, King Taejo's portrait was safely evacuated here."
  },
  {
    era: 'joseon',
    region: 'Sunchang',
    question: "Which historic monument at Manilsa Temple in Sunchang records the legend of King Taejo (Yi Seong-gye) and Monk Muhak praying for the foundation of the Joseon Dynasty?",
    options: ["Sunchang Manilsabi", "Namwon Hwangsandaecheopbi", "Bukhansan Jinheungwang Sunsubi", "Gwanggaeto Stele"],
    correct_option_index: 0,
    explanation: "The Sunchang Manilsabi is a stone monument detailing how Yi Seong-gye prayed at Manilsa Temple and received help from Monk Muhak before founding the Joseon Dynasty."
  },
  {
    era: 'joseon',
    region: 'Jinan',
    question: "Which unique two-story wooden pavilion (Treasure No. 2055) in Jinan is built inside a natural rock shelter/cave, resembling a swallow's nest?",
    options: ["Suseonru", "Hanbyeokdang", "Pihyangjeong", "Gwanghanru"],
    correct_option_index: 0,
    explanation: "Suseonru is an extraordinary pavilion built directly inside a natural cliff cave in Jinan, demonstrating a rare integration of Korean traditional architecture with natural topography."
  },
  {
    era: 'joseon',
    region: 'Muju',
    question: "Which historic pavilion in Muju (Treasure) is celebrated as one of the three great pavilions of the Samnam region, frequented by classical poets?",
    options: ["Hanpungru", "Huipungru", "Pungnammun", "Manggyeongru"],
    correct_option_index: 0,
    explanation: "Hanpungru in Muju is a beautiful Joseon-era pavilion designated as a Treasure, known as one of the three most scenic pavilions of the southern provinces."
  },
  {
    era: 'goryeo',
    region: 'Iksan',
    question: "What is the name of the National Treasure No. 123 relic set, consisting of a gold scripture plaque and glass sarira bottle, discovered inside the Wanggung-ri Five-story Stone Pagoda?",
    options: ["Wanggung-ri Five-story Stone Pagoda Sarira Reliquary", "Mireuksa Pagoda Sarira Reliquary", "Gameunsa Pagoda Sarira Reliquary", "Muryangsa Pagoda Sarira Reliquary"],
    correct_option_index: 0,
    explanation: "The Wanggung-ri Stone Pagoda Sarira Reliquary set (National Treasure No. 123) represents high-quality Buddhist art, containing gold plaques of the Diamond Sutra and a green glass bottle."
  },
  {
    era: 'goryeo',
    region: 'Gochang',
    question: "What is the name of the rock-carved cliff Buddha (Treasure) at Seonunsa Temple's Dosolam Hermitage, famous for the legend of a secret prophecy hidden in its chest that inspired the Donghak Revolution?",
    options: ["Seonunsa Temple Dosolam Rock-carved Buddha", "Mireuksa Temple Stone Buddha", "Silsangsa Temple Iron Buddha", "Songbulam Cliff Buddha"],
    correct_option_index: 0,
    explanation: "The Dosolam Rock-carved Buddha in Gochang features a legend of a hidden prophecy in its chest. In 1892, Donghak rebels opened the niche, retrieving the text to inspire their revolutionary movement."
  }
];

const MOCK_QUIZZES_KO: QuizQuestion[] = [
  ...BASE_MOCK_QUIZZES_KO,
  ...EXTRA_QUIZZES_KO.map((eq, i) => ({
    id: BASE_MOCK_QUIZZES_KO.length + i + 1,
    ...eq
  }))
];

const MOCK_QUIZZES_EN: QuizQuestion[] = [
  ...BASE_MOCK_QUIZZES_EN,
  ...EXTRA_QUIZZES_EN.map((eq, i) => ({
    id: BASE_MOCK_QUIZZES_EN.length + i + 1,
    ...eq
  }))
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

const getGpsErrorMessage = (error: GeolocationPositionError, t: any): string => {
  if (error.code === error.PERMISSION_DENIED) {
    return t('route.map.gps_error_permission');
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    return t('route.map.gps_error_unavailable');
  } else if (error.code === error.TIMEOUT) {
    return t('route.map.gps_error_timeout');
  }
  return t('route.map.gps_error');
};

const getHeritageMarkerImage = (status: string | undefined) => {
  let color = '#F59E0B'; // default yellow/amber
  let stroke = '#D97706';
  // Star icon inside pin
  let innerIcon = `<path fill="white" d="M18 10l2.0 4.0 4.4.6-3.2 3.1.8 4.4-4.0-2.1-4.0 2.1.8-4.4-3.2-3.1 4.4-.6z"/>`;

  if (status === 'planned') {
    color = '#EA580C'; // orange
    stroke = '#C2410C';
    // Pin/Tack icon
    innerIcon = `<path fill="white" d="M16 10h4v2h-4zm-2 3h8v2c0 2.2-1.8 4-4 4s-4-1.8-4-4zm4 6v5h-2v-5z"/>`;
  } else if (status === 'visited') {
    color = '#16A34A'; // green
    stroke = '#15803D';
    // Check icon
    innerIcon = `<path fill="white" d="M14.5 22.0l-4.0-4.0 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4z"/>`;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="36" height="46">
      <path fill="${color}" stroke="${stroke}" stroke-width="2" d="M18 2C9.16 2 2 9.16 2 18c0 12.3 16 26 16 26s16-13.7 16-26c0-8.84-7.16-18-18-18z"/>
      ${innerIcon}
    </svg>
  `.trim().replace(/\s+/g, ' ').replace(/"/g, "'");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

const getCampsiteMarkerImage = (status: string | undefined, isCurated: boolean) => {
  let color = isCurated ? '#EF4444' : '#3B82F6'; // curated red, public blue
  let stroke = isCurated ? '#B91C1C' : '#1D4ED8';
  // Tent icon inside pin
  const innerIcon = `<path fill="white" d="M18 10l9 12H9l9-12zm-5 11h10l-5-6.5-5 6.5z"/>`;

  if (status === 'planned') {
    color = '#EA580C'; // orange
    stroke = '#C2410C';
  } else if (status === 'visited') {
    color = '#16A34A'; // green
    stroke = '#15803D';
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 46" width="36" height="46">
      <path fill="${color}" stroke="${stroke}" stroke-width="2" d="M18 2C9.16 2 2 9.16 2 18c0 12.3 16 26 16 26s16-13.7 16-26c0-8.84-7.16-18-18-18z"/>
      ${innerIcon}
    </svg>
  `.trim().replace(/\s+/g, ' ').replace(/"/g, "'");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

function App() {
  const { t, i18n } = useTranslation();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const KAKAO_KEY = isLocal ? "2a9acbfdf57b3822c73494498fc87389" : "0bf5fc207b57b96ebcce8a4a17f33a5c";

  useKakaoLoader({
    appkey: KAKAO_KEY,
  });

  // ── Supabase Auth state ──────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [, setAuthSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }
    // 초기 세션 로드
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
    });
    // 세션 변화 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleKakaoLogin = async () => {
    if (!supabase) return;
    setLoginLoading(true);
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo },
    });
    if (error) {
      console.error('카카오 로그인 오류:', error);
      alert(i18n.language === 'ko' ? '로그인 중 오류가 발생했습니다.' : 'Login failed. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setShowLoginModal(false);
  };
  // ────────────────────────────────────────────────────────────────────────
  
  const [activeTab, setActiveTab] = useState('era');
  const [activeEra, setActiveEra] = useState('all');

  // GoCamping API setup
  const gocampingApiKey = import.meta.env.VITE_GOCAMPING_API_KEY || '';
  const isGocampingConfigured = !!(gocampingApiKey && gocampingApiKey !== 'your-gocamping-decoding-service-key');

  const [showPublicCamps, setShowPublicCamps] = useState(false);
  const [showCuratedCamps, setShowCuratedCamps] = useState(true);
  const [publicCamps, setPublicCamps] = useState<any[]>([]);
  const [loadingPublicCamps, setLoadingPublicCamps] = useState(false);

  // Client-side user geolocation tracking (retained in smartphone memory only)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocationGuideOpen, setIsLocationGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState<'inapp' | 'chrome' | 'safari'>('inapp');
  const isStandalone = 
    (window.navigator as any).standalone === true || 
    window.matchMedia('(display-mode: standalone)').matches;

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
  // Heritage visit dates: { [heritageId]: string (ISO Date) }
  const [heritageVisitDates, setHeritageVisitDates] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('history_camper_heritage_visit_dates');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to parse heritage visit dates from localStorage", e);
      return {};
    }
  });
  const [solvedQuizzes, setSolvedQuizzes] = useState<Record<string, { heritageId?: string, questionText: string, isCorrect: boolean, selectedAnswer: string, correctAnswer: string, timestamp: string }>>(() => {
    const saved = localStorage.getItem('history_camper_solved_quizzes');
    return saved ? JSON.parse(saved) : {};
  });

  // Active heritage quiz states
  const [activeQuizHeritage, setActiveQuizHeritage] = useState<HeritageSite | null>(null);
  const [activeQuizTargetStatus, setActiveQuizTargetStatus] = useState<'planned' | 'visited' | 'quiz_only' | null>(null);
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

  // Heritage status filter for My Log (나의 기록) tab
  const [heritageLogFilter, setHeritageLogFilter] = useState<'all' | 'planned' | 'visited'>('all');

  // Sub-tab for My Log ('badges' or 'logs')
  const [activeLogSubTab, setActiveLogSubTab] = useState<'badges' | 'logs'>('badges');
  // Selected badge for details modal
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Heritage status filter for History Map (역사지도) tab
  const [mapHeritageFilter, setMapHeritageFilter] = useState<'all' | 'planned' | 'visited' | 'none'>('all');

  // Heritage era filter for History Map (역사지도) tab
  const [mapEraFilter, setMapEraFilter] = useState<string>('all');

  // Toggle filter panel expand/collapse in History Map tab
  const [isMapFilterExpanded, setIsMapFilterExpanded] = useState(false);

  // Swipe-to-go-back gesture refs (using refs to avoid re-renders during active drag)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  // Selected Campsite for interactive mapping (defaults to Moaksan)
  const [selectedCampsiteId, setSelectedCampsiteId] = useState('moaksan');

  // Save feedback toast notification
  const [saveToast, setSaveToast] = useState<{
    id: number;
    type: 'guest' | 'auth';
    title: string;
    desc: string;
  } | null>(null);

  const triggerSaveToast = (actionName: string) => {
    const isKo = i18n.language === 'ko';
    if (authUser) {
      const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || (isKo ? '회원' : 'User');
      setSaveToast({
        id: Date.now(),
        type: 'auth',
        title: isKo ? `✅ ${actionName} 완료 (계정 저장)` : `✅ ${actionName} Saved`,
        desc: isKo ? `${name}님의 카카오 계정에 안전하게 동기화되었습니다.` : `Synced safely with your Kakao account.`
      });
    } else {
      setSaveToast({
        id: Date.now(),
        type: 'guest',
        title: isKo ? `📌 ${actionName} 완료 (기기 저장)` : `📌 ${actionName} Saved locally`,
        desc: isKo ? `현재 기기에 안전하게 저장되었습니다. 카카오 로그인 시 계정에 영구 보관됩니다.` : `Saved to this device. Sign in with Kakao to sync across devices.`
      });
    }
  };

  useEffect(() => {
    if (!saveToast) return;
    const timer = setTimeout(() => {
      setSaveToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [saveToast]);

  // Map Center controller state
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>({ lat: 35.6, lng: 126.9 });

  // Supabase & Quiz States
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [, setSupabaseError] = useState(false);
  const [, setIsFavoritesTableMissing] = useState(false);
  const [quizState, setQuizState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Filters for Quiz
  const [filterEra, setFilterEra] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  // Compute regions that have quizzes in the selected era
  const availableRegions = useMemo(() => {
    const eraQuizzes = quizzes.filter(q => {
      const qEra = q.era?.toLowerCase() || '';
      return filterEra === 'all' || qEra === filterEra.toLowerCase();
    });

    const regionNormalizeMap: Record<string, string> = {
      'jeonju': '전주', '전주': '전주',
      'wanju': '완주', '완주': '완주',
      'iksan': '익산', '익산': '익산',
      'gunsan': '군산', '군산': '군산',
      'jeongeup': '정읍', '정읍': '정읍',
      'namwon': '남원', '남원': '남원',
      'gimje': '김제', '김제': '김제',
      'jinan': '진안', '진안': '진안',
      'muju': '무주', '무주': '무주',
      'imsil': '임실', '임실': '임실',
      'gochang': '고창', '고창': '고창',
      'buan': '부안', '부안': '부안'
    };

    const set = new Set<string>();
    eraQuizzes.forEach(q => {
      if (q.region) {
        const normalized = regionNormalizeMap[q.region.toLowerCase()];
        if (normalized) {
          set.add(normalized);
        }
      }
    });
    return set;
  }, [quizzes, filterEra]);

  // Reset selected region to 'all' if the selected era has no quizzes in that region
  useEffect(() => {
    if (filterRegion !== 'all' && !availableRegions.has(filterRegion)) {
      setFilterRegion('all');
    }
  }, [availableRegions, filterRegion]);

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
      const savedHVisitDates = localStorage.getItem('history_camper_heritage_visit_dates');
      if (savedHVisitDates) {
        setHeritageVisitDates(JSON.parse(savedHVisitDates));
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
    if (!isRemoving) {
      triggerSaveToast(targetStatus === 'visited' ? (i18n.language === 'ko' ? '캠핑장 방문 완료' : 'Campsite Visited') : (i18n.language === 'ko' ? '캠핑장 찜하기' : 'Campsite Planned'));
    }

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
      
      const updatedVisitDates = { ...heritageVisitDates };
      delete updatedVisitDates[heritage.id];
      setHeritageVisitDates(updatedVisitDates);
      localStorage.setItem('history_camper_heritage_visit_dates', JSON.stringify(updatedVisitDates));

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
      
      const updatedVisitDates = { ...heritageVisitDates };
      if (targetStatus === 'visited') {
        updatedVisitDates[heritage.id] = new Date().toISOString();
      } else {
        delete updatedVisitDates[heritage.id];
      }
      setHeritageVisitDates(updatedVisitDates);
      localStorage.setItem('history_camper_heritage_visit_dates', JSON.stringify(updatedVisitDates));

      // If switching to planned, remove review
      if (targetStatus === 'planned') {
        const updatedReviews = { ...heritageReviews };
        delete updatedReviews[heritage.id];
        setHeritageReviews(updatedReviews);
        localStorage.setItem('history_camper_heritage_reviews', JSON.stringify(updatedReviews));
      }

      triggerSaveToast(targetStatus === 'visited' ? (i18n.language === 'ko' ? '유적지 탐방 완료' : 'Heritage Visited') : (i18n.language === 'ko' ? '탐방 계획 저장' : 'Heritage Planned'));
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
        triggerSaveToast(i18n.language === 'ko' ? '역사 퀴즈 풀이' : 'Quiz Answer');
      }
    }
  };

  const handleHeritageQuizComplete = () => {
    if (!activeQuizHeritage || !activeQuizTargetStatus) return;

    // Update status if not quiz_only
    if (activeQuizTargetStatus !== 'quiz_only') {
      const updatedStatuses = { ...heritageStatuses, [activeQuizHeritage.id]: activeQuizTargetStatus };
      setHeritageStatuses(updatedStatuses);
      localStorage.setItem('history_camper_heritage_statuses', JSON.stringify(updatedStatuses));

      const updatedVisitDates = { ...heritageVisitDates };
      if (activeQuizTargetStatus === 'visited') {
        updatedVisitDates[activeQuizHeritage.id] = new Date().toISOString();
      } else {
        delete updatedVisitDates[activeQuizHeritage.id];
      }
      setHeritageVisitDates(updatedVisitDates);
      localStorage.setItem('history_camper_heritage_visit_dates', JSON.stringify(updatedVisitDates));

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

      triggerSaveToast(i18n.language === 'ko' ? '탐방 기록 및 후기' : 'Visit Log & Review');
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
    triggerSaveToast(i18n.language === 'ko' ? '후기 수정' : 'Review Updated');
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
      if (i18n.language === 'en') {
        // In English mode, always use the thoroughly translated English quiz dataset
        setQuizzes(MOCK_QUIZZES_EN);
        setLoadingQuizzes(false);
        return;
      }

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
            setQuizzes(MOCK_QUIZZES_KO);
          }
        } catch (err) {
          console.error("Failed to load quizzes from Supabase, loading mock fallback:", err);
          setSupabaseError(true);
          setQuizzes(MOCK_QUIZZES_KO);
        } finally {
          setLoadingQuizzes(false);
        }
      } else {
        setQuizzes(MOCK_QUIZZES_KO);
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
    if (i18n.language === 'en') {
      if (cl.includes('온라인') || url) method = 'Online';
      else if (cl.includes('전화')) method = 'Phone';
      else if (cl.includes('현장')) method = 'On-site';
      else method = 'Available';
    } else {
      if (!method && url) {
        method = '온라인';
      }
    }

    return (
      <span className="badge" style={{ backgroundColor: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', borderColor: 'rgba(22, 101, 52, 0.15)', borderWidth: '1px', borderStyle: 'solid', display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '2px 6px', fontSize: '0.7rem' }}>
        📅 {i18n.language === 'ko' ? `예약 (${method})` : `Book (${method})`}
      </span>
    );
  };

  // Helper to translate tags
  const translateTag = (tag: string) => {
    if (i18n.language === 'ko') return tag;
    const tagMap: Record<string, string> = {
      '안전점검 완료': 'Safety Verified',
      '유적지 근접': 'Near Heritage',
      '거리순 1위': '#1 Closest',
      '#송광사': '#Songgwangsa',
      '#마이산탑사': '#Maisan_Tapsa',
      '#화암사': '#Hwaamsa',
      '#경기전': '#Gyeonggijeon',
      '#풍남문': '#Pungnammun',
      '#오목대': '#Omokdae',
      '#전주향교': '#Jeonju_Hyanggyo',
      '#교룡산성': '#Gyoryongsanseong',
      '#광한루원': '#Gwanghallu',
      '#만인의총': '#Maninui_Chong',
      '#미륵사지': '#Mireuksa',
      '#왕궁리유적': '#Wanggungri',
      '#쌍릉': '#Twin_Tombs',
      '#고도리석불': '#Godori_Buddha',
      '#동고사': '#Donggosa',
      '#승암산성': '#Seungamsanseong',
      '#금산사': '#Geumsansa',
      '#벽골제': '#Byeokgolje',
      '#금마도토성': '#Geumma_Fortress',
      '#백두대간': '#Baekdudaegan',
      '#지리산': '#Jirisan',
      '#청암산': '#Cheongamsan',
      '#근대역사박물관': '#Modern_Museum',
      '#히로쓰가옥': '#Hirotsu_House',
      '#고창고인돌': '#Gochang_Dolmen',
      '#선운사': '#Seonunsa',
      '#내소사': '#Naesosa',
      '#무성서원': '#Museongseowon',
      '#피향정': '#Pihyangjeong',
      '#실상사': '#Silsangsa',
      '#상이암': '#Sangiam',
      '#황토현': '#Hwangtohyun',
      '#적상산성': '#Jeoksangsanseong'
    };
    return tagMap[tag] || tag;
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
                onClick={() => viewHeritageRoute(campsite.id)}
              >
                <span className="campsite-name-span">
                  {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
                </span>
                <span className="course-link-indicator">
                  {i18n.language === 'ko' ? '🔍상세 코스 보기 ➔' : '🔍View Course ➔'}
                </span>
                {getReservationBadge(campsite)}
              </div>
            </div>
            
            <div className="list-desc">
              {getCampsiteDistanceText(campsite)}
            </div>
            
            <div className="tag-container" style={{ marginTop: '6px' }}>
              {campsite.tags.map((tag: any, idx: number) => (
                <span key={idx} className={`badge ${tag.startsWith('#') ? 'gold' : ''}`}>
                  {translateTag(tag)}
                </span>
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

  // Swipe to go back gesture handlers for campsite details view (using refs to prevent re-renders)
  const onTouchStart = (e: React.TouchEvent) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchEndRef.current = null;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distanceX = touchEndRef.current.x - touchStartRef.current.x;
    const distanceY = Math.abs(touchEndRef.current.y - touchStartRef.current.y);
    
    // Swipe right (distanceX > 60) starting from the left side of the screen (x < 120)
    // and horizontal movement is significantly greater than vertical movement (distanceX > distanceY)
    if (distanceX > 60 && distanceX > distanceY && touchStartRef.current.x < 120) {
      setActiveRouteCampsiteId(null);
    }
  };

  // Request browser location permission and center map (client-side only, no server updates)
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(t('route.map.gps_error_unsupported'));
      return;
    }
    
    // Attempt high-accuracy first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setMapCenter({ lat, lng });
        setGpsError(null);
      },
      (error) => {
        console.warn("First-attempt GPS retrieval failed. Trying fallback...", error);
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          // Fallback to low-accuracy
          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => {
              const lat = fallbackPosition.coords.latitude;
              const lng = fallbackPosition.coords.longitude;
              setUserLocation({ lat, lng });
              setMapCenter({ lat, lng });
              setGpsError(null);
            },
            (fallbackError) => {
              console.error("Fallback GPS retrieval error:", fallbackError);
              setGpsError(getGpsErrorMessage(fallbackError, t));
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          setGpsError(getGpsErrorMessage(error, t));
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
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

      {/* ── 카카오 로그인 모달 ─────────────────────────────── */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
        >
          <div style={{
            background: 'var(--surface)', borderRadius: '20px', padding: '32px 28px',
            maxWidth: '340px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            border: '1px solid var(--border)', position: 'relative'
          }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--surface-foreground)', padding: '4px', borderRadius: '50%'
              }}
            >
              <X size={20} />
            </button>

            {authUser ? (
              /* 로그인 상태 */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #166534, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '2rem'
                }}>
                  {authUser.user_metadata?.avatar_url
                    ? <img src={authUser.user_metadata.avatar_url} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : <User size={36} color="white" />}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '4px' }}>
                  {authUser.user_metadata?.full_name || authUser.user_metadata?.name || (i18n.language === 'ko' ? '히스토리캠퍼' : 'History Camper')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--surface-foreground)', marginBottom: '24px' }}>
                  {authUser.email || (i18n.language === 'ko' ? '카카오 계정으로 로그인됨' : 'Signed in with Kakao')}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '13px',
                    background: '#fee500', border: 'none', borderRadius: '12px',
                    fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: '#3c1e1e'
                  }}
                >
                  <LogOut size={18} />
                  {i18n.language === 'ko' ? '로그아웃' : 'Sign Out'}
                </button>
              </div>
            ) : (
              /* 비로그인 상태 */
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>⛺</div>
                <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--foreground)', marginBottom: '8px' }}>
                  {i18n.language === 'ko' ? '히스토리캠퍼' : 'History Camper'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--surface-foreground)', marginBottom: '28px', lineHeight: 1.6 }}>
                  {i18n.language === 'ko'
                    ? '카카오 계정으로 로그인하면 나의 탐방 기록을 저장할 수 있어요.'
                    : 'Sign in with Kakao to save your heritage visit history.'}
                </div>
                <button
                  onClick={handleKakaoLogin}
                  disabled={loginLoading}
                  style={{
                    width: '100%', padding: '14px',
                    background: '#fee500', border: 'none', borderRadius: '12px',
                    fontWeight: 800, fontSize: '1rem', cursor: loginLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    color: '#3c1e1e', opacity: loginLoading ? 0.7 : 1,
                    boxShadow: '0 4px 16px rgba(254,229,0,0.4)', transition: 'all 0.2s'
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#3c1e1e">
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6L5 21l4.3-2.8C10.2 18.4 11.1 18.5 12 18.5c5.523 0 10-3.477 10-7.7S17.523 3 12 3z"/>
                  </svg>
                  {loginLoading
                    ? (i18n.language === 'ko' ? '연결 중...' : 'Connecting...')
                    : (i18n.language === 'ko' ? '카카오로 로그인' : 'Sign in with Kakao')}
                </button>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '16px', lineHeight: 1.5 }}>
                  {i18n.language === 'ko'
                    ? '로그인 없이도 모든 기능을 이용할 수 있습니다.'
                    : 'You can use all features without signing in.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeRouteCampsiteId ? (
        (() => {
          const campsite = allDisplayCampsites.find(c => c.id === activeRouteCampsiteId);
          if (!campsite) return null;

          const routeHeritages = MASTER_HERITAGES.filter(h => campsite.nearbyHeritageIds.includes(h.id));
          const routePolylinePaths = routeHeritages.map(h => [
            { lat: campsite.lat, lng: campsite.lng },
            { lat: h.lat, lng: h.lng }
          ]);

          return (
        <div 
          className="detail-view-container" 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}
        >
          <header className="top-header detail-header" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', height: '56px', padding: '0 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <button 
              className="back-btn" 
              onClick={() => setActiveRouteCampsiteId(null)} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.95rem',
                fontWeight: '700',
                color: 'var(--primary)',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}
            >
              <ChevronLeft size={20} />
              <span>{i18n.language === 'ko' ? '목록으로' : 'Back'}</span>
            </button>
            <div className="header-title" style={{ flex: 1, textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginRight: '50px' }}>
              ⛺ {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
            </div>
          </header>
          <div className="detail-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <div className="detail-layout" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                      image={campsite.id.startsWith('public-') ? undefined : {
                        src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                        size: { width: 31, height: 35 }
                      }}
                    >
                      <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", borderRadius: "4px", fontWeight: "bold" }}>
                        ⛺ {campsite.id.startsWith('public-') ? campsite.name : t(campsite.name)}
                      </div>
                    </MapMarker>

                    {/* Nearby Heritage Markers */}
                    {routeHeritages.map(heritage => (
                      <MapMarker 
                        key={heritage.id} 
                        position={{ lat: heritage.lat, lng: heritage.lng }}
                        image={{
                          src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                          size: { width: 24, height: 35 }
                        }}
                      >
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
                  <div className="card-title route-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={20} color="var(--gold)"/>
                      {t('route.card.title', { campsiteName: campsite.id.startsWith('public-') ? campsite.name : t(campsite.name) })}
                    </div>
                    
                    {/* Campsite statuses planned/visited toggle */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
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
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
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
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
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
                            <div className="timeline-header">
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
                                      {heritageVisitDates[heritage.id] && ` (${new Date(heritageVisitDates[heritage.id]).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })})`}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="timeline-buttons">
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
                                    color: heritageStatuses[heritage.id] === 'planned' ? 'var(--gold)' : 'var(--surface-foreground)',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  📌 {i18n.language === 'ko' ? '탐방 계획' : 'Plan'}
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
                                    color: heritageStatuses[heritage.id] === 'visited' ? 'var(--primary)' : 'var(--surface-foreground)',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  ✅ {i18n.language === 'ko' ? '탐방 완료' : 'Visited'}
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveQuizHeritage(heritage);
                                    setActiveQuizTargetStatus('quiz_only');
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
                                    color: 'white',
                                    whiteSpace: 'nowrap'
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
        </div>
          );
        })()
      ) : (
        <>
                <header className="top-header">
        <div className="header-title">
          <Tent size={22} className="text-primary" />
          {t('header.title')}
        </div>
        
        {/* Desktop Navigation Link Tabs */}
        <nav className="desktop-nav">
          <button className={`nav-link ${activeTab === 'era' ? 'active' : ''}`} onClick={() => setActiveTab('era')}>{t('tabs.era')}</button>
          <button className={`nav-link ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}>{t('tabs.route')}</button>
          <button className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>{t('tabs.quiz')}</button>
          <button className={`nav-link ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>{t('tabs.safety')}</button>
        </nav>

        <button 
          className="lang-btn" 
          onClick={() => i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')}
        >
          {i18n.language === 'ko' ? 'KO' : 'EN'}
        </button>

        {/* 카카오 로그인 버튼 */}
        {isSupabaseConfigured && !authLoading && (
          <button
            onClick={() => setShowLoginModal(true)}
            title={authUser ? (i18n.language === 'ko' ? '내 프로필' : 'My Profile') : (i18n.language === 'ko' ? '로그인' : 'Sign In')}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: authUser ? 'linear-gradient(135deg, #166534, #16a34a)' : '#fee500',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'all 0.2s', flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {authUser ? (
              authUser.user_metadata?.avatar_url
                ? <img src={authUser.user_metadata.avatar_url} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={18} color="white" />
            ) : (
              <LogIn size={18} color="#3c1e1e" />
            )}
          </button>
        )}
      </header>

      <div className="scroll-area">


        {/* =========================================
            ERA: 시대별 역사 캠핑지 매칭 & 상태 관리
        ========================================= */}
        {activeTab === 'era' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('era.title')}</h3>
            
            <div className="card" style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              
              {/* Section 1: Visit Status Filters */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: statusFilter === 'all' ? '12px' : '0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🎯</span> {i18n.language === 'ko' ? '탐방 상태 필터' : 'Visit Status Filter'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    className={`era-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter('all');
                      setActiveEra('all');
                    }}
                    style={{
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: statusFilter === 'all' ? 'var(--primary)' : 'var(--surface)',
                      color: statusFilter === 'all' ? 'white' : 'var(--surface-foreground)',
                      border: statusFilter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
                      boxShadow: statusFilter === 'all' ? '0 2px 6px rgba(22, 101, 52, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t('era.eras.all')}
                  </button>

                  <button
                    onClick={() => {
                      setStatusFilter('planned');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: statusFilter === 'planned' ? 'var(--gold)' : 'var(--surface)',
                      color: statusFilter === 'planned' ? 'white' : 'var(--surface-foreground)',
                      border: statusFilter === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                      boxShadow: statusFilter === 'planned' ? '0 2px 6px rgba(180, 83, 9, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>📌</span> {t('era.status_planned')}
                  </button>

                  <button
                    onClick={() => {
                      setStatusFilter('visited');
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: statusFilter === 'visited' ? 'var(--primary)' : 'var(--surface)',
                      color: statusFilter === 'visited' ? 'white' : 'var(--surface-foreground)',
                      border: statusFilter === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                      boxShadow: statusFilter === 'visited' ? '0 2px 6px rgba(22, 101, 52, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>✅</span> {t('era.status_visited')}
                  </button>
                </div>
              </div>

              {/* Section 2: Era Filters (Only visible when "All" status is active) */}
              {statusFilter === 'all' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border)', paddingTop: '12px', marginTop: '12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⏳</span> {i18n.language === 'ko' ? '역사 시대 선택' : 'Select Era'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button 
                      className={`era-btn ${activeEra === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveEra('all')}
                      style={{
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: activeEra === 'all' ? 'var(--primary)' : 'rgba(0,0,0,0.02)',
                        color: activeEra === 'all' ? 'white' : 'var(--surface-foreground)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {i18n.language === 'ko' ? '전체 시대' : 'All Eras'}
                    </button>
                    {Eras.filter(e => e.id !== 'all').map(era => (
                      <button 
                        key={era.id} 
                        className={`era-btn ${activeEra === era.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveEra(era.id);
                        }}
                        style={{
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: activeEra === era.id ? 'var(--primary)' : 'var(--surface)',
                          color: activeEra === era.id ? 'white' : 'var(--surface-foreground)',
                          border: activeEra === era.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {era.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter and GPS bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>

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
              <div className="quiz-alert mock" style={{ marginBottom: '10px', background: 'rgba(185, 28, 28, 0.05)', borderColor: 'rgba(185, 28, 28, 0.15)', color: 'var(--red-accent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{gpsError}</span>
                </div>
                <button 
                  onClick={() => setIsLocationGuideOpen(true)}
                  style={{
                    background: 'var(--red-accent)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {t('route.map.gps_guide_btn')}
                </button>
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
            
            {/* Collapsible Filter Panel UI */}
            {!isMapFilterExpanded ? (
              <div className="card" style={{ padding: '10px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--surface-foreground)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: '8px' }}>
                  <span>🔍</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {i18n.language === 'ko' ? '필터: ' : 'Filters: '}
                    <span style={{ color: 'var(--primary)' }}>
                      {[
                        showCuratedCamps ? (i18n.language === 'ko' ? '역사 주변🔴' : 'Near Site') : null,
                        showPublicCamps ? (i18n.language === 'ko' ? '공공캠핑🔵' : 'Public') : null,
                        mapHeritageFilter === 'planned' ? '📌탐방계획' : mapHeritageFilter === 'visited' ? '✅탐방완료' : null,
                        mapEraFilter !== 'all' ? (Eras.find(e => e.id === mapEraFilter)?.label || mapEraFilter) : null
                      ].filter(Boolean).join(', ') || (i18n.language === 'ko' ? '필터 없음' : 'None')}
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    onClick={() => setIsMapFilterExpanded(true)}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {i18n.language === 'ko' ? '필터 열기 ▾' : 'Expand ▾'}
                  </button>
                  <button
                    onClick={handleFindMyLocation}
                    style={{
                      padding: '6px 10px',
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
                    title={t('route.map.find_my_location')}
                  >
                    <span>🎯</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Header title with collapse button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--foreground)' }}>
                    ⚙️ {i18n.language === 'ko' ? '지도 상세 필터 설정' : 'Map Filters Setup'}
                  </span>
                  <button
                    onClick={() => setIsMapFilterExpanded(false)}
                    style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                  >
                    {i18n.language === 'ko' ? '필터 접기 ▴' : 'Collapse ▴'}
                  </button>
                </div>

                {/* Section 1: Campsite Display Settings (Side-by-side Toggle Chips instead of Checkboxes) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⛺</span> {i18n.language === 'ko' ? '캠핑장 표시 설정' : 'Campsite Display Settings'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      onClick={() => setShowCuratedCamps(prev => !prev)}
                      className={`era-btn ${showCuratedCamps ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        minWidth: '130px',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: showCuratedCamps ? 'var(--gold)' : 'var(--surface)',
                        color: showCuratedCamps ? 'white' : 'var(--surface-foreground)',
                        border: showCuratedCamps ? '1px solid var(--gold)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <img 
                        src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png" 
                        style={{ height: '14px', width: '12px', objectFit: 'contain' }} 
                        alt="Curated Campsite Marker"
                      />
                      {i18n.language === 'ko' ? '역사 주변 캠핑장' : 'Curated Campsites'}
                    </button>
                    <button
                      onClick={() => {
                        const nextVal = !showPublicCamps;
                        setShowPublicCamps(nextVal);
                        if (nextVal) {
                          fetchPublicCamps();
                        }
                      }}
                      className={`era-btn ${showPublicCamps ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        minWidth: '130px',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: showPublicCamps ? 'var(--primary)' : 'var(--surface)',
                        color: showPublicCamps ? 'white' : 'var(--surface-foreground)',
                        border: showPublicCamps ? '1px solid var(--primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <img 
                        src="https://t1.daumcdn.net/mapjsapi/images/2x/marker.png" 
                        style={{ height: '14px', width: '10px', objectFit: 'contain' }} 
                        alt="Public Campsite Marker"
                      />
                      {i18n.language === 'ko' ? '전라도 공공 캠핑장' : 'Public Campsites'}
                    </button>
                  </div>
                </div>

                {/* Section 2: Heritage Visit Status Filters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img 
                      src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" 
                      style={{ height: '14px', width: '10px', objectFit: 'contain' }} 
                      alt="Heritage Marker"
                    />
                    {i18n.language === 'ko' ? '역사 유적지 탐방 필터' : 'Heritage Visit Status'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      className={`era-btn ${mapHeritageFilter === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setMapHeritageFilter(prev => prev === 'all' ? 'none' : 'all');
                        setMapEraFilter('all');
                      }}
                      style={{
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: mapHeritageFilter === 'all' ? 'var(--primary)' : 'var(--surface)',
                        color: mapHeritageFilter === 'all' ? 'white' : 'var(--surface-foreground)',
                        border: mapHeritageFilter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        boxShadow: mapHeritageFilter === 'all' ? '0 2px 6px rgba(22, 101, 52, 0.15)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {t('era.eras.all')}
                    </button>

                    <button
                      onClick={() => {
                        setMapHeritageFilter(prev => prev === 'planned' ? 'none' : 'planned');
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: mapHeritageFilter === 'planned' ? 'var(--gold)' : 'var(--surface)',
                        color: mapHeritageFilter === 'planned' ? 'white' : 'var(--surface-foreground)',
                        border: mapHeritageFilter === 'planned' ? '1px solid var(--gold)' : '1px solid var(--border)',
                        boxShadow: mapHeritageFilter === 'planned' ? '0 2px 6px rgba(180, 83, 9, 0.15)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>📌</span> {t('era.status_planned')}
                    </button>

                    <button
                      onClick={() => {
                        setMapHeritageFilter(prev => prev === 'visited' ? 'none' : 'visited');
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: mapHeritageFilter === 'visited' ? 'var(--primary)' : 'var(--surface)',
                        color: mapHeritageFilter === 'visited' ? 'white' : 'var(--surface-foreground)',
                        border: mapHeritageFilter === 'visited' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        boxShadow: mapHeritageFilter === 'visited' ? '0 2px 6px rgba(22, 101, 52, 0.15)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>✅</span> {t('era.status_visited')}
                    </button>
                  </div>
                </div>

                {/* Section 3: Heritage Era Filters (Horizontal Scroll instead of wrap) */}
                {mapHeritageFilter === 'all' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--border)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>⏳</span> {i18n.language === 'ko' ? '유적지 역사 시대 선택' : 'Select Heritage Era'}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      overflowX: 'auto', 
                      paddingBottom: '8px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }} className="era-selector-scroll">
                      <button 
                        className={`era-btn ${mapEraFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setMapEraFilter('all')}
                        style={{
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: mapEraFilter === 'all' ? 'var(--primary)' : 'rgba(0,0,0,0.02)',
                          color: mapEraFilter === 'all' ? 'white' : 'var(--surface-foreground)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {i18n.language === 'ko' ? '전체 시대' : 'All Eras'}
                      </button>
                      {Eras.filter(e => e.id !== 'all').map(era => (
                        <button 
                          key={era.id} 
                          className={`era-btn ${mapEraFilter === era.id ? 'active' : ''}`}
                          onClick={() => {
                            setMapEraFilter(era.id);
                          }}
                          style={{
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            background: mapEraFilter === era.id ? 'var(--primary)' : 'var(--surface)',
                            color: mapEraFilter === era.id ? 'white' : 'var(--surface-foreground)',
                            border: mapEraFilter === era.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {era.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: GPS Action Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
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
              </div>
            )}

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
              <div className="quiz-alert mock" style={{ marginBottom: '10px', marginTop: 0, background: 'rgba(185, 28, 28, 0.05)', borderColor: 'rgba(185, 28, 28, 0.15)', color: 'var(--red-accent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{gpsError}</span>
                </div>
                <button 
                  onClick={() => setIsLocationGuideOpen(true)}
                  style={{
                    background: 'var(--red-accent)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {t('route.map.gps_guide_btn')}
                </button>
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
                  {/* Render filtered heritage sites */}
                  {MASTER_HERITAGES.filter(h => {
                    if (mapHeritageFilter !== 'all' && heritageStatuses[h.id] !== mapHeritageFilter) {
                      return false;
                    }
                    if (mapEraFilter !== 'all' && h.era !== mapEraFilter) {
                      return false;
                    }
                    return true;
                  }).map(heritage => (
                     <MapMarker 
                       key={heritage.id} 
                       position={{ lat: heritage.lat, lng: heritage.lng }}
                       image={{
                         src: getHeritageMarkerImage(heritageStatuses[heritage.id]),
                         size: { width: 32, height: 40 },
                         options: {
                           offset: { x: 16, y: 40 }
                         }
                       }}
                       onClick={() => setActiveMapHeritageId(heritage.id)}
                     >
                      {activeMapHeritageId === heritage.id && (
                        <div style={{ 
                          padding: '10px', 
                          width: '260px', 
                          background: 'white', 
                          borderRadius: '12px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          fontSize: '0.85rem',
                          color: '#333',
                          zIndex: 99999,
                          whiteSpace: 'normal',
                          wordBreak: 'keep-all'
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
                                setActiveQuizTargetStatus('quiz_only');
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
                    const filteredMapCampsites = allDisplayCampsites.filter(c => {
                      const isCurated = MASTER_CAMPSITES.some(mc => mc.id === c.id);
                      if (isCurated && !showCuratedCamps) return false;
                      if (!isCurated && !showPublicCamps) return false;
                      return true;
                    });

                    return filteredMapCampsites.map(campsite => {
                      const isCurated = MASTER_CAMPSITES.some(mc => mc.id === campsite.id);
                      return (
                        <MapMarker 
                          key={campsite.id} 
                          position={{ lat: campsite.lat, lng: campsite.lng }}
                          image={{
                            src: getCampsiteMarkerImage(campsiteStatuses[campsite.id], isCurated),
                            size: { width: 32, height: 40 },
                            options: {
                              offset: { x: 16, y: 40 }
                            }
                          }}
                          onClick={() => {
                            setActiveMapCampsiteId(campsite.id);
                            setActiveMapHeritageId(null);
                          }}
                        >
                          {activeMapCampsiteId === campsite.id && (
                            <div style={{ 
                              padding: '10px', 
                              width: '260px', 
                              background: 'white', 
                              borderRadius: '12px', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              fontSize: '0.85rem',
                              color: '#333',
                              zIndex: 99999,
                              whiteSpace: 'normal',
                              wordBreak: 'keep-all'
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

                        const filteredHeritagesWithDistance = heritagesWithDistance.filter(h => {
                          if (mapHeritageFilter === 'all') return true;
                          return heritageStatuses[h.id] === mapHeritageFilter;
                        });

                        return filteredHeritagesWithDistance.map(heritage => {
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
                                        {heritageVisitDates[heritage.id] && ` (${new Date(heritageVisitDates[heritage.id]).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })})`}
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
                                    title={i18n.language === 'ko' ? '탐방 계획 등록 (역사 퀴즈)' : 'Register Planned (History Quiz)'}
                                  >
                                    📌 {i18n.language === 'ko' ? '탐방 계획' : 'Plan'}
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
                                    title={i18n.language === 'ko' ? '탐방 완료 등록 (역사 퀴즈 및 후기)' : 'Register Visited (History Quiz & Review)'}
                                  >
                                    ✅ {i18n.language === 'ko' ? '탐방 완료' : 'Visited'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveQuizHeritage(heritage);
                                      setActiveQuizTargetStatus('quiz_only');
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
                      if (mapEraFilter !== 'all' && eraId !== mapEraFilter) return null;
                      const eraHeritages = MASTER_HERITAGES.filter(h => h.era === eraId);
                      const filteredEraHeritages = eraHeritages.filter(h => {
                        if (mapHeritageFilter !== 'all' && heritageStatuses[h.id] !== mapHeritageFilter) return false;
                        return true;
                      });
                      if (filteredEraHeritages.length === 0) return null;
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
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--surface-foreground)' }}>({filteredEraHeritages.length})</span>
                          </h4>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {filteredEraHeritages.map(heritage => {
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
                                            {heritageVisitDates[heritage.id] && ` (${new Date(heritageVisitDates[heritage.id]).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })})`}
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
                                        title={i18n.language === 'ko' ? '탐방 계획 등록 (역사 퀴즈)' : 'Register Planned (History Quiz)'}
                                      >
                                        📌 {i18n.language === 'ko' ? '탐방 계획' : 'Plan'}
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
                                        title={i18n.language === 'ko' ? '탐방 완료 등록 (역사 퀴즈 및 후기)' : 'Register Visited (History Quiz & Review)'}
                                      >
                                        ✅ {i18n.language === 'ko' ? '탐방 완료' : 'Visited'}
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
                          {[
                            { key: '전주', labelKo: '전주', labelEn: 'Jeonju' },
                            { key: '군산', labelKo: '군산', labelEn: 'Gunsan' },
                            { key: '익산', labelKo: '익산', labelEn: 'Iksan' },
                            { key: '정읍', labelKo: '정읍', labelEn: 'Jeongeup' },
                            { key: '남원', labelKo: '남원', labelEn: 'Namwon' },
                            { key: '김제', labelKo: '김제', labelEn: 'Gimje' },
                            { key: '완주', labelKo: '완주', labelEn: 'Wanju' },
                            { key: '진안', labelKo: '진안', labelEn: 'Jinan' },
                            { key: '무주', labelKo: '무주', labelEn: 'Muju' },
                            { key: '임실', labelKo: '임실', labelEn: 'Imsil' },
                            { key: '고창', labelKo: '고창', labelEn: 'Gochang' },
                            { key: '부안', labelKo: '부안', labelEn: 'Buan' }
                          ]
                            .filter(r => availableRegions.has(r.key))
                            .map(r => (
                              <option key={r.key} value={r.key}>
                                {i18n.language === 'ko' ? r.labelKo : r.labelEn}
                              </option>
                            ))}
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
            <p style={{ color: 'var(--surface-foreground)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
              {i18n.language === 'ko' 
                ? '내가 다녀온 유적지의 생생한 후기와 역사 퀴즈 풀이 결과를 모아봅니다.' 
                : 'Collect my vivid reviews of visited heritage sites and historical quiz results.'}
            </p>

            {/* Sync & Account Status Banner Card */}
            <div style={{
              background: authUser ? 'rgba(22, 163, 74, 0.08)' : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${authUser ? 'rgba(22, 163, 74, 0.25)' : 'rgba(245, 158, 11, 0.3)'}`,
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: authUser ? 'var(--primary)' : '#f59e0b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0
                }}>
                  {authUser ? <CheckCircle2 size={20} /> : <User size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--foreground)' }}>
                    {authUser
                      ? (i18n.language === 'ko' ? `👤 ${authUser.user_metadata?.full_name || '회원'}님 계정으로 실시간 동기화 중` : `👤 Synced with ${authUser.user_metadata?.full_name || 'Account'}`)
                      : (i18n.language === 'ko' ? '📱 현재 기기(게스트 모드)에 저장 중' : '📱 Saving to this device (Guest Mode)')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--surface-foreground)', marginTop: '2px', lineHeight: 1.4 }}>
                    {authUser
                      ? (i18n.language === 'ko' ? '모든 퀴즈 풀이와 방문 기록이 카카오 계정에 안전하게 보관됩니다.' : 'All quizzes and visit logs are safely saved to your account.')
                      : (i18n.language === 'ko' ? '카카오 로그인 시 다른 스마트폰/PC에서도 내 기록을 그대로 이어볼 수 있어요.' : 'Sign in with Kakao to sync your logs across all devices.')}
                  </div>
                </div>
              </div>
              {!authUser && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    background: '#fee500', color: '#3c1e1e',
                    border: 'none', borderRadius: '10px',
                    padding: '8px 14px', fontSize: '0.82rem', fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 2px 8px rgba(254, 229, 0, 0.3)',
                    marginLeft: 'auto'
                  }}
                >
                  <LogIn size={14} />
                  {i18n.language === 'ko' ? '카카오 로그인' : 'Sign In'}
                </button>
              )}
            </div>

            {/* Sub-tab navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', gap: '16px' }}>
              <button
                onClick={() => setActiveLogSubTab('badges')}
                style={{
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeLogSubTab === 'badges' ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: activeLogSubTab === 'badges' ? 'var(--primary)' : 'var(--surface-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🏅 {i18n.language === 'ko' ? '배지 컬렉션' : 'Badge Collection'}
              </button>
              <button
                onClick={() => setActiveLogSubTab('logs')}
                style={{
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeLogSubTab === 'logs' ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: activeLogSubTab === 'logs' ? 'var(--primary)' : 'var(--surface-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                📖 {i18n.language === 'ko' ? '나의 활동 일지' : 'Activity Logs'}
              </button>
            </div>

            {activeLogSubTab === 'badges' && (() => {
              const unlockedBadges = BADGES.filter(b => b.checkUnlocked(heritageStatuses, solvedQuizzes, heritageReviews));
              const percent = Math.round((unlockedBadges.length / BADGES.length) * 100);

              return (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Progress Stats Card */}
                  <div className="card" style={{ marginBottom: 0, padding: '1.25rem 1.5rem', background: 'radial-gradient(120% 120% at 0% 0%, rgba(22, 101, 52, 0.05) 0%, transparent 100%), var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--surface-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {i18n.language === 'ko' ? '탐방 성과' : 'EXP PROGRESS'}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--foreground)', marginTop: '2px' }}>
                          {i18n.language === 'ko' ? `역사 탐방 배지 ${unlockedBadges.length}개 획득` : `Unlocked ${unlockedBadges.length} of ${BADGES.length} Badges`}
                        </div>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                        {percent}%
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--gold))', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                    </div>
                  </div>

                  {/* Badge Cards Grid */}
                  <div className="badge-grid">
                    {BADGES.map(badge => {
                      const isUnlocked = badge.checkUnlocked(heritageStatuses, solvedQuizzes, heritageReviews);
                      return (
                        <div
                          key={badge.id}
                          className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                          onClick={() => setSelectedBadge(badge)}
                        >
                          <div className="badge-icon-wrapper" style={isUnlocked ? { color: badge.color } : {}}>
                            {badge.icon}
                          </div>
                          <div className="badge-name">
                            {i18n.language === 'ko' ? badge.nameKo : badge.nameEn}
                          </div>
                          <span 
                            className="badge-status-label" 
                            style={{ 
                              background: isUnlocked ? 'rgba(22, 101, 52, 0.08)' : 'rgba(0,0,0,0.04)',
                              color: isUnlocked ? 'var(--primary)' : 'var(--surface-foreground)'
                            }}
                          >
                            {isUnlocked ? (i18n.language === 'ko' ? '해금됨' : 'Unlocked') : (i18n.language === 'ko' ? '잠김' : 'Locked')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {activeLogSubTab === 'logs' && (
              <div style={{ alignItems: 'flex-start' }} className="safety-grid">
                {/* Column 1: My Heritage Logs */}
                <div className="card" style={{ marginBottom: 0 }}>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
                    <BookOpen size={20} color="var(--primary)" />
                    {i18n.language === 'ko' ? '나의 역사지 기록' : 'My Historical Site Log'}
                  </div>

                  {/* Filter Selector Button Group */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px dashed var(--border)' }}>
                    {(['all', 'planned', 'visited'] as const).map(filterVal => {
                      const isActive = heritageLogFilter === filterVal;
                      let label = '';
                      if (filterVal === 'all') label = i18n.language === 'ko' ? '전체' : 'All';
                      else if (filterVal === 'planned') label = i18n.language === 'ko' ? '📌 탐방 계획' : '📌 Planned';
                      else label = i18n.language === 'ko' ? '✅ 탐방 완료' : '✅ Visited';

                      return (
                        <button
                          key={filterVal}
                          onClick={() => setHeritageLogFilter(filterVal)}
                          className={`era-btn ${isActive ? 'active' : ''}`}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: isActive ? 'var(--primary)' : 'var(--surface)',
                            color: isActive ? 'white' : 'var(--foreground)',
                            fontSize: '0.78rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const loggedHeritages = MASTER_HERITAGES.filter(h => {
                      const status = heritageStatuses[h.id];
                      if (heritageLogFilter === 'all') {
                        return status === 'planned' || status === 'visited';
                      }
                      return status === heritageLogFilter;
                    });

                    if (loggedHeritages.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--surface-foreground)' }}>
                          <MapIcon size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5, display: 'block' }} />
                          <p style={{ fontSize: '0.85rem', margin: 0 }}>
                            {i18n.language === 'ko'
                              ? '해당하는 역사지 기록이 없습니다.'
                              : 'No matching historical site logs.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                        {loggedHeritages.map(heritage => {
                          const status = heritageStatuses[heritage.id];
                          const isEditing = editingHeritageId === heritage.id;
                          return (
                            <div key={heritage.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t(heritage.name)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {status === 'planned' ? (
                                    <>
                                      <span className="badge warning" style={{ margin: 0, fontSize: '0.72rem' }}>
                                        {i18n.language === 'ko' ? '탐방 계획 📌' : 'Plan to Visit 📌'}
                                      </span>
                                      <button
                                        onClick={() => handleHeritageStatusClick(heritage, 'visited')}
                                        style={{
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          border: 'none',
                                          background: 'var(--primary)',
                                          color: 'white',
                                          fontSize: '0.7rem',
                                          fontWeight: 'bold',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {i18n.language === 'ko' ? '탐방 완료 등록' : 'Mark Visited'}
                                      </button>
                                    </>
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                      <span className="badge green" style={{ margin: 0, fontSize: '0.72rem' }}>
                                        {i18n.language === 'ko' ? '탐방 완료 ✅' : 'Visited ✅'}
                                      </span>
                                      {heritageVisitDates[heritage.id] && (
                                        <span style={{ fontSize: '0.62rem', color: 'var(--surface-foreground)', opacity: 0.8 }}>
                                          {new Date(heritageVisitDates[heritage.id]).toLocaleDateString(i18n.language === 'ko' ? 'ko-KR' : 'en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                          })}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {status === 'visited' && (
                                <>
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
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Column 2: Quiz Log */}
                <div className="card" style={{ marginBottom: 0 }}>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
                    <Award size={20} color="var(--gold)" />
                    {i18n.language === 'ko' ? '나의 퀴즈 기록' : 'My Quiz Logs'}
                  </div>

                  {Object.keys(solvedQuizzes).length === 0 ? (
                    <div style={{ textShadow: 'none', textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--surface-foreground)' }}>
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
            )}
          </div>
        )}
      </div>

      {/* Floating Save Toast Notification */}
      {saveToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '420px',
            width: 'calc(100% - 32px)',
            zIndex: 9990,
            background: saveToast.type === 'auth' ? '#0f172a' : '#1e293b',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
            border: saveToast.type === 'auth' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: saveToast.type === 'auth' ? 'var(--primary)' : '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0
            }}>
              {saveToast.type === 'auth' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.86rem' }}>{saveToast.title}</div>
              <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '2px', lineHeight: 1.3 }}>
                {saveToast.desc}
              </div>
            </div>
          </div>
          {saveToast.type === 'guest' ? (
            <button
              onClick={() => {
                setSaveToast(null);
                setShowLoginModal(true);
              }}
              style={{
                background: '#fee500',
                color: '#3c1e1e',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              {i18n.language === 'ko' ? '로그인' : 'Sign In'}
            </button>
          ) : (
            <button
              onClick={() => setSaveToast(null)}
              style={{
                background: 'none', border: 'none', color: '#94a3b8',
                cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'era' ? 'active' : ''}`} onClick={() => setActiveTab('era')}><Clock /><span>{t('tabs.era')}</span></button>
        <button className={`nav-item ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}><MapPin /><span>{t('tabs.route')}</span></button>
        <button className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}><Award /><span>{t('tabs.quiz')}</span></button>
        <button className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}><BookOpen /><span>{t('tabs.safety')}</span></button>
      </nav>
        </>
      )}



      {/* Campsite Route & Map Modal Layer removed in favor of dedicated detail view */}
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
                    : (activeQuizTargetStatus === 'planned'
                        ? (i18n.language === 'ko' ? '여행 계획 역사 퀴즈' : 'Travel Plan History Quiz')
                        : (i18n.language === 'ko' ? '역사 퀴즈 풀기' : 'Solve History Quiz'))
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
                      {activeQuizTargetStatus === 'planned'
                        ? (i18n.language === 'ko' ? '확인 및 계획 등록' : 'Confirm & Register Plan')
                        : (i18n.language === 'ko' ? '확인' : 'Confirm')
                      }
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {selectedBadge && (() => {
        const isUnlocked = selectedBadge.checkUnlocked(heritageStatuses, solvedQuizzes, heritageReviews);
        return (
          <div className="modal-backdrop" style={{ zIndex: 3000 }} onClick={() => setSelectedBadge(null)}>
            <div className="modal-card" style={{ maxWidth: '380px', padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedBadge(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--surface-foreground)' }}
              >
                ✕
              </button>
              
              <div 
                className={isUnlocked ? "badge-spin" : ""}
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  background: isUnlocked ? `radial-gradient(circle, rgba(255,255,255,1) 0%, ${selectedBadge.color}22 100%)` : 'rgba(0,0,0,0.04)', 
                  border: `2px solid ${isUnlocked ? selectedBadge.color : '#cbd5e1'}`,
                  boxShadow: isUnlocked ? `0 0 20px ${selectedBadge.color}33` : 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '3rem', 
                  margin: '0 auto 1.5rem'
                }}
              >
                {selectedBadge.icon}
              </div>
              
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                {i18n.language === 'ko' ? selectedBadge.nameKo : selectedBadge.nameEn}
              </h4>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 'bold', 
                    padding: '3px 8px', 
                    borderRadius: '8px',
                    background: isUnlocked ? 'rgba(22, 101, 52, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                    color: isUnlocked ? 'var(--primary)' : '#dc2626'
                  }}
                >
                  {isUnlocked ? (i18n.language === 'ko' ? '기록 달성 🏆' : 'UNLOCKED 🏆') : (i18n.language === 'ko' ? '도전 중 🔒' : 'LOCKED 🔒')}
                </span>
              </div>
              
              <p style={{ fontSize: '0.82rem', color: 'var(--surface-foreground)', lineHeight: 1.5, marginBottom: '1.5rem', background: 'var(--surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'left' }}>
                {i18n.language === 'ko' ? selectedBadge.descKo : selectedBadge.descEn}
              </p>
              
              {isUnlocked ? (
                <button
                  onClick={() => {
                    const text = i18n.language === 'ko' 
                      ? `[전북 역사 캠퍼] 나만의 배지 획득! 🏅 "${selectedBadge.nameKo}" 배지를 해금했습니다. 전북의 유적지 캠핑을 함께 떠나요!`
                      : `[Jeonbuk History Camper] I unlocked the "${selectedBadge.nameEn}" badge! Join me on a historical camping tour!`;
                    navigator.clipboard.writeText(text);
                    alert(i18n.language === 'ko' ? '공유 문구가 클립보드에 복사되었습니다!' : 'Share message copied to clipboard!');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📢</span> {i18n.language === 'ko' ? '획득 인증 공유하기' : 'Share Achievement'}
                </button>
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--surface-foreground)' }}>
                  {i18n.language === 'ko' ? '유적지 탐방과 퀴즈 풀이를 통해 조건이 충족되면 자동으로 획득됩니다.' : 'Automatically unlocked when requirements are met through travel & quizzes.'}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {isLocationGuideOpen && (
        <div className="modal-backdrop" style={{ zIndex: 3000 }} onClick={() => setIsLocationGuideOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '420px', padding: '1.5rem', textAlign: 'left', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsLocationGuideOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--surface-foreground)' }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎯 {i18n.language === 'ko' ? '위치 권한 허용 가이드' : 'Location Permission Guide'}
            </h3>

            {isStandalone && (
              <div style={{ 
                padding: '10px 12px', 
                borderRadius: '8px', 
                background: 'rgba(22, 101, 52, 0.05)', 
                border: '1px solid rgba(22, 101, 52, 0.15)', 
                color: 'var(--primary)',
                fontSize: '0.78rem',
                lineHeight: 1.4,
                marginBottom: '1rem'
              }}>
                📌 <strong>{i18n.language === 'ko' ? '홈 화면 앱(PWA)으로 실행 중입니다' : 'Running as Home Screen App'}</strong><br />
                {i18n.language === 'ko' 
                  ? '홈 화면에 추가된 바로가기 앱은 브라우저 설정창이 없어 권한 관리가 까다롭습니다. 위치가 정상 작동하지 않으면 맨 아래의 꿀팁을 참고해 주세요.' 
                  : 'Home Screen apps do not have standard browser address bars to manage permissions easily. Please refer to the reset tip at the bottom.'}
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1rem', gap: '4px' }}>
              <button 
                onClick={() => setGuideTab('inapp')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: guideTab === 'inapp' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: guideTab === 'inapp' ? 'bold' : 'normal',
                  color: guideTab === 'inapp' ? 'var(--primary)' : 'var(--surface-foreground)',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {i18n.language === 'ko' ? '카카오톡/인앱' : 'In-App / Kakao'}
              </button>
              <button 
                onClick={() => setGuideTab('chrome')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: guideTab === 'chrome' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: guideTab === 'chrome' ? 'bold' : 'normal',
                  color: guideTab === 'chrome' ? 'var(--primary)' : 'var(--surface-foreground)',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {i18n.language === 'ko' ? '크롬/삼성' : 'Chrome/Samsung'}
              </button>
              <button 
                onClick={() => setGuideTab('safari')}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: guideTab === 'safari' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: guideTab === 'safari' ? 'bold' : 'normal',
                  color: guideTab === 'safari' ? 'var(--primary)' : 'var(--surface-foreground)',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {i18n.language === 'ko' ? '아이폰 사파리' : 'iPhone Safari'}
              </button>
            </div>

            {/* Content */}
            <div style={{ minHeight: '180px', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--foreground)' }}>
              {guideTab === 'inapp' && (
                <div>
                  <p style={{ fontWeight: 'bold', color: 'var(--red-accent)', marginBottom: '0.5rem' }}>
                    {i18n.language === 'ko' 
                      ? '⚠️ 카카오톡 등 앱 내부 브라우저는 위치 차단이 잦습니다.' 
                      : '⚠️ In-App browsers often restrict location services.'}
                  </p>
                  <ol style={{ paddingLeft: '1.2rem', margin: '0 0 1rem 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>
                      {i18n.language === 'ko' 
                        ? '화면 오른쪽 아래의 메뉴 버튼(점 3개 ⋯ 또는 🧭 아이콘)을 누릅니다.' 
                        : 'Tap the menu button (⋯ or 🧭 compass icon) at the bottom-right.'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '옵션에서 "다른 브라우저로 열기" (크롬/사파리)를 선택합니다.' 
                        : 'Select "Open in External Browser" (Safari/Chrome).'}
                    </li>
                  </ol>
                  <p style={{ fontSize: '0.78rem', color: 'var(--surface-foreground)', marginBottom: '0.75rem' }}>
                    {i18n.language === 'ko' 
                      ? '또는 주소를 복사하여 크롬이나 사파리에 직접 붙여넣으세요.' 
                      : 'Or, copy the link and paste it into Chrome or Safari.'}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert(i18n.language === 'ko' ? '주소가 복사되었습니다!' : 'URL copied to clipboard!');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(217, 119, 6, 0.08)',
                      border: '1px dashed var(--gold)',
                      color: 'var(--gold)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🔗 {i18n.language === 'ko' ? '현재 주소 복사하기' : 'Copy Current URL'}
                  </button>
                </div>
              )}

              {guideTab === 'chrome' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '2px' }}>
                    {i18n.language === 'ko' ? '크롬 및 삼성 인터넷 (안드로이드/PC)' : 'Chrome & Samsung Internet (Android/PC)'}
                  </p>
                  <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>
                      {i18n.language === 'ko' 
                        ? '주소창 왼쪽의 자물쇠 아이콘(🔒) 또는 설정 조절 단추를 클릭합니다.' 
                        : 'Click the lock icon (🔒) or settings slider on the left of the address bar.'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '"권한" 또는 "사이트 설정" 메뉴로 이동합니다.' 
                        : 'Go to "Permissions" or "Site settings".'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '"위치" 접근 권한을 "허용"으로 변경합니다.' 
                        : 'Change the "Location" permission to "Allow".'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '페이지를 새로고침(F5)한 뒤 "내 위치 찾기"를 다시 누릅니다.' 
                        : 'Refresh the page and tap "Find My Location" again.'}
                    </li>
                  </ol>
                </div>
              )}

              {guideTab === 'safari' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '2px' }}>
                    {i18n.language === 'ko' ? '사파리 및 아이폰 설정 (iOS)' : 'Safari & iPhone Settings (iOS)'}
                  </p>
                  <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>
                      {i18n.language === 'ko' 
                        ? '아이폰 [설정] ➔ [개인정보 보호 및 보안] ➔ [위치 서비스]가 켜져 있는지 확인합니다.' 
                        : 'Go to iPhone [Settings] ➔ [Privacy & Security] ➔ [Location Services] and verify it is turned on.'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '[설정] ➔ [Safari] ➔ [위치]를 선택하고 반드시 "앱을 사용하는 동안"으로 변경합니다. ("묻기"로 되어 있으면 홈 화면 앱 특성상 안내창이 뜨지 않고 자동으로 차단됩니다.)' 
                        : 'Go to [Settings] ➔ [Safari] ➔ [Location] and set it to "While Using the App" (or Allow). (If set to "Ask", standalone Home Screen apps cannot render the browser prompt and will fail automatically.)'}
                    </li>
                    <li>
                      {i18n.language === 'ko' 
                        ? '또는 Safari 주소창의 "한한/aA" 아이콘을 눌러 [웹 사이트 설정] ➔ [위치]를 "허용"으로 변경합니다.' 
                        : 'Or, tap the "aA" icon in Safari\'s address bar, choose [Website Settings] ➔ [Location] and set to "Allow".'}
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {isStandalone && (
              <div style={{ 
                marginTop: '1rem',
                padding: '10px 12px', 
                borderRadius: '8px', 
                background: 'rgba(217, 119, 6, 0.05)', 
                border: '1px dashed var(--gold)', 
                color: 'var(--foreground)',
                fontSize: '0.78rem',
                lineHeight: 1.45
              }}>
                🔑 <strong>{i18n.language === 'ko' ? '💡 홈화면 바로가기 해결 꿀팁!' : '💡 PWA Reset Tip!'}</strong><br />
                {i18n.language === 'ko' ? (
                  <>
                    1. 홈 화면에서 이 앱 아이콘을 길게 눌러 <strong>삭제(지우기)</strong>합니다.<br />
                    2. <strong>아이폰 설정 ➔ 개인정보 보호 ➔ 위치 서비스 ➔ Safari 웹 사이트</strong> 설정을 <strong>'앱을 사용하는 동안'(허용)</strong>으로 변경합니다. (이게 <strong>'묻기'</strong>로 되어 있으면 홈 화면 앱에서는 무조건 실패합니다.)<br />
                    3. 일반 브라우저로 재접속한 뒤 <strong>'홈 화면에 추가'</strong>를 다시 진행해 주세요.
                  </>
                ) : (
                  <>
                    1. Long-press the icon on your home screen and select <strong>Delete</strong>.<br />
                    2. Go to <strong>iPhone Settings ➔ Privacy ➔ Location Services ➔ Safari Websites</strong> and set it to <strong>'While Using the App'</strong> (Allow). (If set to <strong>'Ask'</strong>, standalone mode will fail automatically.)<br />
                    3. Re-open this site in standard browser and <strong>'Add to Home Screen'</strong> again.
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => setIsLocationGuideOpen(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                marginTop: '1.25rem',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {i18n.language === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
