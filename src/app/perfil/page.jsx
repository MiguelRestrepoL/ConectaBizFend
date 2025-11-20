'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProfileForm from '../components/ProfileForm';
import { profileService } from '../api/profile';

const ProfilePage = () => {

  useEffect(() => {
    fetchUser();
  }, []);

  const [user, setUser] = useState({
    username: '',
    email: '',
    buyer_email: 'NOT AVAILABLE AT THE MOMENT',
    country: 'COL',
    birth_date: ''
  });

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem('userId') || '1';
      const profileData = await profileService.getProfile(userId);
      setUser(prev => ({ ...prev, ...profileData.user }));
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      // Mantener datos por defecto si hay error
      setUser(prev => ({
        ...prev,
        username: 'Usuario',
        email: 'usuario@ejemplo.com',
        country: 'COL'
      }));
    }
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || '1';
      
      const response = await profileService.updateProfile(userId, profileData);
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setUser(prev => ({ ...prev, ...response.user }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || '1';
      
      await profileService.changePassword(userId, passwordData);
      
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate2FA = async (type) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') || '1';
      
      if (type === 'correo') {
        await profileService.activateEmail2FA(userId, user.email);
      } else if (type === 'aplicación') {
        await profileService.activateApp2FA(userId, '+XX XXXXXXXXXX');
      }
      
      setMessage({ type: 'success', text: `2FA por ${type} activado correctamente` });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al activar 2FA' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar activeItem="perfil" />
      <div className="ml-0 md:ml-64">
        <Header userName="Usuario" />
        
        <main className="p-4 md:p-8 pt-20 md:pt-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              Administración de tu cuenta
            </h1>

            {/* Mensaje de estado */}
            {message.text && (
              <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <ProfileForm
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onActivate2FA={handleActivate2FA}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;