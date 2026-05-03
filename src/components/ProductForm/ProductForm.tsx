import { useState } from 'react';
import type { Product } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { todayISO } from '../../utils/date';
import { UI } from '../../config/constants';
import { CATEGORIES } from '../../config/categories';
import { SECTIONS } from '../../config/sections';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import styles from './ProductForm.module.css';

type Props = {
  prefillId?: string;
  editProduct?: Product;
  onDone: () => void;
};

export const ProductForm = ({ prefillId = '', editProduct, onDone }: Props) => {
  const { add, edit } = useProducts();
  const isEditing = Boolean(editProduct);

  const [name, setName] = useState(editProduct?.name ?? '');
  const [category, setCategory] = useState(editProduct?.category ?? '');
  const [section, setSection] = useState(editProduct?.section ?? '');
  const [entryDate, setEntryDate] = useState(editProduct?.entryDate ?? todayISO());
  const [description, setDescription] = useState(editProduct?.description ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio.';
    if (!category) next.category = 'Seleccioná una categoría.';
    if (!section) next.section = 'Seleccioná una sección.';
    if (!entryDate) next.entryDate = 'La fecha es obligatoria.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEditing && editProduct) {
      edit({ ...editProduct, name, category, section, entryDate, description });
    } else {
      add({ id: prefillId, name, category, section, entryDate, description });
    }
    onDone();
  };

  return (
    <div className={styles.form}>
      <Input
        label={UI.form.labelId}
        value={isEditing ? (editProduct?.id ?? '') : prefillId}
        onChange={() => {}}
        readOnly
      />
      <Input
        label={UI.form.labelName}
        value={name}
        onChange={setName}
        placeholder={UI.form.placeholderName}
        error={errors.name}
      />

      <div className={styles.categoryField}>
        <label className={styles.categoryLabel}>{UI.form.labelCategory}</label>
        <div className={styles.categoryOptions}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={[
                styles.categoryBtn,
                category === cat.id ? styles.categoryBtnActive : '',
              ].join(' ')}
              onClick={() => setCategory(cat.id)}
            >
              <span className={styles.categoryEmoji}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
        {errors.category && <span className={styles.categoryError}>{errors.category}</span>}
      </div>

      <div className={styles.categoryField}>
        <label className={styles.categoryLabel}>Sección</label>
        <div className={styles.categoryOptions}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={[
                styles.categoryBtn,
                section === sec.id ? styles.categoryBtnActive : '',
              ].join(' ')}
              onClick={() => setSection(sec.id)}
            >
              <span className={styles.categoryEmoji}>{sec.emoji}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
        {errors.section && <span className={styles.categoryError}>{errors.section}</span>}
      </div>

      <Input
        label={UI.form.labelEntryDate}
        value={entryDate}
        onChange={setEntryDate}
        type="date"
        error={errors.entryDate}
      />
      <Input
        label={UI.form.labelDescription}
        value={description}
        onChange={setDescription}
        placeholder={UI.form.placeholderDescription}
      />

      <div className={styles.actions}>
        <Button onClick={handleSubmit} fullWidth>
          {UI.form.btnSave}
        </Button>
        <Button onClick={onDone} variant="secondary" fullWidth>
          {UI.form.btnCancel}
        </Button>
      </div>
    </div>
  );
};
