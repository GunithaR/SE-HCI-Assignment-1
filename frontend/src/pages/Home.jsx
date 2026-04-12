import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import catalogService from "../services/catalogService";
import ProductSection from "../components/ProductSection";

const imgHomePageImage = "http://localhost:3845/assets/f8c3ef8a3714caedee33afd06854e0f9ed0f03bf.png";
const imgHomePageImage1 = "http://localhost:3845/assets/ed5de73e56ab249da8ce0afa0afbd5cbf1d2fa72.svg";
const imgIcon = "http://localhost:3845/assets/b542828e96d84929e5e375f4855b44520a1f4058.svg";

function HeadButtonSecondary({ className, property1 = "Default" }) {
  return (
    <div className={className || "backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.4)] border-solid flex flex-col items-center justify-center p-0 relative rounded-[48px] w-[240px] h-[56px]"}>
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[-1px] rounded-[48px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-full items-center justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-full">
        <Link to="/wizard" className="leading-[28px] w-full h-full flex items-center justify-center">Get Recommendations</Link>
      </div>
    </div>
  );
}

function Footer({ className }) {
  return (
    <div className={className || "bg-[#f8fafc] border-[rgba(204,195,216,0.1)] border-solid border-t content-stretch flex flex-col sm:flex-row min-h-[243px] items-center justify-between pb-[64px] pt-[65px] px-[48px] relative w-full"}>
      <div className="relative shrink-0 flex flex-col gap-[16px] items-start mb-8 sm:mb-0">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#4c1d95] text-[18px] w-[183.2px]">
          <p className="leading-[28px]">L+ SIVILIMA</p>
        </div>
        <div className="content-stretch flex flex-col items-start max-w-[320px] relative shrink-0">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px]">
            <p className="leading-[20px] mb-0">{`Precision in Luxury. Curating the world's finest`}</p>
            <p className="leading-[20px]">architectural materials for visionary builders.</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic opacity-90 relative shrink-0 text-[#64748b] text-[14px] w-[329.94px]">
            <p className="leading-[20px]">© 2026 L+ SIVILIMA. Precision in Luxury.</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 flex gap-[48px] items-start justify-center">
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
          <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#6d28d9] text-[12px] tracking-[1.2px] uppercase">
            <p className="leading-[16px]">Discover</p>
          </div>
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px]">
            <p className="leading-[20px]">Materials</p>
          </div>
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px]">
            <p className="leading-[20px]">Sustainability</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
          <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#6d28d9] text-[12px] tracking-[1.2px] uppercase">
            <p className="leading-[16px]">Company</p>
          </div>
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px]">
            <p className="leading-[20px]">Our Process</p>
          </div>
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px]">
            <p className="leading-[20px]">Contact</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // Dynamic fetching of backend contents
    catalogService.getAllProducts(0, 50).then((data) => {
      setProducts(data.content || []);
    }).catch(console.error);

    catalogService.getCategories().then((data) => {
      setCategories(data || []);
    }).catch(console.error);
  }, []);

  const categoryProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category?.name === activeCategory);
  
  const popularProducts = categoryProducts.slice(0, 4);
  const budgetPicks = categoryProducts.filter(p => p.attribute?.budgetLevel === 'LOW' || p.basePrice < 1500).slice(0, 4);
  const topRated = categoryProducts.filter(p => (p.attribute?.durabilityRating || 0) >= 4).slice(0, 4);
  const climateProducts = categoryProducts.filter(p => p.attribute?.climateSuitability === 'ALL' || p.attribute?.climateSuitability === 'TROPICAL').slice(0, 4);

  // Default filler if arrays are empty, just so the demo renders sections
  const displayBudget = budgetPicks.length > 0 ? budgetPicks : categoryProducts.slice(1, 5);
  const displayTopRated = topRated.length > 0 ? topRated : categoryProducts.slice(2, 6);
  const displayClimate = climateProducts.length > 0 ? climateProducts : categoryProducts.slice(0, 4);

  return (
    <div className="bg-[#fbf8ff] relative w-full min-h-screen flex flex-col font-sans">
      
      {/* Hero Section Container */}
      <div className="relative w-full h-[923px] shrink-0 mb-12">
        <div className="absolute inset-0 overflow-clip rounded-bl-[70px] rounded-br-[70px] shadow-lg">
          <img alt="Hero BG" className="absolute inset-0 object-cover size-full" src={imgHomePageImage} />
          <img alt="Hero Overlay" className="absolute block inset-0 size-full" src={imgHomePageImage1} />
        </div>

        {/* Hero Text Content */}
        <div className="absolute top-[20%] left-0 right-0 flex flex-col items-center justify-center pointer-events-none px-4">
          <div className="flex flex-col gap-[20px] items-center justify-center text-center">
            <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[#cda8ff] text-xl sm:text-[20px] tracking-[1.4px] uppercase whitespace-nowrap drop-shadow-md">
              Built on Quality Choices
            </h2>
            <h1 className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#bcc3ff] text-5xl sm:text-[100px] tracking-[-3.6px] leading-[1.1] drop-shadow-lg">
              L+ SIVILIMA
            </h1>
          </div>
          
          <div className="mt-6 mb-12 max-w-2xl text-center shadow-[0px_4px_3px_0px_rgba(0,0,0,0.1)] px-4">
            <p className="font-['Inter:Medium',sans-serif] font-medium text-[#d2bbff] text-2xl sm:text-[30px] leading-snug drop-shadow-md">
              Source premium materials for your next masterpiece
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-2xl pointer-events-auto">
            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[8px] flex items-center justify-between w-full h-[72px] p-[8px] rounded-[9999px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] border border-white/20">
              <div className="flex gap-[12px] items-center px-[20px] shrink-0">
                <img alt="Search" className="size-[18px]" src={imgIcon} />
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[16px] sm:text-[18px] text-[rgba(255,255,255,0.7)] truncate">
                  Search materials (tiles, roofing...)
                </span>
              </div>
              <button className="bg-[#630ed4] flex flex-col items-center justify-center rounded-[48px] hover:bg-[#4c1d95] transition-colors shadow-lg w-[160px] h-[56px] shrink-0">
                <span className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] sm:text-[18px] text-white">
                  Search
                </span>
              </button>
            </div>

            <div className="flex gap-[20px] sm:gap-[42px] mt-2 justify-center w-full">
              <Link to="/catalog" className="bg-[#630ed4] flex flex-col items-center justify-center rounded-[48px] shadow-lg hover:bg-[#4c1d95] transition-colors w-[240px] h-[56px]">
                <span className="font-['Manrope:Bold',sans-serif] font-bold text-[16px] sm:text-[18px] text-white">Browse Materials</span>
              </Link>
              <HeadButtonSecondary />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 pt-16 pb-24">
        {/* Dynamic Category Tabs */}
        <div className="flex flex-nowrap gap-6 items-center justify-start py-8 mb-12 sm:mb-16 w-full overflow-x-auto no-scrollbar scroll-smooth">
          <button 
             onClick={() => setActiveCategory('All')}
             className={`w-[220px] h-[54px] rounded-[32px] font-bold text-[14px] hover:scale-[1.02] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all shadow-md active:scale-[0.98] shrink-0 ${activeCategory === 'All' ? 'bg-[#630ed4] text-white' : 'bg-white text-[#25005a]'}`}
          >
            All
          </button>
          
          {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.name)}
               className={`w-[220px] h-[54px] rounded-[32px] font-bold text-[14px] hover:scale-[1.02] hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all shadow-md active:scale-[0.98] shrink-0 ${activeCategory === cat.name ? 'bg-[#630ed4] text-white' : 'bg-white text-[#25005a]'}`}
             >
               {cat.name}
             </button>
          ))}
        </div>

        {/* Product Sections */}
        {products.length === 0 ? (
          <div className="text-center text-[#475569] py-20 text-xl font-medium w-full">
             No products registered yet. Admin needs to add products.
          </div>
        ) : (
          <div className="w-full flex-col gap-12 sm:gap-16 flex justify-center items-center">
            <ProductSection title="Popular Right Now" products={popularProducts} />
            <div className="w-full h-px bg-black/5 my-2"></div>
            <ProductSection title="Budget Friendly Picks" products={displayBudget} />
            <div className="w-full h-px bg-black/5 my-2"></div>
            <ProductSection title="Top Rated Materials" products={displayTopRated} />
            <div className="w-full h-px bg-black/5 my-2"></div>
            <ProductSection title="Best for your climate" products={displayClimate} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}