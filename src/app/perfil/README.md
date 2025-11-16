# Página de Administración de Perfil

Esta página permite a los usuarios administrar su perfil de cuenta, incluyendo información personal, contraseñas y configuración de autenticación de dos factores (2FA).

## Características

### 1. Nombre de Usuario
- Permite cambiar el alias que ven los clientes
- Incluye advertencia sobre período de espera para cambios

### 2. Información General
- Correo electrónico principal
- Correo electrónico para compradores
- País/Región
- Fecha de nacimiento

### 3. Cambio de Contraseña
- Contraseña actual
- Nueva contraseña
- Confirmación de nueva contraseña
- Validación de coincidencia de contraseñas

### 4. Autenticación de Dos Factores (2FA)
- Activación por correo electrónico
- Activación por aplicación móvil
- Protección contra accesos no autorizados

## Integración con Backend

La página está configurada para trabajar con los siguientes endpoints:

### Endpoints Requeridos

```javascript
// Actualizar perfil
PUT /api/users/:id/profile
Body: { buyer_email, country, birth_date }

// Cambiar contraseña
PUT /api/users/:id/password
Body: { currentPassword, newPassword }

// Activar 2FA por correo
POST /api/users/:id/2fa/email
Body: { email }

// Activar 2FA por aplicación
POST /api/users/:id/2fa/app
Body: { phoneNumber }

// Obtener perfil
GET /api/users/:id/profile
```

### Controladores Backend

```javascript
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyer_email, country, birth_date } = req.body;
    
    const user = await updateProfile(id, { buyer_email, country, birth_date });
    return res.json({ user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const result = await changeUserPassword(id, { currentPassword, newPassword });
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || 'Error interno' });
  }
};
```

## Uso

1. Navegar a `/perfil` en la aplicación
2. La página cargará automáticamente los datos del usuario
3. Modificar los campos deseados
4. Hacer clic en "Guardar" para cada sección
5. Los mensajes de éxito/error aparecerán en la parte superior

## Estructura de Archivos

```
frontend/src/app/perfil/
├── page.jsx              # Página principal
├── README.md             # Documentación
└── components/
    └── ProfileForm.jsx   # Formulario de perfil

frontend/src/app/api/
└── profile.js            # Servicio de API para perfil
```

## Dependencias

- React Hooks (useState, useEffect)
- Axios para llamadas HTTP
- Tailwind CSS para estilos
- Componentes reutilizables del proyecto
