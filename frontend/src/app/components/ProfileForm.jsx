'use client';

import React, { useState, useEffect } from 'react';

const ProfileForm = ({ user, onUpdateProfile, onChangePassword, onActivate2FA, loading }) => {

  const [formData, setFormData] = useState({
    username: user.username || user.primary_email || '',
    primary_email: user.email || '',
    buyer_email: user.buyer_email || '',
    country: user.country || 'Col',
    birth_date: user.birth_date || ''
  });


  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeSection, setActiveSection] = useState('username');

  // Actualizar formData cuando cambie el user
  useEffect(() => {
    setFormData({
      username: user.username || user.email || '',
      primary_email: user.email || '',
      buyer_email: user.buyer_email || '',
      country: user.country || 'COL',
      birth_date: user.birth_date || ''
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onChangePassword(passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleActivate2FA = (type) => {
    onActivate2FA(type);
  };

  return (
    <div className="space-y-8">
      {/* Sección 1: Nombre de usuario */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nombre de usuario</h2>
        <p className="text-gray-600 mb-2">
          Los clientes observarán este nombre al hacer la compra, o al tú realizar una
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Al cambiar tu nombre, tendrás que esperar un periodo de tiempo para volverlo a cambiar
        </p>
        
        <form onSubmit={handleSubmitProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Alias (Username)
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre de usuario"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email principal: {user.email || formData.primary_email}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>

      {/* Sección 2: Información general */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información general</h2>
        <p className="text-gray-600 mb-2">
          Esta información es privada, se compartirá de manera parcial al comprador en caso de que se realice una compra exitosa. De lo contrario, se recomienda manejar 2 correos electrónicos.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          El comprador observará un e-mail donde debes manejar el tema de reembolsos, en caso de que el portal web no lo haya hecho exitosamente, o quieran hacer seguimiento a su pedido
        </p>
        
        <form onSubmit={handleSubmitProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Dirección de correo electrónico principal
              </label>
              <input
                type="email"
                name="primary_email"
                value={user.email || formData.primary_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Dirección de correo electrónico para los compradores
              </label>
              <input
                type="email"
                name="buyer_email"
                value={formData.buyer_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                PAÍS/REGIÓN
              </label>
              <input
                type="text"
                name="country"
                value={user.country || formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                FECHA DE NACIMIENTO
              </label>
              <input
                type="date"
                name="birth_date"
                value={user.birth_date || formData.birth_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>

      {/* Sección 3: Contraseña */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contraseña</h2>
        <p className="text-gray-600 mb-2">
          Recomendamos cambiar tu contraseña de manera periódica con el fin de evitar acceso no autorizado a tu cuenta.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Por políticas de privacidad y condiciones, se recomienda no compartir la contraseña a terceras con el fin de evitar cualquier tipo de posible amenaza a su cuenta
        </p>
        
        <form onSubmit={handleSubmitPassword}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Contraseña actual
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Cambiando...' : 'Confirmar'}
          </button>
        </form>
      </div>

      {/* Sección 4: Factor de autenticación (2FA) */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Factor de autenticación (2FA)</h2>
        <p className="text-gray-600 mb-6">
          Protege tu cuenta frente a accesos NO autorizados al solicitar códigos para iniciar sesión
        </p>
        
        <div className="space-y-6">
          {/* Autenticación por correo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Autenticación por correo</h3>
              <input
                type="email"
                value={user.email || formData.primary_email}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900"
              />
            </div>
            <button
              onClick={() => handleActivate2FA('correo')}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Activando...' : 'Activar'}
            </button>
          </div>

          {/* Autenticación por aplicación */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Autenticación por aplicación</h3>
              <input
                type="text"
                placeholder="+XX XXXXXXXXXX"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => handleActivate2FA('aplicación')}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Activando...' : 'Activar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
