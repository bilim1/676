import { Plus } from 'lucide-react';

interface AddShortcutButtonProps {
  onClick: () => void;
}

export function AddShortcutButton({ onClick }: AddShortcutButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className="rounded-2xl shadow-lg backdrop-blur-sm bg-white/60 hover:bg-white/80 p-4 w-20 h-20 flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 border-2 border-dashed border-gray-300"
      >
        <Plus size={36} className="text-gray-400" strokeWidth={2} />
      </button>

      <span className="text-sm font-medium text-gray-700 text-center">
        Добавить
      </span>
    </div>
  );
}
