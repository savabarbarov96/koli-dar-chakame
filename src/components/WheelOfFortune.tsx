import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { WinModal } from "./WinModal";
import { Confetti } from "./Confetti";

export interface WheelSector {
  id: string;
  text: string;
  color: 'red' | 'green' | 'yellow' | 'gray';
  probability: number;
  isBigWin: boolean;
}

interface WheelOfFortuneProps {
  sectors: WheelSector[];
  onSpin?: (result: WheelSector) => void;
}

export const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ sectors, onSpin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winResult, setWinResult] = useState<WheelSector | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<SVGGElement>(null);

  const getColorClass = (color: WheelSector['color']) => {
    const colorMap = {
      red: 'fill-wheel-red',
      green: 'fill-wheel-green',
      yellow: 'fill-wheel-yellow',
      gray: 'fill-wheel-gray'
    };
    return colorMap[color];
  };

  const selectWinner = useCallback(() => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const sector of sectors) {
      cumulative += sector.probability / 100;
      if (random <= cumulative) {
        return sector;
      }
    }
    
    return sectors[0]; // Fallback
  }, [sectors]);

  const spinWheel = async () => {
    if (isSpinning || sectors.length === 0) return;

    setIsSpinning(true);
    const winner = selectWinner();
    
    // Calculate rotation to land on the winner
    const sectorAngle = 360 / sectors.length;
    const winnerIndex = sectors.findIndex(s => s.id === winner.id);
    const targetAngle = winnerIndex * sectorAngle + (sectorAngle / 2);
    const finalRotation = 1800 + (360 - targetAngle); // 5 full rotations + adjustment

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      setWinResult(winner);
      onSpin?.(winner);

      if (winner.isBigWin) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 5000);
  };

  const resetWheel = () => {
    setWinResult(null);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  return (
    <div className="flex flex-col items-center gap-6">
      {showConfetti && <Confetti />}
      
      <div className="relative">
        <svg width="400" height="400" className="drop-shadow-xl">
          {/* Outer ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 10}
            fill="hsl(var(--wheel-red))"
            stroke="hsl(var(--wheel-red))"
            strokeWidth="2"
          />
          
          {/* Wheel sectors */}
          <g ref={wheelRef} className="transition-transform duration-[5000ms] ease-out origin-center">
            {sectors.map((sector, index) => {
              const angle = (360 / sectors.length) * index;
              const nextAngle = angle + (360 / sectors.length);
              
              const x1 = centerX + radius * Math.cos((angle * Math.PI) / 180);
              const y1 = centerY + radius * Math.sin((angle * Math.PI) / 180);
              const x2 = centerX + radius * Math.cos((nextAngle * Math.PI) / 180);
              const y2 = centerY + radius * Math.sin((nextAngle * Math.PI) / 180);

              const textAngle = angle + (360 / sectors.length) / 2;
              const textRadius = radius * 0.7;
              const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
              const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

              return (
                <g key={sector.id}>
                  <path
                    d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                    className={getColorClass(sector.color)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    className="pointer-events-none select-none font-semibold"
                  >
                    {sector.text}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="20"
            fill="hsl(var(--wheel-red))"
            stroke="white"
            strokeWidth="3"
          />

          {/* Pointer */}
          <polygon
            points="200,50 210,70 190,70"
            fill="hsl(var(--wheel-red))"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          size="lg"
          className="px-12 py-4 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSpinning ? "Завърта се..." : "Завърти колелото!"}
        </Button>

        {winResult && (
          <Button
            onClick={resetWheel}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Опитай пак
          </Button>
        )}
      </div>

      <WinModal
        isOpen={!!winResult}
        onClose={resetWheel}
        prize={winResult?.text || ""}
        isBigWin={winResult?.isBigWin || false}
      />
    </div>
  );
};