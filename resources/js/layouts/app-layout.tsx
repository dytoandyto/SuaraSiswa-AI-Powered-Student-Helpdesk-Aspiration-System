import ChatbotWidget from '@/components/Chatbot/ChatbotWidget';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // 1. Ambil data auth dari props global Inertia
    const { auth } = usePage().props as any;

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
            {auth?.user?.role === 'siswa' && <ChatbotWidget />}
        </>
    );
};