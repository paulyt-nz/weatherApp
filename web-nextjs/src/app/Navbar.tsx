import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="">
            <Link href="/">Home</Link>
            
            <Link href="/app">App</Link>
            
            <Link href="/about">About</Link>           
        </nav>
    )       
}