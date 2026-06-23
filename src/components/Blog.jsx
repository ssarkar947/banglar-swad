import { useState, useMemo } from 'react';
import './Blog.css';

export default function Blog({ blogs = [] }) {
  const [selectedPillar, setSelectedPillar] = useState('all');

  const filteredBlogs = useMemo(() => {
    if (selectedPillar === 'all') return blogs;
    return blogs.filter(blog => blog.pillar.toLowerCase() === selectedPillar.toLowerCase());
  }, [blogs, selectedPillar]);

  return (
    <div className="blog fadeIn">
      {/* Immersive Header */}
      <header className="blog__header">
        <span className="blog__subtitle-bn">রান্নাঘরের গল্প</span>
        <h1 className="blog__title">Kitchen Stories</h1>
        <p className="blog__desc">
          Documenting the smells, secrets, and stubborn memory of the Bengali kitchen. 
          Divided into our twin pillars: the memory that guides us, and the knowledge that keeps us true.
        </p>
      </header>

      {/* Pillars Filter Tabs */}
      <div className="blog__filter-wrapper">
        <div className="blog__filters">
          <button 
            className={`blog__filter-btn ${selectedPillar === 'all' ? 'blog__filter-btn--active' : ''}`}
            onClick={() => setSelectedPillar('all')}
          >
            All Stories
          </button>
          <button 
            className={`blog__filter-btn ${selectedPillar === 'memory' ? 'blog__filter-btn--active' : ''}`}
            onClick={() => setSelectedPillar('memory')}
          >
            Memory (স্মৃতি)
          </button>
          <button 
            className={`blog__filter-btn ${selectedPillar === 'knowledge' ? 'blog__filter-btn--active' : ''}`}
            onClick={() => setSelectedPillar('knowledge')}
          >
            Knowledge (ज्ञान)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="blog__container">
        {filteredBlogs.length === 0 ? (
          <div className="blog__empty">
            <div className="blog__empty-graphic">🌿</div>
            <h3>The pages are clean.</h3>
            <p>We are still gathering memory. Check back soon for stories fresh from the stove.</p>
          </div>
        ) : (
          <div className="blog__grid">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-card__meta">
                  <span className="blog-card__pillar">{blog.pillar}</span>
                  <span className="blog-card__readtime">{blog.readTime || '4 min read'}</span>
                </div>

                <div className="blog-card__header">
                  {blog.titleBn && <span className="blog-card__title-bn">{blog.titleBn}</span>}
                  <h2 className="blog-card__title">{blog.title}</h2>
                </div>

                <div className="blog-card__body">
                  {blog.content.split('\n').filter(Boolean).slice(0, 2).map((para, index) => (
                    <p key={index} className="blog-card__excerpt">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="blog-card__footer">
                  <div className="blog-card__author-info">
                    <span className="blog-card__author">By {blog.author}</span>
                    <span className="blog-card__date">{blog.date}</span>
                  </div>
                  <button className="blog-card__btn" onClick={() => alert(`Reading full story: ${blog.title}\n\n${blog.content}`)}>
                    Read Full Story →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
