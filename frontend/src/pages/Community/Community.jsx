import React, { useState, useEffect, useContext } from 'react';
import './Community.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faThumbsUp, faComment, faTag, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Community = () => {
    const { url, token } = useContext(StoreContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "General", "Career Advice", "Interview Prep", "Tech Trends", "Referrals"];

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const catQuery = selectedCategory === "All" ? "" : `?category=${selectedCategory}`;
            const response = await axios.get(`${url}/api/forum${catQuery}`);
            if (response.data.success) {
                setPosts(response.data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/forum/create`, newPost, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                alert("Post Created!");
                setShowCreate(false);
                setNewPost({ title: '', content: '', category: 'General' });
                fetchPosts();
            }
        } catch (error) {
            alert("Error creating post");
        }
    };

    const handleUpvote = async (postId) => {
        if (!token) return alert("Please login to upvote");
        try {
            const response = await axios.post(`${url}/api/forum/upvote`, { postId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                fetchPosts();
            }
        } catch (error) {
            console.error("Error upvoting:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory, url]);

    return (
        <div className="community-page animate-fade-in">
            <header className="community-header">
                <h1>ConnectAlum <span className="highlight">Community</span></h1>
                <p>Share knowledge, ask questions, and grow together.</p>
            </header>

            <div className="community-container">
                <aside className="community-sidebar glass">
                    <button className="create-post-btn" onClick={() => setShowCreate(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Create Post
                    </button>
                    <div className="category-list">
                        <h3>Categories</h3>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-item ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="posts-feed">
                    {loading ? (
                        <div className="loading-posts">Loading discussions...</div>
                    ) : posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post-card glass-card">
                                <div className="post-header">
                                    <div className="post-author">
                                        <FontAwesomeIcon icon={faUserCircle} className="author-icon" />
                                        <div>
                                            <h4>{post.authorId.name}</h4>
                                            <span className="author-role">{post.authorId.role}</span>
                                        </div>
                                    </div>
                                    <span className="post-category">
                                        <FontAwesomeIcon icon={faTag} /> {post.category}
                                    </span>
                                </div>
                                <div className="post-content">
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                </div>
                                <div className="post-footer">
                                    <button className="post-action" onClick={() => handleUpvote(post._id)}>
                                        <FontAwesomeIcon icon={faThumbsUp} /> {post.upvotes.length} Upvotes
                                    </button>
                                    <button className="post-action">
                                        <FontAwesomeIcon icon={faComment} /> {post.comments.length} Comments
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-posts">No posts found in this category. Be the first to start a conversation!</div>
                    )}
                </main>
            </div>

            {showCreate && (
                <div className="modal-overlay">
                    <div className="community-modal glass animate-fade-in">
                        <div className="modal-header">
                            <h3>Create New Discussion</h3>
                            <button className="close-btn" onClick={() => setShowCreate(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    required
                                    placeholder="What's on your mind?"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                >
                                    {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Content</label>
                                <textarea
                                    required
                                    placeholder="Share your thoughts, advice, or questions..."
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowCreate(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Post Discussion</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
