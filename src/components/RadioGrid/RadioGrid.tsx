import type { RadioOption } from '@/types';
import styles from './RadioGrid.module.css'

type CardProps = {
  label: string;
  options: RadioOption[];
  selectedValue: number;
  onChange: (value: number) => void;
  /** Passthrough */
  style?: React.CSSProperties;
  className?: string;
}

export default function RadioGrid({ label, options, selectedValue, onChange, style, className }: CardProps) {
  return (
    <div style={style} className={className}>
      {/* Label */}
      <label className={styles.label}>{label}</label>

      {/* Radio Input */}
      <div className={styles.container}>
        {options.map((option, i) => (
          <button 
            key={i}
            className={`${styles.option} ${option.value === selectedValue ? styles.selected : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.displayText}
          </button>
        ))}
      </div>
    </div>
  )
}
