import styles from './Input.module.css';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'email' | 'password';
  readOnly?: boolean;
  error?: string;
};

export const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false,
  error,
}: Props) => (
  <div className={styles.wrapper}>
    <label className={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={[styles.input, error ? styles.inputError : ''].join(' ')}
    />
    {error && <span className={styles.error}>{error}</span>}
  </div>
);
