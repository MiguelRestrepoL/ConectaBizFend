'use client';
 
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';
import SocialButton from '../components/SocialButton';
import { authService } from '../api/auth';
 
const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
 
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const animFrameRef = useRef(null);
 
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);
 
  // ─── Fondo: malla de puntos conectados + ondas aurora ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
 
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
 
    const COUNT = 38;
    pointsRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));
 
    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
 
      // Ondas aurora suaves, tonos azul-morado
      t += 0.0035;
      const waveColors = [
        'rgba(76, 110, 245, 0.05)',
        'rgba(124, 77, 255, 0.045)',
      ];
      waveColors.forEach((color, i) => {
        ctx.beginPath();
        const yBase = height * (0.3 + i * 0.35);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= width; x += 20) {
          const y = yBase
            + Math.sin(x * 0.004 + t * (1 + i * 0.4) + i * 2) * 36
            + Math.sin(x * 0.011 + t * 1.6) * 14;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      });
 
      // Malla de puntos conectados
      const pts = pointsRef.current;
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });
 
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(140, 130, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
 
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(170, 160, 255, 0.35)';
        ctx.fill();
      });
 
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
 
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
 
    setIsLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      router.push('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      console.log(`Login con ${provider}`);
      if (provider === 'google') {
        console.log('Implementar Google OAuth');
      } else if (provider === 'microsoft') {
        console.log('Implementar Microsoft OAuth');
      } else if (provider === 'phone') {
        console.log('Implementar autenticación por teléfono');
      }
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      setErrors({ submit: `Error al iniciar sesión con ${provider}` });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleForgotPassword = () => {
    console.log('Recuperar contraseña');
  };
 
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 15% 20%, rgba(45,55,95,0.55) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(60,40,110,0.45) 0%, transparent 55%), #0a0a0f',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(124,77,255,0.16), 0 20px 60px rgba(0,0,0,0.45), 0 0 40px rgba(90,80,220,0.08); }
          50%      { box-shadow: 0 0 0 1px rgba(124,77,255,0.32), 0 20px 60px rgba(0,0,0,0.45), 0 0 60px rgba(90,80,220,0.16); }
        }
        .login-card {
          animation: cardGlow 4.5s ease-in-out infinite;
        }
        .login-glow-btn {
          transition: box-shadow 0.25s ease, transform 0.15s ease, background 0.2s ease;
        }
        .login-glow-btn:hover {
          box-shadow: 0 0 0 1px rgba(124,77,255,0.4), 0 8px 24px rgba(124,77,255,0.35);
          transform: translateY(-1px);
        }
        .login-glow-btn:active {
          transform: scale(0.98);
        }
      `}</style>
 
      {/* Canvas: malla de puntos + aurora */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
 
      {/* Formulario central */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '420px' }}>
        <div
          className="login-card"
          style={{
            background: 'rgba(22, 24, 38, 0.88)',
            border: '0.5px solid rgba(124,77,255,0.2)',
            borderRadius: '20px',
            padding: '32px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.98)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {/* Header del formulario */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '88px', height: '88px', margin: '0 auto 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: mounted ? 'fadeUp 0.5s ease 0.05s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              <img
                src="/logo-conectabiz.png"
                alt="ConectaBiz Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
 
            <p
              style={{
                color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6,
                animation: mounted ? 'fadeUp 0.5s ease 0.12s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              ¡Bienvenido nuevamente! Ingrese su correo y contraseña para acceder
            </p>
          </div>
 
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.18s both' : 'none', opacity: mounted ? undefined : 0 }}>
              <InputField
                type="email"
                label="Email"
                placeholder="Ingrese su email"
                icon="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-4px' }}>{errors.email}</p>
              )}
            </div>
 
            {/* Contraseña */}
            <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.24s both' : 'none', opacity: mounted ? undefined : 0 }}>
              <InputField
                type="password"
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                icon="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-4px' }}>{errors.password}</p>
              )}
            </div>
 
            {/* Error general */}
            {errors.submit && (
              <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center' }}>{errors.submit}</p>
            )}
 
            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-glow-btn"
              style={{
                width: '100%',
                background: '#7c4dff',
                color: '#fff',
                border: 'none',
                padding: '13px 0',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: isLoading ? 'default' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none',
                marginBottom: '4px',
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Sign In'}
            </button>
 
            {/* Enlaces adicionales */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '13px', marginBottom: '4px',
                animation: mounted ? 'fadeUp 0.5s ease 0.36s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ color: '#b39dff', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#d4c8ff'}
                onMouseLeave={(e) => e.target.style.color = '#b39dff'}
              >
                ¿Olvido su contraseña?
              </button>
 
              <button
                type="button"
                onClick={() => router.push('/register')}
                style={{ color: '#b39dff', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#d4c8ff'}
                onMouseLeave={(e) => e.target.style.color = '#b39dff'}
              >
                ¿No tienes cuenta? <span style={{ fontWeight: 600 }}>¡Registrese!</span>
              </button>
            </div>
 
            {/* Divider */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>o continúa con</span>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            </div>
 
            {/* Botones de login social */}
            <div
              style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                animation: mounted ? 'fadeUp 0.5s ease 0.46s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
              <SocialButton provider="phone" onClick={() => handleSocialLogin('phone')} />
              <SocialButton provider="microsoft" onClick={() => handleSocialLogin('microsoft')} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default LoginPage;
 