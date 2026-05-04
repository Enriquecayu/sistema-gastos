import { useEffect, useState } from 'react';
import api from '../api/axios';

export const Papelera = ({ onRestaurar }) => {
    const [borradas, setBorradas] = useState([]);

    const cargarPapelera = async () => {
        try {
            const res = await api.get('/transacciones/papelera');
            setBorradas(res.data || []);
        } catch (error) {
            console.error("Error al cargar papelera:", error);
        }
    };

    useEffect(() => {
        cargarPapelera();
    }, []);

    const handleRestaurar = async (id) => {
        try {
            await api.post(`/transacciones/restaurar/${id}`);
            cargarPapelera();
            onRestaurar();
        } catch (error) {
            alert("Error al restaurar");
        }
    };

    return (
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '10px' }}>
            {borradas.length === 0 ? <p>Papelera vacía</p> : borradas.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                    <span>{t.descripcion} (${t.monto})</span>
                    <button onClick={() => handleRestaurar(t.id)} style={{ color: '#2ecc71', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold' }}>Restaurar</button>
                </div>
            ))}
        </div>
    );
};