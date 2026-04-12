import { Link } from 'react-router-dom';

const imgContainer = "http://localhost:3845/assets/7c4ec0304f83e73e99a4f7602c178488c805969c.svg";
const imgContainer1 = "http://localhost:3845/assets/ef0dc701c79ddf443083a425357f90780a7c287c.svg";

export default function ProductSection({ title, products, onViewAll }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="flex flex-col items-start relative w-full gap-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start relative shrink-0">
          <h2 className="font-['Manrope:Bold',sans-serif] font-bold text-[#1a1b23] text-[30px] tracking-[-0.75px] leading-tight">
            {title}
          </h2>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex gap-[4px] items-center relative group hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="font-['Inter:Bold',sans-serif] font-bold text-[#630ed4] text-[16px] text-center">
              View All
            </span>
            <div className="relative shrink-0 size-[9.333px] group-hover:translate-x-1 transition-transform">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer} />
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-[40px] items-start relative w-full justify-center md:justify-start">
        {products.map((product) => {
          // Dynamic attributes extraction
          const attributes = product.attribute || {};
          const isEcoFriendly = attributes.budgetLevel === 'LOW' || attributes.climateSuitability === 'ALL';
          const isBestSeller = attributes.durabilityRating >= 4;
          const rating = attributes.durabilityRating ? (attributes.durabilityRating + 0.1).toFixed(1) : "4.8";
          
          const tags = [];
          if (isEcoFriendly) tags.push({ label: 'Eco Friendly', color: 'bg-[#93000a]', textColor: 'text-white' });
          else if (isBestSeller) tags.push({ label: 'Best Seller', color: 'bg-[#630ed4]', textColor: 'text-white' });
          else if (attributes.budgetLevel === 'HIGH') tags.push({ label: 'Premium', color: 'bg-[#1a1b23]', textColor: 'text-white' });

          const featureTags = [];
          if (attributes.maintenanceLevel === 'LOW') featureTags.push('Low Maintenance');
          if (attributes.climateSuitability === 'ALL') featureTags.push('Weather Proof');
          if (attributes.durabilityRating >= 4) featureTags.push('High Durability');
          else if (attributes.style) featureTags.push(attributes.style);

          // Fill empty space if we don't have enough tags
          if (featureTags.length === 0) featureTags.push('Quality Verified');

          const imageSource = product.imageUrl || "http://localhost:3845/assets/f5d4642b627c8264bbd7fcbecc8199143a0fe621.png";

          return (
            <div key={product.id} className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px] shadow-sm hover:shadow-[0px_15px_30px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-full z-[2]">
                <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt={product.name} className="absolute h-full left-0 max-w-none top-0 w-full object-cover" src={imageSource} />
                  </div>
                </div>
                
                {tags.length > 0 && (
                  <div className={`absolute ${tags[0].color} content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]`}>
                    <div className={`flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] ${tags[0].textColor} tracking-[1px] uppercase`}>
                      <p className="leading-[15px] p-1">{tags[0].label}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="content-stretch flex flex-col items-start justify-between px-[20px] py-[24px] relative shrink-0 w-full z-[1]">
                <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                    <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] truncate max-w-[200px]">
                      <p className="leading-[28px] truncate">{product.name}</p>
                    </div>
                    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0 group">
                      <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer1} />
                      </div>
                      <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0">
                        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px]">
                          <p className="leading-[16px]">{rating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[18px] whitespace-nowrap">
                      <p className="leading-[28px]">Rs.{product.basePrice}</p>
                    </div>
                  </div>
                </div>
                
                <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full">
                  <div className="content-stretch flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
                    {featureTags.slice(0, 2).map((tag, idx) => (
                      <div key={idx} className="bg-[#e9e7f3] content-stretch flex flex-col items-start px-[10px] py-[6px] relative rounded-[16px] shrink-0">
                        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px]">
                          <p className="leading-[15px]">{tag}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className="w-full border border-[#ccc3d8] border-solid content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 hover:border-[#630ed4] hover:bg-[#630ed4]/5 transition-colors cursor-pointer group">
                  <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-full">
                    <p className="leading-[24px]">View Details</p>
                  </div>
                </button>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
