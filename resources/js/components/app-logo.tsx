import AppLogoIcon from './app-logo-icon';
import { useSidebar } from '@/components/ui/sidebar';

export default function AppLogo() {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        // Gunakan w-full dan justify-center jika isCollapsed agar icon tepat di tengah
        <div className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-3'} group transition-all`}>
            {/* Ukuran size diatur agar tetap proporsional saat ciut */}
            <div className={`flex aspect-square ${isCollapsed ? 'size-6' : 'size-9'} items-center justify-center transition-all duration-300`}>
                <AppLogoIcon className="size-full" />
            </div>
            
            {/* Teks hanya muncul jika sidebar TIDAK sedang ciut */}
            {!isCollapsed && (
                <div className="flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-left-1">
                    <span className="text-xl font-black leading-none tracking-tighter text-slate-900 dark:text-white uppercase">
                        Suara<span className="text-indigo-600">Siswa</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 truncate">
                        Aspiration System
                    </span>
                </div>
            )}
        </div>
    );
}