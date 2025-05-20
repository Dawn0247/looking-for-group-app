import React, { useEffect, useState } from 'react';
import { fetchGames, fetchGamesCount } from '../api';

function SidebarGameFilter({ onFilterChange }) {
    const [games, setGames] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);
    const [gamesCount, setGamesCount] = useState({});
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        fetchGames({ active: true })
            .then(res => res.json())
            .then(data => {
                const validGames = Array.isArray(data)
                    ? data.filter(g => g && typeof g.id !== 'undefined' && typeof g.name === 'string')
                    : [];
                setGames(validGames);
            })
            .catch(() => setGames([]));
        // Fetch games count
        fetchGamesCount()
            .then(res => res.json())
            .then(data => setGamesCount(data))
            .catch(() => setGamesCount({}));
    }, []);

    // Refetch games count when accordion is expanded
    useEffect(() => {
        if (!collapsed) {
            fetchGamesCount()
                .then(res => res.json())
                .then(data => setGamesCount(data))
                .catch(() => setGamesCount({}));
        }
    }, [collapsed]);

    const toggleGame = (id) => {
        setSelectedGames(prev => {
            let updated;
            if (prev.includes(id)) {
                updated = prev.filter(gid => gid !== id);
            } else {
                updated = [...prev, id];
            }
            if (onFilterChange) onFilterChange(updated);
            return updated;
        });
    };

    const handleAccordionToggle = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className="card bg-light mb-4">
            <div className="card-header bg-primary text-white" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={handleAccordionToggle} aria-expanded={!collapsed} aria-controls="sidebarGameFilterList">
                <i className={`bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'} me-2`}></i>
                <i className="bi bi-list-ul me-2"></i>Filter by Game
            </div>
            <div id="sidebarGameFilterList" style={{ display: collapsed ? 'none' : 'block' }}>
                <ul className="list-group list-group-flush">
                    {games.map(game => {
                        const selected = selectedGames.includes(game.id);
                        const countArr = gamesCount[game.id] || [0, 0];
                        return (
                            <li
                                key={`gameList${game.id}`}
                                id={`gameList${game.id}`}
                                className={`list-group-item list-group-item-action${selected ? ' active' : ''}`}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', backgroundColor: selected ? '#0d6efd' : '', color: selected ? 'white' : '' }}
                                onClick={() => toggleGame(game.id)}
                            >
                                <span style={{ minWidth: 20, display: 'inline-block', textAlign: 'center' }}>
                                    <i className={`bi bi-dot me-2${selected ? ' text-white' : ' text-primary'}`}></i>
                                </span>
                                <span style={{ wordBreak: 'break-word', whiteSpace: 'normal', flex: 1 }}>{game.name}</span>
                                <span style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '0.95em', minWidth: 50, textAlign: 'right' }}>
                                    <span className="badge bg-secondary me-1">{countArr[0]}</span>
                                    <span className="badge bg-info">{countArr[1]}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default SidebarGameFilter;
