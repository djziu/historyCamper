import { useState } from 'react'
import { Tent, Compass, Map as MapIcon, ShieldCheck, MapPin, Clock, Flame, Accessibility, Info, Star, Navigation } from 'lucide-react'
import { Map, MapMarker, Polyline, useKakaoLoader } from 'react-kakao-maps-sdk'

function App() {
  const [loading, error] = useKakaoLoader({
    appkey: "2a9acbfdf57b3822c73494498fc87389",
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [activeEra, setActiveEra] = useState('조선');

  const Eras = ['전체', '백제', '후백제', '고려', '조선', '근대'];

  return (
    <div className="mobile-container">
      <header className="top-header">
        <div className="header-title">
          <Tent size={22} className="text-primary" />
          전북역사 캠퍼
        </div>
      </header>

      <div className="scroll-area">
        {/* =========================================
            HOME (Curation Overview)
        ========================================= */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
              전북의 역사와 자연을 잇는<br />
              <span style={{ color: 'var(--primary)' }}>체류형 역사 탐방 큐레이션</span>
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              안전한 캠핑과 함께 깊이 있는 전북 역사 여행을 떠나보세요.
            </p>

            <div className="card">
              <div className="card-title">
                <Clock size={20} color="var(--primary)" />
                시대별 역사 캠핑지 매칭
              </div>
              <div className="card-text">
                전북의 문화유산 데이터와 고캠핑 API를 연동하여 선택한 시대별 유적지 인근의 안전한 캠핑장을 추천합니다.
              </div>
              <div className="tag-container">
                <span className="badge"><Tent size={14}/> 고캠핑 연동</span>
                <span className="badge gold"><Star size={14}/> 백제~근대유산</span>
              </div>
            </div>

            <div className="card gold-accent">
              <div className="card-title">
                <MapIcon size={20} color="var(--gold)" />
                도슨트 기반 맞춤형 동선
              </div>
              <div className="card-text">
                캠핑 위치를 중심으로 주변 문화유산의 역사적 배경과 관람 포인트를 묶어 최적의 1박 2일 탐방 코스를 생성합니다.
              </div>
            </div>

            <div className="card red-accent">
              <div className="card-title">
                <ShieldCheck size={20} color="var(--red-accent)" />
                실시간 안전·편의 정보
              </div>
              <div className="card-text">
                소방 및 안전 시설 현황, 문화유산 관람 시간, 무장애(Barrier-free) 시설 정보를 통합 제공합니다.
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            ERA: 시대별 역사 캠핑지 매칭
        ========================================= */}
        {activeTab === 'era' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>시대별 역사 캠핑지</h3>
            
            <div className="era-selector">
              {Eras.map(era => (
                <button 
                  key={era} 
                  className={`era-btn ${activeEra === era ? 'active' : ''}`}
                  onClick={() => setActiveEra(era)}
                >
                  {era}
                </button>
              ))}
            </div>

            <div className="card">
              <div className="list-item">
                <div className="list-icon historic">
                  <Tent size={24} />
                </div>
                <div className="list-content">
                  <div className="list-title">완주 모악산 오토캠핑장</div>
                  <div className="list-desc">조선시대 유적지 중심 추천 (2.4km)</div>
                  <div className="tag-container" style={{ marginTop: '6px' }}>
                    <span className="badge">안전점검 완료</span>
                    <span className="badge gold">#송광사</span>
                  </div>
                </div>
              </div>

              <div className="list-item">
                <div className="list-icon historic">
                  <Tent size={24} />
                </div>
                <div className="list-content">
                  <div className="list-title">전주 한옥마을 글램핑</div>
                  <div className="list-desc">조선시대 유적지 중심 추천 (1.1km)</div>
                  <div className="tag-container" style={{ marginTop: '6px' }}>
                    <span className="badge">거리순 1위</span>
                    <span className="badge gold">#경기전 #풍남문</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            ROUTE: 도슨트 맞춤형 방문 경로 & KAKAO MAP
        ========================================= */}
        {activeTab === 'route' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>기점 기반 맞춤형 방문 경로</h3>
            
            {/* KAKAO MAP COMPONENT */}
            <div style={{ marginBottom: '1.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, position: 'relative', zIndex: 1, height: '280px', background: '#1e293b' }}>
              <Map
                center={{ lat: 35.81, lng: 127.12 }} // Viewport Center
                style={{ width: "100%", height: "100%" }}
                level={8}
              >
                {/* 캠핑장 마커 */}
                <MapMarker 
                  position={{ lat: 35.7336, lng: 127.0928 }}
                  image={{
                    src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    size: { width: 24, height: 35 }
                  }}
                >
                  <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center", borderRadius: "4px", fontWeight: "bold" }}>모악산 캠핑장</div>
                </MapMarker>
                
                {/* 유적지 마커 */}
                <MapMarker position={{ lat: 35.7277, lng: 127.0987 }}>
                  <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center" }}>송광사 (도슨트)</div>
                </MapMarker>
                
                <MapMarker position={{ lat: 35.8145, lng: 127.1504 }}>
                  <div style={{ padding: "3px 6px", color: "black", fontSize: "0.75rem", textAlign: "center" }}>전주 경기전</div>
                </MapMarker>

                {/* 연결 경로 선 */}
                <Polyline
                  path={[
                    [
                      { lat: 35.7336, lng: 127.0928 },
                      { lat: 35.7277, lng: 127.0987 },
                      { lat: 35.8145, lng: 127.1504 }
                    ]
                  ]}
                  strokeWeight={4}
                  strokeColor={"#10b981"}
                  strokeOpacity={0.9}
                  strokeStyle={"solid"}
                />
              </Map>
            </div>

            <div className="card gold-accent">
              <div className="card-title">
                <MapPin size={20} color="var(--gold)"/>
                전주·완주 조선 왕조 뿌리 코스
              </div>
              <div className="card-text">
                완주 모악산 주변 캠핑을 기반으로 조선의 발상지를 탐방하는 코스입니다.
              </div>

              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="time">DAY 1 - 14:00</div>
                    <div className="title">완주 모악산 캠핑장 체크인</div>
                    <div className="desc">텐트 피칭 및 휴식, 캠핑장 내 안전시설 예약 확인</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="time">DAY 1 - 16:00</div>
                    <div className="title">송광사 관람 (도슨트)</div>
                    <div className="desc">조선시대 건물과 불상 역사 하이라이트 관람</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="time">DAY 2 - 10:00</div>
                    <div className="title">전주 경기전</div>
                    <div className="desc">태조 이성계의 어진과 조선 왕조의 숨결 느끼기</div>
                  </div>
                </div>
              </div>
              
              <button style={{ width: '100%', padding: '12px', marginTop: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Navigation size={18} />
                카카오맵 길찾기 시작
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            SAFETY: 실시간 안전 및 편의 정보 통합
        ========================================= */}
        {activeTab === 'safety' && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>안전·편의 통합 정보</h3>
            
            <div className="card red-accent">
              <div className="card-title">
                <Tent size={20} color="var(--red-accent)"/>
                모악산 캠핑장 안전 정보
              </div>
              <div className="list-item">
                <div className="list-icon safety"><Flame size={20} /></div>
                <div className="list-content">
                  <div className="list-title">소방·안전 시설</div>
                  <div className="list-desc">소화기 15개, 화재경보기 10개 완비</div>
                  <span className="badge red" style={{marginTop: '4px'}}>최근 점검: 2026.05.10</span>
                </div>
              </div>
              <div className="list-item">
                <div className="list-icon safety"><Info size={20} /></div>
                <div className="list-content">
                  <div className="list-title">긴급 연락망</div>
                  <div className="list-desc">캠핑장 관리소: 063-000-0000<br/>인근 병원: 3.2km (전주병원)</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">
                <Compass size={20} color="var(--primary)"/>
                송광사 관람 편의 정보
              </div>
              <div className="list-item">
                <div className="list-icon"><Clock size={20} /></div>
                <div className="list-content">
                  <div className="list-title">관람 가능 시간</div>
                  <div className="list-desc">하절기: 09:00 ~ 18:00 (입장 마감 17:00)</div>
                </div>
              </div>
              <div className="list-item">
                <div className="list-icon"><Accessibility size={20} /></div>
                <div className="list-content">
                  <div className="list-title">무장애(Barrier-free) 시설</div>
                  <div className="list-desc">경사로 완비, 점자 블록 설치, 장애 화장실 있음</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><Compass /><span>큐레이션</span></button>
        <button className={`nav-item ${activeTab === 'era' ? 'active' : ''}`} onClick={() => setActiveTab('era')}><Clock /><span>시대매칭</span></button>
        <button className={`nav-item ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}><MapPin /><span>맞춤동선</span></button>
        <button className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}><ShieldCheck /><span>안전·편의</span></button>
      </nav>
    </div>
  )
}

export default App
