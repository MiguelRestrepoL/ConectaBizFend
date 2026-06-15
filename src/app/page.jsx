'use client';
 
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
 
export default function Home() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
 
  // ─── Partículas en canvas ───────────────────────────────────────────────────
  useEffect(() => {
    if (!entered) return;
 
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
 
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
 
    // Inicializar partículas
    particlesRef.current = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 90 + 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.08 + 0.02,
    }));
 
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 77, 255, ${p.alpha})`;
        ctx.fill();
 
        p.x += p.vx;
        p.y += p.vy;
 
        if (p.y + p.r < 0) {
          p.y = canvas.height + p.r;
          p.x = Math.random() * canvas.width;
        }
        if (p.x + p.r < 0) p.x = canvas.width + p.r;
        if (p.x - p.r > canvas.width) p.x = -p.r;
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
 
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [entered]);
 
  // ─── Handler click en velo ──────────────────────────────────────────────────
  const handleEnter = () => {
    setFading(true);
    setTimeout(() => setEntered(true), 600);
  };
 
  // ─── Handler login ── apuntan a /login ahora ────────────────────────────────
  const handleLogin = () => router.push('/login');
  const handleRegister = () => router.push('/register');
 
  // ════════════════════════════════════════════════════════════════════════════
  // VELO (pantalla de entrada)
  // ════════════════════════════════════════════════════════════════════════════
  if (!entered) {
    return (
      <div
        onClick={handleEnter}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0a0f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'opacity 0.6s ease',
          opacity: fading ? 0 : 1,
          userSelect: 'none',
        }}
      >
        {/* Manchas de luz ambiental */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(100, 50, 220, 0.06)',
          top: '50%',
          left: '50%',
          transform: 'translate(-60%, -60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(80, 30, 200, 0.05)',
          top: '60%',
          left: '60%',
          transform: 'translate(-40%, -40%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
 
        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2, marginBottom: '32px' }}>
          <Image
            src="/logo-conectabiz.png"
            alt="ConectaBiz"
            width={200}
            height={100}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
 
        {/* Click to enter */}
        <p style={{
          position: 'relative',
          zIndex: 2,
          color: 'rgba(255,255,255,0.35)',
          fontSize: '13px',
          letterSpacing: '0.15em',
          animation: 'pulseText 2.5s ease-in-out infinite',
        }}>
          click to enter...
        </p>
 
        <style>{`
          @keyframes pulseText {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.75; }
          }
        `}</style>
      </div>
    );
  }
 
  // ════════════════════════════════════════════════════════════════════════════
  // HOME PRINCIPAL
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#0a0a0f',
      fontFamily: 'var(--font-geist-sans, sans-serif)',
      overflow: 'hidden',
      animation: 'fadeIn 0.7s ease',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .cta-primary {
          background: #7c4dff;
          color: #fff;
          border: none;
          padding: 14px 0;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          width: 240px;
          transition: background 0.2s, transform 0.15s;
        }
        .cta-primary:hover { background: #6a3de8; transform: translateY(-2px); }
        .cta-primary:active { transform: scale(0.97); }
 
        .cta-secondary {
          background: transparent;
          color: rgba(255,255,255,0.6);
          border: 0.5px solid rgba(255,255,255,0.15);
          padding: 14px 0;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          width: 240px;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .cta-secondary:hover {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          transform: translateY(-2px);
        }
        .cta-secondary:active { transform: scale(0.97); }
 
        .nav-btn {
          background: #7c4dff;
          color: #fff;
          border: none;
          padding: 9px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .nav-btn:hover { background: #6a3de8; }
      `}</style>
 
      {/* Canvas de partículas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
 
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src="/logo-conectabiz.png"
            alt="ConectaBiz"
            width={140}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <button className="nav-btn" onClick={handleLogin}>
          Iniciar sesión
        </button>
      </nav>
 
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        zIndex: 5,
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 48px 60px',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(124,77,255,0.12)',
          border: '0.5px solid rgba(124,77,255,0.3)',
          color: '#b39dff',
          fontSize: '12px',
          padding: '5px 16px',
          borderRadius: '999px',
          marginBottom: '28px',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            background: '#7c4dff',
            borderRadius: '50%',
            animation: 'badgePulse 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          Plataforma de gestión empresarial
        </div>
 
        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(38px, 5vw, 58px)',
          fontWeight: 500,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '600px',
        }}>
          Tu negocio,{' '}
          <span style={{ color: '#7c4dff' }}>conectado</span>
        </h1>
 
        {/* Subtítulo */}
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.42)',
          lineHeight: 1.7,
          maxWidth: '400px',
          marginBottom: '48px',
        }}>
          Gestiona clientes, pedidos y productos en un solo lugar.
          Haz crecer tu negocio, conéctalo.
        </p>
 
        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button className="cta-primary" onClick={handleLogin}>
            Iniciar sesión
          </button>
 
          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '240px',
          }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>o</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
          </div>
 
          <button className="cta-secondary" onClick={handleRegister}>
            Crear una cuenta
          </button>
        </div>
      </section>
 
      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
      }}>
        {[
          { num: '+10', label: 'Clientes gestionados' },
          { num: '99.9%', label: 'Uptime garantizado' },
          { num: '3 planes', label: 'Free, Premium, Elite' },
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            {i > 0 && (
              <div style={{ width: '0.5px', height: '32px', background: 'rgba(255,255,255,0.07)' }} />
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 500, color: '#fff' }}>{s.num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{s.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}