import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import SidebarGameFilter from './SidebarGameFilter';
import NewPostForm from './NewPostForm';
import { fetchPosts, fetchUsers } from '../api';

function HomePage({ user }) {
  const [view, setView] = useState(0); // 0: Looking for Members, 1: Looking for Groups
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersById, setUsersById] = useState({});
  const [selectedGameIds, setSelectedGameIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchPosts({ type: view, filter: selectedGameIds })
      .then(res => res.json())
      .then(data => {
        const validPosts = Array.isArray(data)
          ? data.filter(post => post && typeof post.id !== 'undefined' && typeof post.title === 'string')
          : [];
        setPosts(validPosts);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, [view, selectedGameIds]);

  useEffect(() => {
    fetchUsers()
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(u => { map[u.id] = u.username; });
        setUsersById(map);
      })
      .catch(() => setUsersById({}));
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
            <h1 className="mb-0 text-center text-md-start flex-grow-1" style={{ fontSize: '2rem', whiteSpace: 'nowrap' }}>
              Looking for Group
            </h1>
            <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto justify-content-md-end">
              <button
                className={`btn btn-${view === 0 ? 'primary' : 'outline-primary'}`}
                onClick={() => setView(0)}
              >
                Looking for Members
              </button>
              <button
                className={`btn btn-${view === 1 ? 'primary' : 'outline-primary'}`}
                onClick={() => setView(1)}
              >
                Looking for Groups
              </button>
            </div>
          </div>
          {user && (
            <div className="alert alert-info mb-4">Logged in as <b>{user.username}</b> (ID: {user.id})</div>
          )}
          {user && (
            <NewPostForm user={user} view={view} onPostCreated={() => {
              setLoading(true);
              fetchPosts({ type: view, filter: selectedGameIds })
                .then(res => res.json())
                .then(data => {
                  const validPosts = Array.isArray(data)
                    ? data.filter(post => post && typeof post.id !== 'undefined' && typeof post.title === 'string')
                    : [];
                  setPosts(validPosts);
                  setLoading(false);
                })
                .catch(() => {
                  setPosts([]);
                  setLoading(false);
                });
            }} />
          )}
          {/* Sidebar and cards row */}
          <div className="row">
            <div className="col-md-3 mb-4">
              <SidebarGameFilter onFilterChange={setSelectedGameIds} />
            </div>
            <div className="col-md-9">
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div>Loading posts...</div>
                </div>
              ) : (
                <div className="row">
                  {posts.length === 0 ? (
                    <div className="col-12 text-center text-muted my-5">
                      <i className="bi bi-emoji-frown" style={{ fontSize: '2rem' }}></i>
                      <div>No posts found for the selected filters.</div>
                    </div>
                  ) : (
                    posts.map(post => (
                      <div className="col-md-6 mb-4" key={post.id}>
                        <PostCard 
                          post={{
                            ...post,
                            gameId: post.game?.id,
                            gameName: post.game?.name,
                            postedById: post.postedBy?.id,
                            postedByUsername: post.postedBy?.username
                          }} 
                          usersById={usersById} 
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;