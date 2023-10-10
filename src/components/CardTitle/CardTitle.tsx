import styles from './CardTitle.module.css'

type CardTitleProps = {
  children: React.ReactNode
}

export default function CardTitle({ children }: CardTitleProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
