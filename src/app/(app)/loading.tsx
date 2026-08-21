export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1.2rem',
      }}
    >
      {/* Ocean bubble spinner */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--accent-cyan, #4DD0E1)',
          animation: 'spin 0.8s ease-in-out infinite',
        }}
      />
      <p
        style={{
          color: 'var(--text-secondary, #B0D4F1)',
          fontSize: '0.9rem',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          letterSpacing: '0.05em',
          opacity: 0.8,
        }}
      >
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
