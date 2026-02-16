'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Sorry, something went wrong. Please try again.' }]);
                setIsLoading(false);
                return;
            }

            // Handle streaming response
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        const data = line.replace('data: ', '');
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                assistantContent += parsed.content;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                                    return updated;
                                });
                            }
                        } catch {
                            // skip malformed chunks
                        }
                    }
                }
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your connection and try again.' }]);
        }

        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const suggestions = [
        'Best cashback credit card?',
        'No annual fee cards',
        'Best forex card for travel?',
        'Compare HDFC vs ICICI',
    ];

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen
                        ? 'bg-destructive hover:bg-destructive/90 rotate-0'
                        : 'bg-primary hover:bg-primary/90 hover:scale-110'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <X className="h-5 w-5 text-white" />
                ) : (
                    <MessageCircle className="h-5 w-5 text-white" />
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">CardCompare AI</h3>
                                <p className="text-xs text-muted-foreground">Powered by Groq • Llama 3.3</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center py-6">
                                <Bot className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground mb-4">
                                    Ask me anything about credit cards, rewards, or help finding the best card for you!
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); }}
                                            className="text-xs text-left px-3 py-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-md'
                                            : 'bg-secondary/60 rounded-bl-md'
                                        }`}
                                >
                                    {msg.content || (
                                        <div className="flex items-center gap-1.5">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            <span className="text-xs text-muted-foreground">Thinking...</span>
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-border">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about cards..."
                                className="flex-1 bg-secondary/50 border-0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                                disabled={isLoading}
                            />
                            <Button
                                size="sm"
                                className="h-10 w-10 rounded-xl p-0 shrink-0"
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
