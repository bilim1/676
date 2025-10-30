import { useState, useEffect, DragEvent } from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ShortcutIcon } from '../components/ShortcutIcon';
import { AddShortcutButton } from '../components/AddShortcutButton';
import { ArticleCatalogModal } from '../components/ArticleCatalogModal';
import { CreateArticleModal } from '../components/CreateArticleModal';
import type { Database } from '../lib/database.types';

type Article = Database['public']['Tables']['articles']['Row'];
type HomeShortcut = Database['public']['Tables']['home_shortcuts']['Row'];

interface ShortcutWithArticle extends HomeShortcut {
  article: Article;
}

export function HomePage() {
  const [shortcuts, setShortcuts] = useState<ShortcutWithArticle[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showCatalogPage, setShowCatalogPage] = useState(false);

  useEffect(() => {
    loadShortcuts();
    loadArticles();
  }, []);

  const loadShortcuts = async () => {
    const { data, error } = await supabase
      .from('home_shortcuts')
      .select(`
        *,
        article:articles(*)
      `)
      .order('position');

    if (error) {
      console.error('Error loading shortcuts:', error);
      return;
    }

    setShortcuts(data as ShortcutWithArticle[]);
  };

  const loadArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error loading articles:', error);
      return;
    }

    setAllArticles(data);
  };

  const addShortcut = async (article: Article) => {
    const maxPosition = shortcuts.length > 0
      ? Math.max(...shortcuts.map(s => s.position))
      : -1;

    const { error } = await supabase
      .from('home_shortcuts')
      .insert({
        article_id: article.id,
        position: maxPosition + 1
      });

    if (error) {
      console.error('Error adding shortcut:', error);
      return;
    }

    await loadShortcuts();
    setIsModalOpen(false);
  };

  const removeShortcut = async (shortcutId: string) => {
    const { error } = await supabase
      .from('home_shortcuts')
      .delete()
      .eq('id', shortcutId);

    if (error) {
      console.error('Error removing shortcut:', error);
      return;
    }

    await loadShortcuts();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newShortcuts = [...shortcuts];
    const [draggedItem] = newShortcuts.splice(draggedIndex, 1);
    newShortcuts.splice(dropIndex, 0, draggedItem);

    setShortcuts(newShortcuts);

    const updates = newShortcuts.map((shortcut, index) => ({
      id: shortcut.id,
      position: index
    }));

    for (const update of updates) {
      await supabase
        .from('home_shortcuts')
        .update({ position: update.position })
        .eq('id', update.id);
    }

    setDraggedIndex(null);
  };

  const createArticle = async (articleData: {
    title: string;
    description: string;
    icon: string;
    color: string;
    url: string | null;
  }) => {
    const { error } = await supabase
      .from('articles')
      .insert(articleData);

    if (error) {
      console.error('Error creating article:', error);
      return;
    }

    await loadArticles();
  };

  const existingShortcutIds = new Set(shortcuts.map(s => s.article_id));

  if (showCatalogPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Каталог статей</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Создать статью
              </button>
              <button
                onClick={() => setShowCatalogPage(false)}
                className="px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium text-gray-700 hover:scale-105"
              >
                На главную
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allArticles.map((article) => {
              const IconComponent = (Icons[article.icon as keyof typeof Icons] || Icons.FileText) as LucideIcon;
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="rounded-2xl p-3 flex-shrink-0"
                      style={{ backgroundColor: `${article.color}15` }}
                    >
                      <IconComponent size={32} style={{ color: article.color }} />
                    </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {article.description}
                    </p>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Открыть
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        <CreateArticleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateArticle={createArticle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowCatalogPage(true)}
            className="px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium text-gray-700 hover:scale-105"
          >
            Все статьи
          </button>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-xl px-6 py-4 flex items-center gap-4">
            <Search size={24} className="text-gray-400" />
            <input
              type="text"
              placeholder="Найти в интернете"
              className="flex-1 bg-transparent outline-none text-lg text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8">
            {shortcuts.map((shortcut, index) => (
              <div
                key={shortcut.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <ShortcutIcon
                  title={shortcut.article.title}
                  icon={shortcut.article.icon}
                  color={shortcut.article.color}
                  url={shortcut.article.url}
                  onRemove={() => removeShortcut(shortcut.id)}
                  isDragging={draggedIndex === index}
                />
              </div>
            ))}

            <AddShortcutButton onClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      </div>

      <ArticleCatalogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articles={allArticles}
        onSelectArticle={addShortcut}
        existingShortcutIds={existingShortcutIds}
      />
    </div>
  );
}
