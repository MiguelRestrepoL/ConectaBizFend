'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from './components/InputField';
import Button from './components/Button';
import SocialButton from './components/SocialButton';
import { authService } from './api/auth';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      
      // Redirigir al dashboard o página principal
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
      // Aquí implementarías la lógica específica para cada proveedor
      console.log(`Login con ${provider}`);
      
      // Ejemplo para Google (necesitarías implementar Google OAuth)
      if (provider === 'google') {
        // Implementar Google OAuth
        console.log('Implementar Google OAuth');
      } else if (provider === 'microsoft') {
        // Implementar Microsoft OAuth
        console.log('Implementar Microsoft OAuth');
      } else if (provider === 'phone') {
        // Implementar autenticación por teléfono
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
    // Implementar lógica de recuperación de contraseña
    console.log('Recuperar contraseña');
  };

  const handleRegister = () => {
    // Redirigir a la página de registro
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Título en la esquina superior izquierda */}
      <div className="absolute top-6 left-6">
        <h1 className="text-2xl font-bold text-white">Inicio de Sesión</h1>
      </div>

      {/* Formulario central */}
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl">
          {/* Header del formulario */}
          <div className="text-center mb-8">
            
            {/* Logo ConectaBiz */}
            <div className="w-30 h-30 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/logo-conectabiz.png" 
                alt="ConectaBiz Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-gray-300 text-sm">
              ¡Bienvenido nuevamente! Ingrese su correo y contraseña para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
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
              <p className="text-red-400 text-sm -mt-2">{errors.email}</p>
            )}

            {/* Contraseña */}
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
              <p className="text-red-400 text-sm -mt-2">{errors.password}</p>
            )}

            {/* Error general */}
            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            {/* Botón de inicio de sesión */}
            <Button
              type="submit"
              className="w-full mb-6"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Sign In'}
            </Button>

            {/* Enlaces adicionales */}
            <div className="flex justify-between items-center text-sm mb-6">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ¿Olvido su contraseña?
              </button>
              
              <button
                type="button"
                onClick={handleRegister}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ¿No tienes cuenta? <span className="font-semibold">¡Registrese!</span>
              </button>
            </div>

            {/* Botones de login social */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
              />
              
              <SocialButton
                provider="phone"
                onClick={() => handleSocialLogin('phone')}
              />
              
              <SocialButton
                provider="microsoft"
                onClick={() => handleSocialLogin('microsoft')}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
