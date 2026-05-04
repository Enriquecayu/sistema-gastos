import { useEffect, useState, useCallback } from 'react';
import api from './api/axios';

// Componentes
import { BalanceCard } from './components/BalanceCard';
import { FormularioTransaccion } from './features/FormularioTransaccion';
import { Papelera } from './features/Papelera';
import { GraficoGastos } from './features/GraficoGastos';
import { FiltroFecha } from './features/FiltroFecha';

function App() {
  const [transacciones, setTransacciones] = useState([]);
  const [balance, setBalance] = useState(0);
  const [rango, setRango] = useState({ desde: '', hasta: '' });
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const [vistaActual, setVistaActual] = useState('inicio');
  const [mostrarPapelera, setMostrarPapelera] = useState(false);
  const [verGrafico, setVerGrafico] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      const resBalance = await api.get('/balance');
      const resTrans = await api.get('/transacciones');
      setBalance(resBalance.data?.saldo_total || 0);
      setTransacciones(resTrans.data || []);
    } catch (error) {
      console.error("Error al conectar con la base de datos:", error);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const transaccionesFiltradas = transacciones.filter(t => {
    const cumpleFecha = (!rango.desde || !rango.hasta) ? true :
      (new Date(t.createdAt).toISOString().split('T')[0] >= rango.desde &&
        new Date(t.createdAt).toISOString().split('T')[0] <= rango.hasta);
    const cumpleTipo = filtroTipo === 'todos' ? true : t.tipo === filtroTipo;
    return cumpleFecha && cumpleTipo;
  });

  const eliminarTransaccion = async (id) => {
    if (window.confirm("¿Confirma que desea enviar este registro a la papelera?")) {
      try {
        await api.delete(`/transacciones/${id}`);
        cargarDatos();
      } catch (error) {
        alert("Error al procesar la eliminación");
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* CABECERA INSTITUCIONAL */}
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>Sistema de Gestión de Gastos 🏫</h1>
        <div style={{ maxWidth: '500px', margin: '0 auto', marginBottom: '25px' }}>
          <BalanceCard balance={balance} />
        </div>

        <button
          onClick={() => {
            setVistaActual(vistaActual === 'inicio' ? 'datos' : 'inicio');
            setMostrarPapelera(false);
            setVerGrafico(false);
          }}
          style={{
            padding: '14px 60px', borderRadius: '35px', border: 'none', cursor: 'pointer',
            backgroundColor: '#3498db', color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
            boxShadow: '0 6px 20px rgba(52, 152, 219, 0.3)', transition: '0.3s'
          }}
        >
          {vistaActual === 'inicio' ? "Ver Libro Diario y Estadísticas →" : "← Volver a Carga de Datos"}
        </button>
      </header>

      {/* SECCIÓN DE CARGA (FORMULARIO PANORÁMICO) */}
      {vistaActual === 'inicio' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <div style={{
            background: 'white', padding: '45px', borderRadius: '25px',
            boxShadow: '0 12px 45px rgba(0,0,0,0.1)', width: '95%', maxWidth: '1200px'
          }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50', textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
              Registro de Movimiento Institucional
            </h2>
            <FormularioTransaccion onGuardar={cargarDatos} />
          </div>
        </div>
      )}

      {/* VISTA DE CONSULTA (DOS COLUMNAS) */}
      {vistaActual === 'datos' && (
        <main style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', alignItems: 'start', animation: 'fadeIn 0.4s' }}>

          {/* COLUMNA IZQUIERDA: FILTROS Y HERRAMIENTAS */}
          <aside style={{ position: 'sticky', top: '20px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '20px', fontSize: '1.3rem' }}>Panel de Control</h3>

              <FiltroFecha onFiltrar={(nuevoRango) => setRango(nuevoRango)} />

              <div style={{ margin: '25px 0', padding: '20px 0', borderTop: '1px solid #f1f3f5' }}>
                <span style={{ fontSize: '0.9rem', color: '#7f8c8d', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>Filtrar por Naturaleza:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['todos', 'ingreso', 'gasto'].map((tipo) => (
                    <button key={tipo} onClick={() => setFiltroTipo(tipo)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer',
                        background: filtroTipo === tipo ? '#2c3e50' : 'white', color: filtroTipo === tipo ? 'white' : '#7f8c8d', fontWeight: 'bold', transition: '0.2s'
                      }}>
                      {tipo === 'todos' ? 'Todos' : tipo === 'ingreso' ? 'Ing.' : 'Egr.'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { setMostrarPapelera(!mostrarPapelera); setVerGrafico(false); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', background: mostrarPapelera ? '#2c3e50' : '#f1f3f5', color: mostrarPapelera ? 'white' : '#7f8c8d', fontWeight: 'bold', border: '1px solid #ddd', cursor: 'pointer' }}>
                  {mostrarPapelera ? "← Volver" : "Papelera 🗑️"}
                </button>
                {!mostrarPapelera && (
                  <button onClick={() => setVerGrafico(!verGrafico)}
                    style={{ flex: 1, padding: '14px', borderRadius: '10px', background: verGrafico ? '#2c3e50' : '#8e44ad', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    {verGrafico ? "Lista 📋" : "Gráfico 📊"}
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* COLUMNA DERECHA: RESULTADOS (LISTA CON SCROLL DE 6 ELEMENTOS) */}
          <section style={{ background: 'white', padding: '35px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', minHeight: '600px' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f8f9fa', paddingBottom: '15px', marginBottom: '25px' }}>
              {mostrarPapelera ? "Registros Eliminados" : verGrafico ? "Análisis de Presupuesto" : "Libro Diario de Movimientos"}
            </h3>

            {mostrarPapelera ? (
              <Papelera onRestaurar={cargarDatos} />
            ) : verGrafico ? (
              <GraficoGastos transacciones={transaccionesFiltradas} />
            ) : (
              /* Altura máxima calculada para mostrar exactamente 6 movimientos antes del scroll */
              <div style={{
                maxHeight: '530px',
                overflowY: 'auto',
                paddingRight: '15px'
              }}>
                {transaccionesFiltradas.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#bdc3c7', marginTop: '50px', fontSize: '1.1rem' }}>
                    No se encontraron movimientos registrados.
                  </p>
                ) : (
                  [...transaccionesFiltradas].reverse().map((t) => (
                    <div key={t.id} style={{
                      display: 'flex', justifyContent: 'space-between', padding: '20px 10px',
                      borderBottom: '1px solid #f1f3f5', alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '1.15rem', color: '#2c3e50', marginBottom: '4px' }}>
                          {t.descripcion}
                        </strong>
                        <span style={{
                          fontSize: '0.85rem', color: '#ffffff', backgroundColor: '#95a5a6',
                          padding: '2px 8px', borderRadius: '12px', marginRight: '10px'
                        }}>
                          {t.categoria}
                        </span>
                        <small style={{ color: '#bdc3c7' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                        <span style={{
                          fontWeight: 'bold', fontSize: '1.3rem',
                          color: t.tipo === 'gasto' ? '#e74c3c' : '#27ae60'
                        }}>
                          {t.tipo === 'gasto' ? '-' : '+'}${parseFloat(t.monto).toLocaleString()}
                        </span>
                        <button
                          onClick={() => eliminarTransaccion(t.id)}
                          style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.8rem', transition: '0.2s' }}
                          onMouseOver={(e) => e.target.style.color = '#e74c3c'}
                          onMouseOut={(e) => e.target.style.color = '#ccc'}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </main>
      )}

      {/* ESTILOS GLOBALES RÁPIDOS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #999; }
      `}</style>
    </div>
  );
}

export default App;