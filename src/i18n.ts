import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      header: {
        title: "전북역사 캠퍼",
      },
      tabs: {
        home: "큐레이션",
        era: "시대매칭",
        route: "맞춤동선",
        safety: "안전·편의",
        quiz: "역사퀴즈"
      },
      home: {
        title1: "전북의 역사와 자연을 잇는",
        title2: "체류형 역사 탐방 큐레이션",
        desc: "안전한 캠핑과 함께 깊이 있는 전북 역사 여행을 떠나보세요.",
        card1: {
          title: "시대별 역사 캠핑지 매칭",
          desc: "전북의 문화유산 데이터와 고캠핑 API를 연동하여 선택한 시대별 유적지 인근의 안전한 캠핑장을 추천합니다.",
          tag1: "고캠핑 연동",
          tag2: "백제~근대유산"
        },
        card2: {
          title: "도슨트 기반 맞춤형 동선",
          desc: "캠핑 위치를 중심으로 주변 문화유산의 역사적 배경과 관람 포인트를 묶어 최적의 1박 2일 탐방 코스를 생성합니다."
        },
        card3: {
          title: "실시간 안전·편의 정보",
          desc: "소방 및 안전 시설 현황, 문화유산 관람 시간, 무장애(Barrier-free) 시설 정보를 통합 제공합니다."
        }
      },
      era: {
        title: "시대별 역사 캠핑지",
        view_heritage: "주변 유적지 보기",
        favorites: "즐겨찾기",
        empty_favorites: "즐겨찾기한 캠핑장이 없습니다. 마음에 드는 캠핑장의 버튼을 눌러 등록해 보세요!",
        distance_km: "{{distance}}km",
        status_planned: "갈 예정",
        status_visited: "다녀옴",
        empty_planned: "갈 예정으로 등록한 캠핑장이 없습니다. 캠핑장 카드 하단의 [📌 갈 예정] 버튼을 눌러 등록해 보세요!",
        empty_visited: "다녀온 곳으로 등록한 캠핑장이 없습니다. 캠핑장 카드 하단의 [✅ 다녀옴] 버튼을 눌러 등록해 보세요!",
        eras: {
          all: "전체",
          baekje: "백제",
          later_baekje: "후백제",
          goryeo: "고려",
          joseon: "조선",
          modern: "근대"
        }
      },
      campsites: {
        moaksan: {
          name: "완주 모악산 오토캠핑장",
          desc: "조선시대 유적지 중심 추천 (2.4km)",
          detail: "모악산 자락 아래 위치한 울창하고 조용한 숲속 캠핑장입니다."
        },
        hanok: {
          name: "전주 한옥마을 글램핑",
          desc: "조선시대 유적지 중심 추천 (1.1km)",
          detail: "전주 경기전과 전동성당 인근의 편리한 도심 속 글램핑장입니다."
        },
        mireuksa: {
          name: "익산 미륵사지 오토캠핑장",
          desc: "백제시대 유적지 중심 추천 (0.5km)",
          detail: "국보 미륵사지 석탑이 바로 앞에 있는 역사 캠핑을 즐기기 가장 좋은 캠핑장입니다."
        }
      },
      heritages: {
        songgwangsa: {
          name: "완주 송광사",
          desc: "조선시대의 대웅전 보물과 아름다운 벚꽃길을 지닌 유서 깊은 사찰"
        },
        gyeonggijeon: {
          name: "전주 경기전",
          desc: "조선 태조 이성계의 초상화(어진)를 봉안한 조선 왕조의 발상지"
        },
        omokdae: {
          name: "오목대",
          desc: "이성계가 황산대첩 승전 후 종친들과 연회를 베풀었던 언덕 유적"
        },
        pungnammun: {
          name: "풍남문",
          desc: "조선시대 전주부성의 남문이자 유일하게 남아있는 웅장한 성문"
        },
        mireuksa_site: {
          name: "익산 미륵사지",
          desc: "백제 무왕 때 창건된 동양 최대 크기의 유서 깊은 사찰 유적지"
        },
        wanggungri: {
          name: "익산 왕궁리 유적",
          desc: "백제 무왕 시절 왕궁터로, 국보 오층석탑과 유물이 발견된 사적"
        }
      },
      route: {
        title: "기점 기반 맞춤형 방문 경로",
        map: {
          marker_campsite: "캠핑장",
          marker_heritage: "유적지 (도슨트)",
          load_public: "전라도 공공 캠핑장 표시 🗺️",
          api_key_alert: "💡 API 키가 미등록 상태여서 전라도 지역 주요 공공 캠핑장 모의 데이터를 지도에 표시합니다. 실시간 고캠핑 데이터를 불러오려면 .env 파일에 VITE_GOCAMPING_API_KEY를 기입해 주세요.",
          campsite_info: "공공 캠핑장 상세 정보",
          address: "주소",
          tel: "전화번호",
          induty: "유형"
        },
        card: {
          title: "{{campsiteName}} 기점 탐방 코스",
          desc: "{{campsiteName}} 주변 캠핑을 기반으로 유서 깊은 역사를 탐방하는 코스입니다.",
          btn: "카카오맵 길찾기 시작"
        }
      },
      safety: {
        title: "안전·편의 통합 정보",
        card1: {
          title: "선택한 캠핑장 안전 정보",
          list1: {
            title: "소방·안전 시설",
            desc: "소화기 15개, 화재경보기 10개 완비",
            tag: "최근 점검: 2026.05.10"
          },
          list2: {
            title: "긴급 연락망",
            desc: "캠핑장 관리소: 063-000-0000<br/>인근 병원: 3.2km (전주병원)"
          }
        },
        card2: {
          title: "주변 유적지 관람 편의 정보",
          list1: {
            title: "관람 가능 시간",
            desc: "하절기: 09:00 ~ 18:00 (입장 마감 17:00)"
          },
          list2: {
            title: "무장애(Barrier-free) 시설",
            desc: "경사로 완비, 점자 블록 설치, 장애인 화장실 완비"
          }
        }
      },
      quiz: {
        title: "역사 탐방 퀴즈",
        subtitle: "전북 지역의 유서 깊은 문화유산과 역사를 재미있는 퀴즈로 배워보세요!",
        start: "퀴즈 시작하기",
        next: "다음 문제",
        result: "퀴즈 결과",
        score: "총 {{total}}문제 중 {{score}}문제를 맞췄습니다!",
        restart: "다시 도전하기",
        correct: "정답입니다! 👏",
        incorrect: "아쉽게도 틀렸습니다. 😢",
        mock_alert: "💡 현재 모의(Mock) 데이터로 퀴즈를 구동 중입니다. 프로젝트 루트에 .env 파일을 만들고 Supabase 키를 추가하면 실시간 DB로 연동됩니다.",
        supabase_alert: "✅ Supabase 실시간 데이터베이스 연동 완료! 퀴즈 데이터를 클라우드에서 실시간으로 불러오는 중입니다.",
        era_select: "시대 선택",
        region_select: "지역 선택",
        all: "전체"
      }
    }
  },
  en: {
    translation: {
      header: {
        title: "Jeonbuk History Camper",
      },
      tabs: {
        home: "Curation",
        era: "Era Match",
        route: "Custom Route",
        safety: "Safety Info",
        quiz: "History Quiz"
      },
      home: {
        title1: "Connecting Jeonbuk's history and nature",
        title2: "Stay-type historical exploration curation",
        desc: "Embark on an in-depth journey through Jeonbuk's history with safe camping.",
        card1: {
          title: "Era-based Historical Campsite Matching",
          desc: "Recommends safe campsites near selected era-based historic sites by linking Jeonbuk's cultural heritage data and the GoCamping API.",
          tag1: "GoCamping Link",
          tag2: "Baekje~Modern Heritage"
        },
        card2: {
          title: "Docent-based Custom Route",
          desc: "Generates an optimal 2 days 1 night tour course by grouping the historical background and viewing points of surrounding cultural heritage around the camping location."
        },
        card3: {
          title: "Real-time Safety & Convenience Info",
          desc: "Provides integrated info on fire/safety facilities, cultural heritage viewing hours, and barrier-free facilities."
        }
      },
      era: {
        title: "Historical Campsites by Era",
        view_heritage: "View Nearby Heritage",
        favorites: "Saved",
        empty_favorites: "No saved campsites yet. Add campsites to favorites by clicking the buttons on the card!",
        distance_km: "{{distance}}km",
        status_planned: "Plan to Visit",
        status_visited: "Visited",
        empty_planned: "No planned campsites yet. Click the [📌 Plan to Visit] button on a campground card!",
        empty_visited: "No visited campsites yet. Click the [✅ Visited] button on a campground card!",
        eras: {
          all: "All",
          baekje: "Baekje",
          later_baekje: "Later Baekje",
          goryeo: "Goryeo",
          joseon: "Joseon",
          modern: "Modern"
        }
      },
      campsites: {
        moaksan: {
          name: "Wanju Moaksan Auto Campground",
          desc: "Joseon era historic site centered (2.4km)",
          detail: "A dense, peaceful forest campsite located at the foot of Moaksan Mountain."
        },
        hanok: {
          name: "Jeonju Hanok Village Glamping",
          desc: "Joseon era historic site centered (1.1km)",
          detail: "A convenient glamping site located near Gyeonggijeon and Jeondong Cathedral in Jeonju."
        },
        mireuksa: {
          name: "Iksan Mireuksa Temple Site Campground",
          desc: "Baekje era historic site centered (0.5km)",
          detail: "The best historical campsite located right in front of the National Treasure Mireuksa Stone Pagoda."
        }
      },
      heritages: {
        songgwangsa: {
          name: "Wanju Songgwangsa Temple",
          desc: "A historic temple featuring Joseon era treasures and beautiful cherry blossom paths."
        },
        gyeonggijeon: {
          name: "Jeonju Gyeonggijeon",
          desc: "The birthplace of the Joseon Dynasty enshrining the portrait of founder Yi Seong-gye."
        },
        omokdae: {
          name: "Omokdae",
          desc: "The hill where Yi Seong-gye held a banquet after winning the Battle of Hwangsan."
        },
        pungnammun: {
          name: "Pungnammun Gate",
          desc: "The grand southern gate of Jeonju Castle, and the only remaining gate from the Joseon era."
        },
        mireuksa_site: {
          name: "Iksan Mireuksa Temple Site",
          desc: "The largest temple site in East Asia, founded during the reign of King Mu of Baekje."
        },
        wanggungri: {
          name: "Iksan Wanggung-ri Ruins",
          desc: "The historic royal palace site of King Mu, home to the National Treasure Five-story Stone Pagoda."
        }
      },
      route: {
        title: "Base-point Custom Visit Route",
        map: {
          marker_campsite: "Campground",
          marker_heritage: "Heritage (Docent)",
          load_public: "Show Jeolla Public Campsites 🗺️",
          api_key_alert: "💡 API key is not registered. Showing mock campsite data for Jeolla region. To load real-time GoCamping API data, please write VITE_GOCAMPING_API_KEY in your .env file.",
          campsite_info: "Public Campsite Info",
          address: "Address",
          tel: "Tel",
          induty: "Type"
        },
        card: {
          title: "Exploration Course based on {{campsiteName}}",
          desc: "A custom course exploring the rich history based on camping around {{campsiteName}}.",
          btn: "Start KakaoMap Directions"
        }
      },
      safety: {
        title: "Integrated Safety & Convenience Info",
        card1: {
          title: "Selected Campground Safety Info",
          list1: {
            title: "Fire & Safety Facilities",
            desc: "Fully equipped with 15 fire extinguishers and 10 fire alarms",
            tag: "Recent Check: 2026.05.10"
          },
          list2: {
            title: "Emergency Contact",
            desc: "Campground Office: 063-000-0000<br/>Nearby Hospital: 3.2km (Jeonju Hospital)"
          }
        },
        card2: {
          title: "Nearby Heritage Convenience Info",
          list1: {
            title: "Viewing Hours",
            desc: "Summer: 09:00 ~ 18:00 (Last entry 17:00)"
          },
          list2: {
            title: "Barrier-free Facilities",
            desc: "Ramps, tactile paving, accessible restrooms available"
          }
        }
      },
      quiz: {
        title: "History Exploration Quiz",
        subtitle: "Learn about the rich cultural heritage and history of Jeonbuk through fun quizzes!",
        start: "Start Quiz",
        next: "Next Question",
        result: "Quiz Result",
        score: "You got {{score}} out of {{total}} questions correct!",
        restart: "Try Again",
        correct: "Correct! 👏",
        incorrect: "Incorrect. 😢",
        mock_alert: "💡 Running on mock data. Create a .env file in the root and add Supabase keys to load quizzes from your cloud database.",
        supabase_alert: "✅ Connected to Supabase! Quizzes are synchronized from the cloud in real-time.",
        era_select: "Select Era",
        region_select: "Select Region",
        all: "All"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ko",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
