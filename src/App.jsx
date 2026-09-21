import './App.css'
import Weather from './components/Weather'
import NewsCard from './components/NewsCard'
import { useState, useEffect } from 'react'
function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [articles, setArticles] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [favorites, setFavorites] = useState(() => {
  const savedFavorites = localStorage.getItem('favorites')
  return savedFavorites ? JSON.parse(savedFavorites) : []
})

const [recentSearches, setRecentSearches] = useState(() => {
  const savedSearches = localStorage.getItem('recentSearches')
  return savedSearches ? JSON.parse(savedSearches) : []
})
useEffect(() => {
  setLoading(true)
  setError('')

  fetch(
  `https://newsapi.org/v2/top-headlines?country=us&category=${category === 'All' ? 'general' : category.toLowerCase()}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
)
    .then((response) => {
  if (!response.ok) {
    throw new Error('News API request failed')
  }

  return response.json()
})
.then((data) => {
  setArticles(data.articles || [])
  setLoading(false)
})
    .catch((error) => {
  console.log(error)
  setError('News load nahi ho saki.')
  setLoading(false)
})
}, [category])
useEffect(() => {
  localStorage.setItem('favorites', JSON.stringify(favorites))
}, [favorites])
useEffect(() => {
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches))
}, [recentSearches])

const addToFavorites = (article) => {
  setFavorites((prevFavorites) => {
    const alreadyFavorite = prevFavorites.some(
      (favorite) => favorite.url === article.url
    )

    if (alreadyFavorite) {
      return prevFavorites.filter(
        (favorite) => favorite.url !== article.url
      )
    }

    return [...prevFavorites, article]
  })
}
const saveRecentSearch = (term) => {
  const trimmedTerm = term.trim()

  if (!trimmedTerm) return

  setRecentSearches((previousSearches) => {
    const updatedSearches = [
      trimmedTerm,
      ...previousSearches.filter(
        (item) => item.toLowerCase() !== trimmedTerm.toLowerCase()
      )
    ]

    return updatedSearches.slice(0, 5)
  })
}
const filteredArticles = articles.filter((article) => {
  const matchesSearch = article.title
    ?.toLowerCase()
    .includes(search.toLowerCase())

  return matchesSearch
})
  return (
    <div className="app">
      <h1>📰 News Dashboard</h1>
      <p>Latest news and weather information</p>

      <section className="news-section">
        <h2>Latest News</h2>
        <p>News articles will appear here.</p>
        
        <select
  value={category}
  onChange={(event) => setCategory(event.target.value)}
>
  <option value="All">All</option>
  <option value="Sports">Sports</option>
  <option value="Technology">Technology</option>
</select>
        <input
  type="text"
  placeholder="Search news..."
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  onKeyDown={(event) => {
    if (event.key === 'Enter') {
      saveRecentSearch(search)
    }
  }}
/>
      {loading && <p>Loading news...</p>}

{error && <p>{error}</p>}
{filteredArticles.length === 0 && !loading && !error ? (
  <p className="no-results">
    No news found{search.trim() ? ` for "${search}"` : ''}.
  </p>
) : (
  <div className="news-grid">
    {filteredArticles.map((article) => (
      <NewsCard
        key={article.url}
        title={article.title}
        description={article.description}
        date={article.publishedAt}
        image={article.urlToImage}
        onFavorite={() => addToFavorites(article)}
        isFavorite={favorites.some(
          (favorite) => favorite.url === article.url
        )}
      />
    ))}
  </div>
)}
      </section>
      {recentSearches.length > 0 && (
  <section className="recent-searches">
    <h2>🕘 Recent Searches</h2>

    <div className="recent-search-list">
      {recentSearches.map((item) => (
        <button
          key={item}
          onClick={() => setSearch(item)}
        >
          {item}
        </button>
      ))}
    </div>
  </section>
)}
      {favorites.length > 0 && (
  <section className="favorites-section">
    <h2>⭐ Favorite News</h2>

    <div className="news-grid">
      {favorites.map((article) => (
        <NewsCard
  key={article.url}
  title={article.title}
  description={article.description}
  date={article.publishedAt}
  image={article.urlToImage}
  onFavorite={() => addToFavorites(article)}
  isFavorite={true}
/>
      ))}
    </div>
  </section>
)}
      <Weather />
    </div>
  )
}

export default App