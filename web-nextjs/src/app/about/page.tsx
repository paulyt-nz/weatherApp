import { CSSProperties } from 'react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';
import aboutBackground from './aboutbackground.jpg';
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Adventure Alarm | About',
}

export default function About() {

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

      const aboutStyles: CSSProperties = {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(1px)',
      }

      return (
        <main className="flex flex-col justify-between min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${aboutBackground.src})`}}>
          <Navbar style={navbarStyles}/>
    
          <div className="flex flex-col justify-center self-center mt-20 mb-20 p-8 rounded-xl shadow-lg max-w-xl" style={aboutStyles}>
            <h1 className="text-4xl text-gray-100 font-semibold mb-8">About Adventure Alarm</h1>

            <p className="text-gray-100 text-lg mb-8">Adventure Alarm is the alarm clock for getting out there. The call you need at the right time to drop everything and go do the thing!</p>

            <p className="text-gray-100 text-lg mb-8">You simply enter the weather you are waiting for at any place you like and you will be sent an email when the weather matches what you are after. It is like the bat signal of adventure.</p>

            <p className="text-gray-100 text-lg mb-8">Adventure Alarm currently supports alerts based on real time weather but we will be adding support for forecast alarms soon.</p>

            <p className="text-gray-100 text-xs mb-2 text-center">Made with love by PaulyT.</p>
            <p className="text-gray-100 text-xs text-center">Thanks to Josh for the help and support.</p>


          </div>
    
          <Footer style={footerStyles}/>
        </main>
      )
    }