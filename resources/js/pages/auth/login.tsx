import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, User } from 'lucide-react'; // Tambah icon untuk visual
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    username: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Selamat Datang Kembali" 
            description="Silakan masuk menggunakan NIS dan password Anda."
        >
            <Head title="Masuk Ke Akun" />

            {/* Status session (misal setelah reset password) */}
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">{status}</div>}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* INPUT NIS */}
                    <div className="grid gap-2">
                        <Label htmlFor="nis" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            Nomor Induk Siswa (NIS)
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Contoh: 22001"
                            className="focus-visible:ring-indigo-600"
                        />
                        <InputError message={errors.username} />
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                                Kata Sandi
                            </Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-xs font-bold text-indigo-600" tabIndex={5}>
                                    Lupa Password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="focus-visible:ring-indigo-600"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* REMEMBER ME */}
                    {/* <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">Ingat </Label>
                    </div> */}

                    {/* SUBMIT BUTTON */}
                    <Button 
                        type="submit" 
                        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            "Masuk Sekarang"
                        )}
                    </Button>
                </div>

                {/* Footer Info (Bisa diaktifkan kalau ada fitur daftar mandiri) */}
                <div className="text-center text-xs text-muted-foreground mt-4">
                    Belum punya akun? <span className="font-bold text-slate-900">Hubungi Admin Sekolah</span>
                </div>
            </form>
        </AuthLayout>
    );
}