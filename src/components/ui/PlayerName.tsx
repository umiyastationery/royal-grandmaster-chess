import { cn } from '@/lib/utils';

interface PlayerNameProps {
  name: string;
  className?: string;
  showBranding?: boolean;
  brandingClassName?: string;
}

const PlayerName = ({ 
  name, 
  className = "", 
  showBranding = true,
  brandingClassName = ""
}: PlayerNameProps) => {
  return (
    <span className={cn("inline-block", className)}>
      {name}
      {showBranding && (
        <span className={cn(
          "ml-1 text-xs italic text-muted-foreground/70 font-normal",
          brandingClassName
        )}>
          (Powered by Kp's Creations)
        </span>
      )}
    </span>
  );
};

export default PlayerName;