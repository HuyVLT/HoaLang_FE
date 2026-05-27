'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success('Dang ky tai khoan thanh cong. Vui long dang nhap.');
      router.push('/auth/login');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center font-sans">
      <Card className="w-full max-w-md shadow-lg border border-border">
        
        <CardHeader className="space-y-1.5 text-left">
          <CardTitle className="font-heading text-2xl font-bold text-primary">
            {t('auth.registerTitle')}
          </CardTitle>
          <CardDescription className="text-xs">
            Tao tai khoan moi de trai nghiem toan bo tien ich tu HoaLang.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 text-left">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                Ho ten cua ban
              </label>
              <Input
                type="text"
                placeholder="Nguyen Van A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {t('auth.emailLabel')}
              </label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {t('auth.passwordLabel')}
              </label>
              <Input
                type="password"
                placeholder="Mat khau cua ban"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9"
              />
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm"
            >
              {loading ? t('common.loading') : t('auth.submitRegister')}
            </Button>
            <div className="text-xs text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                {t('auth.submitLogin')}
              </Link>
            </div>
          </CardFooter>
        </form>

      </Card>
    </div>
  );
}
