import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WheelOfFortune, WheelSector } from "@/components/WheelOfFortune";
import { Settings } from "lucide-react";

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

const Index = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 text-center border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2">
            Заложна Къща 'Ивайло Стойчев'
          </h1>
          <p className="text-lg text-muted-foreground">
            Завърти колелото и спечели награда!
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8">
          <WheelOfFortune 
            sectors={sectors} 
            onSpin={(result) => {
              console.log('Winner:', result);
            }}
          />

          {/* Admin link */}
          <div className="mt-12">
            <Link to="/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Администрация
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Заложна Къща 'Ивайло Стойчев'. Всички права запазени.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
