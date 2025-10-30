import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Article = Database['public']['Tables']['articles']['Row'];

interface ArticleCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  existingShortcutIds: Set<string>;
}

export function ArticleCatalogModal({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  existingShortcutIds
}: ArticleCatalogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Выберите статью</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {articles.map((article) => {
              const IconComponent = (Icons[article.icon as keyof typeof Icons] || Icons.FileText) as LucideIcon;
              const isAlreadyAdded = existingShortcutIds.has(article.id);

              return (
                <button
                  key={article.id}
                  onClick={() => !isAlreadyAdded && onSelectArticle(article)}
                  disabled={isAlreadyAdded}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${
                    isAlreadyAdded
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'hover:bg-gray-50 hover:scale-105 cursor-pointer'
                  }`}
                >
                  <div
                    className="rounded-2xl shadow-lg p-4 w-16 h-16 flex items-center justify-center"
                    style={{ backgroundColor: `${article.color}15` }}
                  >
                    <IconComponent
                      size={32}
                      style={{ color: article.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900 text-sm">{article.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  {isAlreadyAdded && (
                    <span className="text-xs text-gray-500">Уже добавлено</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
