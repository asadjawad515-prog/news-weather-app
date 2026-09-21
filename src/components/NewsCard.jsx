function NewsCard({
  title,
  description,
  date,
  image,
  onFavorite,
  isFavorite
}) {
  return (
    <div className="news-card">
      {image ? (
  <img src={image} alt={title} />
) : (
  <div className="image-placeholder">
    📰 No image available
  </div>
)}
      <h3>{title}</h3>

      <p>{description}</p>

      <p>
  Date: {date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date unavailable'}
</p>
      <button onClick={onFavorite}>
  {isFavorite ? '💛 Remove from Favorites' : '⭐ Add to Favorites'}
</button>
    </div>
  )
}

export default NewsCard