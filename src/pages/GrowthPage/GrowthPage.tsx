import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, TreePine, User, Pencil, ArrowLeft } from 'lucide-react';
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
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';
import { MOCK_GROWTHS, type IGrowthRecord } from '@/data/diary';
import { useEffect } from 'react';

const TAG_OPTIONS = ['认知突破', '环境变化', '技能获得', '重要决定', '人际关系', '其他'];

const TAG_COLORS: Record<string, string> = {
  '认知突破': 'bg-purple-100 text-purple-700 border-purple-200',
  '环境变化': 'bg-blue-100 text-blue-700 border-blue-200',
  '技能获得': 'bg-green-100 text-green-700 border-green-200',
  '重要决定': 'bg-amber-100 text-amber-700 border-amber-200',
  '人际关系': 'bg-pink-100 text-pink-700 border-pink-200',
  '其他': 'bg-muted text-muted-foreground border-border',
};

export default function GrowthPage() {
  const { items, addItem, updateItem, deleteItem } = useDiaryStore(
    '__app_diary_growth',
    MOCK_GROWTHS
  );
  const [selfSummary, setSelfSummary] = useState('我是一个热爱生活、对世界充满好奇心的人。');
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IGrowthRecord | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    tag: '认知突破',
  });

  useEffect(() => {
    const stored = scopedStorage.getItem('__app_diary_selfSummary');
    if (stored) setSelfSummary(stored);
  }, []);

  // 按日期正序排列（时间线）
  const sortedRecords = [...items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  function startEditSummary() {
    setSummaryDraft(selfSummary);
    setEditingSummary(true);
  }

  function saveSummary() {
    setSelfSummary(summaryDraft);
    scopedStorage.setItem('__app_diary_selfSummary', summaryDraft);
    setEditingSummary(false);
    toast.success('已保存~');
  }

  function openAddDialog() {
    setEditingRecord(null);
    setFormData({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      tag: '认知突破',
    });
    setDialogOpen(true);
  }

  function openEditDialog(record: IGrowthRecord) {
    setEditingRecord(record);
    setFormData({
      title: record.title,
      date: record.date,
      description: record.description,
      tag: record.tag || '其他',
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      toast.error('请填写标题');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('写点描述吧');
      return;
    }

    if (editingRecord) {
      updateItem(editingRecord.id, {
        ...formData,
        updatedAt: Date.now(),
      });
      toast.success('已更新~');
    } else {
      const newRecord: IGrowthRecord = {
        id: generateId(),
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addItem(newRecord);
      toast.success('成长节点 +1 🌱');
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteItem(id);
    toast.success('已删除');
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
              成长史 🌳
            </h1>
            <p className="text-muted-foreground text-sm">
              记录成长路上的每一个重要节点
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="size-4" />
            添加节点
          </Button>
        </div>

        {/* Self Summary Card */}
        <Card className="mb-10 border border-border/40 bg-gradient-to-br from-green-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <User className="size-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-0.5">我是一个什么样的人</h3>
                <p className="text-xs text-muted-foreground">一句话总结自己</p>
              </div>
              {!editingSummary && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  onClick={startEditSummary}
                >
                  <Pencil className="size-3.5" />
                  编辑
                </Button>
              )}
            </div>
            {editingSummary ? (
              <div className="space-y-3">
                <Textarea
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  rows={3}
                  placeholder="用一句话描述你自己..."
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setEditingSummary(false)}>
                    取消
                  </Button>
                  <Button size="sm" onClick={saveSummary}>保存</Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed pl-13 ml-13" style={{ marginLeft: '52px' }}>
                {selfSummary}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-border" />

          {sortedRecords.length === 0 ? (
            <div className="py-16 text-center pl-10">
              <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <TreePine className="size-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">还没有成长节点哦</p>
              <Button onClick={openAddDialog} variant="secondary" className="gap-2">
                <Plus className="size-4" />
                添加第一个节点
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedRecords.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative pl-12 md:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1.5 md:left-3.5 top-5 size-5 rounded-full bg-green-400 border-4 border-background shadow-sm" />

                  <Card className="border border-border/40 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {record.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${TAG_COLORS[record.tag || '其他'] || TAG_COLORS['其他']}`}
                          >
                            {record.tag}
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
                      <p className="text-xs text-muted-foreground mb-2">{record.date}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {record.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

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
              {editingRecord ? '编辑成长节点' : '添加成长节点'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>标题</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="这个节点发生了什么？"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>日期</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>标签</Label>
                <Select
                  value={formData.tag}
                  onValueChange={(val) => setFormData({ ...formData, tag: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_OPTIONS.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>详细描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述一下这个成长节点..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? '保存修改' : '添加节点'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
