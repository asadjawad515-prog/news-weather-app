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
  try {
    const savedFavorites = localStorage.getItem('favorites')
    return savedFavorites ? JSON.parse(savedFavorites) : []
  } catch {
    return []
  }
})

const [recentSearches, setRecentSearches] = useState(() => {
  try {
    const savedSearches = localStorage.getItem('recentSearches')
    return savedSearches ? JSON.parse(savedSearches) : []
  } catch {
    return []
  }
})


  
  useEffect(() => {
    const controller = new AbortController()

    const fetchNews = async () => {
      setLoading(true)
      setError('')

      const query =
        category === 'All'
          ? ''
          : `&q=${encodeURIComponent(category.toLowerCase())}`

      try {
        const response = await fetch(
          `https://freenewsapi.ai/v1/search?lang=en&size=20&sort=date${query}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('News API request failed')
        }

        const data = await response.json()

        setArticles(Array.isArray(data.results) ? data.results : [])
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        console.error(error)
        setArticles([])
        setError(
          'Unable to load the latest news right now. Please try again in a moment.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchNews()

    return () => {
      controller.abort()
    }
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
  
const uniqueArticles = articles.filter((article, index, self) => {
  const title = article.title?.trim().toLowerCase()

  if (!title) return false

  return self.findIndex(
    (item) => item.title?.trim().toLowerCase() === title
  ) === index
})

const filteredArticles = uniqueArticles.filter((article) => {
  const matchesSearch = article.title
    ?.toLowerCase()
    .includes(search.toLowerCase())

  return matchesSearch
})

  return (
    <div className="app">
      <h1>News Dashboard + Weather App</h1>
      <p>Latest news and weather information</p>

      <section className="news-section">
        <h2>Live News</h2>
        
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
        {loading && <p>Loading the latest news... Please wait.</p>}

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
                date={article.published_at}
                image={article.image}
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
          <h2>Recent Searches</h2>

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
                date={article.published_at}
                image={article.image}
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