import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ShortcutIconProps {
  title: string;
  icon: string;
  color: string;
  url?: string | null;
  onRemove?: () => void;
  isDragging?: boolean;
}

export function ShortcutIcon({
  title,
  icon,
  color,
  url,
  onRemove,
  isDragging = false
}: ShortcutIconProps) {
  const IconComponent = (Icons[icon as keyof typeof Icons] || Icons.FileText) as LucideIcon;

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div
      className={`group relative flex flex-col items-center gap-2 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
      }`}
    >
      <div
        className="relative rounded-2xl shadow-lg backdrop-blur-sm bg-white/90 p-4 w-20 h-20 flex items-center justify-center transition-all hover:shadow-xl"
        onClick={handleClick}
        style={{ backgroundColor: `${color}15` }}
      >
        <IconComponent
          size={36}
          style={{ color }}
          strokeWidth={2}
        />

        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 flex items-center justify-center"
          >
            <Icons.X size={14} strokeWidth={3} />
          </button>
        )}
      </div>

      <span className="text-sm font-medium text-gray-700 text-center max-w-[100px] truncate">
        {title}
      </span>
    </div>
  );
}
