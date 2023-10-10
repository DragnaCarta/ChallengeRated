import styles from './ButtonToggle.module.css'
import type { RadioOption } from '@/types';

type ButtonToggleProps = {
  label: string;
  options: RadioOption[];
  selectedValue: number;
  onClick: (value: number) => void;
}

export default function ButtonGrid({ label, options, onClick, selectedValue }: ButtonToggleProps) {
  return (
    <div>
      {/* Label */}
      <label className={styles.label}>{label}</label>

      {/* Radio Input */}
      <div className={styles.container}>
        {options.map((option, i) => (
          <button 
            key={i}
            className={`${styles.option} ${option.value === selectedValue ? styles.selected : ''}`}
            onClick={() => onClick(option.value)}
          >
            {option.displayText}
          </button>
        ))}
      </div>
    </div>
  )
}
