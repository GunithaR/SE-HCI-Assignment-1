import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MailIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      const authData = await login(email, password);

      // Navigate intelligently based on the user's role
      if (authData.role === 'ADMIN' || authData.role === 'SUB_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-['Inter',sans-serif]"
      style={{ backgroundImage: "linear-gradient(134deg, rgb(255, 255, 255) 0%, rgb(237, 224, 255) 45%, rgb(200, 176, 232) 59%, rgb(121, 50, 215) 91%)" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 py-8 md:px-12 md:py-10 lg:px-[80px] lg:py-[57px] flex flex-col xl:flex-row items-stretch gap-10 xl:gap-[73px] min-h-screen xl:min-h-0 xl:h-[900px]">

        {/* ── LEFT PANEL: Branding & Aesthetics ───────── */}
        <div className="flex-[1_0_0] flex flex-col gap-6 lg:gap-[29px] w-full min-w-[320px] xl:min-w-[400px]">

          {/* Typography Block */}
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 w-full pt-8 xl:pt-0">
            <h3 className="font-['Manrope',sans-serif] font-bold text-[#630ed4] text-[16px] md:text-[20px] tracking-[1.4px] uppercase leading-none">
              Built on Quality Choices
            </h3>
            <h1 className="font-['Inter',sans-serif] font-extrabold text-[#1a1b23] text-[48px] md:text-[72px] xl:text-[92px] tracking-[-2px] xl:tracking-[-3.6px] leading-[1] md:leading-[72px]">
              L+ SIVILIMA
            </h1>
            <p className="font-normal text-[#4a4455] text-[16px] md:text-[20px] xl:text-[22px] leading-[1.5] md:leading-[29.25px] max-w-[700px] mt-2">
              Access your curated construction experience—explore premium materials, manage your projects, and unlock intelligent recommendations
            </p>
          </div>

          {/* Dynamic Image Container */}
          <div className="flex-[1_0_0] w-full min-h-[300px] sm:min-h-[400px] xl:min-h-px relative overflow-hidden rounded-[40px] xl:rounded-[60px] mt-4 xl:mt-0 border-none">
            {/* Note: The 'zoom-image' CSS animation is managed in index.css */}
            <img
              src="/login-hero.png"
              alt="Interior Architecture"
              className="absolute inset-0 w-full h-full object-cover zoom-image origin-center border-none"
              loading="lazy"
            />
          </div>

        </div>

        {/* ── RIGHT PANEL: Functional Login Card ──────── */}
        <div
          className="w-full xl:w-[480px] h-[450px] shrink-0 rounded-[40px] xl:rounded-[60px] p-[16px] mb-8 xl:mb-0 shadow-2xl flex flex-col self-center"
          style={{ background: "linear-gradient(134deg, rgb(255, 255, 255) 0%, rgb(237, 224, 255) 45%, rgb(200, 176, 232) 59%, rgb(121, 50, 215) 91%)" }}
        >
          <div className="w-full h-full glass-panel-figma rounded-[24px] xl:rounded-[44px] px-8 py-5 sm:px-[40px] flex flex-col justify-center overflow-y-auto overflow-x-hidden">

            {/* Inner Center Wrapper */}
            <div className="w-full flex flex-col gap-4 m-auto">

              {/* Header Block */}
              <div className="flex flex-col items-center text-center gap-2">
                <h2 className="font-['Manrope',sans-serif] font-bold text-[36px] sm:text-[38px] text-white tracking-[-0.9px] leading-[40px]">
                  Welcome Back
                </h2>
                <p className="font-normal text-[15px] sm:text-[16px] text-[#ffffffcc] leading-[22.75px]">
                  Enter your credentials to access your architectural projects
                </p>
              </div>

              {/* Validation Error Block */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-2xl text-sm font-medium error-shake shadow-lg backdrop-blur-sm self-center w-3/4 text-center">
                  <span className="mr-2">⚠️</span>{error}
                </div>
              )}

              {/* Form Block */}
              <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full mt-1">

                {/* Email Field Group */}
                <div className="flex flex-col items-start gap-1.5 w-[90%]">
                  <label className="font-semibold text-[12px] text-[#ffffffef] tracking-[0.6px] uppercase ml-2">Email Address</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-[60px] flex items-center pointer-events-none">
                      <MailIcon className="h-[20px] w-[20px] text-white/40" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@platform.com"
                      autoComplete="email"
                      className="w-full h-[54px] bg-[#fffdfd29] rounded-[50px] px-[92px] text-center text-[16px] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-normal input-premium-cta"
                    />
                  </div>
                </div>

                {/* Password Field Group */}
                <div className="flex flex-col items-start gap-1.5 w-[90%]">
                  <label className="font-semibold text-[12px] text-[#ffffffef] tracking-[0.6px] uppercase ml-2">Password</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-[60px] flex items-center pointer-events-none">
                      <LockIcon className="h-[20px] w-[20px] text-white/40" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full h-[54px] bg-[#fffdfd29] rounded-[50px] px-[92px] text-center text-[16px] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-normal input-premium-cta"
                    />
                  </div>
                </div>

                {/* Remember Me & Utilities Block */}
                <div className="flex items-center justify-center w-[90%] px-1 gap-48 mt-1">
                  <label className="flex items-center gap-[8px] cursor-pointer group">
                    <div className="size-[16px] rounded-[16px] bg-[#ffffff33] border border-transparent flex items-center justify-center transition-colors group-hover:bg-[#ffffff44]">
                      {/* Subtle indication area */}
                    </div>
                    <span className="font-medium text-[12px] text-[#ffffffb3] group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="font-medium text-[12px] text-white hover:text-white/80 transition-colors pointer-events-auto">Forgot Password?</a>
                </div>

                {/* Sign In CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[90%] h-[56px] bg-white rounded-[32px] text-[#25005a] font-bold text-[16px] flex items-center justify-center gap-2 mt-1 hover:scale-[1.02] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-xl shrink-0"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                  {!isSubmitting && <ArrowRightIcon className="size-[16px]" />}
                </button>

              </form>

              {/* Footer Sublink */}
              <div className="flex items-center justify-center gap-[7px] w-full text-[14px]">
                <span className="text-[#ffffff99] font-normal">Don't have an account?</span>
                <Link to="/" className="font-bold text-white hover:underline transition-all">Browse our designs</Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
