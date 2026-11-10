import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId, filesToDiaryImages } from '@/lib/image-utils';
import {
  MOCK_MEMOIRS,
  type IMemoirRecord,
  type IDiaryImage,
} from '@/data/diary';

const STAGE_LABELS: Record<string, string> = {
  childhood: '童年',
  youth: '青年',
  middle: '中年',
  oldage: '老年',
};

const STAGE_COLORS: Record<string, string> = {
  childhood: 'bg-pink-100 text-pink-700 border-pink-200',
  youth: 'bg-green-100 text-green-700 border-green-200',
  middle: 'bg-amber-100 text-amber-700 border-amber-200',
  oldage: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function MemoirsPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_memoirs',
    MOCK_MEMOIRS
  );
  const [activeStage, setActiveStage] = useState<string>('all');
  const [activeType, setActiveType] = useState<'all' | 'memory' | 'imagination'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IMemoirRecord | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    stage: 'childhood' as IMemoirRecord['stage'],
    type: 'memory' as IMemoirRecord['type'],
    date: new Date().toISOString().slice(0, 10),
    content: '',
    images: [] as IDiaryImage[],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeStage !== 'all' && item.stage !== activeStage) return false;
      if (activeType !== 'all' && item.type !== activeType) return false;
      return true;
    });
  }, [items, activeStage, activeType]);

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      title: '',
      stage: 'childhood',
      type: 'memory',
      date: new Date().toISOString().slice(0, 10),
      content: '',
      images: [],
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IMemoirRecord) {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      stage: record.stage,
      type: record.type,
      date: record.date,
      content: record.content,
      images: record.images,
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      toast.error('请填写标题');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('请写点内容吧');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: IMemoirRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('记录成功啦 ✨');
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
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
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
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
              回忆录与畅想 📖
            </h1>
            <p className="text-muted-foreground text-sm">
              记录那些温暖的回忆，也写下对未来的畅想
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="size-4" />
            写一篇
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <Tabs defaultValue="all" value={activeStage} onValueChange={setActiveStage}>
            <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50">
              <TabsTrigger value="all" className="text-sm">全部</TabsTrigger>
              <TabsTrigger value="childhood" className="text-sm">童年</TabsTrigger>
              <TabsTrigger value="youth" className="text-sm">青年</TabsTrigger>
              <TabsTrigger value="middle" className="text-sm">中年</TabsTrigger>
              <TabsTrigger value="oldage" className="text-sm">老年</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant={activeType === 'all' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveType('all')}
              className="gap-1.5"
            >
              <BookOpen className="size-4" />
              全部
            </Button>
            <Button
              variant={activeType === 'memory' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveType('memory')}
              className="gap-1.5"
            >
              📝 回忆
            </Button>
            <Button
              variant={activeType === 'imagination' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveType('imagination')}
              className="gap-1.5"
            >
              <Sparkles className="size-4" />
              畅想
            </Button>
          </div>
        </div>

        {/* Records Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">还没有记录哦</p>
            <Button onClick={openAddDialog} variant="secondary" className="gap-2">
              <Plus className="size-4" />
              写下第一篇回忆
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Card className="h-full overflow-hidden border border-border/40 hover:shadow-md transition-shadow">
                  {record.images.length > 0 && (
                    <div
                      className="aspect-video w-full overflow-hidden cursor-pointer relative"
                      onClick={() => setPreviewImage(record.images[0].dataUrl)}
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
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${STAGE_COLORS[record.stage]}`}
                        >
                          {STAGE_LABELS[record.stage]}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {record.type === 'memory' ? '回忆' : '畅想'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => openEditDialog(record)}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{record.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {record.content}
                    </p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
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
              {editingRecord ? '编辑记录' : '写一篇新记录'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>标题</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="给这篇记录起个名字吧"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>人生阶段</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(val) =>
                    setFormData({ ...formData, stage: val as IMemoirRecord['stage'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="childhood">童年</SelectItem>
                    <SelectItem value="youth">青年</SelectItem>
                    <SelectItem value="middle">中年</SelectItem>
                    <SelectItem value="oldage">老年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val as IMemoirRecord['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="memory">回忆</SelectItem>
                    <SelectItem value="imagination">畅想</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              <Label>内容</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="写下你的回忆或畅想..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>图片（可选）</Label>
              <div>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <ImageIcon className="size-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">点击上传图片</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
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
