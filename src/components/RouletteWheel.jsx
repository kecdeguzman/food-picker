import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function RouletteWheel({ items }) {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);

  const sliceColors = [
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#f97316', // orange-500
    '#06b6d4', // cyan-500
    '#ef4444', // red-500
  ];

  const spin = () => {
    if (isSpinning || !items || items.length === 0) return;
    setIsSpinning(true);
    setSelected(null);
    
    const sliceAngle = 360 / items.length;
    const winningIndex = Math.floor(Math.random() * items.length);
    
    const sliceCenterAngle = (winningIndex * sliceAngle) + (sliceAngle / 2);
    const offset = 360 - sliceCenterAngle;
    
    const currentRotMod = rotation % 360;
    const spins = 360 * 5;
    
    let rotationDiff = offset - currentRotMod;
    if (rotationDiff <= 0) {
      rotationDiff += 360;
    }
    
    const newRotation = rotation + spins + rotationDiff;
    
    setRotation(newRotation);
    
    setTimeout(() => {
      setSelected(items[winningIndex]);
      setIsSpinning(false);
    }, 4500); 
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-10 w-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute -top-6 z-20 text-slate-800 dark:text-slate-200 drop-shadow-md">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 4L20 12H4L12 4Z" transform="rotate(180 12 12)" />
          </svg>
        </div>

        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl">
          <motion.div
            ref={wheelRef}
            className="w-full h-full relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 4.5, type: "tween", ease: [0.2, 0.8, 0.2, 1] }}
            style={{ borderRadius: '50%' }}
          >
            {items.map((item, i) => {
              const sliceAngle = 360 / items.length;
              const textAngle = (i * sliceAngle) + (sliceAngle / 2);
              
              return (
                <div
                  key={i}
                  className="absolute w-1/2 h-[2px] top-1/2 left-1/2 origin-left flex items-center justify-start pl-8 sm:pl-10 z-10"
                  style={{
                    transform: `translateY(-50%) rotate(${textAngle - 90}deg)`,
                  }}
                >
                  <span className="text-white font-bold text-xs sm:text-sm drop-shadow-md whitespace-nowrap">
                    {item}
                  </span>
                </div>
              );
            })}
            
            <div 
              className="absolute inset-0 z-0" 
              style={{
                background: `conic-gradient(${items.map((_, i) => {
                  const startColor = sliceColors[i % sliceColors.length];
                  const sliceAngle = 360 / items.length;
                  return `${startColor} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
                }).join(', ')})`
              }}
            />
          </motion.div>
          
          <div className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-slate-800 rounded-full shadow-inner z-20 flex items-center justify-center">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-black tracking-widest rounded-2xl shadow-lg border-b-4 border-brand-600 hover:border-b-0 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:transform-none active:border-b-0"
      >
        {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
      </button>

      <div className={`transition-all duration-500 ${selected && !isSpinning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="px-8 py-6 bg-brand-500 text-white rounded-3xl shadow-xl w-full text-center flex flex-col items-center">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-80">
              You are having
            </p>
            <div className="flex items-center space-x-3 text-white">
              <CheckCircle2 className="w-8 h-8" />
              <h3 className="text-2xl sm:text-3xl font-black">
                {selected}
              </h3>
            </div>
          </div>
      </div>
    </div>
  );
}
