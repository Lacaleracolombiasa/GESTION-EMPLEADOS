
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const InvitationPage = ({ token, onComplete, onGoToLogin }) => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formData, setFormData] = useState({
        tipo_documento: '',
        direccion: '',
        fecha_nacimiento: '',
        email: user?.email || '',
        celular: user?.celular || '',
        contactos_emergencia: [],
        salud_info: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1); // 1: Formulario, 2: Éxito

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Token de invitación no proporcionado.');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('onboardingToken', token)
                .single();

            if (error || !data) {
                setError('Este enlace de invitación no es válido o ha expirado.');
                setUser(null);
            } else {
                setUser(data);
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEmergencyContactChange = (index, e) => {
        const { name, value } = e.target;
        const updatedContacts = [...formData.contactos_emergencia];
        if(!updatedContacts[index]) updatedContacts[index] = {};
        updatedContacts[index][name] = value;
        setFormData(prev => ({ ...prev, contactos_emergencia: updatedContacts }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        const { data, error } = await supabase
            .from('usuarios')
            .update({
                password_hash: password, // En una app real, hashear la contraseña antes de guardarla.
                datos_diligenciados: true,
                status: 'activo',
                onboardingToken: null, // Invalidar el token después de su uso
                tipo_documento: formData.tipo_documento,
                direccion: formData.direccion,
                fecha_nacimiento: formData.fecha_nacimiento,
                email: formData.email,
                celular: formData.celular,
                contactos_emergencia: JSON.stringify(formData.contactos_emergencia),
                salud_info: formData.salud_info,
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            setError('Hubo un error al actualizar tu perfil. Por favor, inténtalo de nuevo.');
            console.error("Error updating user:", error);
        } else {
            onComplete(data); // Opcional: para actualizar el estado en App.jsx si es necesario
            setStep(2); // Cambiar a la vista de éxito
        }
    };

    if (loading) {
        return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Verificando invitación...</div>;
    }

    if (error) {
        return (
            <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-center p-4">
                <div>
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                    <p>{error}</p>
                    <button onClick={onGoToLogin} className="mt-6 px-4 py-2 rounded-md font-medium text-white bg-emerald-500 hover:bg-emerald-600">
                        Ir al Inicio de Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center p-4">
                <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-emerald-500">¡Registro Completado!</h2>
                    <p className="text-gray-300">Tu perfil ha sido configurado exitosamente. Ahora puedes iniciar sesión con tu cédula y tu nueva contraseña.</p>
                    <button onClick={onGoToLogin} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-200">Finaliza tu Registro</h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Bienvenido, <span className="font-bold">{user?.nombre_completo}</span>. Completa tus datos y crea una contraseña para activar tu cuenta.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Tipo de Documento</label>
                        <input type="text" name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} required className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Dirección</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Fecha de Nacimiento</label>
                        <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Cédula</label>
                        <input
                            type="text"
                            value={user?.cedula || ''}
                            readOnly
                            className="mt-1 block w-full input-style bg-slate-700 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Celular</label>
                        <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required className="mt-1 block w-full input-style" />
                    </div>

                    <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 text-white mt-6">Contacto de Emergencia</h3>
                    {(formData.contactos_emergencia.length > 0 ? formData.contactos_emergencia : [{nombre: '', relacion: '', telefono: ''}]).map((c, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                            <input name="nombre" value={c.nombre} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Nombre" className="input-style"/>
                            <input name="relacion" value={c.relacion} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Relación" className="input-style"/>
                            <input name="telefono" value={c.telefono} onChange={(e) => handleEmergencyContactChange(i, e)} placeholder="Teléfono" className="input-style"/>
                        </div>
                    ))}
                    <button type="button" onClick={() => setFormData(prev => ({...prev, contactos_emergencia: [...prev.contactos_emergencia, {nombre: '', relacion: '', telefono: ''}]}))} className="px-3 py-1 text-sm font-bold text-white rounded-full bg-blue-500 hover:bg-blue-600">Añadir Contacto</button>

                    <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 text-white mt-6">Información de Salud</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Información de Salud y Consideraciones</label>
                        <textarea name="salud_info" value={formData.salud_info} onChange={handleChange} className="input-style w-full" rows="3"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200">Nueva Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full input-style"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full input-style"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700">
                            Guardar y Activar Cuenta
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .input-style { background-color: #334155; border: 1px solid #475569; border-radius: 0.375rem; padding: 0.5rem 0.75rem; color: white; width: 100%; }
                .input-style:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5); }
            `}</style>
        </div>
    );
};

export default InvitationPage;
