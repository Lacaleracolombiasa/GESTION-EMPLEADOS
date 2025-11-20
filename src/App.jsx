

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient';
import BlockDatesModal from './BlockDatesModal';
import InvitationPage from './InvitationPage';

// --- Iconos SVG ---
// Colección de componentes SVG para usar como iconos en la interfaz,
// evitando la necesidad de librerías externas o archivos de imagen.
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const UserXIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="22" y1="8" x2="17" y2="13"/></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;




// --- Helper Functions ---
// Genera un array de objetos Date entre dos fechas dadas.
const getDatesInRange = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate + 'T00:00:00'); // Interpretar como fecha local
    const end = new Date(endDate + 'T00:00:00');
    if (isNaN(start) || isNaN(end)) return [];

    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};
// Determina el estado general de una solicitud basado en las aprobaciones.
const getRequestStatus = (req) => {
    if (!req) return 'Estado Desconocido';
    if (req.estado_supervisor === 'rechazado' || req.estado_admin === 'rechazado') return 'Rechazado';
    if (req.estado_supervisor === 'aprobado' && req.estado_admin === 'aprobado') return 'Aprobado';
    if (req.estado_supervisor === 'aprobado' && req.estado_admin === 'pendiente') return 'Aprob. Parcial';
    return 'Pendiente';
};


// --- COMPONENTES DE LA APLICACIÓN ---

// Componente para la pantalla de inicio de sesión.
const LoginPage = ({ onLogin }) => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Maneja el envío del formulario de login.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await onLogin(cedula, password);
        if (!success) {
            setError('Cédula o contraseña incorrectas.');
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
<div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
                <div><img src="https://lacaleracolombia.com.co/wp-content/uploads/2023/03/cropped-Logo-La-Calera-Estuardo-PNG.png" alt="Logo La Calera" className="w-40 mx-auto bg-white rounded-lg p-2" /><p className="mt-2 text-center text-sm text-gray-400">Ingresa tus credenciales</p></div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                     <div><label htmlFor="cedula" className="block text-sm font-medium text-gray-200">Cédula</label><input id="cedula" name="cedula" type="text" required value={cedula} onChange={(e) => setCedula(e.target.value)} className="mt-1 block w-full input-style" /></div>
                    <div><label htmlFor="password"className="block text-sm font-medium text-gray-200">Contraseña</label><input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full input-style" /></div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <div><button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">Iniciar Sesión</button></div>
                </form>
            </div>
        </div>
    );
};

// Componente principal de la estructura de la aplicación (layout).
// Incluye la barra lateral de navegación y la cabecera.
const AppLayout = ({ currentUser, onLogout, children, activeView, setActiveView, notifications, onShowChangePasswordModal, onShowMyProfileModal }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para la barra lateral móvil

    // Define los ítems de navegación base.
    const navItems = [
        { name: 'Dashboard', icon: <HomeIcon />, view: 'dashboard' },
        { name: 'Calendario', icon: <CalendarIcon />, view: 'calendar' },
        { name: 'Histórico Solicitudes', icon: <ArchiveIcon />, view: 'requestHistory' },
    ];
    // Añade ítems condicionalmente según el rol del usuario.
    if (currentUser.rol === 'admin' || currentUser.rol === 'supervisor') {
        navItems.push({ name: 'Gestión de Equipo', icon: <UsersIcon />, view: 'team' });
    }
    if (currentUser.rol === 'supervisor' || currentUser.rol === 'empleado') {
        navItems.push({ name: 'Mis PQR Enviadas', icon: <MessageSquareIcon/>, view: 'myPqr' });
    }
    if (currentUser.rol === 'admin') {
        navItems.push({ name: 'Lista de Sucesos', icon: <ListIcon />, view: 'events' });
        navItems.push({ name: 'Préstamos', icon: <DollarSignIcon />, view: 'loans' });
        navItems.push({ name: 'Gestión PQR', icon: <MessageSquareIcon/>, view: 'pqrAdmin' });
        navItems.push({ name: 'Empleados Retirados', icon: <UserXIcon/>, view: 'retiredEmployees' });
    }

    // Maneja el cierre de sesión.
    const handleLogoutClick = async () => { onLogout(); }
    const handleNavItemClick = (view) => {
        setActiveView(view);
        setIsSidebarOpen(false); // Cierra la barra lateral al seleccionar un ítem
    };

    return (
        <div className="flex h-screen bg-slate-900 text-gray-200">
            {/* Overlay para cerrar la barra lateral en móvil */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

            {/* Barra Lateral */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-800 p-4 flex flex-col justify-between z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform md:relative md:translate-x-0 md:flex`}>
                <div>
                    <div className="mb-8 text-center"><img src="https://lacaleracolombia.com.co/wp-content/uploads/2023/03/cropped-Logo-La-Calera-Estuardo-PNG.png" alt="Logo La Calera" className="w-32 mx-auto bg-white rounded-lg p-1" /><p className="text-sm text-gray-400">{currentUser.cargo}</p></div>
                    <nav className="space-y-2">{navItems.map(item => (<button key={item.name} onClick={() => handleNavItemClick(item.view)} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${activeView === item.view ? 'bg-emerald-500 text-white' : 'hover:bg-slate-700'}`}>{item.icon}<span>{item.name}</span></button>))}</nav>
                </div>
                <div><button onClick={handleLogoutClick} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"><LogOutIcon /><span>Cerrar Sesión</span></button></div>
            </aside>
            {/* Contenido Principal */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                 {/* Cabecera */}
                 <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <button className="md:hidden p-2 mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-xl md:text-3xl font-bold text-white">Bienvenido, {currentUser.nombre_completo?.split(' ')[0]}</h2>
                            <p className="text-xs md:text-base text-gray-400">Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 md:space-x-2">
                         <button onClick={onShowMyProfileModal} title="Mi Perfil" className="p-2 rounded-full hover:bg-slate-700"><UserIcon /></button>
                         <button onClick={onShowChangePasswordModal} title="Cambiar Contraseña" className="p-2 rounded-full hover:bg-slate-700"><KeyIcon /></button>
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-slate-700"><BellIcon />{notifications.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-orange-500 rounded-full"></span>}</button>
                            {showNotifications && <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} />}
                        </div>
                        <div className="hidden md:flex w-10 h-10 bg-emerald-500 rounded-full items-center justify-center font-bold text-white">{currentUser.nombre_completo?.charAt(0)}</div>
                    </div>
                </header>
                {/* Renderiza el contenido de la vista activa */}
                {children}
            </main>
        </div>
    );
};

