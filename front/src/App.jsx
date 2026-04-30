import { useEffect, useState } from 'react';
import api from './api/axios';

function App() {
  // --- ESTADOS ---
  const [transacciones, setTransacciones] = useState([]);
  const [balance, setBalance] = useState(0);
  
  // Estados para el formulario
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('ingreso');

  // --- LÓGICA DE CARGA (READ) ---
  // Metemos la función aquí para evitar el error de "cascading renders"
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resBalance = await api.get('/balance');
        const resTrans = await api.get('/transacciones');
        
        setBalance(resBalance.data?.saldo_total || 0);
        setTransacciones(resTrans.data || []);
      } catch (error) {
        console.error("Error al conectar con el Backend:", error);
      }
    };

    cargarDatos();
  }, []); // Array vacío: solo se ejecuta al montar el componente

  // --- LÓGICA DE CREACIÓN (CREATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica de analista
    if (!descripcion || !monto) return alert("Completá todos los campos");

    try {
      await api.post('/transacciones', {
        descripcion,
        monto: parseFloat(monto),
        tipo
      });

      // Limpiamos el formulario
      setDescripcion('');
      setMonto('');
      
      // Forzamos la recarga de datos para ver el nuevo balance y lista
      window.location.reload(); 
      // Nota: También podrías volver a llamar a cargarDatos si la sacás del useEffect
    } catch (error) {
      console.error("Error al crear transacción:", error);
      alert("Hubo un error al guardar");
    }
  };

  

  // --- RENDERIZADO (VISTA) ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Control de Gastos 💰</h1>
        <div style={{ 
          background: '#2ecc71', color: 'white', padding: '20px', 
          borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ margin: 0 }}>Saldo Actual</h2>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            ${balance.toLocaleString()}
          </p>
        </div>
      </header>

      {/* FORMULARIO */}
      <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Nueva Transacción</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" placeholder="Ej: Sueldo, Supermercado..." 
            value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input 
            type="number" placeholder="Monto" 
            value={monto} onChange={(e) => setMonto(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <select 
            value={tipo} onChange={(e) => setTipo(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="ingreso">Ingreso (+)</option>
            <option value="gasto">Gasto (-)</option>
          </select>
          <button type="submit" style={{ 
            padding: '12px', background: '#3498db', color: 'white', 
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' 
          }}>
            Guardar Movimiento
          </button>
        </form>
      </section>

      {/* LISTADO */}
     {/* --- LISTADO CON SCROLL --- */}
<section>
  <h3>Historial de Movimientos</h3>
  
  <div style={{ 
    maxHeight: '400px',      // Altura máxima antes de activar el scroll
    overflowY: 'auto',       // Activa el scroll vertical solo si es necesario
    padding: '10px',
    background: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' // Un toque de profundidad
  }}>
    {transacciones.length === 0 ? (
      <p style={{ textAlign: 'center', color: '#888' }}>No hay movimientos registrados.</p>
    ) : (
      // Usamos .reverse() para que la más nueva aparezca arriba
      [...transacciones].reverse().map((t) => (
        <div key={t.id} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '12px', 
          borderBottom: '1px solid #eee',
          fontSize: '14px'
        }}>
          <span style={{ fontWeight: '500' }}>{t.descripcion}</span>
          <span style={{ 
            fontWeight: 'bold', 
            color: t.tipo === 'gasto' ? '#e74c3c' : '#27ae60' 
          }}>
            {t.tipo === 'gasto' ? '-' : '+'}${t.monto}
          </span>
        </div>
      ))
    )}
  </div>
</section>
    </div>
  );
}

export default App;