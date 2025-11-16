'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '../components/InputField';
import Button from '../components/Button';
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      // Primero registrar el usuario con solo los datos básicos
      const userResponse = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Si el registro fue exitoso y hay un ID de usuario, aceptar términos y condiciones
      if (userResponse.user && userResponse.user.id) {
        await authService.acceptTerms(userResponse.user.id);
      }
      
      // Redirigir al dashboard o página principal
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex">
      {/* Sección izquierda - Branding */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-2/5 flex-col items-center justify-center px-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8 tracking-wider">
            CONECTABIZ
          </h1>
          
          {/* Círculo de carga */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="w-full h-full border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <p className="text-white text-lg italic">
            Haz crecer tu negocio, conéctalo
          </p>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full lg:w-3/5 xl:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre de usuario */}
            <InputField
              type="text"
              label="Nombre de usuario"
              placeholder="Value"
              icon="👤"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="text-red-400 text-sm -mt-2">{errors.username}</p>
            )}

            {/* Email */}
            <InputField
              type="email"
              label="Email"
              placeholder="Value"
              icon="✉️"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-400 text-sm -mt-2">{errors.email}</p>
            )}

            {/* Confirmar email */}
            <InputField
              type="email"
              label="Confirme su e-mail"
              placeholder="Value"
              icon="✉️"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleInputChange}
            />
            {errors.confirmEmail && (
              <p className="text-red-400 text-sm -mt-2">{errors.confirmEmail}</p>
            )}

            {/* Contraseña */}
            <InputField
              type="password"
              label="Contraseña"
              placeholder="Value"
              icon="🔑"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-400 text-sm -mt-2">{errors.password}</p>
            )}

            {/* Confirmar contraseña */}
            <InputField
              type="password"
              label="Confirme su contraseña"
              placeholder="Value"
              icon="🔑"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm -mt-2">{errors.confirmPassword}</p>
            )}

            {/* Checkbox de términos */}
            <Checkbox
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              label="Estoy de acuerdo con los términos y condiciones"
              name="agreeTerms"
              className="mb-6"
            />
            {errors.agreeTerms && (
              <p className="text-red-400 text-sm -mt-2">{errors.agreeTerms}</p>
            )}

            {/* Error general */}
            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            {/* Botón de registro */}
            <Button
              type="submit"
              className="w-full mb-6"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

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

            {/* Enlaces de términos */}
            <div className="flex justify-center items-center space-x-4 mt-6 text-sm">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Condiciones de uso
              </a>
              <span className="text-gray-400">|</span>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Términos y servicios
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
