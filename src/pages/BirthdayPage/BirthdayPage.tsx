import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Gift, Image as ImageIcon, X, Grid3X3, List, ArrowLeft } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId, filesToDiaryImages } from '@/lib/image-utils';
import { MOCK_BIRTHDAYS, type IBirthdayRecord, type IDiaryImage } from '@/data/diary';

export default function BirthdayPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_birthday',
    MOCK_BIRTHDAYS
  );
  const [viewMode, setViewMode] = useState<'list' | 'photo'>('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IBirthdayRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    age: 22,
    giftName: '',
    giver: '',
    photo: undefined as IDiaryImage | undefined,
    description: '',
  });

  // 按年份分组、降序
  const groupedByYear = useMemo(() => {
    const groups: Record<number, IBirthdayRecord[]> = {};
    items.forEach((item) => {
      if (!groups[item.year]) groups[item.year] = [];
      groups[item.year].push(item);
    });
    // 每年内排序
    Object.keys(groups).forEach((year) => {
      groups[Number(year)].sort((a, b) => a.giver.localeCompare(b.giver));
    });
    return groups;
  }, [items]);

  const years = useMemo(
    () => Object.keys(groupedByYear).map(Number).sort((a, b) => b - a),
    [groupedByYear]
  );

  // 所有有照片的礼物（照片墙用）
  const photoGifts = useMemo(
    () => items.filter((i) => i.photo).sort((a, b) => b.year - a.year),
    [items]
  );

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      year: new Date().getFullYear(),
      age: 22,
      giftName: '',
      giver: '',
      photo: undefined,
      description: '',
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IBirthdayRecord) {
    setEditingRecord(record);
    setFormData({
      year: record.year,
      age: record.age,
      giftName: record.giftName,
      giver: record.giver,
      photo: record.photo,
      description: record.description || '',
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.giftName.trim()) {
      toast.error('礼物叫什么名字？');
      return;
    }
    if (!formData.giver.trim()) {
      toast.error('是谁送的呀？');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, formData);
      toast.success('已更新~');
    } else {
      const newRecord: IBirthdayRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('生日礼物 +1 🎁');
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const images = await filesToDiaryImages(files);
    if (images.length > 0) {
      setFormData((prev) => ({ ...prev, photo: images[0] }));
    }
  }

  function removePhoto() {
    setFormData((prev) => ({ ...prev, photo: undefined }));
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
              生日礼物收藏 🎁
            </h1>
            <p className="text-muted-foreground text-sm">
              每一份礼物都是爱的证明
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setViewMode(viewMode === 'list' ? 'photo' : 'list')}
            >
              {viewMode === 'list' ? <Grid3X3 className="size-4" /> : <List className="size-4" />}
            </Button>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="size-4" />
              添加礼物
            </Button>
          </div>
        </div>

        {/* Timeline / List View */}
        {viewMode === 'list' && (
          <div className="space-y-8">
            {years.length === 0 ? (
              <div className="py-20 text-center">
                <div className="size-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
                  <Gift className="size-8 text-pink-500" />
                </div>
                <p className="text-muted-foreground mb-4">还没有生日礼物记录哦</p>
                <Button onClick={openAddDialog} variant="secondary" className="gap-2">
                  <Plus className="size-4" />
                  添加第一个礼物
                </Button>
              </div>
            ) : (
              years.map((year, yearIdx) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: yearIdx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                      {year}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{year} 年</h3>
                      <p className="text-xs text-muted-foreground">
                        {groupedByYear[year].length} 份礼物
                      </p>
                    </div>
                  </div>

                  <div className="pl-5 border-l-2 border-pink-200 space-y-4">
                    {groupedByYear[year].map((gift, i) => (
                      <motion.div
                        key={gift.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="relative"
                      >
                        {/* Dot on timeline */}
                        <div className="absolute -left-[26px] top-5 size-3 rounded-full bg-pink-400 border-2 border-background" />

                        <Card className="border border-border/40 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {gift.photo ? (
                                <div
                                  className="size-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                                  onClick={() => setPreviewImage(gift.photo!.dataUrl)}
                                >
                                  <Image
                                    src={gift.photo.dataUrl}
                                    alt={gift.giftName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="size-20 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                                  <Gift className="size-8 text-pink-300" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-foreground">
                                    {gift.giftName}
                                  </h4>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="size-7"
                                      onClick={() => openEditDialog(gift)}
                                    >
                                      <Edit2 className="size-3.5" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="size-7 text-destructive"
                                      onClick={() => handleDelete(gift.id)}
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {gift.age} 岁
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    来自 {gift.giver}
                                  </span>
                                </div>
                                {gift.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {gift.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Photo Wall View */}
        {viewMode === 'photo' && (
          <div>
            {photoGifts.length === 0 ? (
              <div className="py-20 text-center">
                <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">还没有带照片的礼物哦</p>
                <Button onClick={openAddDialog} variant="secondary" className="gap-2">
                  <Plus className="size-4" />
                  添加礼物照片
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {photoGifts.map((gift, i) => (
                  <motion.div
                    key={gift.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="relative group cursor-pointer"
                    onClick={() => gift.photo && setPreviewImage(gift.photo.dataUrl)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      {gift.photo && (
                        <Image
                          src={gift.photo.dataUrl}
                          alt={gift.giftName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end p-3">
                      <div className="text-white text-xs">
                        <p className="font-medium truncate">{gift.giftName}</p>
                        <p className="opacity-80">{gift.year}年 · {gift.giver}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
              {editingRecord ? '编辑礼物' : '添加生日礼物'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>年份</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>年龄</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>来自</Label>
                <Input
                  value={formData.giver}
                  onChange={(e) => setFormData({ ...formData, giver: e.target.value })}
                  placeholder="自己 / 朋友名"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>礼物名称</Label>
              <Input
                value={formData.giftName}
                onChange={(e) => setFormData({ ...formData, giftName: e.target.value })}
                placeholder="例：拍立得相机"
              />
            </div>

            <div className="space-y-2">
              <Label>照片（可选）</Label>
              {formData.photo ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  <Image src={formData.photo.dataUrl} alt="" className="w-full h-full object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="!absolute top-2 right-2 z-10"
                    onClick={removePhoto}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <ImageIcon className="size-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">点击上传礼物照片</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label>描述 / 纪念意义（可选）</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="这个礼物有什么特别的意义吗？"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '添加礼物'}
            </Button>
          </DialogFooter>
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
