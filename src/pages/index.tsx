import Head from 'next/head'
import CactuGradients from '@fet/dynamicBackgrounds/CactuGradients'
import MainLayout from '@fet/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CactuGradients />
      </main>
    </MainLayout>
  )
}
