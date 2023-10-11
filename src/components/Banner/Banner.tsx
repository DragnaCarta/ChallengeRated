import Image from 'next/image'
import ImgLogo from '@/images/logo.png'
import Container from '@/components/Container/Container';

import styles from './Banner.module.css'

export default function Banner() {
  return (
    <section className={styles.container}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '8px' }}>
          <Image src={ImgLogo} width="32" height="32" alt="Challenge Rated Logo" />
          <h1 style={{ paddingLeft: '8px', fontSize: '22px' }}>Challenge Rated</h1>
        </div>
        {/* <p style={{ fontWeight: 500 }}>An encounter-building tool for D&D 5th edition</p>
        <p>By <a style={{ color: 'yellow' }} href="https://www.patreon.com/DragnaCarta/posts">DragnaCarta</a></p> */}
      </Container>
    </section>
  )
}
