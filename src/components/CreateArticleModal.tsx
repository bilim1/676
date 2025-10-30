import { useState } from 'react';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateArticle: (article: {
    title: string;
    description: string;
    icon: string;
    color: string;
    url: string | null;
  }) => void;
}

const POPULAR_ICONS = [
  'FileText', 'Home', 'Search', 'Mail', 'Map', 'Youtube', 'Calendar',
  'Image', 'Music', 'Settings', 'User', 'Heart', 'Star', 'Book',
  'Bookmark', 'Camera', 'Clock', 'Cloud', 'Code', 'Coffee',
  'Database', 'Download', 'Edit', 'Folder', 'Gift', 'Globe',
  'Headphones', 'Laptop', 'MessageCircle', 'Newspaper', 'Package',
  'Phone', 'Printer', 'Send', 'Share', 'ShoppingCart', 'Tag',
  'TrendingUp', 'Tv', 'Video', 'Wifi', 'Zap', 'Film', 'Gamepad2'
];

const COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#f43f5e', '#eab308', '#22c55e', '#6b7280'
];

export function CreateArticleModal({ isOpen, onClose, onCreateArticle }: CreateArticleModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('FileText');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onCreateArticle({
      title,
      description,
      icon: selectedIcon,
      color: selectedColor,
      url: url || null
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setSelectedIcon('FileText');
    setSelectedColor('#3b82f6');
    onClose();
  };

  const IconComponent = (Icons[selectedIcon as keyof typeof Icons] || Icons.FileText) as LucideIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Создать новую статью</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div
              className="rounded-2xl shadow-lg p-6 w-24 h-24 flex items-center justify-center"
              style={{ backgroundColor: `${selectedColor}15` }}
            >
              <IconComponent size={48} style={{ color: selectedColor }} strokeWidth={2} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Например: YouTube"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Краткое описание статьи"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL (опционально)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите иконку
            </label>
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-xl">
              {POPULAR_ICONS.map((iconName) => {
                const Icon = (Icons[iconName as keyof typeof Icons]) as LucideIcon;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-3 rounded-lg transition-all hover:scale-110 ${
                      selectedIcon === iconName
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={24} className="text-gray-700" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Выберите цвет
            </label>
            <div className="grid grid-cols-10 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-lg transition-all hover:scale-110 ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
