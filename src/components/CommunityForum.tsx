import React, { useState, useEffect } from 'react';
import { INITIAL_FORUM_THREADS, ForumThread } from '../data/audioEngineeringData';
import { MessageSquare, ThumbsUp, Plus, Search, Send, CheckCircle2 } from 'lucide-react';

export const CommunityForum: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>(() => {
    try {
      const saved = localStorage.getItem('sonoplastia_forum_threads');
      return saved ? JSON.parse(saved) : INITIAL_FORUM_THREADS;
    } catch {
      return INITIAL_FORUM_THREADS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sonoplastia_forum_threads', JSON.stringify(threads));
    } catch {
      // ignore storage errors
    }
  }, [threads]);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_FORUM_THREADS[0].id);
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);

  // New Thread Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('Engenheiro de Áudio / Técnico');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('Alinhamento & PA');
  const [newEquip, setNewEquip] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');

  // Reply Form State
  const [replyAuthor, setReplyAuthor] = useState<string>('');
  const [replyContent, setReplyContent] = useState<string>('');

  const categories = [
    'Todos',
    'Alinhamento & PA',
    'Consoles Digitais',
    'Conserto & Bancada',
    'RF & In-Ear',
    'Acústica Aplicada',
  ];

  const filteredThreads = threads.filter((t) => {
    const matchesCat = selectedCategory === 'Todos' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.equipmentTags.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || filteredThreads[0] || threads[0];

  const handleUpvote = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: ForumThread = {
      id: `th-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Membro Sonoplastia de Elite',
      authorRole: newRole.trim() || 'Profissional de Áudio',
      category: newCategory,
      createdAt: 'Agora mesmo',
      upvotes: 1,
      solved: false,
      equipmentTags: newEquip.trim() || 'Áudio Profissional',
      content: newContent.trim(),
      replies: [],
    };

    setThreads((prev) => [created, ...prev]);
    setActiveThreadId(created.id);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewEquip('');
    setNewContent('');
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThread) return;

    const newReply = {
      id: `rep-${Date.now()}`,
      author: replyAuthor.trim() || 'Técnico Colaborador',
      authorRole: 'Engenheiro de Som · Comunidade',
      createdAt: 'Agora mesmo',
      content: replyContent.trim(),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id ? { ...t, replies: [...t.replies, newReply] } : t
      )
    );
    setReplyContent('');
  };

  return (
    <section className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono text-amber-400 mb-1">
            Comunidade Técnica de Engenheiros de FOH, Monitor, RF e Eletrônica
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Fórum de Troca de Experiências e Relatos de Campo
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowNewThreadModal((prev) => !prev)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 whitespace-nowrap min-h-[44px]"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {showNewThreadModal ? 'Fechar Formulário' : 'Novo Tópico ou Caso Técnico'}
        </button>
      </div>

      {/* Collapsible New Thread Form */}
      {showNewThreadModal && (
        <form
          onSubmit={handleCreateThread}
          className="bg-slate-900 border border-amber-500/50 rounded-2xl p-5 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-100">
            Publicar Novo Relato de Show, Dúvida de Alinhamento ou Caso de Conserto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Seu Nome</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Ex: Carlos Mendes"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Sua Especialidade / Cidade</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Ex: Técnico de PA · Salvador, BA"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Categoria Técnica</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ForumThread['category'])}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              >
                <option value="Alinhamento & PA">Alinhamento & PA</option>
                <option value="Consoles Digitais">Consoles Digitais</option>
                <option value="Conserto & Bancada">Conserto & Bancada</option>
                <option value="RF & In-Ear">RF & In-Ear</option>
                <option value="Acústica Aplicada">Acústica Aplicada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs text-slate-300 mb-1">Título Objetivo do Tópico</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Dica de acoplamento de Sub End-Fire em tenda aberta..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs text-slate-300 mb-1">Equipamentos Envolvidos</label>
              <input
                type="text"
                value={newEquip}
                onChange={(e) => setNewEquip(e.target.value)}
                placeholder="Ex: Behringer Wing · Smaart · Powersoft"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Descrição Técnica Detalhada
            </label>
            <textarea
              rows={3}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Compartilhe medições, configurações de delay, sintomas de bancada ou soluções que funcionaram na prática..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewThreadModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 min-h-[40px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs min-h-[40px]"
            >
              Publicar no Fórum
            </button>
          </div>
        </form>
      )}

      {/* Main Forum Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Thread List & Filters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por console, PA, defeito ou assunto..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-slate-100 text-slate-950 font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filteredThreads.map((t) => {
              const isSelected = activeThread && activeThread.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="text-amber-400 font-medium">{t.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.createdAt}</span>
                    {t.solved && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-mono">● Resolvido</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                    {t.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800/70 font-mono tabular-nums">
                    <span className="truncate max-w-[200px]">{t.author}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span>▲ {t.upvotes} votos</span>
                      <span>·</span>
                      <span>{t.replies.length} resp.</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Active Thread Discussion & Replies */}
        {activeThread && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-semibold">{activeThread.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeThread.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{activeThread.equipmentTags}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpvote(activeThread.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-200 font-mono tabular-nums text-xs flex items-center gap-1.5 min-h-[36px]"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                  Útil ({activeThread.upvotes})
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-50 leading-snug">
                {activeThread.title}
              </h3>

              <div className="text-xs text-slate-400">
                Publicado por <span className="text-slate-200 font-medium">{activeThread.author}</span> ·{' '}
                <span>{activeThread.authorRole}</span>
              </div>
            </div>

            {/* Thread Original Post Body */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed">
              {activeThread.content}
            </div>

            {/* Replies Section */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Respostas e Pareceres da Comunidade ({activeThread.replies.length}):
              </div>

              {activeThread.replies.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    rep.isVerifiedSolution
                      ? 'bg-emerald-950/15 border-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-100 font-semibold">{rep.author}</span>
                      <span className="mx-1.5">·</span>
                      <span>{rep.authorRole}</span>
                      <span className="mx-1.5">·</span>
                      <span>{rep.createdAt}</span>
                    </div>
                    {rep.isVerifiedSolution && (
                      <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Solução Validada em Campo
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {rep.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Reply Form */}
            <form onSubmit={handleAddReply} className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-200">
                Contribuir com Experiência Prática neste Tópico
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="Seu nome e função (ex: André · FOH)"
                  className="sm:col-span-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
                <input
                  type="text"
                  required
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escreva sua recomendação técnica ou solução..."
                  className="sm:col-span-2 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-2 min-h-[40px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar Resposta Técnica
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
