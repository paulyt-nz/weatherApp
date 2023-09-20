import Link from "next/link";
import { CSSProperties } from 'react';

interface NavbarProps {
    style?: CSSProperties;
  }

export default function Navbar({ style }: NavbarProps ) {
    return (
        <nav className="bg-gray-800 p-4 shadow-md text-right flex flex-row justify-between items-center" style={style}>
            <div className="">
                <Link className="flex items-center hover:scale-105 transition duration-200 mx-2" href="/">                      
                        <img className="h-8" src="/adventure-alarm-high-resolution-logo-white-on-transparent-background.png" alt="adventure alarm logo" />                
                </Link>
            </div>
            <div className="self-auto">
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/">Home</Link>
                
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/app">App</Link>
                
                <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/about">About</Link>          
            </div> 
        </nav>
    )       
}