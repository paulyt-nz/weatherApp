import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 shadow-md text-right">
            <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/">Home</Link>
            
            <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/app">App</Link>
            
            <Link className="text-white hover:text-gray-300 transition duration-200 mx-2" href="/about">About</Link>           
        </nav>
    )       
}