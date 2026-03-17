import './globals.css';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

export const metadata = {
  title: 'Grimwatch — The Grim Watchers of the Chain',
  description:
    'Grimwatch peers into the darkness of Solana. The grim watchers verify AI agents and seal the worthy. The void claims the rest.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: '#0A0A0F',
          color: '#D4D0C8',
          fontFamily: "'Cormorant Garamond', serif",
          minHeight: '100vh',
        }}
      >
        {/* Dark vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Fog layer 1 */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '20%',
            left: 0,
            right: 0,
            height: '200px',
            background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(74,222,128,0.03) 0%, transparent 100%)',
            animation: 'fogDrift 25s linear infinite',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Fog layer 2 */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '60%',
            left: 0,
            right: 0,
            height: '200px',
            background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(74,222,128,0.03) 0%, transparent 100%)',
            animation: 'fogDrift 35s linear infinite reverse',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Header */}
        <Header />

        {/* Sidebar (placeholder) */}
        <Sidebar />

        {/* Main content — offset for fixed header */}
        <main
          style={{
            position: 'relative',
            zIndex: 1,
            paddingTop: '60px',
            minHeight: '100vh',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
