import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const { t } = useTranslation('layout')

  return (
    <div className={styles.container}>
      <main className="index-page">
        <div className="welcome-message">
          <p>{t('welcome1')}<strong><u>DNTH-BPK PE Apps</u></strong></p>
          <p>{t('welcome2')}</p>
        </div>
      </main>
    </div>
  )
}

export default Home
