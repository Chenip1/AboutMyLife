import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Heart, Check, Star, ArrowLeft } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId } from '@/lib/image-utils';
import { MOCK_DESIRES, type IDesireRecord } from '@/data/diary';

const CATEGORY_LABELS: Record<string, string> = {
  past: '以前想要的',
  present: '现在想要的',
  future: '未来想要的',
};

const CATEGORY_COLORS: Record<string, string> = {
  past: 'from-purple-100 to-purple-50',
  present: 'from-rose-100 to-rose-50',
  future: 'from-blue-100 to-blue-50',
};

export default function DesirePage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_desire',
    MOCK_DESIRES
  );
  const [activeCategory, setActiveCategory] = useState<string>('present');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IDesireRecord | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    category: 'present' as IDesireRecord['category'],
    priority: 3,
    achieved: false,
    note: '',
  });

  const filteredItems = useMemo(
    () => items.filter((item) => item.category === activeCategory),
    [items, activeCategory]
  );

  const achievedItems = useMemo(
    () => filteredItems.filter((i) => i.achieved),
    [filteredItems]
  );
  const pendingItems = useMemo(
    () => filteredItems.filter((i) => !i.achieved),
    [filteredItems]
  );

  const stats = useMemo(() => {
    return {
      total: items.length,
      achieved: items.filter((i) => i.achieved).length,
    };
  }, [items]);

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      content: '',
      category: (activeCategory as IDesireRecord['category']) || 'present',
      priority: 3,
      achieved: false,
      note: '',
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IDesireRecord) {
    setEditingRecord(record);
    setFormData({
      content: record.content,
      category: record.category,
      priority: record.priority || 3,
      achieved: record.achieved,
      note: record.note || '',
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.content.trim()) {
      toast.error('你想要什么呢？');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, formData);
      toast.success('已更新~');
    } else {
      const newRecord: IDesireRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('欲望清单 +1 💕');
    }
    setDialogOpen(false);
  }

  function toggleAchieved(id: string) {
    const record = items.find((i) => i.id === id);
    if (!record) return;
    const newAchieved = !record.achieved;
    updateItem(id, {
      achieved: newAchieved,
      achievedAt: newAchieved ? new Date().toISOString().slice(0, 10) : undefined,
    });
    if (newAchieved) {
      toast.success('恭喜实现啦！🎉');
    }
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
  }

  function renderStars(priority?: number) {
    const count = priority || 3;
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
          />
        ))}
      </div>
    );
  }

  function renderItemList(list: IDesireRecord[], achieved: boolean) {
    if (list.length === 0) return null;
    return (
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground px-1">
          {achieved ? `已实现 (${list.length})` : `想要中 (${list.length})`}
        </p>
        {list.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Card
              className={`border border-border/40 overflow-hidden ${achieved ? 'bg-muted/30' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Button
                    size="icon"
                    variant={achieved ? 'default' : 'outline'}
                    className={`size-6 shrink-0 rounded-full ${achieved ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={() => toggleAchieved(item.id)}
                  >
                    <Check className="size-3.5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium mb-1 ${achieved ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    >
                      {item.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {renderStars(item.priority)}
                      {item.note && <span className="truncate">{item.note}</span>}
                      {achieved && item.achievedAt && <span>{item.achievedAt}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => openEditDialog(item)}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
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
              欲望清单 💕
            </h1>
            <p className="text-muted-foreground text-sm">
              想要的东西都记下来，一个个去实现
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{stats.achieved}/{stats.total}</p>
              <p className="text-xs text-muted-foreground">已实现</p>
            </div>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="size-4" />
              添加
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          defaultValue="present"
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="past">以前想要的</TabsTrigger>
            <TabsTrigger value="present">现在想要的</TabsTrigger>
            <TabsTrigger value="future">未来想要的</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Heart className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              这里还空着呢，有什么{CATEGORY_LABELS[activeCategory]}？
            </p>
            <Button onClick={openAddDialog} variant="secondary" className="gap-2">
              <Plus className="size-4" />
              添加第一个
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {renderItemList(pendingItems, false)}
            {renderItemList(achievedItems, true)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              {editingRecord ? '编辑愿望' : '添加愿望'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>想要什么</Label>
              <Input
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="写下你想要的东西..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>分类</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val as IDesireRecord['category'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="past">以前想要的</SelectItem>
                    <SelectItem value="present">现在想要的</SelectItem>
                    <SelectItem value="future">未来想要的</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>想要程度</Label>
                <div className="flex items-center gap-1 h-10 px-3 border border-input rounded-md">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: n })}
                      className="p-1"
                    >
                      <Star
                        className={`size-5 ${n <= (formData.priority || 3) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>备注（可选）</Label>
              <Textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="为什么想要它？有什么故事吗？"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="achieved"
                checked={formData.achieved}
                onChange={(e) => setFormData({ ...formData, achieved: e.target.checked })}
                className="size-4 rounded border-input"
              />
              <Label htmlFor="achieved" className="cursor-pointer">
                已经实现啦
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '添加愿望'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
