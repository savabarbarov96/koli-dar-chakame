import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { WheelSector } from "./WheelOfFortune";
import { toast } from "sonner";

interface AdminPanelProps {
  sectors: WheelSector[];
  onSectorsChange: (sectors: WheelSector[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ sectors, onSectorsChange }) => {
  const [editingSectors, setEditingSectors] = useState<WheelSector[]>(sectors);

  const updateSector = (id: string, updates: Partial<WheelSector>) => {
    setEditingSectors(prev => 
      prev.map(sector => 
        sector.id === id ? { ...sector, ...updates } : sector
      )
    );
  };

  const addSector = () => {
    const newSector: WheelSector = {
      id: `sector-${Date.now()}`,
      text: 'Нов сектор',
      color: 'gray',
      probability: 12.5,
      isBigWin: false
    };
    setEditingSectors(prev => [...prev, newSector]);
  };

  const removeSector = (id: string) => {
    setEditingSectors(prev => prev.filter(sector => sector.id !== id));
  };

  const saveSectors = () => {
    // Validate total probability
    const totalProbability = editingSectors.reduce((sum, sector) => sum + sector.probability, 0);
    
    if (Math.abs(totalProbability - 100) > 0.1) {
      toast.error("Общата вероятност трябва да е 100%");
      return;
    }

    if (editingSectors.length < 3) {
      toast.error("Трябват поне 3 сектора");
      return;
    }

    onSectorsChange(editingSectors);
    toast.success("Настройките са запазени!");
  };

  const resetToDefaults = () => {
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
    setEditingSectors(defaultSectors);
    toast.success("Върнато към първоначални настройки");
  };

  const totalProbability = editingSectors.reduce((sum, sector) => sum + sector.probability, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Администрация</h1>
        <div className="flex gap-2">
          <Button onClick={resetToDefaults} variant="outline">
            Първоначални настройки
          </Button>
          <Button onClick={addSector} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Добави сектор
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {editingSectors.map((sector, index) => (
          <Card key={sector.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Сектор {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSector(sector.id)}
                  disabled={editingSectors.length <= 3}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`text-${sector.id}`}>Текст на награда</Label>
                  <Input
                    id={`text-${sector.id}`}
                    value={sector.text}
                    onChange={(e) => updateSector(sector.id, { text: e.target.value })}
                    placeholder="Въведи награда..."
                  />
                </div>
                
                <div>
                  <Label htmlFor={`color-${sector.id}`}>Цвят</Label>
                  <Select
                    value={sector.color}
                    onValueChange={(color: WheelSector['color']) => 
                      updateSector(sector.id, { color })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Червен</SelectItem>
                      <SelectItem value="green">Зелен</SelectItem>
                      <SelectItem value="yellow">Жълт</SelectItem>
                      <SelectItem value="gray">Сив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`probability-${sector.id}`}>Вероятност (%)</Label>
                  <Input
                    id={`probability-${sector.id}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={sector.probability}
                    onChange={(e) => updateSector(sector.id, { probability: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`bigwin-${sector.id}`}
                    checked={sector.isBigWin}
                    onCheckedChange={(checked) => updateSector(sector.id, { isBigWin: checked })}
                  />
                  <Label htmlFor={`bigwin-${sector.id}`}>Голяма награда (конфети)</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">
                Общо вероятност: {totalProbability.toFixed(1)}%
              </p>
              {Math.abs(totalProbability - 100) > 0.1 && (
                <p className="text-destructive text-sm">
                  Трябва да е точно 100%
                </p>
              )}
            </div>
            <Button
              onClick={saveSectors}
              size="lg"
              disabled={Math.abs(totalProbability - 100) > 0.1 || editingSectors.length < 3}
              className="px-8"
            >
              Запази промените
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};