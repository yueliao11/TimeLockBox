'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { SendIcon, Loader2Icon } from 'lucide-react';

export default function AIAssistant() {
  const account = useCurrentAccount();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  
  if (!account) {
    redirect('/');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setLoading(true);
    try {
      // TODO: Implement AI API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a mock AI response. The actual AI integration will be implemented soon.'
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        
        <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto p-4 rounded-lg border">
          {messages.map((message, i) => (
            <Card key={i} className={`p-4 ${message.role === 'assistant' ? 'bg-primary/10' : ''}`}>
              <p>{message.content}</p>
            </Card>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about time capsules..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}