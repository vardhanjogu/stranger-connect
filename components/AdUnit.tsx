import React, { useEffect } from 'react';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  slot = "0000000000", 
  format = "auto", 
  className = ""
}) => {
  useEffect(() => {
    // try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }, []);

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <div className="bg-white/5 border border-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center w-full min-h-[120px] relative overflow-hidden group">
        <div className="absolute top-2 left-6 text-[8px] text-white/20 font-black uppercase tracking-widest">
          Sponsor
        </div>
        <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest animate-pulse">
          Connection sponsored by Ads
        </div>
        
        {/* AdSense ins tag will go here in production */}
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-STRANGER_CONNECT"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};