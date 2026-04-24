import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    History,
    Tags,
    UserCircle,
    Users
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // Ambil data auth dari props global Inertia
    const { auth } = usePage().props as any;

    // Pecah pengecekan role agar lebih presisi
    const role = auth.user.role;
    const isAdmin = role === 'admin';
    const isSiswa = role === 'siswa';
    const isStaff = !isAdmin && !isSiswa; // Menangkap role sarpras, sims, kesiswaan, kurikulum, hubin

    // 1. Menu khusus SISWA
    const siswaNavItems: NavItem[] = [
        {
            title: 'Buat Laporan', 
            url: '/dashboard',
            icon: LayoutGrid,
        },
        // {
        //     title: 'Chat Bantuan', 
        //     url: '/chat-bantuan',
        //     icon: Users,
        // },
        {
            title: 'Histori Laporan',
            url: '/histori',
            icon: History,
        },
        {
            title: 'Profil Saya',
            url: '/profile',
            icon: UserCircle,
        },
    ];

    // 2. Menu khusus STAF DIVISI (Sarpras, dll)
    const staffNavItems: NavItem[] = [
        {
            title: 'Dashboard Laporan',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Profil Saya',
            url: '/profile',
            icon: UserCircle,
        },
    ];

    // 3. Menu khusus SUPER ADMIN
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard Utama',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kelola Kategori',
            url: '/kategori',
            icon: Tags,
        },
        {
            title: 'Kelola Siswa', // Diubah namanya dari "Siswa" karena sekarang menampung staf juga
            url: '/siswa', // URL tetap /siswa agar tidak error di route web.php
            icon: Users,
        },
        {
            title: 'Kelola FAQ Chatbot',
            url: '/admin/chatbot',
            icon: History,
        },
        {
            title: 'Profil Saya',
            url: '/profile',
            icon: UserCircle,
        },
    ];

    // Tentukan menu mana yang aktif berdasarkan role yang sedang login
    let activeNavItems = siswaNavItems;
    if (isAdmin) {
        activeNavItems = adminNavItems;
    } else if (isStaff) {
        activeNavItems = staffNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="flex items-center justify-center w-full">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={activeNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}