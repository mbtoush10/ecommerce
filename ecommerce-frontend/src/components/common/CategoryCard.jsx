import { Link } from 'react-router-dom';
import './CategoryCard.css';

// أيقونات التصنيفات
const categoryIcons = {
  'Laptops': '💻',
  'Gaming Gear': '🎮',
  'Audio': '🎧',
  'Networking': '🌐',
  'Accessories': '🖥️'
};

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.name}`} className="category-card" aria-label={`تصفح ${category.name}`}>
      <div className="category-icon">{categoryIcons[category.name] || '📦'}</div>
      <h3 className="category-name">{category.name}</h3>
    </Link>
  );
}
