import React, { useEffect, useState } from 'react';
import 'bootswatch/dist/cerulean/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Header from './components/Header';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import HomePage from './components/HomePage';
import { fetchUser } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [selectedGameIds, setSelectedGameIds] = useState([]);

  const fetchUserData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    fetchUser(token)
      .then(response => response.json())
      .then(data => {
        if (data.id && data.username) {
          setUser({ id: data.id, username: data.username });
        } else {
          setUser(null);
        }
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        setUser(null);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="App">
      <Header user={user} onLogout={() => setUser(null)} />
      <div className="container mt-5">
        <LoginModal onLoginSuccess={fetchUserData} />
        <RegisterModal onRegisterSuccess={fetchUserData} />
        <div className="row">
          {/* HomePage handles the sidebar and cards */}
          <div className="col-md-12">
            <HomePage user={user} selectedGameIds={selectedGameIds} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
