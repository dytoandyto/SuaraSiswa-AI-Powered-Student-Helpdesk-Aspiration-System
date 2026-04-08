// resources/js/components/app-logo-icon.tsx
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outline Kotak (Gaya Notion: Border Tebal & Elegan) */}
            <rect 
                x="8" y="8" width="84" height="84" rx="20" 
                className="stroke-slate-900 dark:stroke-white" 
                strokeWidth="10" 
            />
            
            {/* Huruf S Sambung (Single Path Continuous) */}
            <path 
                d="M65 35C65 25 35 25 35 35C35 45 65 55 65 65C65 75 35 75 35 65" 
                className="stroke-slate-900 dark:stroke-white" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            
            {/* Titik Aksen (Biar Gak Sepi & Terlihat Modern) */}
            <circle cx="70" cy="30" r="4" className="fill-indigo-600" />
        </svg>
    );
}