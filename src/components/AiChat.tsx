import { useState, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send, Bot, User, Trash2, Volume2, VolumeX, X, Maximize2, Minimize2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'

type Message = {
    role: 'user' | 'assistant',
    content: string,
    timestamp: number
}

export default function AiChat() {
    // Add media query hook to detect mobile devices
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [isExpanded, setIsExpanded] = useState(false)

    // Load messages from localStorage or use default welcome message
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedMessages = localStorage.getItem('ai-chat-messages');
        return savedMessages ? JSON.parse(savedMessages) : [
            { role: 'assistant', content: 'Hi there! How can I help you today?', timestamp: Date.now() }
        ];
    });

    const [input, setInput] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const messageEndRef = useRef<HTMLDivElement>(null)
    const notificationSound = useRef<HTMLAudioElement | null>(null)

    // Initialize audio element
    useEffect(() => {
        notificationSound.current = new Audio('/notification.mp3');
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isOpen]);

    // Handle body scroll locking for mobile
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        }
    }, [isMobile, isOpen]);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async () => {
        if (!input.trim()) return

        // Add user message
        const userMessage = { role: 'user' as const, content: input.trim(), timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Show typing indicator
        setIsTyping(true);

        // Play sound when sending message if enabled
        if (soundEnabled && notificationSound.current) {
            notificationSound.current.play().catch(e => console.error('Error playing sound:', e));
        }

        // Simulate AI response after a delay
        setTimeout(() => {
            const aiResponse = {
                role: 'assistant' as const,
                content: `This is a simulated response to: "${input.trim()}"`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const clearChat = () => {
        setMessages([
            { role: 'assistant', content: "I've cleared our conversation. How can I help you now?", timestamp: Date.now() }
        ]);
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Choose chat container style based on device and expanded state
    const getChatContainerStyles = () => {
        if (isMobile) {
            return "fixed inset-0 z-50 flex flex-col bg-white";
        } else if (isExpanded) {
            return "fixed bottom-4 right-4 w-[500px] h-[600px] z-50 flex flex-col bg-white shadow-2xl border border-blue-200";
        } else {
            return "w-[350px] sm:w-96 p-0 shadow-xl border-blue-200";
        }
    };

    // Handle chat toggle for mobile vs desktop
    const renderChatInterface = () => {
        const chatContent = (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
            >
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        <h3 className="font-medium">Glimpse AI Assistant</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            aria-label={soundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
                        >
                            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                            onClick={clearChat}
                            aria-label="Clear chat history"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                                onClick={toggleExpand}
                                aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                            >
                                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                        )}
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea
                        className={`${isMobile ? 'h-full' : isExpanded ? 'h-[500px]' : 'h-80'} px-4 py-3 overflow-y-auto`}
                        ref={scrollAreaRef}
                    >
                        <div className="space-y-4 pb-2">
                            <AnimatePresence>
                                {messages.map((message, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1 max-w-[75%]">
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-2",
                                                    message.role === 'user'
                                                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white self-end"
                                                        : "bg-blue-50 text-slate-700 border border-blue-100"
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                            <span className={cn(
                                                "text-xs text-gray-500",
                                                message.role === 'user' ? "text-right" : "text-left"
                                            )}>
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-white shrink-0">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 text-slate-700 p-3 rounded-2xl flex items-center">
                                            <span className="flex space-x-1">
                                                <motion.span
                                                    className="h-2 w-2 rounded-full bg-blue-400"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                                                ></motion.span>
                                                <motion.span
                                                    className="h-2 w-2 rounded-full bg-blue-400"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                                                ></motion.span>
                                                <motion.span
                                                    className="h-2 w-2 rounded-full bg-blue-400"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                                                ></motion.span>
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messageEndRef} />
                        </div>
                    </ScrollArea>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-4 border-t border-blue-100 bg-gradient-to-r from-slate-50 to-blue-50"
                >
                    <div className="flex gap-2 items-center">
                        <Input
                            ref={inputRef}
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            className="flex-1 border-blue-200 focus-visible:ring-blue-400 focus-visible:ring-1 shadow-sm transition-all"
                            aria-label="Type your message"
                            disabled={isTyping}
                        />
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <Button
                                onClick={handleSendMessage}
                                size="icon"
                                disabled={!input.trim() || isTyping}
                                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-opacity"
                                aria-label="Send message"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        );

        if (isMobile) {
            return (
                <>
                    {isOpen && (
                        <div className={getChatContainerStyles()}>
                            {chatContent}
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="default"
                                size="icon"
                                className='h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-sky-500 to-blue-600'
                                aria-label="Open AI chat assistant"
                            >
                                <MessageSquare className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </PopoverTrigger>
                    <PopoverContent
                        className={isExpanded ? "!w-auto !p-0" : getChatContainerStyles()}
                        align="end"
                        sideOffset={16}
                        onOpenAutoFocus={e => e.preventDefault()}
                    >
                        {chatContent}
                    </PopoverContent>
                </Popover>
            );
        }
    };

    // Added a fixed chat button for mobile
    const renderMobileChatButton = () => {
        if (!isMobile || isOpen) return null;

        return (
            <motion.div
                className="fixed bottom-24 right-6 z-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    variant="default"
                    size="icon"
                    className='h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-sky-500 to-blue-600'
                    aria-label="Open AI chat assistant"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            </motion.div>
        );
    };

    return (
        <>
            <div className='fixed bottom-24 xl:bottom-12 right-6 xl:right-12 z-50'>
                {renderChatInterface()}
            </div>
            {renderMobileChatButton()}
        </>
    );
}
