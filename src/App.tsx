import { useState, useEffect } from 'react'
import { Tent, Compass, Map as MapIcon, ShieldCheck, MapPin, Clock, Flame, Accessibility, Info, Star, Navigation, Award, CheckCircle2, XCircle, AlertCircle, Database, Heart } from 'lucide-react'
import { Map, MapMarker, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured, QuizQuestion, Campsite, HeritageSite } from './supabaseClient'

// Campsites Master Data
const MASTER_CAMPSITES: Campsite[] = [
  {
    id: 'moaksan',
    name: 'campsites.moaksan.name',
    description: 'campsites.moaksan.desc',
    lat: 35.7336,
    lng: 127.0928,
    era: 'joseon',
    tags: ['안전점검 완료', '#송광사'],
    distanceToHistoric: 2.4,
    nearbyHeritageIds: ['songgwangsa']
  },
  {
    id: 'hanok',
    name: 'campsites.hanok.name',
    description: 'campsites.hanok.desc',
    lat: 35.8145,
    lng: 127.1504,
    era: 'joseon',
    tags: ['거리순 1위', '#경기전', '#풍남문', '#오목대'],
    distanceToHistoric: 1.1,
    nearbyHeritageIds: ['gyeonggijeon', 'omokdae', 'pungnammun']
  },
  {
    id: 'mireuksa',
    name: 'campsites.mireuksa.name',
    description: 'campsites.mireuksa.desc',
    lat: 36.0082,
    lng: 127.0315,
    era: 'baekje',
    tags: ['안전점검 완료', '유적지 초인접', '#미륵사지'],
    distanceToHistoric: 0.5,
    nearbyHeritageIds: ['mireuksa_site', 'wanggungri']
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
  }
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

function App() {
  const { t, i18n } = useTranslation();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const KAKAO_KEY = isLocal ? "2a9acbfdf57b3822c73494498fc87389" : "0bf5fc207b57b96ebcce8a4a17f33a5c";

  useKakaoLoader({
    appkey: KAKAO_KEY,
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [activeEra, setActiveEra] = useState('joseon');

  // Favorites states
  const [deviceId] = useState(() => {
    let id = localStorage.getItem('history_camper_device_id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      localStorage.setItem('history_camper_device_id', id);
    }
    return id;
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Selected Campsite for interactive mapping (defaults to Moaksan)
  const [selectedCampsiteId, setSelectedCampsiteId] = useState('moaksan');

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

  // Retrieve Favorites from Supabase or LocalStorage
  useEffect(() => {
    async function loadFavorites() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('campsite_id')
            .eq('device_id', deviceId);
          
          if (error) throw error;
          if (data) {
            setFavorites(data.map(item => item.campsite_id));
          }
        } catch (err) {
          console.error("Failed to load favorites from Supabase, loading from LocalStorage:", err);
          const saved = localStorage.getItem('history_camper_favorites');
          if (saved) {
            setFavorites(JSON.parse(saved));
          }
        }
      } else {
        const saved = localStorage.getItem('history_camper_favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
    }
    loadFavorites();
  }, [deviceId]);

  // Toggle Favorite
  const toggleFavorite = async (campsiteId: string) => {
    const isFavorited = favorites.includes(campsiteId);
    let updatedFavorites: string[];

    if (isFavorited) {
      updatedFavorites = favorites.filter(id => id !== campsiteId);
    } else {
      updatedFavorites = [...favorites, campsiteId];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('history_camper_favorites', JSON.stringify(updatedFavorites));

    if (isSupabaseConfigured && supabase) {
      try {
        if (isFavorited) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('device_id', deviceId)
            .eq('campsite_id', campsiteId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({
              device_id: deviceId,
              campsite_id: campsiteId
            });
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to update favorite in Supabase:", err);
      }
    }
  };

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

  // Dynamic campsite routing helpers
  const selectedCampsite = MASTER_CAMPSITES.find(c => c.id === selectedCampsiteId) || MASTER_CAMPSITES[0];
  const nearbyHeritages = MASTER_HERITAGES.filter(h => selectedCampsite.nearbyHeritageIds.includes(h.id));

  // Path coordinates for polyline route starting at campground and drawing lines to historical landmarks
  const polylinePaths = nearbyHeritages.map(h => [
    { lat: selectedCampsite.lat, lng: selectedCampsite.lng },
    { lat: h.lat, lng: h.lng }
  ]);

  // Filter campsites for Era Matching tab
  const filteredCampsites = MASTER_CAMPSITES.filter(c => {
    if (showFavoritesOnly && !favorites.includes(c.id)) {
      return false;
    }
    if (!showFavoritesOnly && activeEra !== 'all' && c.era !== activeEra) {
      return false;
    }
    return true;
  });

  // Navigate to route tab and load clicked campsite
  const viewHeritageRoute = (campsiteId: string) => {
    setSelectedCampsiteId(campsiteId);
    setActiveTab('route');
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
            ERA: 시대별 역사 캠핑지 매칭 & 즐겨찾기
        ========================================= */}
        {activeTab === 'era' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('era.title')}</h3>
            
            <div className="era-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              {/* Favorites filter toggle */}
              <button
                className={`era-btn ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => {
                  setShowFavoritesOnly(prev => !prev);
                  if (!showFavoritesOnly) {
                    setActiveEra('all');
                  }
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  borderColor: showFavoritesOnly ? 'var(--red-accent)' : '',
                  backgroundColor: showFavoritesOnly ? 'rgba(185, 28, 28, 0.05)' : '',
                  color: showFavoritesOnly ? 'var(--red-accent)' : ''
                }}
              >
                <Heart size={14} fill={showFavoritesOnly ? 'var(--red-accent)' : 'none'} color={showFavoritesOnly ? 'var(--red-accent)' : 'currentColor'} />
                {t('era.favorites')}
              </button>

              <div style={{ height: '20px', width: '1px', background: 'var(--border)', margin: '0 4px' }} />

              {Eras.map(era => (
                <button 
                  key={era.id} 
                  className={`era-btn ${(!showFavoritesOnly && activeEra === era.id) ? 'active' : ''}`}
                  onClick={() => {
                    setShowFavoritesOnly(false);
                    setActiveEra(era.id);
                  }}
                >
                  {era.label}
                </button>
              ))}
            </div>

            {filteredCampsites.length > 0 ? (
              <div className="era-grid">
                {filteredCampsites.map(campsite => (
                  <div key={campsite.id} className="card" style={{ marginBottom: 0, position: 'relative' }}>
                    <div className="list-item" style={{ borderBottom: 'none', padding: 0 }}>
                      <div className="list-icon historic" style={{ cursor: 'pointer' }} onClick={() => viewHeritageRoute(campsite.id)}>
                        <Tent size={24} />
                      </div>
                      <div className="list-content" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div 
                            className="list-title" 
                            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                            onClick={() => viewHeritageRoute(campsite.id)}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = ''}
                          >
                            {t(campsite.name)}
                          </div>
                          
                          {/* Heart Icon Button to toggle Favorite */}
                          <button
                            onClick={() => toggleFavorite(campsite.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginTop: '-4px' }}
                          >
                            <Heart 
                              size={20} 
                              fill={favorites.includes(campsite.id) ? 'var(--red-accent)' : 'none'} 
                              color={favorites.includes(campsite.id) ? 'var(--red-accent)' : 'var(--surface-foreground)'}
                              style={{ transition: 'transform 0.1s ease' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </button>
                        </div>
                        
                        <div className="list-desc">{t(campsite.description)}</div>
                        
                        <div className="tag-container" style={{ marginTop: '6px' }}>
                          {campsite.tags.map((tag, idx) => (
                            <span key={idx} className={`badge ${tag.startsWith('#') ? 'gold' : ''}`}>{tag}</span>
                          ))}
                        </div>

                        {/* Button to view dynamic heritage routes */}
                        <button
                          onClick={() => viewHeritageRoute(campsite.id)}
                          style={{
                            width: '100%',
                            marginTop: '12px',
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
                            e.currentTarget.style.color = '#white';
                            // inline style update hack since React direct style rewrite is easier
                            const target = e.currentTarget;
                            target.style.color = '#ffffff';
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
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', marginBottom: 0 }}>
                <Heart size={40} color="var(--border)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <div className="card-title" style={{ justifyContent: 'center', fontSize: '1rem', color: 'var(--surface-foreground)', marginBottom: '0.5rem' }}>
                  {showFavoritesOnly ? t('era.favorites') : t('era.title')}
                </div>
                <div className="card-text" style={{ fontSize: '0.85rem' }}>
                  {showFavoritesOnly ? t('era.empty_favorites') : (i18n.language === 'ko' ? '해당 조건의 캠핑지가 없습니다.' : 'No campsites matching current filters.')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            ROUTE: 도슨트 맞춤형 방문 경로 & KAKAO MAP (Dynamic Integration)
        ========================================= */}
        {activeTab === 'route' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{t('route.title')}</h3>
            
            <div className="route-layout">
              {/* KAKAO MAP COMPONENT */}
              <div className="route-map-container">
                <Map
                  center={{ lat: selectedCampsite.lat, lng: selectedCampsite.lng }}
                  style={{ width: "100%", height: "100%" }}
                  level={selectedCampsiteId === 'mireuksa' ? 6 : 8}
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
                      ⛺ {t(selectedCampsite.name)}
                    </div>
                  </MapMarker>
                  
                  {/* Dynamic Nearby Heritage Markers */}
                  {nearbyHeritages.map(heritage => (
                    <MapMarker key={heritage.id} position={{ lat: heritage.lat, lng: heritage.lng }}>
                      <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", fontWeight: 'bold' }}>
                        🏛️ {t(heritage.name)}
                      </div>
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
                    {t('route.card.title', { campsiteName: t(selectedCampsite.name) })}
                  </div>
                  {/* Heart button on map details */}
                  <button
                    onClick={() => toggleFavorite(selectedCampsite.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Heart 
                      size={20} 
                      fill={favorites.includes(selectedCampsite.id) ? 'var(--red-accent)' : 'none'} 
                      color={favorites.includes(selectedCampsite.id) ? 'var(--red-accent)' : 'var(--surface-foreground)'}
                    />
                  </button>
                </div>
                
                <div className="card-text">
                  {t('route.card.desc', { campsiteName: t(selectedCampsite.name) })}
                </div>

                <div className="timeline">
                  {/* Campground Check-in step */}
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="time">DAY 1 - 14:00</div>
                      <div className="title">{t(selectedCampsite.name)} {i18n.language === 'ko' ? '체크인' : 'Check-in'}</div>
                      <div className="desc">{t(selectedCampsite.description)}</div>
                    </div>
                  </div>

                  {/* Dynamic heritage steps */}
                  {nearbyHeritages.map((heritage, index) => (
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
                  ))}
                </div>
                
                <button 
                  onClick={() => window.open(`https://map.kakao.com/link/to/${t(selectedCampsite.name)},${selectedCampsite.lat},${selectedCampsite.lng}`)}
                  style={{ width: '100%', padding: '12px', marginTop: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Navigation size={18} />
                  {t('route.card.btn')}
                </button>
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
                  {t(selectedCampsite.name)} {i18n.language === 'ko' ? '안전 정보' : 'Safety Info'}
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
