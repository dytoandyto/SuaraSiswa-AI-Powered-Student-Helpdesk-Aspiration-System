import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function Edit() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Form Update Profil
    const profileForm = useForm({
        nama: user.nama,
        kelas: user.kelas || '',
    });

    // Form Update Password
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'));
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(route('profile.password.update'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Profil', href: '/profile' }]}>
            <Head title="Profil Saya" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Pengaturan Profil</h1>

                {/* INFO DATA (Read Only NIS) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <p className="text-xs font-bold text-gray-500 uppercase">Nomor Induk Siswa (ID)</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">{user.nis}</p>
                    <p className="text-[10px] text-gray-400 mt-1">*NIS tidak dapat diubah untuk keamanan data.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* FORM BIODATA */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="font-bold mb-4">Biodata Diri</h3>
                        <form onSubmit={updateProfile} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold">Nama Lengkap</label>
                                <input type="text" value={profileForm.data.nama} onChange={e => profileForm.setData('nama', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                            </div>
                            {user.role === 'siswa' && (
                                <div>
                                    <label className="text-xs font-bold">Kelas</label>
                                    <input type="text" value={profileForm.data.kelas} onChange={e => profileForm.setData('kelas', e.target.value)} className="w-full rounded-lg border-gray-200 text-sm" />
                                </div>
                            )}
                            <button type="submit" disabled={profileForm.processing} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">Simpan Perubahan</button>
                        </form>
                    </div>

                    {/* FORM GANTI PASSWORD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="font-bold mb-4">Ganti Password</h3>
                        <form onSubmit={updatePassword} className="space-y-4">
                            <input type="password" placeholder="Password Lama" value={passwordForm.data.current_password} onChange={e => passwordForm.setData('current_password', e.target.value)} className="w-full rounded-lg border-gray-200 text-sm" />
                            <input type="password" placeholder="Password Baru" value={passwordForm.data.password} onChange={e => passwordForm.setData('password', e.target.value)} className="w-full rounded-lg border-gray-200 text-sm" />
                            <input type="password" placeholder="Konfirmasi Password Baru" value={passwordForm.data.password_confirmation} onChange={e => passwordForm.setData('password_confirmation', e.target.value)} className="w-full rounded-lg border-gray-200 text-sm" />
                            <button type="submit" disabled={passwordForm.processing} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}