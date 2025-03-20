import '../styles/Navigation.css';

function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <nav className="navigation">
      <ul className="nav-list">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item">
            <button
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation; 