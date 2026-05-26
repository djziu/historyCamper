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
        route: "역사지도",
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
          name: "김제 모악산 캠핑파크",
          desc: "조선시대 유적지 인근 추천 (4.1km)",
          detail: "모악산 자락 아래 하천이 흐르고 울창한 숲에 둘러싸인 조용한 캠핑장입니다."
        },
        hanok: {
          name: "전주 한옥마을 도란도란 카라반",
          desc: "조선시대 유적지 인근 추천 (0.5km)",
          detail: "전주 경기전, 오목대 인근 한옥마을 내에 위치한 편리한 도심 속 카라반 글램핑장입니다."
        },
        gyoryongsan: {
          name: "남원 교룡산 오토캠핑장",
          desc: "조선시대 유적지 인근 추천 (30km 내)",
          detail: "교룡산성 아래 자리 잡아 맑은 공기와 조용한 환경을 갖추고 있으며, 춘향전의 무대인 광한루원과 가깝습니다."
        },
        mireuksa: {
          name: "익산 백제캠핑장",
          desc: "백제시대 유적지 인근 추천 (6.7km)",
          detail: "익산 미륵사지 유적지와 인접하여 역사 탐방과 캠핑을 즐기기 가장 좋은 캠핑장입니다."
        },
        ajung: {
          name: "전주 아중호수 캠핑장",
          desc: "후백제 유적지 인근 추천 (3.3km)",
          detail: "아중호수의 고즈넉한 풍경을 바라보며 힐링할 수 있는 도심 인접 캠핑장입니다."
        },
        geumsansa_camp: {
          name: "김제 금산사 청소년야영장",
          desc: "후백제 유적지 인근 추천 (30km 내)",
          detail: "견훤왕이 유배되었던 유서 깊은 금산사 자락에 위치한 자연 친화적 야영장으로 힐링하기 좋습니다."
        },
        geumma: {
          name: "익산 금마 에코캠핑장",
          desc: "고려시대 유적지 인근 추천 (1.9km)",
          detail: "금마저수지와 서동공원 옆에 위치하여 자연 생태와 역사 탐방을 동시에 즐기기 좋은 곳입니다."
        },
        baekdudaegan: {
          name: "남원 백두대간 레저오토캠핑장",
          desc: "고려시대 유적지 인근 추천 (30km 내)",
          detail: "백두대간 생태교육장 인근에 위치하며, 고려시대 웅장한 가람터인 만복사지와 지리산 탐방에 좋습니다."
        },
        cheongamsan: {
          name: "군산 청암산 오토캠핑장",
          desc: "근대문화 유적지 인근 추천 (7.8km)",
          detail: "청암산 호수 인근의 깨끗하고 다채로운 편의시설을 갖춘 가족형 오토캠핑장입니다."
        },
        mokpo_football: {
          name: "목포 국제축구센터 캠핑장",
          desc: "근대문화 유적지 인근 추천 (30km 내)",
          detail: "근대 항구 도시 목포의 근대역사관 거리와 인접하여 유달산 절경과 목포의 근대 숨결을 생생히 느끼는 베이스캠프입니다."
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
        gwanghallu: {
          name: "남원 광한루원",
          desc: "조선 시대의 대표적인 정원으로 성춘향과 이몽룡의 사랑 이야기가 깃든 명승"
        },
        mireuksa_site: {
          name: "익산 미륵사지",
          desc: "백제 무왕 때 창건된 동양 최대 크기의 유서 깊은 사찰 유적지"
        },
        wanggungri: {
          name: "익산 왕궁리 유적",
          desc: "백제 무왕 시절 왕궁터로, 국보 오층석탑과 유물이 발견된 사적"
        },
        donggosanseong: {
          name: "전주 동고산성",
          desc: "후백제를 건국한 견훤왕의 궁성터이자 전주 전경을 조망할 수 있는 산성 유적지"
        },
        seungamsan_fortress: {
          name: "전주 승암산성 (치명자산)",
          desc: "후백제 도성 방어를 위한 핵심 기지였던 전주 한옥마을 인근의 요새 유적지"
        },
        geumsansa: {
          name: "김제 금산사",
          desc: "후백제 견훤이 아들들에 의해 유배되었던 미륵 신앙의 중심 사찰"
        },
        godori_buddha: {
          name: "익산 고도리 석조여래입상",
          desc: "고려 시대의 불상 양식을 잘 보여주는 익산 금마면의 보물 석조 여래 입상"
        },
        manboksa_site: {
          name: "남원 만복사지",
          desc: "고려 문종 시절 창건된 사찰 터로, 기이하고 웅장한 석조 유물들이 남아있는 사적"
        },
        modern_museum: {
          name: "군산 근대역사박물관",
          desc: "군산의 근대 역사와 해양 물류 문화를 체험할 수 있는 대표 박물관"
        },
        hirotsu_house: {
          name: "군산 신흥동 일본식 가옥",
          desc: "일제강점기 일본인 지주의 생활상과 건축 양식을 보존하고 있는 등록문화재"
        },
      },
      route: {
        title: "전라도 역사 유적지 지도",
        map: {
          marker_campsite: "캠핑장",
          marker_heritage: "유적지 (도슨트)",
          load_public: "전라도 공공 캠핑장 표시 🗺️",
          api_key_alert: "💡 API 키가 미등록 상태여서 전라도 지역 주요 공공 캠핑장 모의 데이터를 지도에 표시합니다. 실시간 고캠핑 데이터를 불러오려면 .env 파일에 VITE_GOCAMPING_API_KEY를 기입해 주세요.",
          campsite_info: "공공 캠핑장 상세 정보",
          address: "주소",
          tel: "전화번호",
          induty: "유형",
          my_location: "내 위치",
          find_my_location: "내 위치 찾기 🎯",
          distance_from_me: "내 위치에서 {{distance}}km",
          gps_error: "위치 정보를 가져올 수 없습니다. 브라우저의 위치 권한을 허용해 주세요.",
          reservable_only: "예약 가능만 보기 📅",
          naver_booking: "네이버 예약 🔍",
          kakao_booking: "카카오 예약/정보 📍"
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
        route: "History Map",
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
          name: "Gimje Moaksan Camping Park",
          desc: "Joseon era historic site centered (4.1km)",
          detail: "A peaceful campground surrounded by dense forest at the foot of Moaksan Mountain with a nearby stream."
        },
        hanok: {
          name: "Jeonju Hanok Village Doran Doran Caravan",
          desc: "Joseon era historic site centered (0.5km)",
          detail: "A convenient caravan campground located in Hanok Village near Gyeonggijeon and Omokdae."
        },
        gyoryongsan: {
          name: "Gyoryongsan Auto Campground, Namwon",
          desc: "Joseon era historic site centered (Within 30km)",
          detail: "Located under Gyoryongsanseong, offering fresh air, quiet forest, and proximity to Gwanghallu Garden."
        },
        mireuksa: {
          name: "Iksan Baekje Campground",
          desc: "Baekje era historic site centered (6.7km)",
          detail: "A campground near Iksan Mireuksa Temple Site, perfect for historical exploration and camping."
        },
        ajung: {
          name: "Jeonju Ajung Lake Campground",
          desc: "Later Baekje era historic site centered (3.3km)",
          detail: "A peaceful lakeside campground near Ajung Lake, close to the city."
        },
        geumsansa_camp: {
          name: "Geumsansa Youth Campground, Gimje",
          desc: "Later Baekje era historic site centered (Within 30km)",
          detail: "A nature-friendly campground at the foot of historic Geumsansa Temple, where King Gyeon Hwon was confined."
        },
        geumma: {
          name: "Iksan Geumma Eco Campground",
          desc: "Goryeo era historic site centered (1.9km)",
          detail: "Located next to Geumma Reservoir, ideal for nature and historical tour."
        },
        baekdudaegan: {
          name: "Baekdu-daegan Leisure Auto Campground, Namwon",
          desc: "Goryeo era historic site centered (Within 30km)",
          detail: "Located near the Eco Center, great for exploring Goryeo's Manboksa Temple Site and Jirisan."
        },
        cheongamsan: {
          name: "Gunsan Cheongamsan Auto Campground",
          desc: "Modern era historic site centered (7.8km)",
          detail: "A family-friendly auto campground near Cheongamsan Lake with top-notch amenities."
        },
        mokpo_football: {
          name: "Mokpo International Football Center Campground",
          desc: "Modern era historic site centered (Within 30km)",
          detail: "Located near Mokpo Modern History Hall, a basecamp to experience the breathtaking view of Yudal Mountain and Mokpo's modern atmosphere."
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
        gwanghallu: {
          name: "Gwanghallu Garden, Namwon",
          desc: "A representative Joseon-era garden, famous for the love story of Chunhyang and Mongryong."
        },
        mireuksa_site: {
          name: "Iksan Mireuksa Temple Site",
          desc: "The largest temple site in East Asia, founded during the reign of King Mu of Baekje."
        },
        wanggungri: {
          name: "Iksan Wanggung-ri Ruins",
          desc: "The historic royal palace site of King Mu, home to the National Treasure Five-story Stone Pagoda."
        },
        donggosanseong: {
          name: "Jeonju Donggosanseong Fortress",
          desc: "The palace site of King Gyeon Hwon, founder of Later Baekje, offering panoramic views of Jeonju."
        },
        seungamsan_fortress: {
          name: "Seungamsan Fortress (Chimyeongjasan), Jeonju",
          desc: "A historic fortress defense outpost near Jeonju Hanok Village."
        },
        geumsansa: {
          name: "Geumsansa Temple, Gimje",
          desc: "The central temple of Maitreya belief, where King Gyeon Hwon was confined by his sons."
        },
        godori_buddha: {
          name: "Iksan Godori Standing Stone Buddha",
          desc: "A Goryeo-era standing stone Buddha statue in Geumma-myeon, designated as a national treasure."
        },
        manboksa_site: {
          name: "Manboksa Temple Site, Namwon",
          desc: "A temple site founded during Goryeo King Munjong's reign, preserving magnificent stone relics."
        },
        modern_museum: {
          name: "Gunsan Modern History Museum",
          desc: "A representative museum showcasing Gunsan's modern history and maritime logistics culture."
        },
        hirotsu_house: {
          name: "Gunsan Sinheung-dong Japanese House",
          desc: "A registered cultural heritage preserving the lifestyle and architecture of a Japanese landlord during the colonial era."
        },
        mokpo_modern: {
          name: "Mokpo Modern History Hall 1",
          desc: "The former Japanese consulate building, preserving Mokpo's opening and modern history."
        }
      },
      route: {
        title: "Jeolla Historical Heritage Map",
        map: {
          marker_campsite: "Campground",
          marker_heritage: "Heritage (Docent)",
          load_public: "Show Jeolla Public Campsites 🗺️",
          api_key_alert: "💡 API key is not registered. Showing mock campsite data for Jeolla region. To load real-time GoCamping API data, please write VITE_GOCAMPING_API_KEY in your .env file.",
          campsite_info: "Public Campsite Info",
          address: "Address",
          tel: "Tel",
          induty: "Type",
          my_location: "My Location",
          find_my_location: "Find My Location 🎯",
          distance_from_me: "{{distance}}km from me",
          gps_error: "Failed to retrieve location. Please allow location permissions in your browser.",
          reservable_only: "Reservable Only 📅",
          naver_booking: "Naver Booking 🔍",
          kakao_booking: "Kakao Booking/Info 📍"
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
