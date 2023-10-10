import styles from './Container.module.css'

type ContainerProps = {
  children: React.ReactNode
}

export default function Card({ children }: ContainerProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
