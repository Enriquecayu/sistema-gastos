import { useEffect, useState, useCallback } from 'react';
import api from './api/axios';

function App() {
  // --- ESTADOS ---
  const [transacciones, setTransacciones] = useState([]);
  const [borradas, setBorradas] = useState([]); // Estado para la papelera
  const [balance, setBalance] = useState(0);
  const [mostrarPapelera, setMostrarPapelera] = useState(false);
  
  // Estados para el formulario
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('ingreso');

  // --- LÓGICA DE CARGA (READ) ---
  const cargarDatos = useCallback(async () => {
    try {
      const resBalance = await api.get('/balance');
      const resTrans = await api.get('/transacciones');
      
      setBalance(resBalance.data?.saldo_total || 0);
      setTransacciones(resTrans.data || []);
    } catch (error) {
      console.error("Error al conectar con el Backend:", error);
    }
  }, []);

  const cargarPapelera = async () => {
    try {
      const res = await api.get('/transacciones/papelera');
      setBorradas(res.data || []);
    } catch (error) {
      console.error("Error al cargar papelera:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- LÓGICA DE CREACIÓN (CREATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion || !monto) return alert("Completá todos los campos");

    try {
      await api.post('/transacciones', {
        descripcion,
        monto: parseFloat(monto),
        tipo
      });
      setDescripcion('');
      setMonto('');
      cargarDatos(); // Recarga sin refrescar pantalla
    } catch (error) {
      alert("Error al guardar");
    }
  };

  // --- LÓGICA DE BORRADO LÓGICO (DELETE) ---
  const eliminarTransaccion = async (id) => {
    if (window.confirm("¿Enviar a la papelera?")) {
      try {
        await api.delete(`/transacciones/${id}`);
        cargarDatos();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  // --- LÓGICA DE RESTAURACIÓN ---
  const restaurarTransaccion = async (id) => {
    try {
      await api.post(`/transacciones/restaurar/${id}`);
      cargarPapelera(); // Actualiza lista de borrados
      cargarDatos();    // Actualiza lista activa y balance
    } catch (error) {
      alert("Error al restaurar");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Control de Gastos 💰</h1>
        <div style={{ 
          background: balance >= 0 ? '#2ecc71' : '#e74c3c', 
          color: 'white', padding: '20px', borderRadius: '12px', transition: '0.3s'
        }}>
          <h2 style={{ margin: 0 }}>Saldo Actual</h2>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            ${Number(balance).toLocaleString()}
          </p>
        </div>
      </header>

      {/* FORMULARIO */}
      {!mostrarPapelera && (
        <section style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3>Nueva Transacción</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ padding: '10px' }} />
            <input type="number" placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} style={{ padding: '10px' }} />
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ padding: '10px' }}>
              <option value="ingreso">Ingreso (+)</option>
              <option value="gasto">Gasto (-)</option>
            </select>
            <button type="submit" style={{ padding: '12px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>Guardar</button>
          </form>
        </section>
      )}

      {/* BOTÓN PAPELERA */}
      <button 
        onClick={() => {
          setMostrarPapelera(!mostrarPapelera);
          if (!mostrarPapelera) cargarPapelera();
        }}
        style={{ marginBottom: '20px', background: '#95a5a6', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
      >
        {mostrarPapelera ? "← Volver al Historial" : "Ver Papelera 🗑️"}
      </button>

      {/* CONTENIDO PRINCIPAL */}
      <section>
        <h3>{mostrarPapelera ? "Papelera de Reciclaje" : "Historial de Movimientos"}</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '10px' }}>
          
          {/* MODO PAPELERA */}
          {mostrarPapelera ? (
            borradas.length === 0 ? <p>Papelera vacía</p> : borradas.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                <span>{t.descripcion} (${t.monto})</span>
                <button onClick={() => restaurarTransaccion(t.id)} style={{ color: '#2ecc71', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold' }}>Restaurar</button>
              </div>
            ))
          ) : (
            /* MODO HISTORIAL */
            transacciones.length === 0 ? <p>No hay movimientos</p> : [...transacciones].reverse().map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee' }}>
                <div>
                  <span style={{ fontWeight: '500' }}>{t.descripcion}</span>
                  <br /><small style={{ color: '#aaa' }}>{new Date(t.createdAt).toLocaleDateString()}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: t.tipo === 'gasto' ? '#e74c3c' : '#27ae60' }}>
                    {t.tipo === 'gasto' ? '-' : '+'}${parseFloat(t.monto).toLocaleString()}
                  </span>
                  <button onClick={() => eliminarTransaccion(t.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>×</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;