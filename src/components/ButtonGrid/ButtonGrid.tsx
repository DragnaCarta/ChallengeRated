import styles from './ButtonGrid.module.css'

type ButtonOption = {
  displayText: string;
  value: number;
}

type ButtonGridProps = {
  label: string;
  options: ButtonOption[];
  onClick: (value: number) => void;
  /** Poor man's way of approximating ally/enemy toggle */
  mode: 'red' | 'blue';
  /** Passthrough */
  style?: React.CSSProperties;
}

export default function ButtonGrid({ label, options, onClick, mode, style }: ButtonGridProps) {
  const redMode = styles.red;
  const blueMode = styles.blue;
  
  return (
    <div style={style} className={mode === 'red' ? redMode : blueMode}>
      {/* Label */}
      <label className={styles.label}>{label}</label>

      {/* Radio Input */}
      <div className={styles.container}>
        {options.map((option, i) => (
          <button 
            key={i}
            className={styles.option}
            onClick={() => onClick(option.value)}
          >
            {option.displayText}
          </button>
        ))}
      </div>
    </div>
  )
}
