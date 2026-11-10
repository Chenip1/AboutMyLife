import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Sparkles, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { MOCK_FIRSTS, type IFirstRecord, type IDiaryImage } from '@/data/diary';

export default function FirstsPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_firsts',
    MOCK_FIRSTS
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IFirstRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<IFirstRecord | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    feeling: '',
    images: [] as IDiaryImage[],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sortedRecords = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      feeling: '',
      images: [],
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IFirstRecord) {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      date: record.date,
      feeling: record.feeling,
      images: record.images,
    });
    setViewingRecord(null);
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      toast.error('这是什么第一次呢？');
      return;
    }
    if (!formData.feeling.trim()) {
      toast.error('记录一下当时的感受吧~');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: IFirstRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('又收藏了一个第一次！✨');
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
              第一次收藏馆 ✨
            </h1>
            <p className="text-muted-foreground text-sm">
              收藏人生中每一个珍贵的「第一次」
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              共 {items.length} 个第一次
            </Badge>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="size-4" />
              添加
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {sortedRecords.length === 0 ? (
          <div className="py-20 text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Sparkles className="size-10 text-purple-500" />
            </div>
            <p className="text-muted-foreground mb-4">还没有收藏「第一次」哦</p>
            <p className="text-sm text-muted-foreground mb-6">
              人生中有太多珍贵的第一次，都记录下来吧~
            </p>
            <Button onClick={openAddDialog} variant="secondary" className="gap-2">
              <Plus className="size-4" />
              收藏第一个
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRecords.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card
                  className="h-full overflow-hidden border border-border/40 hover:shadow-lg transition-all cursor-pointer bg-card"
                  onClick={() => setViewingRecord(record)}
                >
                  {/* Image area - polaroid style */}
                  <div className="p-3 pb-0 bg-gradient-to-b from-purple-50/50 to-transparent">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted relative">
                      {record.images.length > 0 ? (
                        <Image
                          src={record.images[0].dataUrl}
                          alt={record.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sparkles className="size-12 text-purple-300" />
                        </div>
                      )}
                      {record.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                          +{record.images.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
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
                    <p className="text-xs text-muted-foreground mb-2">{record.date}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {record.feeling}
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
              {editingRecord ? '编辑' : '收藏一个第一次'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>标题</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例：第一次坐飞机"
              />
            </div>

            <div className="space-y-2">
              <Label>日期</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>当时的感受</Label>
              <Textarea
                value={formData.feeling}
                onChange={(e) => setFormData({ ...formData, feeling: e.target.value })}
                placeholder="描述一下当时的心情和感受..."
                rows={4}
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
              {editingRecord ? '保存修改' : '收藏'}
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
                <p className="text-sm text-muted-foreground">{viewingRecord.date}</p>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {viewingRecord.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {viewingRecord.images.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setPreviewImage(img.dataUrl)}
                      >
                        <Image src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm font-medium text-purple-700 mb-2">💫 当时的感受</p>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {viewingRecord.feeling}
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
