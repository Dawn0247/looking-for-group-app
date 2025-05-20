import React, { useState, useEffect } from 'react';
import { fetchGames } from '../api';
import TagSelect from './TagSelect';
import GameSelect from './GameSelect';

function NewPostForm({ user, onPostCreated, view }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [gameId, setGameId] = useState('');
  const [games, setGames] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [type, setType] = useState(view);
  const [selectedTags, setSelectedTags] = useState([]);

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
  }, []);

  useEffect(() => {
    setType(view);
  }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    if (!title || !description || !selectedTags.length || !gameId) {
      setError('Please fill out all fields.');
      setSubmitting(false);
      return;
    }
    const tagIds = selectedTags.map(t => t.id);
    const payload = {
      title,
      description,
      tags: tagIds,
      game: gameId,
      postedBy: user.id,
      type
    };
    try {
      const res = await fetch('/api/makepost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setTags('');
        setGameId('');
        setSuccess(true);
        if (onPostCreated) onPostCreated();
      } else {
        setError('Failed to create post.');
      }
    } catch (err) {
      setError('Failed to create post.');
    }
    setSubmitting(false);
  };

  return (
    <div className="card border-primary mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }} onClick={() => setCollapsed(c => !c)}>
        <span>Create a New Post</span>
        <i className={`bi ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
      </div>
      {!collapsed && (
        <div className="card-body bg-light">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Post created successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row g-2 align-items-end">
              <div className="col-md-8">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" value={type} onChange={e => setType(Number(e.target.value))}>
                  <option value={0}>Looking for Members</option>
                  <option value={1}>Looking for Groups</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={500} required />
            </div>
            <TagSelect selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            <div className="mb-3">
              <label className="form-label">Game</label>
              <GameSelect
                games={games}
                value={gameId}
                onChange={setGameId}
                isDisabled={submitting}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Post'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewPostForm;