// Componente del Dashboard principal. Muestra información relevante y acciones según el rol.
const Dashboard = ({ currentUser, solicitudes, users, prestamos, documentos, onUpdateRequestStatus, onUpdateLoanStatus, onShowNewRequestModal, onShowNewLoanModal, onBlockDates, onShowApproveLoanModal, onShowRejectLoanModal, onShowRequestDocModal, onShowPQRModal, onUpdateDocStatus }) => {
    // Filtra datos relevantes para el dashboard.
    const myRequests = solicitudes.filter(s => s.empleado_id === currentUser.id);
    const myLoans = prestamos.filter(p => p.empleado_id === currentUser.id);
    const myDocs = documentos.filter(d => d.empleado_id === currentUser.id);
    const teamRequestsToSupervise = solicitudes.filter(s => {
        const employee = users.find(u => u.id === s.empleado_id);
        if (!employee || s.estado_supervisor !== 'pendiente') return false;

        if (currentUser.rol === 'supervisor') {
            return employee.supervisor_id === currentUser.id;
        }
        if (currentUser.rol === 'admin') {
            // Admin supervises employees who report to no one, or report to the admin directly.
            return !employee.supervisor_id || employee.supervisor_id === currentUser.id;
        }
        return false;
     });
    const requestsToAdmin = solicitudes.filter(s => s.estado_supervisor === 'aprobado' && s.estado_admin === 'pendiente');
    const pendingLoans = prestamos.filter(p => p.estado === 'pendiente');
    const pendingDocs = documentos.filter(d => d.estado === 'pendiente');

    // Sub-componente reutilizable para mostrar listas de solicitudes pendientes de aprobación.
    const ApprovalRequestItem = ({ req, level, onUpdate, users }) => {
        const [comment, setComment] = useState(level === 'supervisor' ? req.comentarios_supervisor : req.comentarios_admin);
        const employee = users.find(u => u.id === req.empleado_id);

        return (
            <div className="bg-slate-700 p-3 rounded-lg">
                <div className="flex flex-wrap justify-between items-center mb-2">
                    <div>
                        <p className="font-semibold text-white">{req.tipo} - <span className="font-normal">{employee?.nombre_completo}</span></p>
                        <p className="text-sm text-gray-400">{req.fecha_inicio} al {req.fecha_fin}</p>
                        {req.comentarios_empleado && <p className="text-xs text-gray-400 italic">Empleado: "{req.comentarios_empleado}"</p>}
                        {req.comentarios_supervisor && level === 'admin' && <p className="text-xs text-gray-400 italic">Supervisor: "{req.comentarios_supervisor}"</p>}
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button onClick={() => onUpdate(req.id, level, 'aprobado', comment)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-emerald-500 hover:bg-emerald-600">Aprobar</button>
                        <button onClick={() => onUpdate(req.id, level, 'rechazado', comment)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-red-500 hover:bg-red-600">Rechazar</button>
                    </div>
                </div>
                <textarea
                    className="input-style w-full mt-2 text-sm"
                    rows="2"
                    placeholder={`Añadir comentario para el ${level === 'supervisor' ? 'administrador' : 'empleado'} (opcional)`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>
        );
    };

    const ApprovalCard = ({ title, requests, level, onUpdate, users }) => (
        <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <div className="space-y-3">
                 {requests.length > 0 ? requests.map(req => (
                    <ApprovalRequestItem key={req.id} req={req} level={level} onUpdate={onUpdate} users={users} />
                )) : <p className="text-gray-400">No hay solicitudes pendientes.</p>}
            </div>
        </div>
    );

    // Sub-componente reutilizable para mostrar préstamos pendientes de aprobación (Admin).
    const LoanApprovalCard = ({ loans, onShowApproveLoanModal, onUpdate }) => (
       <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-4">Préstamos para Aprobación</h3>
            <div className="space-y-3">
                 {loans.length > 0 ? loans.map(loan => {
                    const employee = users.find(u => u.id === loan.empleado_id);
                    return (
                        <div key={loan.id} className="bg-slate-700 p-3 rounded-lg">
                            <div className="flex flex-wrap justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">${new Intl.NumberFormat('es-CO').format(loan.monto)} - <span className="font-normal">{employee?.nombre_completo}</span></p>
                                    <p className="text-sm text-gray-400">{loan.motivo}</p>
                                    {loan.comentarios_empleado && <p className="text-xs text-gray-400 italic">Empleado: "{loan.comentarios_empleado}"</p>}
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button onClick={() => onShowApproveLoanModal(loan)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-emerald-500 hover:bg-emerald-600">Aprobar</button>
                                    <button onClick={() => onShowRejectLoanModal(loan)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-red-500 hover:bg-red-600">Rechazar</button>
                                </div>
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-400">No hay préstamos pendientes.</p>}
            </div>
        </div>
    );

    // Sub-componente reutilizable para mostrar documentos pendientes de gestión (Admin).
    const DocumentApprovalCard = ({ docs, onUpdateDocStatus }) => (
        <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-4">Solicitudes de Documentos Pendientes</h3>
            <div className="space-y-3">
                 {docs.length > 0 ? docs.map(doc => {
                    const employee = users.find(u => u.id === doc.empleado_id);
                    return (
                        <div key={doc.id} className="flex flex-wrap justify-between items-center bg-slate-700 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">{doc.tipo_documento} - <span className="font-normal">{employee?.nombre_completo}</span></p>
                                <p className="text-sm text-gray-400">Notas: {doc.notas || 'N/A'}</p>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0">
                                <button onClick={() => onUpdateDocStatus(doc.id, 'listo')} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-emerald-500 hover:bg-emerald-600">Marcar como Listo</button>
                                <button onClick={() => onUpdateDocStatus(doc.id, 'rechazado')} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-red-500 hover:bg-red-600">Rechazar</button>
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-400">No hay solicitudes de documentos pendientes.</p>}
            </div>
        </div>
    );


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna de Acciones Rápidas */}
            <div className="bg-slate-800 p-6 rounded-lg col-span-1">
                <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                    {/* Botones condicionales según rol */}
                    {currentUser.rol !== 'admin' && (
                        <>
                            <button onClick={onShowNewRequestModal} className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"><PlusCircleIcon /><span>Nueva Solicitud Permiso/Vac.</span></button>
                             <button onClick={onShowRequestDocModal} className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"><FileTextIcon/><span>Solicitar Documento</span></button>
                            <button onClick={onShowNewLoanModal} className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"><DollarSignIcon /><span>Solicitar Préstamo</span></button>
                            <button onClick={onShowPQRModal} className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors"><MessageSquareIcon /><span>Enviar Comentario/PQR</span></button>
                        </>
                    )}
                    {currentUser.rol === 'admin' && <button onClick={onBlockDates} className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"><LockIcon /><span>Bloquear Fechas</span></button>}
                </div>
            </div>
             {/* Sección Mis Solicitudes Recientes */}
            <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">Mis Solicitudes Recientes</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {myRequests.length > 0 ? myRequests.slice(0, 5).map(req => (<div key={req.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg"><div><p className="font-semibold text-white">{req.tipo}</p><p className="text-sm text-gray-400">{req.fecha_inicio} al {req.fecha_fin}</p></div><StatusBadge statusSupervisor={req.estado_supervisor} statusAdmin={req.estado_admin} /></div>)) : <p className="text-gray-400">No tienes solicitudes recientes.</p>}
                </div>
            </div>

             {/* Sección Mis Documentos Solicitados (si aplica) */}
             {myDocs.length > 0 && (
                 <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-3">
                    <h3 className="text-xl font-bold text-white mb-4">Mis Documentos Solicitados</h3>
                     <div className="space-y-3">
                         {myDocs.map(doc => (
                         <div key={doc.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">{doc.tipo_documento}</p>
                                <p className="text-sm text-gray-400">{doc.notas || 'Sin notas adicionales'}</p>
                            </div>
                            <StatusBadge estado={doc.estado} />
                        </div>
                    ))}
                     </div>
                </div>
             )}

             {/* Sección Mis Préstamos (si aplica) */}
            {myLoans.length > 0 && (
                <div className="bg-slate-800 p-6 rounded-lg col-span-1 md:col-span-3">
                    <h3 className="text-xl font-bold text-white mb-4">Mis Préstamos</h3>
                     {myLoans.map(loan => (
                         <div key={loan.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">${new Intl.NumberFormat('es-CO').format(loan.monto)}</p>
                                <p className="text-sm text-gray-400">{loan.estado === 'aprobado' ? `Desembolso: ${loan.fecha_desembolso}` : loan.motivo}</p>
                                {loan.comentarios_admin && <p className="text-xs text-gray-400 italic">Admin: "{loan.comentarios_admin}"</p>}
                            </div>
                            <StatusBadge estado={loan.estado} />
                        </div>
                    ))}
                </div>
            )}
            {/* Secciones de Aprobación Condicionales */}
            {(currentUser.rol === 'supervisor' || currentUser.rol === 'admin') && teamRequestsToSupervise.length > 0 && <ApprovalCard title="Solicitudes para Supervisión" requests={teamRequestsToSupervise} level="supervisor" onUpdate={onUpdateRequestStatus} users={users} />}
            {currentUser.rol === 'admin' && <ApprovalCard title="Solicitudes para Aprobación Final" requests={requestsToAdmin} level="admin" onUpdate={onUpdateRequestStatus} users={users} />}
            {currentUser.rol === 'admin' && <DocumentApprovalCard docs={pendingDocs} onUpdateDocStatus={onUpdateDocStatus} />}
            {currentUser.rol === 'admin' && <LoanApprovalCard loans={pendingLoans} onShowApproveLoanModal={onShowApproveLoanModal} onShowRejectLoanModal={onShowRejectLoanModal} />}
        </div>
    );
};

// Componente para mostrar un badge de estado coloreado.
const StatusBadge = ({ statusSupervisor, statusAdmin, estado }) => {
    let status = estado || 'Pendiente';
    let color = 'bg-orange-500';
    // Lógica para determinar el color y texto del badge según el estado.
    if (estado === 'pendiente') { status = 'Pendiente'; color = 'bg-orange-500'; }
    else if (estado === 'listo' || estado === 'aprobado') { status = estado === 'listo' ? 'Listo' : 'Aprobado'; color = 'bg-emerald-500'; }
    else if (estado === 'rechazado') { status = 'Rechazado'; color = 'bg-red-500'; }
    else {
        if (statusSupervisor === 'rechazado' || statusAdmin === 'rechazado') { status = 'Rechazado'; color = 'bg-red-500'; }
        else if (statusSupervisor === 'aprobado' && statusAdmin === 'aprobado') { status = 'Aprobado'; color = 'bg-emerald-500'; }
        else if (statusSupervisor === 'aprobado' && statusAdmin === 'pendiente') { status = 'Aprob. Parcial'; color = 'bg-blue-600'; }
        else { status = 'Pendiente'; color = 'bg-orange-500'; }
    }
    return <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${color}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

// Componente para la vista de Gestión de Equipo (Admin/Supervisor).
const TeamManagement = ({ currentUser, users, onShowInviteModal, onUpdateUser, onRetireUser, onShowLastGeneratedLink, onShowUserInvitationLink }) => {
    const [viewingProfile, setViewingProfile] = useState(null); // Estado para controlar qué perfil se está viendo.
    const [filters, setFilters] = useState({ nombre: '', cargo: '', estado: '' }); // Estado para los filtros.

    // Filtra los usuarios a mostrar: todo el equipo para admin, equipo directo para supervisor.
    let teamUsers = users.filter(u => u.status !== 'retirado');
    if (currentUser.rol === 'supervisor') {
        teamUsers = users.filter(u => u.supervisor_id === currentUser.id || u.id === currentUser.id);
    }

    // Aplica los filtros de búsqueda sobre la lista de usuarios.
    const filteredUsers = useMemo(() => {
        return teamUsers.filter(user => {
            const datosDiligenciados = user.datos_diligenciados ? 'diligenciado' : 'pendiente por diligenciar';
            return (filters.nombre === '' || user.nombre_completo.toLowerCase().includes(filters.nombre.toLowerCase())) &&
                   (filters.cargo === '' || user.cargo.toLowerCase().includes(filters.cargo.toLowerCase())) &&
                   (filters.estado === '' || datosDiligenciados === filters.estado);
        });
    }, [teamUsers, filters]);

    // Maneja cambios en los campos de filtro.
    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            {/* Cabecera y botón de invitar */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Gestión de Equipo</h3>
                <div className="flex space-x-2">
                    <button onClick={onShowLastGeneratedLink} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                        <span>Ver Último Enlace</span>
                    </button>
                    <button onClick={onShowInviteModal} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">
                        <PlusCircleIcon /> <span>Invitar Empleado</span>
                    </button>
                </div>
            </div>
            {/* Sección de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
                <input type="text" name="nombre" placeholder="Filtrar por nombre..." value={filters.nombre} onChange={handleFilterChange} className="input-style" />
                <input type="text" name="cargo" placeholder="Filtrar por cargo..." value={filters.cargo} onChange={handleFilterChange} className="input-style" />
                <select name="estado" value={filters.estado} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los estados</option>
                    <option value="diligenciado">Diligenciado</option>
                    <option value="pendiente por diligenciar">Pendiente por diligenciar</option>
                </select>
            </div>
            {/* Tabla de Usuarios */}
            <div className="overflow-x-auto"><table className="w-full text-left">
                 <thead className="border-b border-slate-700 text-sm text-gray-400"><tr><th className="p-3">Nombre Completo</th><th className="p-3">Cargo</th><th className="p-3">Estado Datos</th><th className="p-3">Acciones</th></tr></thead>
                 <tbody>{filteredUsers.map(user => (<tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700"><td className="p-3 font-medium text-white">{user.nombre_completo}</td><td className="p-3">{user.cargo}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full text-white ${user.datos_diligenciados ? 'bg-emerald-500' : 'bg-orange-500'}`}>{user.datos_diligenciados ? 'diligenciado' : 'pendiente'}</span></td><td className="p-3"><button onClick={() => setViewingProfile(user)} className="text-blue-400 hover:text-blue-300">Ver Perfil</button>{user.status === 'pre-registro' && user.onboardingToken && (<button onClick={() => onShowUserInvitationLink(user)} className="ml-2 px-3 py-1 text-xs font-bold text-white rounded-full bg-purple-600 hover:bg-purple-700">Copiar Link</button>)}</td></tr>))}</tbody>
            </table></div>
            {/* Modal para ver perfil */}
            {viewingProfile && <UserProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} onUpdateUser={onUpdateUser} currentUser={currentUser} onRetireUser={onRetireUser} users={users}/>}
        </div>
    );
};

// Modal para crear una nueva solicitud (Permiso, Vacaciones, etc.).
const NewRequestModal = ({ onClose, onCreateRequest, currentUser, blockedDates }) => {
     const [formData, setFormData] = useState({
        tipo: 'Vacaciones',
        fecha_inicio: '',
        fecha_fin: '',
        todo_el_dia: true,
        hora_inicio: '',
        hora_fin: '',
        hora_llegada_aprox: '',
        comentarios_empleado: '' // New field
    });

    const detailedTypes = ['Permiso Médico', 'Permiso Personal', 'Evento Personal'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

     const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fecha_inicio) { alert("Por favor, selecciona la fecha de inicio."); return; }
        let finalData = { ...formData };
        if (detailedTypes.includes(finalData.tipo)) {
            finalData.fecha_fin = finalData.fecha_inicio; // For single-day detailed requests
        } else if (!finalData.fecha_fin) {
            alert("Por favor, selecciona la fecha de fin.");
            return;
        }

        const requestedDates = getDatesInRange(finalData.fecha_inicio, finalData.fecha_fin);
        const isBlocked = requestedDates.some(d => blockedDates.some(b => b.date === d.toISOString().slice(0, 10)));
        if (isBlocked) { alert("Error: Una o más fechas seleccionadas están bloqueadas por administración."); return; }

        const supabaseData = {
            empleado_id: currentUser.id,
            tipo: finalData.tipo,
            fecha_inicio: finalData.fecha_inicio,
            fecha_fin: finalData.fecha_fin,
            todo_el_dia: detailedTypes.includes(finalData.tipo) ? finalData.todo_el_dia : null,
            hora_inicio: !finalData.todo_el_dia && detailedTypes.includes(finalData.tipo) ? finalData.hora_inicio : null,
            hora_fin: !finalData.todo_el_dia && detailedTypes.includes(finalData.tipo) ? finalData.hora_fin : null,
            hora_llegada_aprox: !finalData.todo_el_dia && detailedTypes.includes(finalData.tipo) ? finalData.hora_llegada_aprox : null,
            comentarios_empleado: formData.comentarios_empleado // New field
        };

        onCreateRequest(supabaseData);
    };
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Crear Nueva Solicitud</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Solicitud</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full mt-1 input-style"><option>Vacaciones</option><option>Permiso Médico</option><option>Permiso Personal</option><option>Evento Personal</option><option>Trabajo Remoto</option></select></div>

                    {detailedTypes.includes(formData.tipo) && (
                         <div className="flex items-center space-x-2">
                            <input type="checkbox" id="todo_el_dia" name="todo_el_dia" checked={formData.todo_el_dia} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor="todo_el_dia" className="text-sm text-gray-200">Todo el día</label>
                         </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Inicio</label><input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required className="w-full mt-1 input-style" /></div>
                        {!detailedTypes.includes(formData.tipo) && (
                             <div><label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Fin</label><input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required className="w-full mt-1 input-style" /></div>
                        )}
                    </div>

                    {!formData.todo_el_dia && detailedTypes.includes(formData.tipo) && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-200 mb-1">Hora de Inicio</label><input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="w-full mt-1 input-style" /></div>
                                <div><label className="block text-sm font-medium text-gray-200 mb-1">Hora de Fin</label><input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} className="w-full mt-1 input-style" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-200 mb-1">Hora Aproximada de Llegada</label><input type="time" name="hora_llegada_aprox" value={formData.hora_llegada_aprox} onChange={handleChange} className="w-full mt-1 input-style" /></div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Comentarios (Opcional)</label>
                        <textarea name="comentarios_empleado" value={formData.comentarios_empleado} onChange={handleChange} className="input-style" rows="3"></textarea>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">Enviar Solicitud</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal para editar una solicitud existente.
const EditRequestModal = ({ request, onClose, onSave, users }) => {
    const [formData, setFormData] = useState({ ...request });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const employee = users.find(u => u.id === request.empleado_id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Editar Solicitud de {employee?.nombre_completo}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Solicitud</label>
                        <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full mt-1 input-style">
                            <option>Vacaciones</option>
                            <option>Permiso Médico</option>
                            <option>Permiso Personal</option>
                            <option>Evento Personal</option>
                            <option>Trabajo Remoto</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Inicio</label>
                            <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required className="w-full mt-1 input-style" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Fin</label>
                            <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required className="w-full mt-1 input-style" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Panel desplegable para mostrar notificaciones.
const NotificationsPanel = ({ notifications, onClose }) => {
     return (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
            <div className="p-4 flex justify-between items-center border-b border-slate-700"><h4 className="font-bold text-white">Notificaciones</h4><button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon/></button></div>
            <div className="p-2 max-h-96 overflow-y-auto">{notifications.length > 0 ? (notifications.map(notif => (<div key={notif.id} className="p-3 hover:bg-slate-700 rounded-lg"><p className="text-sm text-white">{notif.message}</p><p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleString('es-ES')}</p></div>))) : ( <p className="text-sm text-gray-400 p-4 text-center">No hay notificaciones nuevas.</p> )}</div>
        </div>
    );
};

// Componente para la vista de Calendario.
const CalendarView = ({ currentUser, solicitudes, users, blockedDates }) => {
     const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Funciones para navegar entre meses.
    const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // Calcula los eventos a mostrar en el mes actual (solicitudes, cumpleaños).
    const calendarEvents = useMemo(() => {
        let allEvents = [];
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Solicitudes Aprobadas
        const approvedRequests = solicitudes.filter(s => s.estado_supervisor === 'aprobado' && s.estado_admin === 'aprobado');
        approvedRequests.forEach(req => {
            const employee = users.find(u => u.id === req.empleado_id);
            if (!employee) return;
            const dates = getDatesInRange(req.fecha_inicio, req.fecha_fin);
            dates.forEach(date => {
                 if (date.getFullYear() === currentYear && date.getMonth() === currentMonth){
                     allEvents.push({
                        id: `${req.id}-${date.toISOString()}`, date: date,
                        title: employee.nombre_completo, color: 'bg-emerald-500',
                        type: 'Solicitud', details: req, employee: employee
                    });
                 }
            });
        });

        // Cumpleaños de TODOS los usuarios
        users.forEach(user => {
            if(user.fecha_nacimiento){
                try {
                    const birthDateParts = user.fecha_nacimiento.split('-');
                    if (birthDateParts.length === 3) {
                        const birthMonth = parseInt(birthDateParts[1], 10) - 1; // Month is 0-indexed
                        const birthDay = parseInt(birthDateParts[2], 10);

                        if (!isNaN(birthMonth) && !isNaN(birthDay) && birthMonth === currentMonth) {
                             const birthdayThisYear = new Date(currentYear, birthMonth, birthDay);
                             // Check if the constructed date is valid for the current year (handles leap years implicitly)
                             if (birthdayThisYear.getFullYear() === currentYear && birthdayThisYear.getMonth() === birthMonth && birthdayThisYear.getDate() === birthDay) {
                                allEvents.push({
                                    id: `bday-${user.id}-${currentYear}`, date: birthdayThisYear, title: `🎂 ${user.nombre_completo}`,
                                    color: 'bg-purple-600', type: 'Cumpleaños', details: { tipo: 'Cumpleaños', empleado: user.nombre_completo }, employee: user
                                });
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error processing birthday for user:", user.id, user.fecha_nacimiento, e);
                }
            }
        });


        return allEvents;
    }, [solicitudes, users, currentDate]);

    // Lógica para generar los días del mes y placeholders.
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startingDayIndex = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);

    const monthDays = Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1));
    const emptyDays = Array.from({ length: startingDayIndex });


    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            {/* Navegación y Leyenda */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-slate-700"><ChevronLeftIcon/></button>
                <h3 className="text-xl font-bold text-white">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}</h3>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-slate-700"><ChevronRightIcon/></button>
            </div>
             <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs text-gray-400">
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>Solicitudes</div>
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-purple-600 mr-2"></span>Cumpleaños</div>
                <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-gray-600 mr-2"></span>Bloqueadas</div>
            </div>
            {/* Grid del Calendario */}
            <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-px text-center text-xs bg-slate-700 border border-slate-700 min-w-[700px]">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <div key={day} className="font-bold text-gray-400 p-2 bg-slate-800">{day}</div>)}
                    {emptyDays.map((_, i) => <div key={`empty-${i}`} className="bg-slate-800 h-28"></div>)}
                    {monthDays.map(day => {
                        const dayStr = day.toISOString().slice(0, 10);
                        const dayEvents = calendarEvents.filter(e => e.date.toISOString().slice(0,10) === dayStr);
                        const blockedInfo = blockedDates.find(b => b.date === dayStr);
                        const isBlocked = !!blockedInfo;
                        return (
                            <div key={dayStr} className={`h-28 bg-slate-800 p-1 flex flex-col items-start overflow-y-auto relative`}>
                                <span className="font-bold text-white">{day.getDate()}</span>
                                {isBlocked && <div className="absolute inset-0 bg-slate-900 bg-opacity-70 flex flex-col items-center justify-center z-10 p-1"><LockIcon className="text-red-500"/><p className="text-white text-xs text-center break-words">{blockedInfo.comment}</p></div>}
                                {/* Renderizar eventos del día */}
                                {dayEvents.map((event) => (<button key={event.id} onClick={() => setSelectedEvent(event)} className={`w-full text-left text-white text-[10px] p-1 rounded ${event.color} mb-1 truncate`}>{event.title}</button>))}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Modal de Detalles del Evento */}
            {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

// Modal para mostrar los detalles de un evento del calendario.
const EventDetailModal = ({ event, onClose }) => {
     const employee = event.type === 'Solicitud' || event.type === 'Cumpleaños' ? event.employee : null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">{event.type === 'Cumpleaños' ? event.title : (event.details.tipo || event.type)}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon/></button>
                 </div>
                <div className="text-sm space-y-2 text-white">
                    {employee && <p><strong className="text-gray-400">Empleado:</strong> {employee.nombre_completo}</p>}
                    {event.type === 'Solicitud' && (<><p><strong className="text-gray-400">Desde:</strong> {event.details.fecha_inicio}</p><p><strong className="text-gray-400">Hasta:</strong> {event.details.fecha_fin}</p>{event.details.hora_inicio && <p><strong className="text-gray-400">Hora Inicio:</strong> {event.details.hora_inicio}</p>}{event.details.hora_fin && <p><strong className="text-gray-400">Hora Fin:</strong> {event.details.hora_fin}</p>}{event.details.hora_llegada_aprox && <p><strong className="text-gray-400">Llegada Aprox.:</strong> {event.details.hora_llegada_aprox}</p>}{event.details.comentarios_empleado && <p><strong className="text-gray-400">Comentario:</strong> {event.details.comentarios_empleado}</p>}</>)}
                    {event.type === 'Evento Corporativo' && (<p><strong className="text-gray-400">Fecha:</strong> {new Date(event.date).toLocaleDateString('es-ES')}</p>)}
                     {event.type === 'Cumpleaños' && (<p><strong className="text-gray-400">Fecha:</strong> {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>)}
                </div>
            </div>
        </div>
    )
};



// --- NUEVOS MODALES Y VISTAS ---
// Vista para mostrar a los empleados retirados (Admin).
const RetiredEmployeesView = ({ users, onUpdateUser, onRetireUser, currentUser }) => {
    const [viewingProfile, setViewingProfile] = useState(null);
    const retiredUsers = users.filter(u => u.status === 'retirado');

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Empleados Retirados</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700 text-sm text-gray-400">
                        <tr>
                            <th className="p-3">Nombre Completo</th>
                            <th className="p-3">Cargo</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Celular</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {retiredUsers.map(user => (
                            <tr key={user.id} className="border-b border-slate-700">
                                <td className="p-3 font-medium text-white">{user.nombre_completo}</td>
                                <td className="p-3">{user.cargo}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.celular}</td>
                                <td className="p-3">
                                    <button onClick={() => setViewingProfile(user)} className="text-blue-400 hover:text-blue-300">Ver Perfil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {retiredUsers.length === 0 && <p className="text-gray-400 mt-4 text-center">No hay empleados retirados.</p>}
            {viewingProfile && <UserProfileModal user={viewingProfile} onClose={() => setViewingProfile(null)} onUpdateUser={onUpdateUser} currentUser={currentUser} onRetireUser={onRetireUser} users={users}/>}
        </div>
    );
};

// Modal para ver o editar el perfil de un usuario.
const UserProfileModal = ({ user, onClose, onUpdateUser, currentUser, onRetireUser, users }) => {
     const [isEditing, setIsEditing] = useState(false);
    const initialContacts = useMemo(() => {
        try { return JSON.parse(user.contactos_emergencia || '[]'); } catch { return []; }
    }, [user.contactos_emergencia]);

    const [formData, setFormData] = useState({
        ...user,
        contactos_emergencia: initialContacts
    });

    const isSelfProfile = currentUser.id === user.id;

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


     const handleEmergencyContactChange = (index, e) => {
        const { name, value } = e.target;
        const updatedContacts = [...formData.contactos_emergencia];
        if(!updatedContacts[index]) updatedContacts[index] = {};
        updatedContacts[index][name] = value;
        setFormData(prev => ({ ...prev, contactos_emergencia: updatedContacts }));
    };

    const handleSave = () => {
         const dataToSave = {
             ...formData,
             contactos_emergencia: JSON.stringify(formData.contactos_emergencia || [])
         };
         delete dataToSave.color;

        onUpdateUser(user.id, dataToSave);
        setIsEditing(false);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-white">{isSelfProfile ? "Mi Perfil" : user.nombre_completo}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon/></button>
                </div>
                <div className="text-sm space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* SECCIÓN 1: DATOS PERSONALES */}
                    <div className="p-4 bg-slate-700 rounded-lg">
                        <h4 className="font-bold text-lg mb-2 text-white">Datos Personales</h4>
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-xs text-gray-400">Nombre Completo</label><input name="nombre_completo" value={formData.nombre_completo} onChange={handleFieldChange} className="w-full input-style"/></div>
                                <div><label className="block text-xs text-gray-400">Cédula</label><input name="cedula" value={formData.cedula} readOnly={isSelfProfile} className={`w-full input-style ${isSelfProfile ? 'bg-slate-600 cursor-not-allowed' : ''}`}/></div>
                                <div><label className="block text-xs text-gray-400">Dirección</label><input name="direccion" value={formData.direccion} onChange={handleFieldChange} className="w-full input-style"/></div>
                                <div><label className="block text-xs text-gray-400">Fecha Nacimiento</label><input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento || ''} onChange={handleFieldChange} className="w-full input-style"/></div>
                                <div><label className="block text-xs text-gray-400">Celular</label><input name="celular" value={formData.celular} onChange={handleFieldChange} className="w-full input-style"/></div>
                                <div><label className="block text-xs text-gray-400">Email</label><input name="email" value={formData.email} onChange={handleFieldChange} className="w-full input-style"/></div>
                                {currentUser.rol === 'admin' && !isSelfProfile && (
                                    <>
                                        <div><label className="block text-xs text-gray-400">Contraseña</label><input name="password_hash" value={formData.password_hash} onChange={handleFieldChange} className="w-full input-style"/></div>
                                        <div>
                                            <label className="block text-xs text-gray-400">Reporta a</label>
                                            <select name="supervisor_id" value={formData.supervisor_id || ''} onChange={handleFieldChange} className="w-full input-style">
                                                <option value="">Reporta al Administrador</option>
                                                {users.filter(u => u.rol === 'admin' || u.rol === 'supervisor').map(s => (
                                                    <option key={s.id} value={s.id}>{s.nombre_completo}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                            <p className="text-white"><strong className="text-gray-400">Cédula:</strong> {user.tipo_documento} {user.cedula}</p>
                            <p className="text-white"><strong className="text-gray-400">Dirección:</strong> {user.direccion}</p>
                            <p className="text-white"><strong className="text-gray-400">Fecha Nacimiento:</strong> {user.fecha_nacimiento}</p>
                            <p className="text-white"><strong className="text-gray-400">Celular:</strong> {user.celular}</p>
                            <p className="text-white"><strong className="text-gray-400">Email:</strong> {user.email}</p>
                            <p className="text-white"><strong className="text-gray-400">Estado:</strong> {user.status}</p>
                             {currentUser.rol === 'admin' && !isSelfProfile && <p className="text-white"><strong className="text-gray-400">Contraseña (Hash):</strong> {user.password_hash}</p>}
                            </>
                        )}
                    </div>
                    {/* SECCIÓN 2: CONTACTO DE EMERGENCIA */}
                    <div className="p-4 bg-slate-700 rounded-lg">
                         <h4 className="font-bold text-lg mb-2 text-white">Contacto de Emergencia</h4>
                         {isEditing ? (
                             (formData.contactos_emergencia.length > 0 ? formData.contactos_emergencia : [{nombre: '', relacion: '', telefono: ''}]).map((c, i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                     <input name="nombre" value={c.nombre} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Nombre" className="input-style"/>
                                     <input name="relacion" value={c.relacion} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Relación" className="input-style"/>
                                     <input name="telefono" value={c.telefono} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Teléfono" className="input-style"/>
                                </div>
                             ))
                         ) : (
                            initialContacts.length > 0 ? initialContacts.map((c, i) => (<p key={i} className="text-white"><strong className="text-gray-400">{c.relacion}:</strong> {c.nombre} - {c.telefono}</p>)) : <p className="text-gray-400">No registrado</p>
                         )}
                    </div>
                    {/* SECCIÓN 3: INFO DE SALUD */}
                     <div className="p-4 bg-slate-700 rounded-lg">
                        <h4 className="font-bold text-lg mb-2 text-white">Información de Salud y Consideraciones</h4>
                        {isEditing ? (
                             <textarea name="salud_info" value={formData.salud_info} onChange={handleFieldChange} className="input-style w-full" rows="3"/>
                        ) : (
                           <p className="text-white">{user.salud_info || 'No registrada'}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-4 space-x-3">
                    {isEditing ? 
                        <button onClick={handleSave} className="px-4 py-2 bg-emerald-500 rounded text-white">Guardar</button> 
                        : 
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 rounded text-white">Modificar Datos</button>
                    }
                    {currentUser.rol === 'admin' && !isSelfProfile && user.status !== 'retirado' && !isEditing && (
                        <button onClick={() => onRetireUser(user)} className="px-4 py-2 bg-red-500 rounded text-white">Retirar Empleado</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Modal para mostrar el enlace de invitación generado.
const ShowLinkModal = ({ link, onClose }) => {
     return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg text-center">
                <h3 className="text-xl font-bold text-white mb-4">Enlace de Registro Generado</h3>
                <p className="text-gray-300 mb-4">En un entorno real, este enlace se enviaría al nuevo empleado. Para simularlo, copia el enlace, cierra sesión y pégalo en la barra de direcciones de tu navegador.</p>
                <input type="text" readOnly value={link} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-center text-amber-300" />
                <button onClick={() => { navigator.clipboard.writeText(link); alert('Enlace copiado al portapapeles!'); }} className="mt-4 px-4 py-2 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600">Copiar Enlace</button>
                <button onClick={onClose} className="mt-6 px-4 py-2 rounded-md font-medium text-white bg-emerald-500 hover:bg-emerald-600">Entendido</button>
            </div>
        </div>
    );
};

// Componente para la vista "Histórico Solicitudes" (Todos los roles).
const RequestHistoryView = ({ currentUser, solicitudes, users, onEditRequest }) => { // Añadir onEditRequest
    const [filters, setFilters] = useState({ empleado_id: currentUser.rol === 'admin' ? '' : currentUser.id, tipo: '', estado: '', fechaInicio: '', fechaFin: '' });
    // Filtra solicitudes visibles para el rol actual.
    const userSolicitudes = useMemo(() => {
        if (currentUser.rol === 'admin') return solicitudes;
        return solicitudes.filter(s => s.empleado_id === currentUser.id);
    }, [currentUser, solicitudes]);
    // Aplica los filtros seleccionados.
    const filteredSolicitudes = useMemo(() => {
        return userSolicitudes.filter(req => {
            const status = getRequestStatus(req);
            const reqStartDate = new Date(req.fecha_inicio + 'T00:00:00'); // Ensure date interpretation
            const reqEndDate = new Date(req.fecha_fin + 'T00:00:00');
            const filterStartDate = filters.fechaInicio ? new Date(filters.fechaInicio + 'T00:00:00') : null;
            const filterEndDate = filters.fechaFin ? new Date(filters.fechaFin + 'T23:59:59') : null;

            return (filters.empleado_id === '' || req.empleado_id === filters.empleado_id) &&
                   (filters.tipo === '' || req.tipo === filters.tipo) &&
                   (filters.estado === '' || status === filters.estado) &&
                   (!filterStartDate || reqStartDate >= filterStartDate || reqEndDate >= filterStartDate) &&
                   (!filterEndDate || reqStartDate <= filterEndDate);
        });
    }, [userSolicitudes, filters]);

    const handleFilterChange = (e) => setFilters(prev => ({...prev, [e.target.name]: e.target.value}));

    return (
         <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Histórico de Solicitudes</h3>
            {/* Sección de Filtros */}
            <div className={`grid grid-cols-1 ${currentUser.rol === 'admin' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-4 mb-4 p-4 bg-slate-700 rounded-lg`}>
                {currentUser.rol === 'admin' && <select name="empleado_id" value={filters.empleado_id} onChange={handleFilterChange} className="input-style"><option value="">Todos</option>{users.map(u=><option key={u.id} value={u.id}>{u.nombre_completo}</option>)}</select>}
                <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-style"><option value="">Tipo</option><option>Vacaciones</option><option>Permiso Médico</option><option>Permiso Personal</option><option>Evento Personal</option><option>Trabajo Remoto</option></select>
                <select name="estado" value={filters.estado} onChange={handleFilterChange} className="input-style"><option value="">Estado</option><option>Aprobado</option><option>Rechazado</option><option>Pendiente</option><option>Aprob. Parcial</option></select>
                <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} className="input-style"/>
                <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} className="input-style"/>
            </div>
             {/* Tabla de Histórico */}
             <div className="overflow-x-auto"><table className="w-full text-left">
                 <thead className="border-b border-slate-700 text-sm text-gray-400"><tr>{currentUser.rol === 'admin' && <th className="p-3">Empleado</th>}<th className="p-3">Tipo</th><th className="p-3">Fechas</th><th className="p-3">Comentarios Empleado</th><th className="p-3">Comentarios Supervisor</th><th className="p-3">Comentarios Admin</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead>
                 <tbody>{filteredSolicitudes.map(req => {
                     const employee = users.find(u => u.id === req.empleado_id);
                     const isPending = req.estado_supervisor === 'pendiente' && req.estado_admin === 'pendiente';
                     // Permitir edición si es admin O si es el empleado dueño Y la solicitud está pendiente.
                     const canEdit = (currentUser.rol === 'admin' || (currentUser.id === req.empleado_id && isPending));

                     return (
                         <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-700">
                             {currentUser.rol === 'admin' && <td className="p-3 font-medium text-white">{employee?.nombre_completo}</td>}
                             <td className="p-3">{req.tipo}</td>
                             <td className="p-3">{req.fecha_inicio} - {req.fecha_fin}</td>
                             <td className="p-3 text-gray-400 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={req.comentarios_empleado}>{req.comentarios_empleado || 'N/A'}</td>
                             <td className="p-3 text-gray-400 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={req.comentarios_supervisor}>{req.comentarios_supervisor || 'N/A'}</td>
                             <td className="p-3 text-gray-400 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={req.comentarios_admin}>{req.comentarios_admin || 'N/A'}</td>
                             <td className="p-3"><StatusBadge statusSupervisor={req.estado_supervisor} statusAdmin={req.estado_admin} /></td>
                             <td className="p-3">
                                 {canEdit && (
                                     <button onClick={() => onEditRequest(req)} className="text-blue-400 hover:text-blue-300" title="Editar Solicitud">
                                         <EditIcon/>
                                     </button>
                                 )}
                                 {/* Podrías añadir botón de eliminar para admin aquí si es necesario */}
                             </td>
                         </tr>
                    );
                 })}</tbody>
            </table></div>
             {/* Mensaje si no hay resultados */}
            {filteredSolicitudes.length === 0 && <p className="text-gray-400 mt-4 text-center">No se encontraron solicitudes con los filtros aplicados.</p>}
        </div>
    );
};

// Modal para solicitar un documento (Carta Laboral, etc.).
const RequestDocumentModal = ({ onClose, onCreateDocumentRequest, currentUser }) => {
    const [formData, setFormData] = useState({ tipo_documento: 'Carta Laboral', notas: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onCreateDocumentRequest({ ...formData, empleado_id: currentUser.id }); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Solicitar Documento</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Documento</label><select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} className="input-style"><option>Carta Laboral</option><option>Desprendible de Nómina</option><option>Certificado de Ingresos y Retenciones</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-200 mb-1">Notas Adicionales (Opcional)</label><textarea name="notas" value={formData.notas} onChange={handleChange} className="input-style" rows="3"></textarea></div>
                    <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary">Enviar Solicitud</button></div>
                </form>
            </div>
            <style>{`.btn-primary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #10b981; color: white;} .btn-secondary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #475569; color: white;}`}</style>
        </div>
    );
};

// Modal para enviar PQR (Comentario, Queja, Reclamo, etc.).
const PQRFormModal = ({ onClose, onSubmitPQR, currentUser }) => {
    const [formData, setFormData] = useState({ tipo: 'Comentario', mensaje: '', otro_tipo: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSubmitPQR({...formData, empleado_id: currentUser.id }); };
    const pqrTypes = ["Comentario", "Felicitación", "Factor de Riesgo", "Queja", "Reclamo", "Sugerencia", "Otros"];
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Enviar Comentario / PQR</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div><label className="block text-sm font-medium text-gray-200 mb-1">Tipo</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="input-style">{pqrTypes.map(t => <option key={t}>{t}</option>)}</select></div>
                    {formData.tipo === 'Otros' && <div><label className="block text-sm font-medium text-gray-200 mb-1">Especificar Tipo</label><input type="text" name="otro_tipo" value={formData.otro_tipo} onChange={handleChange} required className="input-style"/></div>}
                    <div><label className="block text-sm font-medium text-gray-200 mb-1">Mensaje</label><textarea name="mensaje" value={formData.mensaje} onChange={handleChange} required className="input-style" rows="5"></textarea></div>
                     <div className="flex justify-end pt-4 space-x-3"><button type="button" onClick={onClose} className="btn-secondary">Cancelar</button><button type="submit" className="btn-primary flex items-center"><SendIcon className="h-4 w-4 mr-2"/>Enviar</button></div>
                </form>
            </div>
             <style>{`.btn-primary{display:inline-flex; align-items:center; padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #10b981; color: white;} .btn-secondary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #475569; color: white;}`}</style>
        </div>
    );
};

// Componente para la vista de Gestión PQR (Admin).
const PQRAdminView = ({ pqrSubmissions, users }) => {
    const [filters, setFilters] = useState({ empleado_id: '', tipo: '', fechaInicio: '', fechaFin: '' });

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Ordenar PQR por fecha descendente
    const sortedPQR = useMemo(() => {
        return [...pqrSubmissions].filter(pqr => {
            const pqrDate = new Date(pqr.fecha);
            const filterStartDate = filters.fechaInicio ? new Date(filters.fechaInicio + 'T00:00:00') : null;
            const filterEndDate = filters.fechaFin ? new Date(filters.fechaFin + 'T23:59:59') : null;
            const displayType = pqr.tipo === 'Otros' && pqr.otro_tipo ? `Otros (${pqr.otro_tipo})` : pqr.tipo;

            return (filters.empleado_id === '' || pqr.empleado_id === filters.empleado_id) &&
                   (filters.tipo === '' || displayType === filters.tipo) &&
                   (!filterStartDate || pqrDate >= filterStartDate) &&
                   (!filterEndDate || pqrDate <= filterEndDate);
        }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [pqrSubmissions, filters]);

    const pqrTypes = ["Comentario", "Felicitación", "Factor de Riesgo", "Queja", "Reclamo", "Sugerencia", "Otros"];

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Gestión PQR</h3>
            {/* Sección de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
                <select name="empleado_id" value={filters.empleado_id} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Empleados</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
                </select>
                <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Tipos</option>
                    {pqrTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} className="input-style"/>
                <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} className="input-style"/>
            </div>
             <div className="space-y-4">
                {sortedPQR.length > 0 ? sortedPQR.map(pqr => {
                     const employee = users.find(u => u.id === pqr.empleado_id);
                     const displayType = pqr.tipo === 'Otros' && pqr.otro_tipo ? `Otros (${pqr.otro_tipo})` : pqr.tipo;
                     return (
                         <div key={pqr.id} className="bg-slate-700 p-4 rounded-lg">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-white">{displayType} - {employee?.nombre_completo || 'Usuario Desconocido'}</span>
                                <span className="text-xs text-gray-400">{new Date(pqr.fecha).toLocaleDateString('es-ES')} {new Date(pqr.fecha).toLocaleTimeString('es-ES')}</span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{pqr.mensaje}</p> {/* Preserve line breaks */}
                        </div>
                     );
                }) : <p className="text-gray-400">No hay PQR registradas.</p>}
            </div>
        </div>
    );
};

// Componente para la vista "Mis PQR Enviadas" (Empleado/Supervisor).
const MyPQRView = ({ currentUser, pqrSubmissions, onDeletePQR }) => { // Añadir prop onDeletePQR
    const [filters, setFilters] = useState({ tipo: '', fechaInicio: '', fechaFin: '' });

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

     // Filtra y ordena las PQR del usuario actual
     const myPqr = useMemo(() => {
         return pqrSubmissions
                .filter(pqr => {
                    const pqrDate = new Date(pqr.fecha);
                    const filterStartDate = filters.fechaInicio ? new Date(filters.fechaInicio + 'T00:00:00') : null;
                    const filterEndDate = filters.fechaFin ? new Date(filters.fechaFin + 'T23:59:59') : null;

                    const displayType = pqr.tipo === 'Otros' && pqr.otro_tipo ? `Otros (${pqr.otro_tipo})` : pqr.tipo;

                    return pqr.empleado_id === currentUser.id &&
                           (filters.tipo === '' || displayType === filters.tipo) &&
                           (!filterStartDate || pqrDate >= filterStartDate) &&
                           (!filterEndDate || pqrDate <= filterEndDate);
                })
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
     }, [currentUser, pqrSubmissions, filters]);

    const pqrTypes = ["Comentario", "Felicitación", "Factor de Riesgo", "Queja", "Reclamo", "Sugerencia", "Otros"];

     return (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Mis PQR Enviadas</h3>
            {/* Sección de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
                <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Tipos</option>
                    {pqrTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} className="input-style"/>
                <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} className="input-style"/>
            </div>
             <div className="space-y-4">
                 {myPqr.length > 0 ? myPqr.map(pqr => {
                     const displayType = pqr.tipo === 'Otros' && pqr.otro_tipo ? `Otros (${pqr.otro_tipo})` : pqr.tipo;
                     return (
                        <div key={pqr.id} className="bg-slate-700 p-4 rounded-lg">
                             <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="font-semibold text-white">{displayType}</span>
                                    <span className="text-xs text-gray-400 ml-2">{new Date(pqr.fecha).toLocaleDateString('es-ES')} {new Date(pqr.fecha).toLocaleTimeString('es-ES')}</span>
                                </div>
                                {/* Botón Eliminar */}
                                <button onClick={() => onDeletePQR(pqr.id)} className="text-red-400 hover:text-red-300" title="Eliminar PQR">
                                    <TrashIcon/>
                                </button>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{pqr.mensaje}</p>
                        </div>
                     );
                 }) : <p className="text-gray-400">No has enviado ninguna PQR.</p>}
            </div>
        </div>
    );
};

// Modal para solicitar un nuevo préstamo.
const NewLoanModal = ({ onClose, onCreateLoan, currentUser }) => {
    const [formData, setFormData] = useState({
        monto: '',
        motivo: '',
        comentarios_empleado: '' // Nuevo campo para comentarios
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.monto || !formData.motivo) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        onCreateLoan({ ...formData, empleado_id: currentUser.id });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Solicitar Préstamo</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Monto a Solicitar (COP)</label>
                        <input type="number" name="monto" value={formData.monto} onChange={handleChange} required className="w-full mt-1 input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Motivo del Préstamo</label>
                        <textarea name="motivo" value={formData.motivo} onChange={handleChange} required className="w-full mt-1 input-style" rows="3"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Comentarios (Opcional)</label>
                        <textarea name="comentarios_empleado" value={formData.comentarios_empleado} onChange={handleChange} className="w-full mt-1 input-style" rows="3"></textarea>
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">Enviar Solicitud</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal de confirmación genérico.
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md font-medium bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

// Modal para que el admin apruebe un préstamo y fije la fecha de desembolso.
const ApproveLoanModal = ({ loan, onClose, onConfirm, users }) => {
    const [fechaDesembolso, setFechaDesembolso] = useState('');
    const [comentarioAdmin, setComentarioAdmin] = useState(''); // Nuevo estado para el comentario

    const handleConfirm = () => {
        if (!fechaDesembolso) {
            alert('Por favor, selecciona una fecha de desembolso.');
            return;
        }
        onConfirm(loan.id, 'aprobado', fechaDesembolso, comentarioAdmin); // Pasar comentario
    };
    
    const employee = users.find(u => u.id === loan.empleado_id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold text-white mb-4">Aprobar Préstamo</h3>
                <div className="text-gray-300 space-y-2 mb-4">
                    <p><strong>Empleado:</strong> {employee?.nombre_completo}</p>
                    <p><strong>Monto:</strong> ${new Intl.NumberFormat('es-CO').format(loan.monto)}</p>
                    <p><strong>Motivo:</strong> {loan.motivo}</p>
                    {loan.comentarios_empleado && <p><strong>Comentarios Empleado:</strong> {loan.comentarios_empleado}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">Fecha de Desembolso</label>
                    <input type="date" value={fechaDesembolso} onChange={(e) => setFechaDesembolso(e.target.value)} required className="w-full mt-1 input-style" />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Comentarios para el Empleado (Opcional)</label>
                    <textarea value={comentarioAdmin} onChange={(e) => setComentarioAdmin(e.target.value)} className="w-full mt-1 input-style" rows="3"></textarea>
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-medium bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                    <button onClick={handleConfirm} className="px-4 py-2 rounded-md font-medium bg-emerald-500 hover:bg-emerald-600 text-white">Aprobar y Notificar</button>
                </div>
            </div>
        </div>
    );
};

// Modal para que el admin rechace un préstamo y agregue un comentario.
const RejectLoanModal = ({ loan, onClose, onConfirm, users }) => {
    const [comentarioAdmin, setComentarioAdmin] = useState('');

    const handleConfirm = () => {
        onConfirm(loan.id, 'rechazado', null, comentarioAdmin);
    };
    
    const employee = users.find(u => u.id === loan.empleado_id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold text-white mb-4">Rechazar Préstamo</h3>
                <div className="text-gray-300 space-y-2 mb-4">
                    <p><strong>Empleado:</strong> {employee?.nombre_completo}</p>
                    <p><strong>Monto:</strong> ${new Intl.NumberFormat('es-CO').format(loan.monto)}</p>
                    <p><strong>Motivo:</strong> {loan.motivo}</p>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Comentarios para el Empleado</label>
                    <textarea value={comentarioAdmin} onChange={(e) => setComentarioAdmin(e.target.value)} className="w-full mt-1 input-style" rows="3"></textarea>
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-medium bg-slate-600 hover:bg-slate-700 text-white">Cancelar</button>
                    <button onClick={handleConfirm} className="px-4 py-2 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white">Rechazar y Notificar</button>
                </div>
            </div>
        </div>
    );
};


// Modal para invitar a un nuevo empleado.
const InviteEmployeeModal = ({ onClose, onInvite, users, currentUser }) => {
    const [formData, setFormData] = useState({ 
        nombre_completo: '', 
        email: '', 
        celular: '', 
        cedula: '',
        supervisor_id: currentUser.rol === 'admin' ? '' : currentUser.id // Pre-seleccionar para supervisores
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onInvite(formData, onClose); };

    // Opciones para el selector de supervisor
    const supervisorOptions = users.filter(u => u.rol === 'admin' || u.rol === 'supervisor');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Invitar Nuevo Empleado</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} placeholder="Nombre Completo" required className="input-style"/>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="input-style"/>
                    <input name="celular" value={formData.celular} onChange={handleChange} placeholder="Celular" required className="input-style"/>
                    <input name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Cédula (será la contraseña inicial)" required className="input-style"/>
                    
                    {/* Selector de Supervisor */}
                    {currentUser.rol === 'admin' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Asignar Supervisor</label>
                            <select 
                                name="supervisor_id" 
                                value={formData.supervisor_id} 
                                onChange={handleChange} 
                                className="input-style"
                            >
                                <option value="">Sin supervisor directo (reporta a admin)</option>
                                {supervisorOptions.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre_completo}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Generar Enlace de Invitación</button>
                    </div>
                </form>
                 <style>{`.btn-primary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #10b981; color: white;} .btn-secondary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #475569; color: white;}`}</style>
            </div>
        </div>
    );
};

// Modal para cambiar la contraseña.
const ChangePasswordModal = ({ onClose, onChangePassword, currentUser }) => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [error, setError] = useState('');
    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (passwords.new !== passwords.confirm) { setError('Las nuevas contraseñas no coinciden.'); return; }
        // Aquí iría la lógica para verificar la contraseña actual y cambiarla.
        // Por ahora, simulamos el cambio.
        onChangePassword(currentUser.id, passwords.new);
        alert('Contraseña cambiada con éxito.');
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Cambiar Contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="current" type="password" value={passwords.current} onChange={handleChange} placeholder="Contraseña Actual" required className="input-style"/>
                    <input name="new" type="password" value={passwords.new} onChange={handleChange} placeholder="Nueva Contraseña" required className="input-style"/>
                    <input name="confirm" type="password" value={passwords.confirm} onChange={handleChange} placeholder="Confirmar Nueva Contraseña" required className="input-style"/>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Cambiar Contraseña</button>
                    </div>
                </form>
                <style>{`.btn-primary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #10b981; color: white;} .btn-secondary{padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #475569; color: white;}`}</style>
            </div>
        </div>
    );
};

// Vista de log de eventos (Admin).
const EventLogView = ({ solicitudes, users, onDeleteRequest, onEditRequest }) => {
    const [filters, setFilters] = useState({ empleado_id: '', tipo: '', estado: '', fechaInicio: '', fechaFin: '' });

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const filteredSolicitudes = useMemo(() => {
        return solicitudes.filter(req => {
            const employee = users.find(u => u.id === req.empleado_id);
            const requestStatus = getRequestStatus(req); // Assuming getRequestStatus is available globally or passed
            const reqStartDate = new Date(req.fecha_inicio + 'T00:00:00');
            const reqEndDate = new Date(req.fecha_fin + 'T00:00:00');
            const filterStartDate = filters.fechaInicio ? new Date(filters.fechaInicio + 'T00:00:00') : null;
            const filterEndDate = filters.fechaFin ? new Date(filters.fechaFin + 'T23:59:59') : null;

            return (filters.empleado_id === '' || req.empleado_id === filters.empleado_id) &&
                   (filters.tipo === '' || req.tipo === filters.tipo) &&
                   (filters.estado === '' || requestStatus === filters.estado) &&
                   (!filterStartDate || reqStartDate >= filterStartDate || reqEndDate >= filterStartDate) &&
                   (!filterEndDate || reqStartDate <= filterEndDate);
        });
    }, [solicitudes, users, filters]);

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Log de Sucesos del Sistema</h3>
            {/* Sección de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
                <select name="empleado_id" value={filters.empleado_id} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Empleados</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
                </select>
                <select name="tipo" value={filters.tipo} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Tipos</option>
                    <option>Vacaciones</option>
                    <option>Permiso Médico</option>
                    <option>Permiso Personal</option>
                    <option>Evento Personal</option>
                    <option>Trabajo Remoto</option>
                </select>
                <select name="estado" value={filters.estado} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Estados</option>
                    <option>Aprobado</option>
                    <option>Rechazado</option>
                    <option>Pendiente</option>
                    <option>Aprob. Parcial</option>
                </select>
                <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} className="input-style"/>
                <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} className="input-style"/>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700 text-sm text-gray-400">
                        <tr>
                            <th className="p-3">Empleado</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Fechas</th>
                            <th className="p-3">Estado Supervisor</th>
                            <th className="p-3">Estado Admin</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSolicitudes.map(req => {
                            const employee = users.find(u => u.id === req.empleado_id);
                            return (
                                <tr key={req.id} className="border-b border-slate-700 hover:bg-slate-700">
                                    <td className="p-3 font-medium text-white">{employee?.nombre_completo}</td>
                                    <td className="p-3">{req.tipo}</td>
                                    <td className="p-3">{req.fecha_inicio} - {req.fecha_fin}</td>
                                    <td className="p-3"><StatusBadge estado={req.estado_supervisor} /></td>
                                    <td className="p-3"><StatusBadge estado={req.estado_admin} /></td>
                                    <td className="p-3 flex space-x-2">
                                        <button onClick={() => onEditRequest(req)} className="text-blue-400 hover:text-blue-300"><EditIcon /></button>
                                        <button onClick={() => onDeleteRequest(req.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Vista de gestión de préstamos (Admin).
const LoanManagementView = ({ prestamos, users, onUpdateLoanStatus, onShowApproveLoanModal, onShowRejectLoanModal }) => {
    const [filters, setFilters] = useState({ empleado_id: '', estado: '', fechaInicio: '', fechaFin: '' });

    const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const filteredPrestamos = useMemo(() => {
        return prestamos.filter(loan => {
            const loanDate = new Date(loan.fecha_solicitud);
            const filterStartDate = filters.fechaInicio ? new Date(filters.fechaInicio + 'T00:00:00') : null;
            const filterEndDate = filters.fechaFin ? new Date(filters.fechaFin + 'T23:59:59') : null;

            return (filters.empleado_id === '' || loan.empleado_id === filters.empleado_id) &&
                   (filters.estado === '' || loan.estado === filters.estado) &&
                   (!filterStartDate || loanDate >= filterStartDate) &&
                   (!filterEndDate || loanDate <= filterEndDate);
        });
    }, [prestamos, filters]);

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Gestión de Préstamos</h3>
            {/* Sección de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-700 rounded-lg">
                <select name="empleado_id" value={filters.empleado_id} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Empleados</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
                </select>
                <select name="estado" value={filters.estado} onChange={handleFilterChange} className="input-style">
                    <option value="">Todos los Estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                </select>
                <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} className="input-style"/>
                <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} className="input-style"/>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-700 text-sm text-gray-400">
                        <tr>
                            <th className="p-3">Empleado</th>
                            <th className="p-3">Monto</th>
                            <th className="p-3">Motivo</th>
                            <th className="p-3">Comentarios Empleado</th>
                            <th className="p-3">Comentarios Admin</th>
                            <th className="p-3">Fecha Solicitud</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPrestamos.map(loan => {
                            const employee = users.find(u => u.id === loan.empleado_id);
                            return (
                                <tr key={loan.id} className="border-b border-slate-700 hover:bg-slate-700">
                                    <td className="p-3 font-medium text-white">{employee?.nombre_completo}</td>
                                    <td className="p-3">${new Intl.NumberFormat('es-CO').format(loan.monto)}</td>
                                    <td className="p-3">{loan.motivo}</td>
                                    <td className="p-3 text-gray-400 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={loan.comentarios_empleado}>{loan.comentarios_empleado || 'N/A'}</td>
                                    <td className="p-3 text-gray-400 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={loan.comentarios_admin}>{loan.comentarios_admin || 'N/A'}</td>
                                    <td className="p-3">{loan.fecha_solicitud}</td>
                                    <td className="p-3"><StatusBadge estado={loan.estado} /></td>
                                    <td className="p-3">
                                        {loan.estado === 'pendiente' && (
                                            <div className="flex space-x-2">
                                                <button onClick={() => onShowApproveLoanModal(loan)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-emerald-500 hover:bg-emerald-600">Aprobar</button>
                                                <button onClick={() => onShowRejectLoanModal(loan)} className="px-3 py-1 text-xs font-bold text-white rounded-full bg-red-500 hover:bg-red-600">Rechazar</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DE LA APLICACIÓN ---
export default function App() {
    // --- Estados Principales ---
    const [view, setView] = useState('login');
    const [userForRegistration, setUserForRegistration] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [users, setUsers] = useState([]);
    // Inicializar estados con arrays vacíos si se desea empezar en blanco
    const [solicitudes, setSolicitudes] = useState([]); // Iniciar vacío
    const [prestamos, setPrestamos] = useState([]); // Iniciar vacío
    const [documentos, setDocumentos] = useState([]); // Iniciar vacío
    const [pqrSubmissions, setPqrSubmissions] = useState([]); // Iniciar vacío
    const [blockedDates, setBlockedDates] = useState([]); // Iniciar vacío
    const [notifications, setNotifications] = useState([]);
    const [modal, setModal] = useState(null);
    const [lastGeneratedLink, setLastGeneratedLink] = useState(null);

    // --- Efectos ---
    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            setView('invitation');
            return;
        }

        fetchData(); // Carga inicial

        // Vuelve a cargar los datos cada 15 segundos para mantener la UI actualizada.
        const intervalId = setInterval(() => {
            fetchData();
        }, 15000);

        // Limpia el intervalo cuando el componente se desmonta.
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    async function fetchData() {
        const { data: usersData, error: usersError } = await supabase.from('usuarios').select('*');
        if (usersError) console.error('Error fetching users:', usersError);
        else setUsers(usersData);

        const { data: solicitudesData, error: solicitudesError } = await supabase.from('solicitudes').select('*');
        if (solicitudesError) console.error('Error fetching solicitudes:', solicitudesError);
        else setSolicitudes(solicitudesData);

        const { data: prestamosData, error: prestamosError } = await supabase.from('prestamos').select('*');
        if (prestamosError) console.error('Error fetching prestamos:', prestamosError);
        else setPrestamos(prestamosData);

        const { data: documentosData, error: documentosError } = await supabase.from('documentos').select('*');
        if (documentosError) console.error('Error fetching documents:', documentosError);
        else setDocumentos(documentosData);

        const { data: pqrData, error: pqrError } = await supabase.from('pqr').select('*');
        if (pqrError) console.error('Error fetching PQR:', pqrError);
        else setPqrSubmissions(pqrData);

        const { data: blockedDatesData, error: blockedDatesError } = await supabase.from('fechas_bloqueadas').select('*');
        if (blockedDatesError) console.error('Error fetching blocked dates:', blockedDatesError);
        else setBlockedDates(blockedDatesData);
    }

    // --- Funciones Handler (Manejadores de Eventos) ---
    const addNotification = (message) => { setNotifications(prev => [{ id: `notif-${Date.now()}-${Math.random()}`, message, date: new Date() }, ...prev].slice(0, 10)); };
    const handleLogin = async (cedula, password) => {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('cedula', cedula)
            .single();

        if (error || !data) {
            console.error('Error logging in:', error);
            return false;
        }

        // Verificar si el usuario está en pre-registro
        if (data.status === 'pre-registro') {
            addNotification('Debes completar tu registro a través del enlace de invitación antes de iniciar sesión.');
            return false;
        }

            // Verificar la contraseña (en un caso real, esto debería ser manejado por Supabase Auth de forma segura)
            if (data.password_hash !== password) {
                return false;
            }
        
            // Si todo es correcto, proceder al dashboard
            
            // Actualizar manualmente el estado de los usuarios con los datos nuevos del login
            setUsers(prevUsers => {
                const userExists = prevUsers.some(u => u.id === data.id);
                if (userExists) {
                    return prevUsers.map(u => u.id === data.id ? data : u);
                } else {
                    return [...prevUsers, data];
                }
            });
        
            setCurrentUser(data); 
            setView('app'); 
            setActiveView('dashboard');
            return true;    };
    const handleLogout = () => { setCurrentUser(null); setView('login'); };
    const handleInviteUser = async (newUserInfo, onCloseCallback) => {
        const token = `${newUserInfo.cedula}-${Date.now()}`.slice(0, 255); // Crear un token único y seguro
        const newUserProfile = {
            nombre_completo: newUserInfo.nombre_completo,
            email: newUserInfo.email,
            celular: newUserInfo.celular,
            cargo: 'Nuevo Ingreso',
            area: 'Por Asignar',
            rol: 'empleado',
            status: 'pre-registro',
            supervisor_id: newUserInfo.supervisor_id || null, // Asignar supervisor
            cedula: newUserInfo.cedula,
            password_hash: null, // La contraseña se establecerá en la página de invitación
            contactos_emergencia: JSON.stringify([]),
            salud_info: '',
            fecha_nacimiento: null,
            datos_diligenciados: false,
            onboardingToken: token
        };

        const { data, error } = await supabase.from('usuarios').insert([newUserProfile]).select();

        if (error) {
            console.error('Error inviting user:', error);
            addNotification(`Error al invitar al usuario: ${error.message}`);
            alert(`Error al invitar al usuario: ${error.message}`);
            return;
        }

        if (data) {
            setUsers([...users, ...data]);
            const link = `${window.location.origin}${window.location.pathname}?token=${token}`;
            setLastGeneratedLink(link);
            setModal({type: 'showLink', data: {link: link}});
            addNotification(`Enlace de invitación generado para ${newUserInfo.nombre_completo}.`);
            onCloseCallback();
        }
     };
    const handleCreateRequest = async (requestData) => {
        let newRequest = {
            ...requestData,
            estado_admin: 'pendiente',
            comentarios_supervisor: '', // New field
            comentarios_admin: ''      // New field
        };
        newRequest.estado_supervisor = currentUser.rol === 'supervisor' ? 'aprobado' : 'pendiente';
        
        const { data, error } = await supabase.from('solicitudes').insert([newRequest]).select();

        if (error) {
            console.error('Error creating request:', error);
            addNotification(`Error al crear la solicitud: ${error.message}`);
            return;
        }

        if (data) {
            setSolicitudes([...solicitudes, ...data]);
            addNotification(`Tu solicitud de ${requestData.tipo} ha sido enviada.`);
            setModal(null);
        }
    };
    const handleUpdateRequest = async (updatedRequest) => {
        const { data, error } = await supabase
            .from('solicitudes')
            .update(updatedRequest)
            .eq('id', updatedRequest.id)
            .select();

        if (error) {
            console.error('Error updating request:', error);
            addNotification(`Error al actualizar la solicitud: ${error.message}`);
            return;
        }

        if (data) {
            setSolicitudes(solicitudes.map(s => s.id === updatedRequest.id ? data[0] : s));
            addNotification(`La solicitud ${updatedRequest.id} ha sido actualizada.`);
            setModal(null);
        }
     };
    const handleUpdateRequestStatus = async (requestId, level, status, comment = '') => {
        const request = solicitudes.find(r => r.id === requestId);
        if (!request) return;

        const updatedRequest = { ...request };
        if (level === 'supervisor') {
            updatedRequest.estado_supervisor = status;
            updatedRequest.comentarios_supervisor = comment;
            
            const employee = users.find(u => u.id === request.empleado_id);
            const isAdminActingAsSupervisor = currentUser.rol === 'admin' && employee && (!employee.supervisor_id || employee.supervisor_id === currentUser.id);

            if (status === 'rechazado' || isAdminActingAsSupervisor) {
                updatedRequest.estado_admin = status;
                if (isAdminActingAsSupervisor) {
                    updatedRequest.comentarios_admin = comment;
                }
            }
        } else if (level === 'admin') {
            updatedRequest.estado_admin = status;
            updatedRequest.comentarios_admin = comment;
        }

        const { data, error } = await supabase
            .from('solicitudes')
            .update(updatedRequest)
            .eq('id', requestId)
            .select();

        if (error) {
            console.error('Error updating request status:', error);
            addNotification(`Error al actualizar el estado de la solicitud: ${error.message}`);
            return;
        }

        if (data) {
            setSolicitudes(solicitudes.map(req => req.id === requestId ? data[0] : req));
            const employee = users.find(u => u.id === updatedRequest.empleado_id);
            const message = `La solicitud de ${employee?.nombre_completo || 'Empleado'} ha sido ${status}.`;
            addNotification(message);
        }
    };
    const handleUpdateLoanStatus = async (loanId, status, fechaDesembolso, comentarioAdmin) => {
        const { data, error } = await supabase
            .from('prestamos')
            .update({ estado: status, fecha_desembolso: fechaDesembolso, comentarios_admin: comentarioAdmin })
            .eq('id', loanId)
            .select();

        if (error) {
            console.error('Error updating loan status:', error);
            addNotification(`Error al actualizar el estado del préstamo: ${error.message}`);
            return;
        }

        if (data) {
            setPrestamos(prestamos.map(loan => loan.id === loanId ? data[0] : loan));
            const loan = data[0];
            const employee = users.find(u => u.id === loan.empleado_id);
            addNotification(`El préstamo de ${employee?.nombre_completo || 'Empleado'} fue ${status}`);
            setModal(null);
        }
    };
    const handleDeleteRequest = async (id) => {
        const { error } = await supabase.from('solicitudes').delete().eq('id', id);

        if (error) {
            console.error('Error deleting request:', error);
            addNotification(`Error al eliminar la solicitud: ${error.message}`);
            return;
        }

        setSolicitudes(solicitudes.filter(s => s.id !== id));
        addNotification(`La solicitud ${id} ha sido eliminada.`);
        setModal(null);
    };
    const handleUpdateUser = async (userId, updatedData) => {
        const { data, error } = await supabase
            .from('usuarios')
            .update(updatedData)
            .eq('id', userId)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            addNotification(`Error al actualizar el usuario: ${error.message}`);
            return;
        }

        if (data) {
            setUsers(users.map(u => u.id === userId ? data[0] : u));
            addNotification(`El usuario ${updatedData.nombre_completo} ha sido actualizado.`);
            setModal(null);
        }
    };

    const handleRetireUser = (user) => {
        setModal({type: 'confirmRetire', data: { user }});
    }

    const handleConfirmRetire = async (user) => {
        await handleUpdateUser(user.id, { ...user, status: 'retirado' });
        setModal(null);
    }
    const handleChangePassword = async (userId, newPassword) => {
        // In a real app, you should handle password change securely,
        // for example, by using Supabase Auth functions.
        // Here we directly update the password hash.
        const { data, error } = await supabase
            .from('usuarios')
            .update({ password_hash: newPassword }) // In a real app, you should hash the password
            .eq('id', userId)
            .select();

        if (error) {
            console.error('Error changing password:', error);
            addNotification(`Error al cambiar la contraseña: ${error.message}`);
            return;
        }

        if (data) {
            addNotification('Contraseña cambiada con éxito.');
            setModal(null);
        }
    };
    const handleProfileUpdate = async (userId, profileUpdates) => {
        await handleUpdateUser(userId, profileUpdates);
        addNotification(`Tu perfil ha sido actualizado.`);
    };
    const handleBlockDates = () => {
        setModal({ type: 'blockDates' });
    };

    const handleBlockDatesSubmit = async (startDate, endDate, comment) => {
        const datesToBlock = getDatesInRange(startDate, endDate).map(d => ({
            date: d.toISOString().slice(0, 10),
            comment: comment
        }));

        const { data, error } = await supabase.from('fechas_bloqueadas').insert(datesToBlock).select();

        if (error) {
            console.error('Error blocking dates:', error);
            addNotification(`Error al bloquear las fechas: ${error.message}`);
            return;
        }
        
        if (data) {
            setBlockedDates(prev => [...prev, ...data]);
            addNotification(`Fechas desde ${startDate} hasta ${endDate} han sido bloqueadas.`);
        }
    };

    const handleDeleteBlockedDate = async (dateToDelete) => {
        const { error } = await supabase.from('fechas_bloqueadas').delete().eq('date', dateToDelete);

        if (error) {
            console.error('Error unblocking date:', error);
            addNotification(`Error al desbloquear la fecha: ${error.message}`);
            return;
        }

        setBlockedDates(prev => prev.filter(d => d.date !== dateToDelete));
        addNotification(`La fecha ${dateToDelete} ha sido desbloqueada.`);
    };

        const handleCreateDocumentRequest = async (docData) => {
            const newDocRequest = {
                ...docData,
                estado: 'pendiente',
                fecha_solicitud: new Date().toISOString()
            };
            
            const { data, error } = await supabase.from('documentos').insert([newDocRequest]).select();

            if (error) {
                console.error('Error creating document request:', error);
                addNotification(`Error al crear la solicitud de documento: ${error.message}`);
                return;
            }

            if (data) {
                setDocumentos([...documentos, ...data]);
                addNotification(`Tu solicitud de ${docData.tipo_documento} ha sido enviada.`);
                setModal(null);
            }
        };
        const handleUpdateDocumentStatus = async (docId, status) => {
            const { data, error } = await supabase
                .from('documentos')
                .update({ estado: status })
                .eq('id', docId)
                .select();

            if (error) {
                console.error('Error updating document status:', error);
                addNotification(`Error al actualizar el estado del documento: ${error.message}`);
                return;
            }

            if (data) {
                setDocumentos(documentos.map(doc => doc.id === docId ? data[0] : doc));
                const doc = data[0];
                const employee = users.find(u => u.id === doc.empleado_id);
                addNotification(`La solicitud de documento de ${employee?.nombre_completo || 'Empleado'} ha sido actualizada a '${status}'.`);
            }
    };
        const handleSubmitPQR = async (pqrData) => {
            const newPQR = {
                ...pqrData,
                fecha: new Date().toISOString()
            };
            
            const { data, error } = await supabase.from('pqr').insert([newPQR]).select();

            if (error) {
                console.error('Error submitting PQR:', error);
                addNotification(`Error al enviar PQR: ${error.message}`);
                return;
            }

            if (data) {
                setPqrSubmissions([...pqrSubmissions, ...data]);
                addNotification(`Tu ${pqrData.tipo} ha sido enviado.`);
                setModal(null);
            }
    };
    // Nueva función para eliminar PQR
    const handleDeletePQR = async (pqrId) => {
        const { error } = await supabase.from('pqr').delete().eq('id', pqrId);

        if (error) {
            console.error('Error deleting PQR:', error);
            addNotification(`Error al eliminar PQR: ${error.message}`);
            return;
        }

        setPqrSubmissions(prevPqr => prevPqr.filter(pqr => pqr.id !== pqrId));
        addNotification("PQR eliminada correctamente.");
        setModal(null); // Cierra el modal de confirmación si se usa
    };

    const handleCreateLoan = async (loanData) => {
        const newLoan = {
            ...loanData,
            estado: 'pendiente',
            fecha_solicitud: new Date().toISOString().slice(0,10),
            comentarios_admin: ''
        };

        const { data, error } = await supabase.from('prestamos').insert([newLoan]).select();

        if (error) {
            console.error('Error creating loan:', error);
            addNotification(`Error al crear el préstamo: ${error.message}`);
            return;
        }

        if (data) {
            setPrestamos([...prestamos, ...data]);
            addNotification("Tu solicitud de préstamo ha sido enviada.");
            setModal(null);
        }
    };


    // Obtiene los datos más actualizados del usuario logueado.
    const updatedCurrentUser = users.find(u => u.id === currentUser?.id);

    // --- Renderizado ---
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
        return <InvitationPage 
                    token={token} 
                    onComplete={(updatedUser) => {
                        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                    }}
                    onGoToLogin={() => {
                        const newUrl = window.location.origin + window.location.pathname;
                        window.location.href = newUrl;
                    }}
                />;
    }

    if (view === 'login') return <LoginPage onLogin={handleLogin} users={users} />;
    
    if (view === 'app' && updatedCurrentUser) {
        // Función interna para renderizar la vista activa dentro del AppLayout.
        const renderView = () => {
            switch (activeView) {
                case 'dashboard': return <Dashboard currentUser={updatedCurrentUser} solicitudes={solicitudes} users={users} prestamos={prestamos} documentos={documentos} onUpdateRequestStatus={handleUpdateRequestStatus} onUpdateLoanStatus={handleUpdateLoanStatus} onShowNewRequestModal={() => setModal({type: 'newRequest'})} onShowNewLoanModal={() => setModal({type: 'newLoan'})} onBlockDates={handleBlockDates} onShowApproveLoanModal={(loan) => setModal({type: 'approveLoan', data: loan})} onShowRejectLoanModal={(loan) => setModal({type: 'rejectLoan', data: loan})} onShowRequestDocModal={() => setModal({ type: 'requestDocument' })} onShowPQRModal={() => setModal({ type: 'submitPQR' })} onUpdateDocStatus={handleUpdateDocumentStatus} />;
                case 'calendar': return <CalendarView currentUser={updatedCurrentUser} solicitudes={solicitudes} users={users} blockedDates={blockedDates} />;
                case 'requestHistory': return <RequestHistoryView currentUser={updatedCurrentUser} solicitudes={solicitudes} users={users} onEditRequest={(req) => setModal({type: 'editRequest', data: req})} />; // Pasar onEditRequest
                                case 'team': return <TeamManagement currentUser={updatedCurrentUser} users={users} onShowInviteModal={() => setModal({type: 'inviteEmployee', data: { users: users, currentUser: updatedCurrentUser }})} onUpdateUser={handleUpdateUser} onRetireUser={handleRetireUser} onShowLastGeneratedLink={() => setModal({type: 'showLink', data: {link: lastGeneratedLink}})} onShowUserInvitationLink={(user) => { const link = `${window.location.origin}${window.location.pathname}?token=${user.onboardingToken}`; navigator.clipboard.writeText(link); addNotification(`Enlace para ${user.nombre_completo} copiado.`); }} />;                case 'events': return <EventLogView solicitudes={solicitudes} users={users} onDeleteRequest={(id) => setModal({type: 'confirmDeleteRequest', data: {id: id}})} onEditRequest={(req) => setModal({type: 'editRequest', data: req})} />;
                case 'loans': return <LoanManagementView prestamos={prestamos} users={users} onUpdateLoanStatus={handleUpdateLoanStatus} onShowApproveLoanModal={(loan) => setModal({type: 'approveLoan', data: loan})} onShowRejectLoanModal={(loan) => setModal({type: 'rejectLoan', data: loan})} />;
                case 'pqrAdmin': return <PQRAdminView pqrSubmissions={pqrSubmissions} users={users} />;
                case 'myPqr': return <MyPQRView currentUser={updatedCurrentUser} pqrSubmissions={pqrSubmissions} onDeletePQR={(id) => setModal({type: 'confirmDeletePQR', data: {id: id}})} />;
                case 'retiredEmployees': return <RetiredEmployeesView users={users} onUpdateUser={handleUpdateUser} onRetireUser={handleRetireUser} currentUser={updatedCurrentUser} />;
                default: return <Dashboard currentUser={updatedCurrentUser} />;
            }
        };
        // Renderiza el layout principal y los modales condicionalmente.
        return (<>
            <AppLayout currentUser={updatedCurrentUser} onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView} notifications={notifications} onShowChangePasswordModal={() => setModal({ type: 'changePassword' })} onShowMyProfileModal={() => setModal({ type: 'myProfile', data: updatedCurrentUser })}>{renderView()}</AppLayout>
            {/* Renderizado Condicional de Modales */}
            {modal?.type === 'newRequest' && <NewRequestModal onClose={() => setModal(null)} onCreateRequest={handleCreateRequest} currentUser={updatedCurrentUser} blockedDates={blockedDates} />}
            {modal?.type === 'editRequest' && <EditRequestModal request={modal.data} onClose={() => setModal(null)} onSave={handleUpdateRequest} users={users}/>}
            {modal?.type === 'blockDates' && <BlockDatesModal onClose={() => setModal(null)} onBlockDates={handleBlockDatesSubmit} blockedDates={blockedDates} onDeleteBlockedDate={handleDeleteBlockedDate} />}
            {modal?.type === 'newLoan' && <NewLoanModal onClose={() => setModal(null)} onCreateLoan={handleCreateLoan} currentUser={updatedCurrentUser}/>}
            {modal?.type === 'confirmDeleteRequest' && <ConfirmModal title="Confirmar Eliminación" message="¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer." onConfirm={() => handleDeleteRequest(modal.data.id)} onCancel={() => setModal(null)} />}
            {modal?.type === 'confirmDeletePQR' && <ConfirmModal title="Confirmar Eliminación" message="¿Estás seguro de que deseas eliminar esta PQR? Esta acción no se puede deshacer." onConfirm={() => handleDeletePQR(modal.data.id)} onCancel={() => setModal(null)} />}
            {modal?.type === 'confirmRetire' && <ConfirmModal title="Confirmar Retiro" message={`¿Estás seguro de que deseas retirar a ${modal.data.user.nombre_completo}? Esta acción no se puede deshacer.`} onConfirm={() => handleConfirmRetire(modal.data.user)} onCancel={() => setModal(null)} />}
            {modal?.type === 'approveLoan' && <ApproveLoanModal loan={modal.data} onClose={() => setModal(null)} onConfirm={handleUpdateLoanStatus} users={users} />}
            {modal?.type === 'rejectLoan' && <RejectLoanModal loan={modal.data} onClose={() => setModal(null)} onConfirm={handleUpdateLoanStatus} users={users} />}
            {modal?.type === 'inviteEmployee' && <InviteEmployeeModal onClose={() => setModal(null)} onInvite={handleInviteUser} users={users} currentUser={updatedCurrentUser} />}
            {modal?.type === 'changePassword' && <ChangePasswordModal onClose={() => setModal(null)} onChangePassword={handleChangePassword} currentUser={updatedCurrentUser} />}
            {modal?.type === 'myProfile' && <UserProfileModal user={modal.data} onClose={() => setModal(null)} onUpdateUser={handleUpdateUser} currentUser={updatedCurrentUser} onRetireUser={handleRetireUser}/>}
            {modal?.type === 'requestDocument' && <RequestDocumentModal onClose={() => setModal(null)} onCreateDocumentRequest={handleCreateDocumentRequest} currentUser={updatedCurrentUser} />}
            {modal?.type === 'submitPQR' && <PQRFormModal onClose={() => setModal(null)} onSubmitPQR={handleSubmitPQR} currentUser={updatedCurrentUser} />}
            {/* Estilos Globales */}
            <style>{`
                .input-style { background-color: #334155; border: 1px solid #475569; border-radius: 0.375rem; padding: 0.5rem 0.75rem; color: white; width: 100%; }
                .input-style:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5); }
                .input-style::placeholder { color: #94a3b8; }
                input[type="date"]::-webkit-calendar-picker-indicator, input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
                .input-style[readonly] { background-color: #475569; cursor: not-allowed; }
            `}</style>
        </>);
    }
    // Estado de carga inicial o si currentUser se pierde.
    return <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">Cargando...</div>;
}

