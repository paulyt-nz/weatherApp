import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Home() {
  return (
    <main className="">
      <Navbar />

      <div>
        <h1>THIS WILL BE MY LANDING/HOME PAGE</h1>
        <Link id="enter" href="/app">Enter App</Link>
        <p></p>
      </div>

      <Footer />
    </main>
  )
}
