import React, { useEffect } from 'react';

interface AdUnitProps {
  slot?: string; // For Google AdSense data-ad-slot identifier
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  className?: string;
  label?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  slot = "0000000000", 
  format = "auto", 
  className = "",
  label = "Advertisement"
}) => {
  useEffect(() => {
    // INSTRUCTIONS FOR PRODUCTION:
    // 1. Create a Google AdSense account.
    // 2. Get your publisher ID (e.g., ca-pub-XXXXXXXXXXXXXXXX).
    // 3. Create Ad Units and get the 'slot' IDs.
    // 4. Uncomment the code below to push ads.
    
    // try {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (e) {
    //   console.error("AdSense error", e);
    // }
  }, []);

  return (
    <div className={`flex items-center justify-center ${className} overflow-hidden`}>
      {/* VISUAL PLACEHOLDER (Remove or hide this div when using real ads) */}
      <div className={`bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center justify-center text-center w-full shadow-sm relative group cursor-pointer hover:bg-slate-800 transition-colors ${className.includes('h-full') ? 'h-full' : 'min-h-[100px] max-w-[336px]'}`}>
        <div className="absolute top-0 left-0 bg-slate-700 text-[10px] px-1.5 py-0.5 text-slate-300 font-bold uppercase rounded-br">
          Ad
        </div>
        <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300">
          {label}
        </span>
        <span className="text-xs text-slate-600 mt-1">
          (Place AdSense Script Here)
        </span>

        {/* REAL AD CODE EXAMPLE:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        */}
      </div>
    </div>
  );
};