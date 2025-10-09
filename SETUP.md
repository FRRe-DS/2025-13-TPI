# Portal de Compras - Grupo 13 🛒

## Desarrollo de Software 2025 - UTN FRRe

Sistema de compras online desarrollado con **React + Next.js + Tailwind** (Frontend) y **FastAPI + Python** (Backend).

---

## 🚀 Configuración Rápida (Para Compañeros de Equipo)

### **Opción 1: Configuración Automática**

#### Windows:
```bash
# 1. Clonar el repositorio
git clone https://github.com/FRRe-DS/2025-13-TPI.git
cd 2025-13-TPI

# 2. Ejecutar script de configuración
setup-windows.bat
```

#### Linux/Mac:
```bash
# 1. Clonar el repositorio
git clone https://github.com/FRRe-DS/2025-13-TPI.git
cd 2025-13-TPI

# 2. Ejecutar script de configuración
./setup-unix.sh
```

### **Opción 2: Configuración Manual**

#### Prerrequisitos:
- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **Python** (v3.8 o superior) - [Descargar](https://python.org/)
- **Git** - [Descargar](https://git-scm.com/)

#### Pasos:

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/FRRe-DS/2025-13-TPI.git
   cd 2025-13-TPI
   ```

2. **Configurar Frontend:**
   ```bash
   cd compras/frontend
   npm install
   ```

3. **Configurar Backend:**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

---

## 🏃‍♂️ Ejecutar el Proyecto

### **Frontend (React + Next.js):**
```bash
cd compras/frontend
npm run dev
```
- **URL:** http://localhost:3000
- **Hot Reload:** ✅ Los cambios se ven automáticamente

### **Backend (FastAPI + Python):**
```bash
cd compras/backend
python main.py
# o
uvicorn main:app --reload
```
- **URL:** http://localhost:8000
- **Documentación API:** http://localhost:8000/docs

---

## 📁 Estructura del Proyecto

```
2025-13-TPI/
├── compras/
│   ├── frontend/          # React + Next.js + Tailwind
│   │   ├── src/
│   │   │   ├── app/       # Pages (App Router)
│   │   │   └── components/ # Componentes React
│   │   ├── package.json   # Dependencias Node.js
│   │   └── tailwind.config.js
│   ├── backend/           # FastAPI + Python
│   │   ├── routers/       # Endpoints de la API
│   │   ├── models/        # Modelos de datos
│   │   ├── main.py        # Servidor principal
│   │   └── requirements.txt # Dependencias Python
│   └── openapi.yaml       # Documentación API
├── setup-windows.bat      # Script automático Windows
├── setup-unix.sh          # Script automático Linux/Mac
└── README.md             # Este archivo
```

---

## 🌿 Flujo de Trabajo con Git

### **Estructura de Ramas:**
- `main` - Código de producción (protegida)
- `develop` - Integración de features
- `backend` - Desarrollo backend
- `frontend` - Desarrollo frontend
- `backend/feature-name` - Features específicas backend
- `frontend/feature-name` - Features específicas frontend

### **Workflow recomendado:**
```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear feature branch
git checkout -b backend/nueva-funcionalidad
# o
git checkout -b frontend/nueva-funcionalidad

# 3. Desarrollar y commitear
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 4. Subir cambios
git push -u origin backend/nueva-funcionalidad

# 5. Crear Pull Request hacia develop
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend:**
- ⚛️ **React 18** - Librería UI
- 🚀 **Next.js 15** - Framework React con SSR
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 📝 **TypeScript** - Tipado estático
- 🎭 **Framer Motion** - Animaciones
- 📋 **React Hook Form** - Manejo de formularios
- 🌐 **Axios** - Cliente HTTP

### **Backend:**
- 🐍 **Python 3.8+** - Lenguaje principal
- ⚡ **FastAPI** - Framework web moderno
- 🗃️ **SQLAlchemy** - ORM
- 🔐 **JWT** - Autenticación
- 📊 **Pydantic** - Validación de datos
- 🚀 **Uvicorn** - Servidor ASGI

---

## 📝 Scripts Disponibles

### **Frontend:**
```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # Linter ESLint
```

### **Backend:**
```bash
python main.py       # Servidor desarrollo
uvicorn main:app --reload  # Con auto-reload
```

---

## 🔧 Configuración del Entorno

### **Variables de Entorno (.env):**
Crear archivo `.env` en `compras/backend/`:
```env
SECRET_KEY=tu_clave_secreta_jwt
DATABASE_URL=postgresql://user:password@localhost/dbname
DEBUG=True
```

---

## 🐛 Solución de Problemas

### **Error: "npm no se reconoce"**
- ✅ Instalar Node.js desde [nodejs.org](https://nodejs.org/)
- ✅ Reiniciar terminal después de instalar

### **Error: "python no se reconoce"**
- ✅ Instalar Python desde [python.org](https://python.org/)
- ✅ Marcar "Add to PATH" durante instalación

### **Error: "execution policy" en PowerShell**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Puerto ocupado**
- Frontend: Cambiar puerto en `next.config.js`
- Backend: Usar `uvicorn main:app --port 8001`

---

## 👥 Equipo de Desarrollo

- **Grupo 13** - Portal de Compras
- **Materia:** Desarrollo de Software
- **Universidad:** UTN - Facultad Regional Resistencia

---

## 📞 Contacto

Para dudas o problemas, contactar al equipo de desarrollo a través del repositorio de GitHub.

---

**¡Listo para desarrollar! 🚀**