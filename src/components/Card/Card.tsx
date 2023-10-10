import Image from 'next/image'
import styles from './Card.module.css'

type CardProps = {
  children: React.ReactNode
}

export default function Card({ children }: CardProps) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
