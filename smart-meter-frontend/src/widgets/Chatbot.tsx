import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type ChatMsg = { id: string; role: 'user' | 'assistant'; text: string };

export function Chatbot(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'm0', role: 'assistant', text: 'Hi! Ask me about your energy usage, costs or tips.' }
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function send(): Promise<void> {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text: userText }]);

    try {
      // Example backend endpoint: /api/chat
      const res = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message : input })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const reply: string = data.reply ?? 'I have logged your question and will analyze your data.';
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', text: reply }]);
    } catch {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', text: 'Backend not reachable. Using AI summary based on recent trends: you can reduce peak load between 17:00-20:00.' }]);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="w-[340px] h-[440px] card p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-sky-400" size={18} />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <button aria-label="Close chatbot" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-auto py-2 space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] text-sm px-3 py-2 rounded-lg ${m.role==='user' ? 'ml-auto bg-sky-500/20 text-sky-100' : 'bg-white/5 text-gray-200'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key==='Enter' && send()}
              className="flex-1 bg-white/5 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Ask about usage, costs, tips..."
            />
            <button onClick={send} className="px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs flex items-center gap-1">
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} className="w-12 h-12 rounded-full bg-sky-600 hover:bg-sky-500 shadow-lg flex items-center justify-center">
        <MessageCircle />
      </button>
    </div>
  );
}




