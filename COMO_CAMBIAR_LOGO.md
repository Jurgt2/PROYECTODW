# 🖼️ CÓMO CAMBIAR EL LOGO DEL LOGIN

## 📋 TIENES 3 OPCIONES PARA PONER TU IMAGEN

---

## ✅ OPCIÓN 1: Usar una URL externa (Más Fácil)

### Ventajas:
- ✨ Más rápido
- No necesitas archivos locales
- Puedes usar imágenes de internet

### Pasos:
1. Sube tu imagen a un servicio como:
   - [Imgur](https://imgur.com/)
   - [ImgBB](https://imgbb.com/)
   - Google Drive (público)
   - Tu propio servidor

2. En `login.component.html` (línea 11), descomenta esta línea:
```html
<img src="https://tu-url-aqui.com/logo.png" alt="Logo" class="logo-image">
```

3. Reemplaza `https://tu-url-aqui.com/logo.png` con la URL de tu imagen

### Ejemplo:
```html
<img src="https://i.imgur.com/abc123.png" alt="Logo" class="logo-image">
```

---

## ✅ OPCIÓN 2: Usar una imagen local (Recomendado)

### Ventajas:
- ✅ Más profesional
- ✅ No depende de internet
- ✅ Carga más rápida

### Pasos:

#### 1. Crea la carpeta de imágenes (si no existe):
```bash
mkdir -p src/assets/images
```

#### 2. Copia tu imagen a la carpeta:
```bash
# Opción A: Desde Finder
# Arrastra tu imagen a: src/assets/images/logo.png

# Opción B: Desde terminal
cp /ruta/a/tu/imagen.png src/assets/images/logo.png
```

#### 3. En `login.component.html` (línea 14), descomenta:
```html
<img src="assets/images/logo.png" alt="Logo" class="logo-image">
```

#### 4. Ajusta el nombre del archivo si es diferente:
```html
<!-- Si tu archivo se llama "mi-logo.jpg" -->
<img src="assets/images/mi-logo.jpg" alt="Logo" class="logo-image">
```

---

## ✅ OPCIÓN 3: Cambiar el tamaño del logo

Si tu imagen es muy grande o pequeña, ajusta en `login.component.css`:

```css
.logo-container {
  width: 100px;  /* Cambiar de 80px a 100px */
  height: 100px; /* Cambiar de 80px a 100px */
  /* ... resto del código */
}
```

---

## 🎨 PERSONALIZACIÓN ADICIONAL

### Quitar el fondo circular de gradiente:

En `login.component.css`, línea 47:
```css
.logo-container {
  /* ... */
  background: transparent; /* En lugar del gradiente */
  box-shadow: none; /* Sin sombra */
  /* ... */
}
```

### Hacer el logo cuadrado en lugar de circular:

```css
.logo-container {
  /* ... */
  border-radius: 15px; /* En lugar de 50% (circular) */
  /* ... */
}
```

### Ajustar cómo se ve la imagen:

```css
.logo-container .logo-image {
  object-fit: cover;   /* Opción 1: Recorta pero llena todo */
  /* O */
  object-fit: contain; /* Opción 2: Muestra toda la imagen sin recortar */
}
```

---

## 📂 ESTRUCTURA DE CARPETAS RECOMENDADA

```
src/
├── assets/
│   ├── images/
│   │   ├── logo.png          ← Tu logo aquí
│   │   ├── logo-white.png    ← Versión blanca (opcional)
│   │   └── favicon.ico       ← Ícono del navegador
│   └── ...
└── ...
```

---

## 🚀 CÓDIGO COMPLETO YA ACTUALIZADO

### `login.component.html` (líneas 9-17):
```html
<div class="login-header">
  <div class="logo-container">
    <!-- Opción 1: URL externa -->
    <img src="https://tu-url-aqui.com/logo.png" alt="Logo" class="logo-image">
    
    <!-- Opción 2: Imagen local (RECOMENDADO) -->
    <!-- <img src="assets/images/logo.png" alt="Logo" class="logo-image"> -->
    
    <!-- Opción 3: Mantener el ícono -->
    <!-- <i class="pi pi-shield" style="font-size: 3rem; color: var(--primary-color)"></i> -->
  </div>
  <h1>Quality & Knowledge</h1>
  <p class="subtitle">Sistema de Gestión de Riesgos</p>
</div>
```

### `login.component.css` (líneas 45-62):
```css
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
  overflow: hidden;
}

.logo-container .logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 🔥 EJEMPLOS DE URLs DE IMÁGENES DE PRUEBA

Puedes usar estas URLs temporalmente para probar:

```html
<!-- Logo de ejemplo 1 -->
<img src="https://via.placeholder.com/80" alt="Logo" class="logo-image">

<!-- Logo de ejemplo 2 -->
<img src="https://picsum.photos/80" alt="Logo" class="logo-image">
```

---

## ✨ RESULTADO FINAL

Tu login se verá así:
```
┌─────────────────────────────┐
│      [TU IMAGEN AQUÍ] 🖼️    │
│   Quality & Knowledge       │
│ Sistema de Gestión de       │
│        Riesgos              │
└─────────────────────────────┘
```

---

## 📞 ¿NECESITAS AYUDA?

Si tu imagen no aparece:
1. ✅ Verifica que la URL sea correcta
2. ✅ Verifica que el archivo exista en `assets/images/`
3. ✅ Abre la consola del navegador (F12) para ver errores
4. ✅ Recarga la página (Ctrl + Shift + R / Cmd + Shift + R)

---

**Última actualización:** 2 de febrero de 2026
