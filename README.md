# ChapaTuChamba - Plataforma de Primer Empleo

## 📌 Visión General

**ChapaTuChamba** es una plataforma desarrollada para facilitar el acceso al primer empleo para jóvenes sin experiencia laboral. La idea es conectar a candidatos emergentes con empresas y reclutadores que buscan talento joven, sin imponer requisitos de años de experiencia.

## 🎯 Problema que Resuelve

- El 80% de ofertas "junior" o "trainee" exigen experiencia previa.
- Los jóvenes envían muchas postulaciones sin recibir respuesta.
- Los reclutadores no disponen de herramientas sencillas para evaluar talento emergente.
- Falta visibilidad de las habilidades reales de los postulantes.

## 📦 Stack del Proyecto

- Frontend: HTML estático + CSS inline + JavaScript en `js/main.js`
- Backend: Spring Boot con Java 17
- Persistencia: JPA y SQL Server (configurado en `backend/src/main/resources/application.properties`)
- Estructura del proyecto:
  - `backend/`: código Java del servidor
  - `js/`: lógica de navegación y formularios
  - `main/`: páginas HTML de candidato y reclutador
  - `login.html`: portal de acceso al sistema
  - `ladingpage.html`: landing principal

## 👥 Roles y Flujos

### 1. Postulante

- Puede registrarse como candidato.
- Completa datos personales, carrera y formulario de inicio de sesión.
- Puede explorar vacantes y postularse a ofertas.
- Puede ver su perfil y estado de postulaciones.

### 2. Reclutador

- Puede registrarse como empresa o reclutador.
- Publica ofertas de trabajo.
- Revisa postulaciones a sus vacantes.
- Puede gestionar feedback y ver informes básicos.

## 🧠 Cómo Funciona el Proyecto

### Frontend

- `js/main.js` gestiona la navegación entre páginas, el inicio de sesión y los formularios.
- Las páginas principales están en `main/Candidatos/` y `main/Reclutador/`.
- El login se realiza contra el backend en `http://localhost:8080/api/auth/login`.

### Backend

- `backend/src/main/java/com/bolsaempleo/`: contiene controladores, servicios, modelos y repositorios.
- Controladores principales:
  - `AuthController`: login y registro de postantes y reclutadores.
  - `PostanteController`: gestión de candidatos, habilidades y postulaciones.
  - `ReclutadorController`: creación y búsqueda de ofertas/postulaciones.
  - `PostulacionController`: postulación, estado y candidatos por oferta.

## 🔌 Endpoints Principales

| Endpoint | Método | Uso |
|---|---|---|
| `/api/auth/login` | POST | Login de postulante o reclutador |
| `/api/auth/postante/register` | POST | Registro de postulante |
| `/api/auth/reclutador/register` | POST | Registro de reclutador |
| `/api/postantes/{id}` | GET | Obtener datos de postulante |
| `/api/reclutadores/{id}` | GET | Obtener datos de reclutador |
| `/api/postulaciones/{id}/postular` | POST | Postular un candidato a una oferta |
| `/api/postulaciones/{id}/candidatos` | GET | Ver candidatos de una oferta |
| `/api/postulaciones/{id}/estado` | PUT | Actualizar estado de postulaciones |
| `/api/postantes/{id}/habilidades` | POST | Agregar habilidades a un postulante |
| `/api/postantes/{id}/habilidades` | GET | Listar habilidades de un postulante |
| `/api/postantes/habilidades/{habilidadId}/verificar` | PUT | Verificar una habilidad |

## 🧪 Funcionalidades Implementadas

- Registro y login de postulantes y reclutadores.
- Validación básica de usuarios duplicados.
- Publicación de vacantes por reclutadores.
- Gestión del estado de postulaciones.
- Carga de CV en el backend y guardado de ruta en `Postante`.
- Gestión de habilidades de postulantes y verificación de competencias.

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos

- Java 17
- Maven
- SQL Server accesible (o ajustar la configuración de base de datos)
- Navegador web

### Pasos

1. Abrir el backend en `backend/`.
2. Ejecutar:
   ```powershell
   mvn spring-boot:run
   ```
3. Abrir `login.html` o `ladingpage.html` en el navegador.
4. Iniciar sesión con un rol existente o registrar un nuevo usuario.

> Si el navegador bloquea `file://` por `fetch`, usa un servidor simple como VS Code Live Server o `python -m http.server 8000` desde la carpeta raíz.

## � Estructura de Carpetas

- `backend/`: proyecto Spring Boot
- `js/main.js`: lógica principal de frontend
- `login.html`: página de acceso
- `ladingpage.html`: landing de presentación
- `main/Candidatos/`: rutas y vistas para candidatos
- `main/Reclutador/`: rutas y vistas para reclutadores

## 💡 Próximas Mejoras

- Autenticación con JWT y roles reales.
- Mejorar los formularios con validación y estados dinámicos.
- Páginas reales de ofertas, detalle de postulaciones y gestión de usuarios.
- Reportes y filtros para reclutadores.
- Integrar notificaciones y feedback en tiempo real.

## 📝 Notas

Esta versión es un MVP funcional que combina frontend estático con backend Spring Boot. El objetivo es mostrar la lógica de roles y el flujo básico de conexión entre candidatos y reclutadores.

