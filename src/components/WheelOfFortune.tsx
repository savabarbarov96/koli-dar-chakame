import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { WinModal } from "./WinModal";
import { Confetti } from "./Confetti";
import { Wheel3D } from "./Wheel3D";

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
  const [targetRotation, setTargetRotation] = useState(0);
  const [use3D, setUse3D] = useState(true);

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
    setWinResult(null); // Clear previous result
    const winner = selectWinner();
    
    // Calculate rotation to land on the winner
    const sectorAngle = (Math.PI * 2) / sectors.length;
    const winnerIndex = sectors.findIndex(s => s.id === winner.id);
    const targetAngle = winnerIndex * sectorAngle + (sectorAngle / 2);
    const finalRotation = Math.PI * 10 + targetAngle; // 5 full rotations + adjustment

    setTargetRotation(finalRotation);

    // Store winner for when spin completes
    setTimeout(() => {
      if (!isSpinning) return; // Prevent multiple results
      
      setIsSpinning(false);
      setWinResult(winner);
      onSpin?.(winner);

      if (winner.isBigWin) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 8000); // Match the 8-second spin duration
  };

  const resetWheel = () => {
    setWinResult(null);
    setTargetRotation(0);
  };

  const handleSpinComplete = () => {
    // This ensures the modal only appears after the wheel stops spinning
    if (isSpinning) {
      setIsSpinning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {showConfetti && <Confetti />}
      
      <div className="relative">
        {use3D ? (
          <Wheel3D
            sectors={sectors}
            isSpinning={isSpinning}
            targetRotation={targetRotation}
            onSpinComplete={handleSpinComplete}
          />
        ) : (
          <div className="w-96 h-96 relative">
            <div 
              className={`w-full h-full rounded-full border-8 border-wheel-red relative overflow-hidden
                ${isSpinning ? 'animate-wheel-spin animate-wheel-glow' : ''}
                shadow-2xl`}
              style={{
                background: `conic-gradient(${sectors.map((sector, index) => {
                  const percentage = 100 / sectors.length;
                  const startPercentage = (index * percentage);
                  const endPercentage = ((index + 1) * percentage);
                  return `hsl(var(--wheel-${sector.color})) ${startPercentage}% ${endPercentage}%`;
                }).join(', ')})`
              }}
            >
              {/* Sector labels */}
              {sectors.map((sector, index) => {
                const angle = (360 / sectors.length) * index + (360 / sectors.length) / 2;
                const radius = 140;
                return (
                  <div
                    key={sector.id}
                    className="absolute text-white font-bold text-sm pointer-events-none select-none drop-shadow-lg"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                      textAlign: 'center',
                      maxWidth: '80px',
                      fontSize: sectors.length > 8 ? '11px' : '14px'
                    }}
                  >
                    {sector.text}
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-wheel-red rounded-full border-4 border-white shadow-lg" />
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-wheel-red shadow-lg z-10" />
          </div>
        )}
        
        {/* Toggle 3D/2D button */}
        <Button
          onClick={() => setUse3D(!use3D)}
          variant="outline"
          size="sm"
          className="absolute top-2 right-2"
        >
          {use3D ? '2D' : '3D'}
        </Button>
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