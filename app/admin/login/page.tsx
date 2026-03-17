'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError('Invalid credentials.');
      return;
    }
    router.push('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="text-center">
            <div className="text-sm uppercase tracking-[0.35em] text-white">AS LOF TOUR</div>
            <h1 className="mt-4 text-3xl font-semibold text-white">Admin Login</h1>
          </div>
          <form action={onSubmit} className="mt-8 grid gap-5">
            <div><Label>Email</Label><Input name="email" type="email" /></div>
            <div><Label>Password</Label><Input name="password" type="password" /></div>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
