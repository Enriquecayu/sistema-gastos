import { useState } from 'react';
import api from '../api/axios';

export const FormularioTransaccion = ({ onGuardar }) => {
    const [formData, setFormData] = useState({
        descripcion: '',
        monto: '',
        categoria: 'Administración', // Categoría inicial más formal
        tipo: 'gasto'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.descripcion || !formData.monto) return alert("Por favor, complete los datos del registro.");

        try {
            await api.post('/transacciones', formData);
            setFormData({ descripcion: '', monto: '', categoria: 'Administración', tipo: 'gasto' });
            onGuardar();
        } catch (error) {
            console.error("Error al registrar movimiento institucional:", error);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid #ddd',
        fontSize: '1.1rem',
        marginTop: '5px',
        backgroundColor: '#ffffff',
        color: '#000000', // Texto negro puro asegurado
        outline: 'none',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#2c3e50',
        fontSize: '0.95rem',
        display: 'block',
        marginBottom: '5px'
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                alignItems: 'start'
            }}
        >
            {/* COLUMNA IZQUIERDA: IDENTIFICACIÓN DEL MOVIMIENTO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={labelStyle}>Descripcion</label>
                    <input
                        type="text"
                        placeholder="Ej: Pago Cooperadora, Compra de tizas, Insumos computación..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Importe Total ($)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={formData.monto}
                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* COLUMNA DERECHA: CLASIFICACIÓN INSTITUCIONAL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={labelStyle}>Área</label>
                        <select
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="Administración">Administración</option>
                            <option value="Cooperadora">Cooperadora</option>
                            <option value="Infraestructura">Infraestructura</option>
                            <option value="Eventos">Eventos y Actos</option>
                            <option value="Insumos">Insumos Educativos</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Tipo de Operación</label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            style={{
                                ...inputStyle,
                                color: formData.tipo === 'gasto' ? '#e74c3c' : '#27ae60',
                                fontWeight: 'bold'
                            }}
                        >
                            <option value="gasto">Egreso / Gasto (-)</option>
                            <option value="ingreso">Ingreso / Entrada (+)</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#2c3e50', // Azul institucional más serio
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        marginTop: '10px',
                        boxShadow: '0 4px 15px rgba(44, 62, 80, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Registrar Transaccion
                </button>
            </div>
        </form>
    );
};