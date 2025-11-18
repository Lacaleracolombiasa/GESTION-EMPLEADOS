import React, { useState } from 'react';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;

const BlockDatesModal = ({ onClose, onBlockDates, blockedDates, onDeleteBlockedDate }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [comment, setComment] = useState('');

    const handleBlock = () => {
        if (startDate) {
            onBlockDates(startDate, endDate || startDate, comment);
            setStartDate('');
            setEndDate('');
            setComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6">Bloquear Fechas</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Inicio</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full mt-1 input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Fin (opcional)</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full mt-1 input-style" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Comentario</label>
                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Motivo del bloqueo" className="w-full mt-1 input-style" />
                </div>

                <div className="flex justify-end pt-4 space-x-3 border-t border-slate-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white">Cerrar</button>
                    <button type="button" onClick={handleBlock} className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white">Bloquear</button>
                </div>

                <div className="mt-8 flex-grow overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4">Fechas Bloqueadas</h3>
                    {blockedDates && blockedDates.length > 0 ? (
                        <ul className="space-y-2">
                            {blockedDates.sort((a, b) => a.date.localeCompare(b.date)).map(blockedDate => (
                                <li key={blockedDate.date} className="flex justify-between items-center bg-slate-700 p-2 rounded-lg">
                                    <div>
                                        <span className="text-white">{blockedDate.date}</span>
                                        {blockedDate.comment && <p className="text-xs text-gray-400 italic">{blockedDate.comment}</p>}
                                    </div>
                                    <button onClick={() => onDeleteBlockedDate(blockedDate.date)} className="text-red-400 hover:text-red-300">
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No hay fechas bloqueadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockDatesModal;