'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Scissors, Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Success - Redirect to dashboard
      router.push('/app/dashboard');
      router.refresh();
    } catch (err: any) {
      setError('Ocorreu um erro inesperado ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      setError('Erro ao iniciar login com Google.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#231c0f] overflow-hidden">
      {/* Left Side: Hero Image Section */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-end p-12 overflow-hidden bg-[#231c10]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
            alt="Dark moody barbershop interior"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#231c0f] via-[#231c0f]/60 to-transparent"></div>
        
        {/* Branding Content */}
        <div className="relative z-20 max-w-lg">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <Scissors className="text-[#f79f08] w-12 h-12" />
            <h2 className="text-4xl font-bold text-white tracking-tight">BarberGOLD</h2>
          </Link>
          <p className="text-xl text-[#ccb58f] font-medium leading-relaxed">
            Premium management for the modern barbershop. Streamline your appointments, manage your staff, and elevate your client experience.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-[#231c0f]">
        <div className="w-full max-w-[480px] flex flex-col gap-6">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center items-center gap-2 mb-4">
            <Scissors className="text-[#f79f08] w-10 h-10" />
            <h2 className="text-2xl font-bold text-white">BarberGOLD</h2>
          </div>
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">Welcome Back</h1>
            <p className="text-[#ccb58f] text-base font-normal leading-normal">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-4">
            {/* Email / Username Field */}
            <label className="flex flex-col w-full">
              <p className="text-white text-base font-medium leading-normal pb-2">Email or Username</p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                disabled={loading}
                className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#f79f08] border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-14 placeholder:text-[#ccb58f]/70 px-4 text-base font-normal leading-normal transition-colors disabled:opacity-50"
              />
            </label>

            {/* Password Field */}
            <label className="flex flex-col w-full">
              <div className="flex justify-between items-center pb-2">
                <p className="text-white text-base font-medium leading-normal">Password</p>
              </div>
              <div className="flex w-full flex-1 items-stretch rounded-lg focus-within:ring-1 focus-within:ring-[#f79f08] focus-within:border-[#f79f08] border border-[#695430] bg-[#342a18] h-14 overflow-hidden transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent text-white focus:outline-none focus:ring-0 placeholder:text-[#ccb58f]/70 px-4 text-base font-normal leading-normal h-full disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#ccb58f] hover:text-[#f79f08] flex items-center justify-center pr-4 pl-2 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </label>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    disabled={loading}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-[#695430] bg-[#342a18] checked:border-[#f79f08] checked:bg-[#f79f08] transition-all disabled:opacity-50"
                  />
                  <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-[#231c0f] opacity-0 peer-checked:opacity-100 font-bold" />
                </div>
                <span className="text-base font-medium text-[#ccb58f] group-hover:text-[#f79f08] transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-base font-medium text-[#f79f08] hover:text-[#f79f08]/80 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-4 bg-[#f79f08] text-[#231c0f] text-base font-bold leading-normal tracking-wide hover:bg-[#f79f08]/90 hover:shadow-[0_0_20px_rgba(247,159,8,0.3)] transition-all duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processando...
                </>
              ) : 'Log In'}
            </button>
          </form>

          {/* Footer */}
          <div className="flex justify-center mt-4">
            <p className="text-[#ccb58f] text-base font-normal">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#f79f08] font-bold hover:underline ml-1">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
