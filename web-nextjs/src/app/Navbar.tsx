import Link from "next/link";
import { CSSProperties } from 'react';

interface NavbarProps {
    style?: CSSProperties;
  }

export default function Navbar({ style }: NavbarProps ) {
    return (
        <nav className="bg-gray-800 p-4 shadow-md text-right flex flex-row justify-between" style={style}>
            <div>
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/">ADVENTURE ALARM</Link>
            </div>
            <div>
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/">Home</Link>
                
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/app">App</Link>
                
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/about">About</Link>          
            </div> 
        </nav>
    )       
}