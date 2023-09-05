import { CSSProperties } from 'react';

interface FooterProps {
    style?: CSSProperties;
  }

export default function Footer({ style }: FooterProps ) {
    return (
        <footer className="bg-gray-800 text-white py-6" style={style}>
            <div className="container mx-auto flex justify-between items-center">
                <span className="block mb-2">© 2023 Adventure Alarm</span>
                <span className="block mb-2"></span>
                <span className="block mb-2">Created by PaulyT</span>
            </div>
        </footer>
    )  
}
