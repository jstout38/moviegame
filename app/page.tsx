import Image from 'next/image'
import { useEffect } from 'react';
import MovieGame from './moviegame';




export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MovieGame />

    </main>
  )
}
