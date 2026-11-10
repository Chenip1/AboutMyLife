import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Home, Image as ImageIcon, X, BookOpen, Sofa, Monitor, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId, filesToDiaryImages } from '@/lib/image-utils';
import { MOCK_LIFE_ALBUMS, type ILifeAlbumRecord, type IDiaryImage } from '@/data/diary';

const CATEGORIES = [
  { value: 'recipe', label: '菜谱', icon: BookOpen, color: 'from-orange-100 to-amber-50' },
  { value: 'room', label: '我的房间', icon: Sofa, color: 'from-pink-100 to-rose-50' },
  { value: 'desk', label: '我的书桌', icon: Monitor, color: 'from-blue-100 to-cyan-50' },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  recipe: '菜谱',
  room: '我的房间',
  desk: '我的书桌',
};

export default function LifeAlbumPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_lifeAlbum',
    MOCK_LIFE_ALBUMS
  );
  const [activeCategory, setActiveCategory] = useState<string>('recipe');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ILifeAlbumRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ILifeAlbumRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'recipe' as ILifeAlbumRecord['category'],
    title: '',
    content: '',
    images: [] as IDiaryImage[],
  });

  const filteredItems = useMemo(
    () =>
      items
        .filter((i) => i.category === activeCategory)
        .sort((a, b) => b.createdAt - a.createdAt),
    [items, activeCategory]
  );

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      category: activeCategory as ILifeAlbumRecord['category'],
      title: '',
      content: '',
      images: [],
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: ILifeAlbumRecord) {
    setEditingRecord(record);
    setFormData({
      category: record.category,
      title: record.title,
      content: record.content,
      images: record.images,
    });
    setViewingRecord(null);
    setDialogOpen(true);
  }

  function handleTabChange(val: string) {
    setActiveCategory(val);
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      toast.error('起个名字吧~');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('写点内容吧');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: ILifeAlbumRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('记录成功 🏡');
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
    setViewingRecord(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const images = await filesToDiaryImages(files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...images] }));
  }

  function removeImage(id: string) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="size-4" />
          返回手账本首页
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
            >
              生活图鉴 🏡
            </h1>
            <p className="text-muted-foreground text-sm">
              记录生活中的烟火气和小美好
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="size-4" />
            添加记录
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs
          defaultValue="recipe"
          value={activeCategory}
          onValueChange={handleTabChange}
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.value} value={cat.value} className="gap-1.5">
                  <Icon className="size-4" />
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Home className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              还没有{CATEGORY_LABELS[activeCategory]}记录哦
            </p>
            <Button onClick={openAddDialog} variant="secondary" className="gap-2">
              <Plus className="size-4" />
              添加第一条
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Card
                  className="h-full overflow-hidden border border-border/40 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setViewingRecord(record)}
                >
                  {record.images.length > 0 && (
                    <div
                      className="aspect-video w-full overflow-hidden relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(record.images[0].dataUrl);
                      }}
                    >
                      <Image
                        src={record.images[0].dataUrl}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                      {record.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                          +{record.images.length - 1}
                        </div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{record.title}</h3>
                      <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(record);
                          }}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {CATEGORY_LABELS[record.category]}
                    </Badge>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {record.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Add Button (mobile) */}
        <div className="fixed bottom-6 right-6 md:hidden z-40">
          <Button size="icon" className="size-14 rounded-full shadow-lg" onClick={openAddDialog}>
            <Plus className="size-6" />
          </Button>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              {editingRecord ? '编辑记录' : '添加生活记录'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>分类</Label>
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value })
                      }
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-all ${
                        formData.category === cat.value
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>标题</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={
                  formData.category === 'recipe'
                    ? '例：番茄炒蛋'
                    : formData.category === 'room'
                    ? '例：我的小窝改造'
                    : '例：理想中的书桌'
                }
              />
            </div>

            <div className="space-y-2">
              <Label>内容</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={
                  formData.category === 'recipe'
                    ? '写下食材和步骤...'
                    : '描述一下吧...'
                }
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>照片（可选，支持多张）</Label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <ImageIcon className="size-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">点击上传照片</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-md overflow-hidden">
                      <Image src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="!absolute top-1 right-1 size-6 z-10"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '保存记录'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={!!viewingRecord} onOpenChange={(open) => !open && setViewingRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewingRecord && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {viewingRecord.title}
                </DialogTitle>
                <Badge variant="secondary" className="w-fit">
                  {CATEGORY_LABELS[viewingRecord.category]}
                </Badge>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {viewingRecord.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {viewingRecord.images.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setPreviewImage(img.dataUrl)}
                      >
                        <Image src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {viewingRecord.content}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setViewingRecord(null)}>
                  关闭
                </Button>
                <Button onClick={() => openEditDialog(viewingRecord)} className="gap-2">
                  <Edit2 className="size-4" />
                  编辑
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-2 bg-transparent border-none shadow-none">
          {previewImage && (
            <Image src={previewImage} alt="预览" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
