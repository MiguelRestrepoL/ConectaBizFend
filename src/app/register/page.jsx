'use client';
 
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';
import SocialButton from '../components/SocialButton';
import Checkbox from '../components/Checkbox';
import { authService } from '../api/auth';
 
const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
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
 
  // ─── Fondo: malla de puntos conectados + ondas aurora (igual que login) ──
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
 
    const COUNT = 42;
    pointsRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));
 
    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
 
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
 
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
 
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
 
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Los emails no coinciden';
    }
 
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
 
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
 
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateForm()) {
      return;
    }
 
    setIsLoading(true);
    try {
      const userResponse = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
 
      if (userResponse.user && userResponse.user.id) {
        await authService.acceptTerms(userResponse.user.id);
      }
 
      router.push('/home');
    } catch (error) {
      console.error('Error al registrar:', error);
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
        .register-card {
          animation: cardGlow 4.5s ease-in-out infinite;
        }
        .register-glow-btn {
          transition: box-shadow 0.25s ease, transform 0.15s ease, background 0.2s ease;
        }
        .register-glow-btn:hover {
          box-shadow: 0 0 0 1px rgba(124,77,255,0.4), 0 8px 24px rgba(124,77,255,0.35);
          transform: translateY(-1px);
        }
        .register-glow-btn:active {
          transform: scale(0.98);
        }
        @media (max-width: 1023px) {
          .register-branding { display: none; }
        }
      `}</style>
 
      {/* Canvas: malla de puntos + aurora */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
 
      {/* Contenedor principal: branding + form */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '64px',
        }}
      >
        {/* Branding izquierda */}
        <div
          className="register-branding"
          style={{
            flex: '0 0 38%',
            textAlign: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h1 style={{
            fontSize: '52px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.06em',
            marginBottom: '36px',
          }}>
            CONECTA<span style={{ color: '#7c4dff' }}>BIZ</span>
          </h1>
 
          <div style={{ width: '96px', height: '96px', margin: '0 auto 36px', position: 'relative' }}>
            <div style={{
              width: '100%',
              height: '100%',
              border: '4px solid rgba(124,77,255,0.85)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
 
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', fontStyle: 'italic' }}>
            Haz crecer tu negocio, conéctalo
          </p>
        </div>
 
        {/* Formulario derecha */}
        <div style={{ flex: '0 0 420px', width: '100%', maxWidth: '420px' }}>
          <div
            className="register-card"
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
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
                marginBottom: '24px',
                animation: mounted ? 'fadeUp 0.5s ease 0.05s both' : 'none',
                opacity: mounted ? undefined : 0,
              }}
            >
              Crear cuenta
            </h2>
 
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Nombre de usuario */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.1s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <InputField
                  type="text"
                  label="Nombre de usuario"
                  placeholder="Ingrese su nombre de usuario"
                  icon="👤"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-2px' }}>{errors.username}</p>}
              </div>
 
              {/* Email */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.15s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <InputField
                  type="email"
                  label="Email"
                  placeholder="Ingrese su email"
                  icon="✉️"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-2px' }}>{errors.email}</p>}
              </div>
 
              {/* Confirmar email */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.2s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <InputField
                  type="email"
                  label="Confirme su e-mail"
                  placeholder="Confirme su email"
                  icon="✉️"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                />
                {errors.confirmEmail && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-2px' }}>{errors.confirmEmail}</p>}
              </div>
 
              {/* Contraseña */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.25s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <InputField
                  type="password"
                  label="Contraseña"
                  placeholder="Ingrese su contraseña"
                  icon="🔑"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-2px' }}>{errors.password}</p>}
              </div>
 
              {/* Confirmar contraseña */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.3s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <InputField
                  type="password"
                  label="Confirme su contraseña"
                  placeholder="Confirme su contraseña"
                  icon="🔑"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '-2px' }}>{errors.confirmPassword}</p>}
              </div>
 
              {/* Checkbox de términos */}
              <div style={{ animation: mounted ? 'fadeUp 0.5s ease 0.35s both' : 'none', opacity: mounted ? undefined : 0 }}>
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  label="Estoy de acuerdo con los términos y condiciones"
                  name="agreeTerms"
                />
                {errors.agreeTerms && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '4px' }}>{errors.agreeTerms}</p>}
              </div>
 
              {/* Error general */}
              {errors.submit && (
                <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center' }}>{errors.submit}</p>
              )}
 
              {/* Botón de registro */}
              <button
                type="submit"
                disabled={isLoading}
                className="register-glow-btn"
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
                  animation: mounted ? 'fadeUp 0.5s ease 0.4s both' : 'none',
                  marginTop: '4px',
                }}
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
 
              {/* Divider */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  animation: mounted ? 'fadeUp 0.5s ease 0.45s both' : 'none',
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
                  animation: mounted ? 'fadeUp 0.5s ease 0.5s both' : 'none',
                  opacity: mounted ? undefined : 0,
                }}
              >
                <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
                <SocialButton provider="phone" onClick={() => handleSocialLogin('phone')} />
                <SocialButton provider="microsoft" onClick={() => handleSocialLogin('microsoft')} />
              </div>
 
              {/* Enlaces de términos */}
              <div
                style={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                  fontSize: '12px', marginTop: '8px',
                  animation: mounted ? 'fadeUp 0.5s ease 0.55s both' : 'none',
                  opacity: mounted ? undefined : 0,
                }}
              >
                <a href="#" style={{ color: '#b39dff', textDecoration: 'none' }}>Condiciones de uso</a>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                <a href="#" style={{ color: '#b39dff', textDecoration: 'none' }}>Términos y servicios</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default RegisterPage;
 