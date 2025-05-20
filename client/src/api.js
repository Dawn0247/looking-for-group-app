// API utility functions for the client React app

export async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response;
}

export async function register(username, password) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response;
}

export async function fetchUser(token) {
  const response = await fetch('/api/user', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response;
}

export async function fetchPosts({ type, filter }) {
  let url = `/api/posts?type=${type}`;
  if (filter && filter.length > 0) {
    url += `&filter=${filter.join('~')}`;
  }
  const response = await fetch(url);
  return response;
}

export async function fetchGames({ active } = {}) {
  let url = '/api/games';
  if (active) url += '?active=1';
  const response = await fetch(url);
  return response;
}

export async function fetchGamesCount() {
  const response = await fetch('/api/gamescount');
  return response;
}

export async function fetchUsers() {
  const response = await fetch('/api/users');
  return response;
}
