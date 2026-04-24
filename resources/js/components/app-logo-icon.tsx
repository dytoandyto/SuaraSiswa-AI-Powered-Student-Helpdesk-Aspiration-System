// resources/js/components/app-logo-icon.tsx
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="24" fill="#4f46e5" />

            <path d="M65 35C65 25 35 25 35 35C35 45 65 55 65 65C65 75 35 75 35 65"
                stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

            <circle cx="70" cy="30" r="5" fill="#f59e0b" />
        </svg>

    );
}