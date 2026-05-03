import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  fullWidth?: boolean;
  small?: boolean;
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  small = false,
  disabled = false,
}: Props) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={[
      styles.btn,
      styles[variant],
      fullWidth ? styles.fullWidth : '',
      small ? styles.small : '',
    ].join(' ')}
  >
    {children}
  </button>
);
