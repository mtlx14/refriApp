import type { Product } from '../../types/product';
import { formatDate } from '../../utils/date';
import { getCategoryEmoji } from '../../config/categories';
import styles from './ProductCard.module.css';

type Props = {
  product: Product;
  onClick: (product: Product) => void;
  index?: number;
};

export const ProductCard = ({ product, onClick, index = 0 }: Props) => {
  const emoji = getCategoryEmoji(product.category);
  return (
  <button
    className={styles.card}
    onClick={() => onClick(product)}
    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
  >
    <div className={styles.icon}>
      {emoji || product.name.charAt(0).toUpperCase()}
    </div>
    <div className={styles.info}>
      <span className={styles.name}>{product.name}</span>
      {product.description && (
        <span className={styles.description}>{product.description}</span>
      )}
    </div>
    <div className={styles.right}>
      <span className={styles.id}>#{product.id}</span>
      <span className={styles.date}>{formatDate(product.entryDate)}</span>
    </div>
  </button>
  );
};
