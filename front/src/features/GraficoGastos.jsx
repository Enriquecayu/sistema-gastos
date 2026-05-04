import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registramos los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoGastos = ({ transacciones }) => {
    // 1. Filtramos solo los gastos
    const gastos = transacciones.filter(t => t.tipo === 'gasto');

    // 2. Agrupamos montos por categoría
    const categoriasMap = gastos.reduce((acc, t) => {
        const cat = t.categoria || 'Otros';
        acc[cat] = (acc[cat] || 0) + parseFloat(t.monto);
        return acc;
    }, {});

    const data = {
        labels: Object.keys(categoriasMap),
        datasets: [
            {
                label: 'Gastos por Categoría',
                data: Object.values(categoriasMap),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56',
                    '#4BC0C0', '#9966FF', '#FF9F40'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '10px', border: '1px solid #ddd' }}>
            <h3 style={{ textAlign: 'center' }}>Distribución de Gastos</h3>
            {gastos.length > 0 ? (
                <Pie data={data} options={{ responsive: true }} />
            ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>No hay gastos para graficar.</p>
            )}
        </div>
    );
};