import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { socket } from '../services/socket';
import { Send } from 'lucide-react';

export default function TicketDetails() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const chatEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // 1. Carrega histórico inicial
        api.get(`/messages/${id}`).then(res => setMessages(res.data));

        // 2. Entra na sala do ticket no Socket
        socket.emit('joinTicket', id);

        // 3. Ouve novas mensagens em tempo real
        socket.on('newMessage', (msg) => {
        setMessages(prev => [...prev, msg]);
        });

        return () => socket.off('newMessage');
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        await api.post(`/messages/${id}`, { content }); // Envia via API
        setContent('');
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50">
        <header className="p-4 bg-white border-b flex justify-between">
            <h1 className="font-bold">Chat do Ticket #{id}</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${msg.sender_id === user.id ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}>
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-70 block mt-1">{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
            </div>
            ))}
            <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
            <input className="flex-1 p-2 border rounded-full px-4 outline-none focus:ring-2 focus:ring-emerald-500" value={content} onChange={e => setContent(e.target.value)} placeholder="Escreva a sua mensagem..." />
            <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition">
            <Send size={20} />
            </button>
        </form>
        </div>
    );
}