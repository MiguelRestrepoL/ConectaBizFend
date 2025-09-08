# Componentes Reutilizables

Este directorio contiene componentes reutilizables para la aplicación ConectaBiz.

## Componentes Disponibles

### InputField
Componente para campos de entrada con iconos y etiquetas.

**Props:**
- `type`: Tipo de input (text, email, password, etc.)
- `placeholder`: Texto placeholder
- `icon`: Icono a mostrar (emoji o componente)
- `label`: Etiqueta del campo
- `value`: Valor del campo
- `onChange`: Función de cambio
- `className`: Clases CSS adicionales

**Ejemplo:**
```jsx
<InputField
  type="email"
  label="Email"
  placeholder="Ingresa tu email"
  icon="✉️"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Button
Componente de botón con diferentes variantes.

**Props:**
- `children`: Contenido del botón
- `onClick`: Función de click
- `type`: Tipo de botón (button, submit, reset)
- `variant`: Variante del botón (primary, secondary, social)
- `className`: Clases CSS adicionales
- `disabled`: Estado deshabilitado

**Ejemplo:**
```jsx
<Button
  variant="primary"
  onClick={handleClick}
  disabled={isLoading}
>
  Enviar
</Button>
```

### SocialButton
Componente para botones de login social.

**Props:**
- `provider`: Proveedor (google, microsoft, phone)
- `onClick`: Función de click
- `className`: Clases CSS adicionales

**Ejemplo:**
```jsx
<SocialButton
  provider="google"
  onClick={handleGoogleLogin}
/>
```

### Checkbox
Componente de checkbox con etiqueta.

**Props:**
- `checked`: Estado del checkbox
- `onChange`: Función de cambio
- `label`: Texto de la etiqueta
- `className`: Clases CSS adicionales

**Ejemplo:**
```jsx
<Checkbox
  checked={agreeTerms}
  onChange={(e) => setAgreeTerms(e.target.checked)}
  label="Acepto los términos y condiciones"
/>
```

## Uso de la API

El archivo `api/auth.js` contiene todos los servicios de autenticación:

```javascript
import { authService } from '../api/auth';

// Login
await authService.login(email, password);

// Registro
await authService.register(userData);

// Login social
await authService.loginWithGoogle(googleToken);
await authService.loginWithMicrosoft(microsoftToken);
await authService.loginWithPhone(phoneNumber);

// Verificar código de teléfono
await authService.verifyPhoneCode(phoneNumber, code);

// Cerrar sesión
authService.logout();

// Obtener usuario actual
const user = await authService.getCurrentUser();

// Verificar autenticación
const isAuth = authService.isAuthenticated();
```
