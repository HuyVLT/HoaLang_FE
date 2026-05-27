'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock delay
    setTimeout(() => {
      // Validate credentials based on global rules
      if (email === 'admin@restx.food' && password === 'Admin@123') {
        login(
          {
            id: 'admin-id-1',
            email: 'admin@restx.food',
            name: 'Super Admin',
            role: 'super_admin',
          },
          'mock-jwt-token-123456'
        );
        toast.success('Dang nhap he thong Super Admin thanh cong');
        router.push('/');
      } else if (email && password) {
        // Log in as standard user if not admin credentials (for testing ease)
        login(
          {
            id: 'user-id-abc',
            email: email,
            name: email.split('@')[0],
            role: 'user',
          },
          'mock-jwt-token-standard'
        );
        toast.success('Dang nhap thanh cong');
        router.push('/');
      } else {
        toast.error(t('auth.errorAuth'));
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center font-sans">
      <Card className="w-full max-w-md shadow-lg border border-border">
        
        <CardHeader className="space-y-1.5 text-left">
          <CardTitle className="font-heading text-2xl font-bold text-primary">
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription className="text-xs">
            Su dung email va mat khau de truy cap vao he thong lang nghe.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 text-left">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">
                {t('auth.emailLabel')}
              </label>
              <Input
                type="email"
                placeholder="admin@restx.food"
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
                placeholder="Mat khau he thong"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9"
              />
            </div>

            {/* Helper Info */}
            <div className="text-[10px] text-muted-foreground leading-relaxed bg-muted/50 p-2.5 rounded-lg">
              Tai khoan Super Admin va Admin mac dinh:<br />
              Email: <span className="font-mono text-foreground font-semibold">admin@restx.food</span><br />
              Mat khau: <span className="font-mono text-foreground font-semibold">Admin@123</span>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm"
            >
              {loading ? t('common.loading') : t('auth.submitLogin')}
            </Button>
            <div className="text-xs text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                {t('auth.submitRegister')}
              </Link>
            </div>
          </CardFooter>
        </form>

      </Card>
    </div>
  );
}
