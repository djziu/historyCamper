import { useState } from 'react'
import { Home, Search, BookOpen, User } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="mobile-container">
      <header className="top-header">
        <div className="header-title">History App</div>
      </header>

      <div className="scroll-area">
        {activeTab === 'home' && (
          <div>
            <div className="card">
              <div className="card-title">Welcome back!</div>
              <div className="card-text">Continue your journey through history. We've prepared new daily quizzes for you.</div>
            </div>
            <div className="card">
              <div className="card-title">Recent Activity</div>
              <div className="card-text">You completed the "Joseon Dynasty" quiz with a score of 85%.</div>
            </div>
            <div className="card">
              <div className="card-title">Recommended</div>
              <div className="card-text">Explore origins of the Three Kingdoms era.</div>
            </div>
          </div>
        )}
        {activeTab === 'search' && (
          <div className="card">
            <div className="card-title">Search</div>
            <div className="card-text">Search feature coming soon...</div>
          </div>
        )}
        {activeTab === 'learn' && (
          <div className="card">
            <div className="card-title">Learn</div>
            <div className="card-text">Educational resources and modules.</div>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-title">Profile</div>
            <div className="card-text">Your stats and settings.</div>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home />
          <span>Home</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search />
          <span>Search</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'learn' ? 'active' : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          <BookOpen />
          <span>Learn</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default App
