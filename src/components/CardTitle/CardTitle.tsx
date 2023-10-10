import styles from './CardTitle.module.css'

type CardTitleProps = {
  children: React.ReactNode
}

export default function CardTitle({ children }: CardTitleProps) {
  return (
    <div className={styles.container}>
      <h2>{children}</h2>
    </div>
  )
}
