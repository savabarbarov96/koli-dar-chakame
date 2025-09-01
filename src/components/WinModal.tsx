import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  prize: string;
  isBigWin: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, onClose, prize, isBigWin }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-modal-in">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-primary">
            🎉 Печелиш! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className={`text-center p-6 rounded-lg ${isBigWin ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            <p className="text-2xl font-bold mb-2">
              Твоята награда:
            </p>
            <p className={`text-3xl font-extrabold ${isBigWin ? 'animate-pulse' : ''}`}>
              {prize}
            </p>
          </div>
          
          {isBigWin && (
            <div className="text-center">
              <p className="text-xl font-bold text-accent animate-pulse">
                🌟 ГОЛЯМА НАГРАДА! 🌟
              </p>
            </div>
          )}
          
          <Button
            onClick={onClose}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Затвори
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};