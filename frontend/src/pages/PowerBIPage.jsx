function PowerBIPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '36px', 
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#0f172a',
        textAlign: 'center'
      }}>
        Analytics Dashboard
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '20px'
      }}>
        <iframe
          title="power-bi"
          width="100%"
          height="600"
          src="https://app.powerbi.com/view?r=eyJrIjoiMTYyNGVjZGItNGQ1MS00MWQxLTg3NzMtOGYyY2YzMjFiYTNhIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
          frameBorder="0"
          allowFullScreen="true"
          style={{
            maxWidth: '100%',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </div>
  );
}

export default PowerBIPage;

