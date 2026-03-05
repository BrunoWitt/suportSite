import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ title: '', description: '', prioridade: 'NORMAL' });

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        const res = await api.get('/tickets'); // Rota do backend
        setTickets(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/tickets', newTicket); // Rota do backend
        setShowModal(false);
        loadTickets();
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Meus Chamados</h1>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
            <PlusCircle size={20} /> Novo Ticket
            </button>
        </div>

        <div className="grid gap-4">
            {tickets.map(ticket => (
            <Link key={ticket.id} to={`/ticket/${ticket.id}`} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-emerald-500 transition">
                <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${ticket.prioridade === 'ALTA' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {ticket.prioridade}
                </span>
                <h2 className="text-xl font-semibold mt-2">{ticket.title}</h2>
                <p className="text-slate-500 text-sm line-clamp-1">{ticket.description}</p>
                </div>
                <div className="text-right">
                <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block mb-2">{ticket.status}</p>
                <div className="flex items-center gap-1 text-slate-400 text-sm justify-end">
                    <MessageSquare size={16} /> Abrir Conversa
                </div>
                </div>
            </Link>
            ))}
        </div>

        {/* Modal Simples para Criar Ticket */}
        {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <form onSubmit={handleCreate} className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">Abrir Novo Chamado</h2>
                <input className="w-full p-2 border rounded" placeholder="Título" onChange={e => setNewTicket({...newTicket, title: e.target.value})} required />
                <textarea className="w-full p-2 border rounded" placeholder="Descrição" onChange={e => setNewTicket({...newTicket, description: e.target.value})} required />
                <select className="w-full p-2 border rounded" onChange={e => setNewTicket({...newTicket, prioridade: e.target.value})}>
                <option value="NORMAL">NORMAL</option>
                <option value="ALTA">ALTA</option>
                </select>
                <div className="flex gap-2">
                <button type="submit" className="bg-emerald-600 text-white flex-1 py-2 rounded">Criar</button>
                <button onClick={() => setShowModal(false)} className="bg-slate-200 flex-1 py-2 rounded">Cancelar</button>
                </div>
            </form>
            </div>
        )}
        </div>
    );
}