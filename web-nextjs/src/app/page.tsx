import { CSSProperties } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import homepagePhoto from './homepage-photo.jpg';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adventure Alarm | Home',
  description: 'Adventure Alarm is a weather notification app that allows you to set up notifications for weather conditions suited to your adventures.',
}

export default function Home() {

  const navbarStyles: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(1px)',
    color: 'white'
  }

  const footerStyles: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(1px)',
    color: 'white'
  }
    
  return (
    <main className="flex flex-col justify-between min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${homepagePhoto.src})`}}>
      <Navbar style={navbarStyles}/>

      <div className="self-center flex flex-col items-center mt-20 mb-20 p-6" >
        <h1 className="text-4xl text-white font-semibold mb-8" 
          style={{ textShadow: '4px 4px 10px rgba(0, 0, 0, 1)' }}>
            Welcome to your Adventure Alarm
        </h1>
        <Link className="bg-black bg-opacity-80 text-gray-300 font-bold p-4 rounded hover:bg-opacity-40 hover:text-white transition duration-150" id="enter" href="/app">Enter App</Link>
        <p></p>
      </div>

      <Footer style={footerStyles}/>
    </main>
  )
}
