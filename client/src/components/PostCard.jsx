import React from 'react';

function PostCard({ post, usersById }) {
  // Use postedBy.username if available, else fallback to postedBy.id
  const postedByUsername = post.postedBy?.username || post.postedBy?.id || post.postedBy;
  // Format unix timestamp to readable date
  const formattedDate = new Date(post.postedAt * 1000).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  // Use game name if available
  const gameName = post.game?.name || '';

  return (
    <div className="card h-100 bg-white border border-primary d-flex flex-column">
      <div className="card-body flex-grow-1">
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{post.description}</p>
      </div>
      <div className="mt-auto px-3 pb-2">
        {gameName && <span className="badge bg-info me-1">{gameName}</span>}
        {post.tags && post.tags.map(tag => (
          <span key={typeof tag === 'object' ? tag.id : tag} className="badge bg-secondary me-1">
            {typeof tag === 'object' ? tag.tag : tag}
          </span>
        ))}
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Posted by {postedByUsername} on {formattedDate}
        </small>
      </div>
    </div>
  );
}

export default PostCard;