import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { formatDate } from '../../utils/date';
import { getCategoryEmoji } from '../../config/categories';
import { UI } from '../../config/constants';
import { Button } from '../Button/Button';
import styles from './ProductDetail.module.css';

type Props = {
  product: Product;
  onEdit: () => void;
  onClose: () => void;
};

export const ProductDetail = ({ product, onEdit, onClose }: Props) => {
  const { remove } = useProducts();
  const emoji = getCategoryEmoji(product.category);

  const handleDelete = () => {
    remove(product.id);
    onClose();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        {emoji && <span className={styles.emoji}>{emoji}</span>}
        <div className={styles.topMeta}>
          <span className={styles.id}>#{product.id}</span>
          <span className={styles.date}>{formatDate(product.entryDate)}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button onClick={onEdit} fullWidth>
          {UI.form.btnEdit}
        </Button>
        <Button onClick={handleDelete} variant="danger" fullWidth>
          {UI.form.btnDelete}
        </Button>
      </div>
    </div>
  );
};
