import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CloudSun, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId, filesToDiaryImages } from '@/lib/image-utils';
import { MOCK_MOODS, type IMoodRecord, type MoodType, type IDiaryImage } from '@/data/diary';

const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string; color: string; bgColor: string }[] = [
  { value: 'happy', label: '开心', emoji: '😊', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { value: 'calm', label: '平静', emoji: '😌', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'excited', label: '兴奋', emoji: '🤩', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { value: 'tired', label: '疲惫', emoji: '😴', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  { value: 'sad', label: '难过', emoji: '😢', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { value: 'anxious', label: '焦虑', emoji: '😰', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { value: 'angry', label: '生气', emoji: '😤', color: 'text-red-600', bgColor: 'bg-red-100' },
];

function getMoodInfo(mood: MoodType) {
  return MOOD_OPTIONS.find((m) => m.value === mood) || MOOD_OPTIONS[0];
}

export default function MoodPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore('__app_diary_mood', MOCK_MOODS);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IMoodRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    mood: 'happy' as MoodType,
    content: '',
    images: [] as IDiaryImage[],
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 按日期排序（倒序）
  const sortedRecords = useMemo(
    () => [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [items]
  );

  // 日期 -> record 的 map
  const dateToRecord = useMemo(() => {
    const map = new Map<string, IMoodRecord>();
    items.forEach((r) => map.set(r.date, r));
    return map;
  }, [items]);

  // 本月心情统计
  const monthStats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthRecords = items.filter((r) => {
      const d = new Date(r.date);
      return d >= monthStart && d <= monthEnd;
    });
    const total = monthRecords.length;
    const counts: Record<string, number> = {};
    monthRecords.forEach((r) => {
      counts[r.mood] = (counts[r.mood] || 0) + 1;
    });
    return { total, counts };
  }, [items, currentMonth]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = monthStart.getDay();
    // 前置空格
    const prefix = Array.from({ length: startDay }, (_, i) => null);
    return [...prefix, ...days];
  }, [currentMonth]);

  function prevMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }

  function openAddDialog(date?: string) {
    const d = date || new Date().toISOString().slice(0, 10);
    const existing = dateToRecord.get(d);
    if (existing) {
      openEditDialog(existing);
      return;
    }
    setEditingRecord(null);
    setFormData({
      date: d,
      mood: 'happy',
      content: '',
      images: [],
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IMoodRecord) {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      mood: record.mood,
      content: record.content,
      images: record.images,
    });
    setSelectedDate(record.date);
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.content.trim()) {
      toast.error('写点今天的感受吧~');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: IMoodRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('心情已记录 🌈');
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
    setDialogOpen(false);
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
              心情日记 🌈
            </h1>
            <p className="text-muted-foreground text-sm">
              记录每一天的心情和感受
            </p>
          </div>
          <Button onClick={() => openAddDialog()} className="gap-2">
            <Plus className="size-4" />
            写日记
          </Button>
        </div>

        {/* Stats Bar */}
        <Card className="mb-6 border border-border/40">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">本月心情：</span>
              {monthStats.total === 0 ? (
                <span className="text-sm text-muted-foreground">还没有记录~</span>
              ) : (
                MOOD_OPTIONS.map((mood) => {
                  const count = monthStats.counts[mood.value] || 0;
                  if (count === 0) return null;
                  return (
                    <Badge key={mood.value} variant="secondary" className="gap-1 text-xs">
                      <span>{mood.emoji}</span>
                      {mood.label} {count}天
                    </Badge>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Mode Switch */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'calendar' | 'list')} className="mb-6">
          <TabsList>
            <TabsTrigger value="calendar">日历视图</TabsTrigger>
            <TabsTrigger value="list">列表视图</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <Card className="border border-border/40">
            <CardContent className="p-4 md:p-6">
              {/* Month header */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  ‹
                </Button>
                <h3 className="font-semibold text-foreground">
                  {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
                </h3>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  ›
                </Button>
              </div>

              {/* Weekday labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
                  <div key={d} className="text-center text-xs text-muted-foreground py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} className="aspect-square" />;
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const record = dateToRecord.get(dateStr);
                  const moodInfo = record ? getMoodInfo(record.mood) : null;
                  const todayFlag = isToday(day);

                  return (
                    <button
                      key={dateStr}
                      onClick={() => openAddDialog(dateStr)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative ${
                        moodInfo
                          ? `${moodInfo.bgColor} hover:opacity-80`
                          : 'hover:bg-muted/50'
                      } ${todayFlag ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                    >
                      <span className={moodInfo ? 'text-lg md:text-xl' : 'text-muted-foreground text-xs'}>
                        {moodInfo ? moodInfo.emoji : day.getDate()}
                      </span>
                      {moodInfo && (
                        <span className="text-[10px] text-muted-foreground">
                          {day.getDate()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {sortedRecords.length === 0 ? (
              <div className="py-16 text-center">
                <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <CloudSun className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">还没有日记哦</p>
                <Button onClick={() => openAddDialog()} variant="secondary" className="gap-2">
                  <Plus className="size-4" />
                  写第一篇日记
                </Button>
              </div>
            ) : (
              sortedRecords.map((record, i) => {
                const moodInfo = getMoodInfo(record.mood);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <Card className="border border-border/40 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div
                            className={`size-14 rounded-2xl ${moodInfo.bgColor} flex items-center justify-center shrink-0`}
                          >
                            <span className="text-2xl">{moodInfo.emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${moodInfo.color}`}>
                                  {moodInfo.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {record.date}
                                </span>
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
                            <p className="text-sm text-foreground leading-relaxed mb-3">
                              {record.content}
                            </p>
                            {record.images.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {record.images.slice(0, 4).map((img) => (
                                  <div
                                    key={img.id}
                                    className="size-16 rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => setPreviewImage(img.dataUrl)}
                                  >
                                    <Image
                                      src={img.dataUrl}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Floating Add Button (mobile) */}
        <div className="fixed bottom-6 right-6 md:hidden z-40">
          <Button size="icon" className="size-14 rounded-full shadow-lg" onClick={() => openAddDialog()}>
            <Plus className="size-6" />
          </Button>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              {editingRecord ? '编辑日记' : '写日记'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>日期</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>今天的心情</Label>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: mood.value })}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all ${
                      formData.mood === mood.value
                        ? `${mood.bgColor} ${mood.color} ring-2 ring-offset-1 ring-current`
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <span className="text-base">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>今天的感受</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="写下今天的心情和感受..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>图片（可选）</Label>
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
            {editingRecord && (
              <Button
                variant="ghost"
                className="text-destructive mr-auto"
                onClick={() => handleDelete(editingRecord.id)}
              >
                删除
              </Button>
            )}
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '保存日记'}
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
