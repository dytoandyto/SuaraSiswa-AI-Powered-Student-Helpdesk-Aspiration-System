import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];
export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user as any;
    const isAdmin = user.role === 'admin'; // Cek apakah dia admin

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nama: user.nama,
        kelas: user.kelas || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isAdmin) {
            patch(route('profile.update'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profil Saya" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title="Informasi Akun" 
                        description={isAdmin ? "Perbarui informasi profil Anda." : "Data profil Anda yang terdaftar di sistem."} 
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* NIS - Selalu Disabled untuk siapapun */}
                        <div className="grid gap-2">
                            <Label htmlFor="nis">Nomor Induk Siswa (NIS)</Label>
                            <Input
                                id="nis"
                                className="mt-1 block w-full bg-gray-100"
                                value={user.nis}
                                disabled
                            />
                        </div>

                        {/* NAMA - Disabled jika bukan Admin */}
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                                id="nama"
                                className={`mt-1 block w-full ${!isAdmin ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                disabled={!isAdmin} // Kunci jika bukan admin
                                required
                            />
                            <InputError className="mt-2" message={errors.nama} />
                        </div>

                        {/* KELAS - Hanya muncul untuk siswa & Locked */}
                        {user.role === 'siswa' && (
                            <div className="grid gap-2">
                                <Label htmlFor="kelas">Kelas</Label>
                                <Input
                                    id="kelas"
                                    className="mt-1 block w-full bg-gray-50 cursor-not-allowed"
                                    value={data.kelas}
                                    disabled={true} // Selalu kunci untuk siswa
                                />
                            </div>
                        )}

                        {/* TAMPILKAN TOMBOL HANYA UNTUK ADMIN */}
                        {isAdmin ? (
                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Simpan Perubahan</Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Berhasil disimpan.</p>
                                </Transition>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
                                <p className="text-xs text-amber-700 font-medium">
                                    Informasi: Perubahan data diri hanya dapat dilakukan melalui Admin atau Petugas Tata Usaha.
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}