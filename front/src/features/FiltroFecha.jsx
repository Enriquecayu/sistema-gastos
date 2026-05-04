import { useState } from 'react';

export const FiltroFecha = ({ onFiltrar }) => {
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');

    const manejarCambio = () => {
        onFiltrar({ desde, hasta });
    };

    const limpiar = () => {
        setDesde('');
        setHasta('');
        onFiltrar({ desde: '', hasta: '' });
    };

    return (
        <div style={{
            background: '#fff', padding: '15px', borderRadius: '10px',
            marginBottom: '20px', border: '1px solid #ddd', display: 'flex',
            flexDirection: 'column', gap: '10px'
        }}>
            <h4 style={{ margin: 0, color: '#555' }}>Filtrar por periodo:</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
                <span>al</span>
                <input
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={manejarCambio}
                    style={{ flex: 2, background: '#34495e', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Aplicar Filtro
                </button>
                <button
                    onClick={limpiar}
                    style={{ flex: 1, background: '#34495e', border: '1px solid #ccc', padding: '8px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
};