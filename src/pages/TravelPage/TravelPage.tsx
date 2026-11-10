import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, Calendar, Image as ImageIcon, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
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
import { MOCK_TRAVELS, type ITravelRecord, type IDiaryImage } from '@/data/diary';

export default function TravelPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_travel',
    MOCK_TRAVELS
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ITravelRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<ITravelRecord | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    story: '',
    images: [] as IDiaryImage[],
  });

  const sortedRecords = [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  function openAddDialog() {
    setEditingRecord(null);
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      location: '',
      startDate: today,
      endDate: today,
      story: '',
      images: [],
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: ITravelRecord) {
    setEditingRecord(record);
    setFormData({
      location: record.location,
      startDate: record.startDate,
      endDate: record.endDate,
      story: record.story,
      images: record.images,
    });
    setViewingRecord(null);
    setDialogOpen(true);
  }

  function openDetail(record: ITravelRecord) {
    setViewingRecord(record);
    setCurrentPhotoIndex(0);
  }

  function handleSubmit() {
    if (!formData.location.trim()) {
      toast.error('去哪里旅行了？');
      return;
    }
    if (!formData.story.trim()) {
      toast.error('记录一下旅行的故事吧~');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: ITravelRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('旅行记录 +1 🗺️');
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

  function prevPhoto() {
    if (!viewingRecord) return;
    setCurrentPhotoIndex((i) =>
      i === 0 ? viewingRecord.images.length - 1 : i - 1
    );
  }

  function nextPhoto() {
    if (!viewingRecord) return;
    setCurrentPhotoIndex((i) =>
      i === viewingRecord.images.length - 1 ? 0 : i + 1
    );
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
              旅行记录 🗺️
            </h1>
            <p className="text-muted-foreground text-sm">
              用照片和文字留住旅途中的故事
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              共 {items.length} 次旅行
            </Badge>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="size-4" />
              添加
            </Button>
          </div>
        </div>

        {/* Travel Cards */}
        {sortedRecords.length === 0 ? (
          <div className="py-20 text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
              <MapPin className="size-10 text-cyan-500" />
            </div>
            <p className="text-muted-foreground mb-4">还没有旅行记录哦</p>
            <p className="text-sm text-muted-foreground mb-6">
              去看看世界吧，回来把故事写下来~
            </p>
            <Button onClick={openAddDialog} variant="secondary" className="gap-2">
              <Plus className="size-4" />
              记录第一次旅行
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedRecords.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Card
                  className="overflow-hidden border border-border/40 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openDetail(record)}
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-2/5 relative">
                      <div className="aspect-[4/3] md:aspect-auto md:h-full bg-muted">
                        {record.images.length > 0 ? (
                          <Image
                            src={record.images[0].dataUrl}
                            alt={record.location}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="size-12 text-cyan-200" />
                          </div>
                        )}
                      </div>
                      {record.images.length > 1 && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
                          {record.images.length} 张照片
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="md:w-3/5 p-5 md:p-6 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {record.location}
                        </h3>
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

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <Calendar className="size-4" />
                        <span>
                          {record.startDate} ~ {record.endDate}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
                        {record.story}
                      </p>

                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          点击查看详情 →
                        </Badge>
                      </div>
                    </CardContent>
                  </div>
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
              {editingRecord ? '编辑旅行记录' : '记录一次旅行'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>目的地</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="例：云南 · 大理"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>出发日期</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>返回日期</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>旅行故事</Label>
              <Textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="记录一下这次旅行的故事吧..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>照片（可选，支持多张）</Label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <ImageIcon className="size-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">点击上传旅行照片</span>
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

      {/* Detail Dialog */}
      <Dialog open={!!viewingRecord} onOpenChange={(open) => !open && setViewingRecord(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingRecord && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {viewingRecord.location}
                </DialogTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {viewingRecord.startDate} ~ {viewingRecord.endDate}
                </p>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Photo Gallery */}
                {viewingRecord.images.length > 0 && (
                  <div className="relative rounded-xl overflow-hidden bg-muted">
                    <div
                      className="aspect-video w-full cursor-pointer"
                      onClick={() => setPreviewImage(viewingRecord.images[currentPhotoIndex].dataUrl)}
                    >
                      <Image
                        src={viewingRecord.images[currentPhotoIndex].dataUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {viewingRecord.images.length > 1 && (
                      <>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="!absolute left-3 top-1/2 -translate-y-1/2 rounded-full size-8 z-10"
                          onClick={prevPhoto}
                        >
                          <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="!absolute right-3 top-1/2 -translate-y-1/2 rounded-full size-8 z-10"
                          onClick={nextPhoto}
                        >
                          <ChevronRight className="size-5" />
                        </Button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {viewingRecord.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPhotoIndex(idx)}
                              className={`size-2 rounded-full transition-all ${
                                idx === currentPhotoIndex
                                  ? 'bg-white w-6'
                                  : 'bg-white/50 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Story */}
                <div className="bg-muted/30 rounded-xl p-5">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {viewingRecord.story}
                  </p>
                </div>

                {/* Thumbnails if multiple */}
                {viewingRecord.images.length > 3 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {viewingRecord.images.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`shrink-0 size-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentPhotoIndex
                            ? 'border-primary'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
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
        <DialogContent className="max-w-5xl p-2 bg-transparent border-none shadow-none">
          {previewImage && (
            <Image src={previewImage} alt="预览" className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
