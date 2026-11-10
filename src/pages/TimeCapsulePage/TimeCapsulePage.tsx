import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Lock, Unlock, Mail, HelpCircle, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDiaryStore } from '@/hooks/use-diary-store';
import { generateId } from '@/lib/image-utils';
import { MOCK_TIME_CAPSULES, type ITimeCapsuleRecord } from '@/data/diary';

const UNLOCK_OPTIONS = [
  { label: '1 年后', value: '1y', days: 365 },
  { label: '3 年后', value: '3y', days: 365 * 3 },
  { label: '5 年后', value: '5y', days: 365 * 5 },
  { label: '10 年后', value: '10y', days: 365 * 10 },
  { label: '自定义日期', value: 'custom', days: 0 },
];

export default function TimeCapsulePage() {
  const { items, addItem, updateItem } = useDiaryStore(
    '__app_diary_timeCapsule',
    MOCK_TIME_CAPSULES
  );
  const [activeTab, setActiveTab] = useState('write');
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);
  const [viewingCapsule, setViewingCapsule] = useState<ITimeCapsuleRecord | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [formData, setFormData] = useState({
    type: 'letter' as 'letter' | 'question',
    content: '',
    unlockOption: '1y',
    customDate: '',
  });

  // 计算解锁状态（根据当前时间判断）
  const capsulesWithUnlockStatus = useMemo(() => {
    const now = Date.now();
    return items.map((c) => ({
      ...c,
      isUnlocked: c.unlockAt <= now,
    }));
  }, [items]);

  const unlockedCapsules = useMemo(
    () => capsulesWithUnlockStatus.filter((c) => c.isUnlocked),
    [capsulesWithUnlockStatus]
  );
  const sealedCapsules = useMemo(
    () => capsulesWithUnlockStatus.filter((c) => !c.isUnlocked),
    [capsulesWithUnlockStatus]
  );

  function openWriteDialog() {
    setFormData({
      type: 'letter',
      content: '',
      unlockOption: '1y',
      customDate: '',
    });
    setWriteDialogOpen(true);
  }

  function handleSubmit() {
    if (!formData.content.trim()) {
      toast.error('写点什么给未来的自己吧~');
      return;
    }

    let unlockAt: number;
    if (formData.unlockOption === 'custom') {
      if (!formData.customDate) {
        toast.error('请选择解锁日期');
        return;
      }
      unlockAt = new Date(formData.customDate).getTime();
    } else {
      const option = UNLOCK_OPTIONS.find((o) => o.value === formData.unlockOption);
      unlockAt = Date.now() + (option?.days || 365) * 24 * 60 * 60 * 1000;
    }

    if (unlockAt <= Date.now()) {
      toast.error('解锁时间要在未来哦~');
      return;
    }

    const newCapsule: ITimeCapsuleRecord = {
      id: generateId(),
      type: formData.type,
      content: formData.content,
      createdAt: Date.now(),
      unlockAt,
      isUnlocked: false,
    };
    addItem(newCapsule);
    toast.success('时间胶囊已封存 💌');
    setWriteDialogOpen(false);
  }

  function openCapsule(capsule: ITimeCapsuleRecord) {
    if (!capsule.isUnlocked) {
      toast.info('还没到解锁时间哦，再等等吧~');
      return;
    }
    setViewingCapsule(capsule);
  }

  function openReplyDialog() {
    if (!viewingCapsule) return;
    setReplyContent(viewingCapsule.reply || '');
    setReplyDialogOpen(true);
  }

  function handleReplySubmit() {
    if (!viewingCapsule) return;
    if (!replyContent.trim()) {
      toast.error('写点回信内容吧~');
      return;
    }
    updateItem(viewingCapsule.id, {
      reply: replyContent,
      repliedAt: Date.now(),
    });
    setViewingCapsule({ ...viewingCapsule, reply: replyContent, repliedAt: Date.now() });
    toast.success('回信已保存 ✨');
    setReplyDialogOpen(false);
  }

  function formatUnlockDate(timestamp: number): string {
    return format(new Date(timestamp), 'yyyy年M月d日', { locale: zhCN });
  }

  function getDaysRemaining(unlockAt: number): number {
    return Math.max(0, differenceInDays(new Date(unlockAt), new Date()));
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
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            时间胶囊 💌
          </h1>
          <p className="text-muted-foreground text-sm">
            给未来的自己写一封信，在某个特别的日子打开
          </p>
        </div>

        <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="write" className="gap-2">
              <Send className="size-4" />
              写给未来
            </TabsTrigger>
            <TabsTrigger value="open" className="gap-2">
              <Unlock className="size-4" />
              打开过去的信
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 写给未来 Tab */}
        {activeTab === 'write' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-dashed border-border/60 bg-gradient-to-br from-amber-50/50 to-transparent">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="size-16 md:size-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <Mail className="size-8 md:size-10 text-amber-600" />
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
                  >
                    写一封信给未来的自己
                  </h2>
                  <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                    把现在的心情、想说的话、想问的问题封进时间胶囊，
                    在未来的某一天打开，看看当时的自己
                  </p>
                  <Button onClick={openWriteDialog} size="lg" className="gap-2">
                    <Plus className="size-5" />
                    开始写信
                  </Button>
                </CardContent>
              </Card>

              {/* 密封中的胶囊 */}
              {sealedCapsules.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="size-4 text-muted-foreground" />
                    密封中 ({sealedCapsules.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sealedCapsules.map((capsule, i) => (
                      <motion.div
                        key={capsule.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Card className="border border-border/40 bg-amber-50/30">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="size-14 rounded-xl bg-amber-200/60 flex items-center justify-center shrink-0">
                                <Lock className="size-6 text-amber-700" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {capsule.type === 'letter' ? '一封信' : '一个问题'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {formatUnlockDate(capsule.unlockAt)} 解锁
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-amber-700">
                                  <Clock className="size-3.5" />
                                  <span>还有 {getDaysRemaining(capsule.unlockAt)} 天</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* 打开过去的信 Tab */}
        {activeTab === 'open' && (
          <AnimatePresence mode="wait">
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {unlockedCapsules.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <HelpCircle className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">还没有已解锁的时间胶囊</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    去写一封给未来的信吧，时间到了就能打开啦~
                  </p>
                  <Button onClick={() => setActiveTab('write')} variant="secondary" className="gap-2">
                    <Send className="size-4" />
                    去写信
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {unlockedCapsules.map((capsule, i) => (
                    <motion.div
                      key={capsule.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Card
                        className="border border-border/40 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => openCapsule(capsule)}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="size-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                              <Unlock className="size-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  已解锁
                                </Badge>
                                {capsule.type === 'letter' ? (
                                  <Badge variant="secondary" className="text-xs">一封信</Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">一个问题</Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                                {capsule.content}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(capsule.createdAt), 'yyyy年M月d日', { locale: zhCN })}{' '}
                                封存
                              </p>
                              {capsule.reply && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                                  <MessageCircle className="size-3.5" />
                                  <span>已回复</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {sealedCapsules.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="size-4 text-muted-foreground" />
                    等待解锁 ({sealedCapsules.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sealedCapsules.map((capsule, i) => (
                      <motion.div
                        key={capsule.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Card className="border border-border/40 bg-muted/30 opacity-80">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="size-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                <Lock className="size-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {formatUnlockDate(capsule.unlockAt)} 解锁
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  还有 {getDaysRemaining(capsule.unlockAt)} 天
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Write Dialog */}
      <Dialog open={writeDialogOpen} onOpenChange={setWriteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              给未来的自己写封信 ✉️
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>类型</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val as 'letter' | 'question' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">一封信</SelectItem>
                  <SelectItem value="question">一个问题</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{formData.type === 'letter' ? '信件内容' : '你的问题'}</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={formData.type === 'letter' ? '亲爱的未来的我...' : '我想问未来的自己...'}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>解锁时间</Label>
              <Select
                value={formData.unlockOption}
                onValueChange={(val) => setFormData({ ...formData, unlockOption: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNLOCK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.unlockOption === 'custom' && (
                <Input
                  type="date"
                  value={formData.customDate}
                  onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setWriteDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Lock className="size-4" />
              封存胶囊
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Capsule Dialog */}
      <Dialog open={!!viewingCapsule} onOpenChange={(open) => !open && setViewingCapsule(null)}>
        <DialogContent className="max-w-lg">
          {viewingCapsule && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
                  {viewingCapsule.type === 'letter' ? '来自过去的一封信 💌' : '来自过去的一个问题 ❓'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(viewingCapsule.createdAt), 'yyyy年M月d日', { locale: zhCN })} 封存 ·{' '}
                  {format(new Date(viewingCapsule.unlockAt), 'yyyy年M月d日', { locale: zhCN })} 解锁
                </p>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                    {viewingCapsule.content}
                  </p>
                </div>

                {viewingCapsule.reply ? (
                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                      <MessageCircle className="size-3.5" />
                      现在的我的回答
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                      {viewingCapsule.reply}
                    </p>
                    {viewingCapsule.repliedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(viewingCapsule.repliedAt), 'yyyy年M月d日', { locale: zhCN })}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      要不要回复一下过去的自己呢？
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setViewingCapsule(null)}>
                  关闭
                </Button>
                <Button onClick={openReplyDialog} className="gap-2">
                  <MessageCircle className="size-4" />
                  {viewingCapsule.reply ? '修改回信' : '写回信'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}>
              给过去的自己写回信
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="亲爱的过去的我..."
              rows={6}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setReplyDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleReplySubmit}>保存回信</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
