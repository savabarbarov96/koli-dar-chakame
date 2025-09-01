import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/AdminPanel";
import { WheelSector } from "@/components/WheelOfFortune";
import { ArrowLeft } from "lucide-react";

const defaultSectors: WheelSector[] = [
  { id: '1', text: '100 лв.', color: 'green', probability: 15, isBigWin: true },
  { id: '2', text: 'Опитай пак', color: 'gray', probability: 20, isBigWin: false },
  { id: '3', text: '50 лв.', color: 'yellow', probability: 15, isBigWin: false },
  { id: '4', text: 'Опитай пак', color: 'gray', probability: 20, isBigWin: false },
  { id: '5', text: '200 лв.', color: 'red', probability: 10, isBigWin: true },
  { id: '6', text: 'Опитай пак', color: 'gray', probability: 15, isBigWin: false },
  { id: '7', text: '25 лв.', color: 'yellow', probability: 10, isBigWin: false },
  { id: '8', text: 'Опитай пак', color: 'gray', probability: 5, isBigWin: false }
];

const Admin = () => {
  const [sectors, setSectors] = useState<WheelSector[]>(defaultSectors);

  useEffect(() => {
    const stored = localStorage.getItem('wheelSectors');
    if (stored) {
      try {
        setSectors(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading sectors:', error);
      }
    }
  }, []);

  const handleSectorsChange = (newSectors: WheelSector[]) => {
    setSectors(newSectors);
    localStorage.setItem('wheelSectors', JSON.stringify(newSectors));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Обратно към колелото
            </Button>
          </Link>
        </div>
        
        <AdminPanel 
          sectors={sectors} 
          onSectorsChange={handleSectorsChange}
        />
      </div>
    </div>
  );
};

export default Admin;