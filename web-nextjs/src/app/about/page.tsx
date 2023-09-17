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


        
      return (
        <main className="flex flex-col justify-between min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${aboutBackground.src})`}}>
          <Navbar style={navbarStyles}/>
    
          <div className="self-center flex flex-col items-center mt-20 mb-20 p-6" >
            
          </div>
    
          <Footer style={footerStyles}/>
        </main>
      )
    }