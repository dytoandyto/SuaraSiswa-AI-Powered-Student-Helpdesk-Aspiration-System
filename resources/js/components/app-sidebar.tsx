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
    const isAdmin = auth.user.role === 'admin';

    // Menu khusus SISWA
    const siswaNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Histori Aspirasi',
            url: '/histori', 
            icon: History,
        },
        {
            title: 'Profil Saya',
            url: '/profile',
            icon: UserCircle,
        },
    ];

    // Menu khusus ADMIN
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Kelola Kategori',
            url: '/kategori',
            icon: Tags,
        },
        {
            title: 'Kelola Siswa',
            url: '/siswa',
            icon: Users, // Menggunakan icon Users agar lebih relevan
        },
    ];

    // Tentukan menu mana yang aktif berdasarkan role
    const activeNavItems = isAdmin ? adminNavItems : siswaNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/* Hapus mt-auto dan pastikan asChild Link menyesuaikan lebar */}
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