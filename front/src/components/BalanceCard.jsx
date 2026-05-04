export const BalanceCard = ({ balance }) => {
  const isPositive = balance >= 0;

  return (
    <div style={{
      background: isPositive ? '#2ecc71' : '#e74c3c',
      color: 'white', padding: '20px', borderRadius: '12px', transition: '0.3s'
    }}>
      <h2 style={{ margin: 0 }}>Saldo Actual</h2>
      <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
        ${Number(balance).toLocaleString()}
      </p>
    </div>
  );
};