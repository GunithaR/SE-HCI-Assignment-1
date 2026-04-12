import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar completely on the Login page
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[rgba(240,240,240,0.78)] backdrop-blur-xl z-50 h-[80px] px-[30px] flex items-center justify-between">
      <div className="flex items-center gap-[75px]">
        <Link to="/" className="font-['Manrope:Bold',sans-serif] font-bold text-[#4c1d95] text-[26px] tracking-[-1.2px] leading-[32px] whitespace-nowrap">
          L + SIVILIMA
        </Link>
        
        <div className="hidden md:flex items-center gap-[37px]">
          <Link to="/catalog" className="font-['Inter:Medium',sans-serif] font-medium text-[#475569] text-[18px] tracking-[-0.35px] hover:text-[#4c1d95] transition-colors whitespace-nowrap">Catalog</Link>
          <Link to="/wizard" className="font-['Inter:Medium',sans-serif] font-medium text-[#475569] text-[18px] tracking-[-0.35px] hover:text-[#4c1d95] transition-colors whitespace-nowrap">Recommendations</Link>
          {isAdmin && (
            <Link to="/admin" className="font-['Inter:Medium',sans-serif] font-medium text-[#475569] text-[18px] tracking-[-0.35px] hover:text-[#4c1d95] transition-colors whitespace-nowrap">Admin Dashboard</Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-[46px]">
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <span className="font-['Inter:Medium',sans-serif] text-[16px] font-medium text-[#475569] hidden sm:block truncate max-w-[150px]">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="text-[16px] font-['Manrope:Bold',sans-serif] font-bold text-[#630ed4] hover:text-[#4c1d95] transition-colors uppercase tracking-widest whitespace-nowrap shrink-0"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="relative shrink-0 flex items-center justify-center size-[40px] rounded-full hover:bg-black/5 transition-colors group">
            <img 
              alt="Login Profile" 
              className="block size-[19px] group-hover:scale-110 transition-transform" 
              src="http://localhost:3845/assets/d642d5cda49192a34f75054038ce92679524e034.svg" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback SVG profile icon */}
            <svg className="hidden size-[19px] text-[#475569] group-hover:text-[#4c1d95] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
