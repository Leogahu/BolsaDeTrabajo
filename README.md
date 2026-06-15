# ChapaTuChamba - Plataforma de Primer Empleo

[![Java](https://img.shields.io/badge/Java-17-orange?logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green?logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-21.2.0-red?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Azure-0078d4?logo=microsoft-sql-server)](https://azure.microsoft.com/)

## 📌 Visión General

**ChapaTuChamba** es una plataforma web full-stack diseñada para conectar a jóvenes de 18-25 años sin experiencia laboral con empresas que ofrecen prácticas, trainee o primer empleo real. A diferencia de LinkedIn o Computrabajo, esta plataforma se enfoca exclusivamente en eliminar requisitos contradictorios y validar potencial a través de habilidades comprobables.

### 🎯 Problemática que Resuelve

- El 80% de ofertas "junior" o "trainee" exigen experiencia previa (círculo vicioso)
- Jóvenes envían 10-30 postulaciones al mes sin retroalimentación constructiva
- Reclutadores carecen de herramientas para evaluar potencial vs trayectoria
- Falta de validación de habilidades más allá del CV tradicional

### 👥 Segmentos Objetivo

| Segmento | Características |
|----------|-----------------|
| **Postulantes** | 18-25 años, estudiantes últimos ciclos, egresados, sin experiencia formal |
| **Reclutadores** | PYMEs y startups que buscan talento joven con habilidades técnicas y blandas |

### 📊 Cartera de Features (MVP)

| Épica | Puntos | Features |
|-------|--------|----------|
| **EP01** - Oportunidades sin experiencia | 31 | 8 features |
| **EP02** - Validación de habilidades | 36 | 6 features |
| **EP03** - Mejora proceso postulación | 30 | 7 features |
| **TOTAL** | **97** | **20 features** |

**Features Clave Implementadas:**
- ✅ Ofertas junior sin requisitos contradictorios
- ✅ Habilidades verificables con insignias
- ✅ Feedback detallado en rechazos
- ✅ Filtros específicos para "primera chamba"
- ✅ Alertas personalizadas de vacantes
- ✅ Chat real-time con reclutadores
- ✅ Gestión de proyectos académicos
- ✅ Sistema de notificaciones en tiempo real

---

## 🏗️ Arquitectura de la Aplicación

### Stack Tecnológico

#### Backend (Java/Spring Boot)
```
Framework        : Spring Boot 3.4.0 (Java 17)
ORM              : Spring Data JPA / Hibernate
Base de Datos    : SQL Server (Azure Cloud)
Autenticación    : JWT (JJWT 0.12.6)
API REST         : SpringDoc OpenAPI (Swagger 2.7.0)
Archivos         : Azure Blob Storage 12.26.0
Mensajería RT    : Spring WebSocket + STOMP
Validación       : Jakarta Bean Validation
Mapeo de DTOs    : MapStruct 1.6.3
Build Tool       : Maven 3.9.6
```

#### Frontend (Angular)
```
Framework        : Angular 21.2.0
Lenguaje         : TypeScript 5.9.2
Testing          : Vitest 4.0.8
HTTP Client      : RxJS 7.8.0
WebSocket        : STOMP.js + SockJS 7.3.0
Routing          : Lazy Loading modular
HTTP Interceptor : JWT Token Injection
```

#### Infraestructura
```
Contenedor       : Docker (Multi-stage Build)
Base Image       : Eclipse Temurin 17 JRE Alpine
Orquestación     : Docker Compose ready
Base de Datos    : SQL Server en Azure
Almacenamiento   : Azure Blob Storage
```

---

## 📂 Estructura del Proyecto

```
BolsaDeTrabajo/
├── backend/                              # Aplicación Java/Spring Boot
│   ├── src/main/java/com/bolsaempleo/
│   │   ├── controller/                  # 8 Controladores REST
│   │   ├── service/                     # 11 Servicios (@Transactional)
│   │   ├── repository/                  # 13 JpaRepositories
│   │   ├── model/                       # 13 Entidades JPA
│   │   ├── dto/                         # DTOs para Request/Response
│   │   ├── mapper/                      # MapStruct Mappers
│   │   ├── security/                    # JWT, Auth Guards
│   │   ├── config/                      # Configuración (CORS, WebSocket)
│   │   ├── exception/                   # Handlers de excepciones
│   │   └── seed/                        # Data initialization
│   ├── src/main/resources/
│   │   └── application.properties       # Config DB, JWT, Azure
│   ├── pom.xml                          # Dependencias Maven
│   └── target/                          # Build output
│
├── frontend/                             # Aplicación Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── services/           # 15 Servicios HTTP
│   │   │   │   │   ├── auth.ts         # Autenticación
│   │   │   │   │   ├── job.ts          # Ofertas de trabajo
│   │   │   │   │   ├── chat.ts         # Mensajería
│   │   │   │   │   ├── notification.ts # Notificaciones
│   │   │   │   │   ├── alerta.ts       # Alertas personalizadas
│   │   │   │   │   ├── postante.ts     # Perfil candidato
│   │   │   │   │   ├── reclutador.ts   # Perfil empresa
│   │   │   │   │   ├── proyecto.ts     # Proyectos
│   │   │   │   │   └── realtime.ts     # WebSocket/STOMP
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth-guard.ts   # Protección por rol
│   │   │   │   └── constants/
│   │   │   │       └── api.ts          # URLs base
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── candidato/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── explorar-vacantes/
│   │   │   │   │   ├── detalle-vacante/
│   │   │   │   │   ├── postulaciones/
│   │   │   │   │   ├── entrevistas/
│   │   │   │   │   ├── habilidades/
│   │   │   │   │   ├── perfil/
│   │   │   │   │   ├── alertas/
│   │   │   │   │   └── register/
│   │   │   │   │
│   │   │   │   ├── reclutador/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── publicar-oferta/
│   │   │   │   │   ├── vacantes/
│   │   │   │   │   ├── gestion-candidatos/
│   │   │   │   │   ├── feedback/
│   │   │   │   │   ├── reportes/
│   │   │   │   │   ├── portal-empresa/
│   │   │   │   │   └── register/
│   │   │   │   │
│   │   │   │   └── public/
│   │   │   │       ├── landing/
│   │   │   │       └── login/
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── layouts/
│   │   │   │   │   └── main-layout/     # Navbar, sidebar
│   │   │   │   ├── models/              # Interfaces TypeScript
│   │   │   │   ├── pipes/               # Pipes de formato
│   │   │   │   └── components/          # Componentes reutilizables
│   │   │   │
│   │   │   ├── app.routes.ts           # Routing central (lazy loading)
│   │   │   ├── app.config.ts           # Configuración Angular
│   │   │   └── app.ts                  # Root component
│   │   │
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.css
│   │
│   ├── package.json                    # Dependencias npm
│   ├── angular.json                    # Config build
│   ├── tsconfig.json                   # Config TypeScript
│   ├── vitest.config.ts                # Testing config
│   └── proxy.conf.json                 # Proxy a backend
│
├── Dockerfile                          # Build multi-stage
├── docker-compose.yml                  # (ready to use)
├── uploads/                            # Carpeta temporal de archivos
├── apache-maven-3.9.6/                # Maven preinstalado
└── README.md                           # Este archivo

```

---

## 🔌 API REST - Endpoints Principales

### 🔐 **Autenticación** (`/api/v1/auth`)
```http
POST   /auth/login                      Autenticación
POST   /auth/postante/register          Registro candidato
PUT    /auth/postante/{id}              Actualizar perfil candidato
```

### 👤 **Postantes - Candidatos** (`/api/v1/postantes`)
```http
POST   /postantes/register              Registro con CV + foto (multipart)
GET    /postantes/{id}                  Obtener perfil completo
PUT    /postantes/{id}                  Actualizar perfil
POST   /postantes/{id}/habilidades      Agregar habilidad
PUT    /postantes/{id}/descripcion      Actualizar biografía
GET    /postantes/{id}/proyectos        Listar proyectos académicos
POST   /postantes/{id}/proyectos        Crear proyecto
```

### 🏢 **Reclutadores - Empresas** (`/api/v1/reclutadores`)
```http
POST   /reclutadores/register           Registrar empresa
GET    /reclutadores/{id}               Obtener perfil
PUT    /reclutadores/{id}               Actualizar datos
PUT    /reclutadores/{id}/completo      Actualizar con foto (multipart)
```

### 💼 **Ofertas de Trabajo** (`/api/v1/postulaciones`)
```http
POST   /{id}/postular                   Aplicar a vacante (candidato)
GET    /{id}/candidatos                 Listar candidatos (reclutador)
PUT    /{id}/estado                     Cambiar estado + enviar feedback
GET    /{postulacionId}/estado/{postanteId}   Verificar estado candidatura
GET    /                                Listar todas las ofertas (filtrado)
POST   /                                Crear nueva oferta (reclutador)
```

### 💬 **Chat - Mensajería** (`/api/v1/chat`)
```http
GET    /conversaciones/postante/{id}              Chats del candidato
GET    /conversaciones/reclutador/{id}            Chats del reclutador
GET    /conversaciones/{id}/mensajes              Historial de mensajes
POST   /conversaciones/{id}/mensajes              Enviar mensaje (WebSocket)
PUT    /conversaciones/{id}/leidos                Marcar como leído
GET    /no-leidos                                 Contar mensajes no leídos
```

### 🔔 **Notificaciones** (`/api/v1/notificaciones`)
```http
GET    /                                Listar notificaciones
GET    /no-leidas                       Contar no leídas
PUT    /{id}/leida                      Marcar una como leída
PUT    /marcar-todas                    Marcar todas como leídas
```

### 🎯 **Alertas Personalizadas** (`/api/v1/alertas-empleo`)
```http
GET    /postante/{id}                   Listar alertas del candidato
POST   /postante/{id}                   Crear alerta (keyword + modalidad)
DELETE /{id}                            Eliminar alerta
```

**Documentación interactiva:** `/swagger-ui.html`

---

## 📊 Modelos de Datos

### Entidades Principales (13 total)

#### 👤 Postante (Candidato)
```java
{
  "id": 1,
  "username": "carlos_dev",
  "email": "carlos@example.com",
  "nombres": "Carlos",
  "apellidos": "García",
  "carrera": "Ingeniería Informática",
  "egresado": true,
  "cvPath": "https://storage.azure.com/...",
  "fotoPerfil": "https://...",
  "descripcion": "Desenvolvimiento ágil...",
  "institucion": "Universidad XYZ",
  "habilidades": [ { "nombre": "Java", "verificado": true } ],
  "proyectos": [ { "titulo": "App TODO", "url": "https://..." } ],
  "certificados": [ { "titulo": "AWS Certified" } ]
}
```

#### 💼 Postulación (Oferta de Trabajo)
```java
{
  "id": 5,
  "titulo": "Junior Developer NodeJS",
  "tipoModalidad": "PRÁCTICA",           // PRÁCTICA, TRAINEE, PRIMER_EMPLEO
  "tipoPuesto": "BACKEND",              // FRONTEND, BACKEND, FULLSTACK
  "salarioMinimo": 1500,
  "salarioMaximo": 2500,
  "descripcion": "Buscamos...",
  "requisitos": "- NodeJS\n- Git",
  "ubicacion": "Lima",
  "fechaPublicacion": "2024-06-15T10:00:00",
  "reclutador": { "id": 2, "empresa": "TechCorp" },
  "candidatos": [ {...} ]               // PostulacionEstado
}
```

#### 📋 PostulacionEstado (Candidatura)
```java
{
  "id": 42,
  "estado": "EN_REVISION",              // CV_ENVIADO, EN_REVISION, CONTACTARAN, FINALIZADO
  "fechaPostulacion": "2024-06-15T00:00:00",
  "fechaActualizacion": "2024-06-16T14:30:00",
  "motivo": "Tu CV está siendo evaluado. Pronto nos comunicaremos.",
  "postante": { "id": 1, "nombres": "Carlos" },
  "postulacion": { "id": 5, "titulo": "Junior Developer" }
}
```

#### 💬 Mensaje (Chat)
```java
{
  "id": 100,
  "contenido": "Hola, me interesa el puesto de...",
  "remitenteTipo": "POSTANTE",          // POSTANTE o RECLUTADOR
  "remitenteId": 1,
  "leido": true,
  "fechaEnvio": "2024-06-16T14:30:00",
  "conversacion": { "id": 8 }
}
```

#### 🎯 AlertaEmpleo (Búsqueda Personalizada)
```java
{
  "id": 3,
  "keyword": "nodejs",
  "modalidad": "PRÁCTICA",
  "frecuencia": "DIARIA",
  "activa": true,
  "fechaCreacion": "2024-06-15T10:00:00"
}
```

---

## 🔐 Flujos Principales

### 1️⃣ Candidato Buscando Trabajo
```
1. Registro     → /candidato/register (multipart: email, CV, foto)
2. Login        → POST /auth/login (JWT token por 24h)
3. Dashboard    → Resumen de postulaciones activas
4. Explorar     → GET /postulaciones (búsqueda + filtros)
5. Detalle      → Ver requisitos, modalidad, salario, empresa
6. Postular     → POST /postulaciones/{id}/postular
7. Seguimiento  → /candidato/postulaciones (estados)
8. Chat         → Comunicación con reclutador vía WebSocket
9. Alertas      → Crear búsquedas personalizadas
```

### 2️⃣ Reclutador Publicando Oferta
```
1. Registro       → /reclutador/register (empresa, email)
2. Login          → POST /auth/login
3. Crear Oferta   → POST /postulaciones (JSON con detalles)
4. Revisar CVs    → /reclutador/gestion-candidatos
5. Cambiar Estado → PUT /postulaciones/{id}/estado + feedback
6. Chat           → Comunicación directa con candidatos
7. Reportes       → Estadísticas de aplicaciones
```

### 3️⃣ Notificaciones en Tiempo Real
```
WebSocket Endpoint: /ws
Protocolo: STOMP + SockJS
Fallback: Polling

Eventos:
├─ Nueva postulación recibida
├─ Cambio de estado de candidatura
├─ Mensaje nuevo en chat
└─ Notificaciones del sistema
```

### 4️⃣ Autenticación y Autorización
```
1. POST /auth/login          → Credenciales (email + password)
2. Validación               → Busca en BD (Postante o Reclutador)
3. JWT Generation           → Token con rol (24h expiration)
4. Client Storage           → localStorage en navegador
5. HTTP Interceptor         → Agrega Authorization header
6. Server Validation        → JwtFilter en cada request
7. Role Authorization       → Guards por rol (@GetMapping)
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Java 17+** (OpenJDK o Oracle JDK)
- **Node.js 18+** y npm
- **Maven 3.9+** (incluido en el proyecto)
- **SQL Server** (Azure Cloud o local)
- **Docker** (opcional, para contenerización)

### Backend Setup

```bash
# 1. Navegar a la carpeta backend
cd backend

# 2. Configurar properties
# Editar: src/main/resources/application.properties
# Reemplazar:
#   - spring.datasource.url (Azure SQL Server)
#   - spring.datasource.username
#   - spring.datasource.password
#   - jwt.secret
#   - azure.storage.connection-string

# 3. Compilar
./mvnw clean install

# 4. Ejecutar
./mvnw spring-boot:run

# Backend disponible en: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Frontend Setup

```bash
# 1. Navegar a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Configurar backend URL
# Editar: src/app/core/constants/api.ts
# Cambiar: const API_BASE_URL = 'http://localhost:8080';

# 4. Ejecutar servidor de desarrollo
npm start

# Frontend disponible en: http://localhost:4200
```

### Docker Setup (Producción)

```bash
# 1. Construir imagen
docker build -t bolsa-trabajo:latest .

# 2. Ejecutar contenedor
docker run -p 8080:8080 \
  -e DB_URL=jdbc:sqlserver://... \
  -e DB_USER=... \
  -e DB_PASSWORD=... \
  bolsa-trabajo:latest

# 3. Acceder
# Backend: http://localhost:8080
# Frontend: http://localhost:3000 (servido por nginx)
```

---

## 🛠️ Desarrollo

### Estructura de Código - Backend

**Patrón: Service-Repository-Controller**

```java
// Ejemplo: PostulacionController
@RestController
@RequestMapping("/api/v1/postulaciones")
public class PostulacionController {
  @PostMapping("/{id}/postular")
  public ResponseEntity<?> postular(
    @PathVariable Long id,
    @RequestBody PostularRequest request,
    @AuthenticationPrincipal UserPrincipal principal
  ) {
    return postulacionService.postular(id, principal.getId(), request);
  }
}

// PostulacionService (Lógica de negocio)
@Service
@Transactional
public class PostulacionService {
  public ResponseEntity<?> postular(Long idOferta, Long idPostante, ...) {
    // Validaciones
    // Crear PostulacionEstado
    // Enviar notificación
    // Guardar en BD
  }
}

// PostulacionRepository (Acceso a datos)
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
  List<Postulacion> findByReclutadorId(Long reclutadorId);
}
```

**Entidades con Auditoría:**
```java
@Entity
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
  @CreatedDate
  private LocalDateTime createdAt;
  
  @LastModifiedDate
  private LocalDateTime updatedAt;
}
```

### Estructura de Código - Frontend

**Patrón: Smart/Dumb Components + RxJS Observables**

```typescript
// Smart Component (Container)
@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html'
})
export class PostulacionesComponent implements OnInit {
  postulaciones$ = this.postulacionService.getByPostante(this.postanteId);
  
  constructor(private postulacionService: PostulacionService) {}
  
  cambiarEstado(id: number, estado: string) {
    this.postulacionService.cambiarEstado(id, estado).subscribe(...);
  }
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-postulacion-card',
  inputs: ['postulacion', 'onEstadoChange']
})
export class PostulacionCardComponent {
  @Input() postulacion!: Postulacion;
  @Output() estadoChange = new EventEmitter<string>();
}

// Service (RxJS)
@Injectable({ providedIn: 'root' })
export class PostulacionService {
  constructor(private http: HttpClient) {}
  
  getByPostante(id: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(
      `${environment.apiUrl}/postulaciones/postante/${id}`
    );
  }
}
```

---

## 🧪 Testing

### Backend (JUnit 5 + Mockito)
```bash
# Ejecutar tests
./mvnw test

# Con reporte de cobertura
./mvnw test jacoco:report
```

### Frontend (Vitest)
```bash
# Ejecutar tests
npm run test

# Con cobertura
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

---

## 📚 Documentación Adicional

### API Documentation
```
OpenAPI/Swagger: http://localhost:8080/swagger-ui.html
JSON Schema: http://localhost:8080/v3/api-docs
```

### Base de Datos
```sql
-- Principales tablas:
POSTANTE              -- Candidatos
RECLUTADOR           -- Empresas
POSTULACION          -- Ofertas de trabajo
POSTULACION_ESTADO   -- Candidaturas
CONVERSACION         -- Chats
MENSAJE              -- Mensajes del chat
NOTIFICACION         -- Notificaciones
ALERTA_EMPLEO        -- Búsquedas personalizadas
HABILIDAD            -- Competencias del candidato
PROYECTO             -- Proyectos académicos
CERTIFICADO          -- Certificaciones
AVAL                 -- Avales académicos
```

### Propiedades de Configuración
```properties
# Database
spring.datasource.url=jdbc:sqlserver://bolsaserver.database.windows.net:1433;database=BolsaTrabajoDB
spring.datasource.username=CloudSA01d3b220
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=ZGV2LWJvbHNhLWVtcGxlb3Mtc2VjcmV0...
jwt.expiration-ms=86400000   # 24 horas

# Azure Storage
azure.storage.container-name=archivos-bolsa
app.uploads.base-url=/uploads
spring.servlet.multipart.max-file-size=10MB

# CORS
app.frontend.url=http://localhost:4200

# Logging
logging.level.com.bolsaempleo=INFO
logging.level.org.springframework.security=DEBUG
```

---

## 🎨 Guía de Estilos

- **Paleta:** Azules (confianza, tecnología) + degradados celeste/turquesa (dinamismo)
- **Tipografía:** Sans serif moderna
- **UI:** Cards claras, bordes suaves, esquinas redondeadas, espacios amplios
- **Responsive:** Mobile-first con breakpoints para tablet y desktop

---

## 📊 Estado de Implementación

### ✅ Completado (MVP)
- [x] Arquitectura full-stack (Backend/Frontend)
- [x] Autenticación JWT bilateral (Postante/Reclutador)
- [x] CRUD completo de ofertas de trabajo
- [x] Sistema de candidaturas con 4 estados
- [x] Mensajería real-time (WebSocket/STOMP)
- [x] Notificaciones del sistema
- [x] Alertas personalizadas de vacantes
- [x] Carga de archivos (CV, fotos) en Azure Blob Storage
- [x] Perfil de candidato (proyectos, habilidades, certificados)
- [x] Perfil de reclutador/empresa
- [x] Documentación Swagger/OpenAPI
- [x] Configuración Docker

### 📋 Posibles Mejoras Futuras
- [ ] Testing exhaustivo (unit + integration)
- [ ] Pruebas prácticas de habilidades
- [ ] Sistema de recomendaciones con IA
- [ ] Análisis de CV con OCR
- [ ] Integración con plataformas de pago
- [ ] Mobile app (React Native o Flutter)
- [ ] Analytics y reportes avanzados
- [ ] Validación de referencias de académicos

---

## 📁 Configuración de Despliegue

### Azure Cloud
```
SQL Server: bolsaserver.database.windows.net
Storage: bolsaempleo.blob.core.windows.net
Auth: JWT con 24h expiration
```

### Dockerfile (Multi-stage)
```dockerfile
# Stage 1: Build Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
COPY --from=builder /app/backend/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
```

---

## 🚢 Servicios Implementados (11)

| Servicio | Responsabilidad | Métodos |
|----------|-----------------|---------|
| **AuthService** | Autenticación, JWT, login/logout | 5+ |
| **PostanteService** | Perfil candidato, habilidades | 8+ |
| **ReclutadorService** | Perfil empresa, empresa | 5+ |
| **PostulacionService** | Ofertas, cambio de estado, feedback | 12+ |
| **ChatService** | Conversaciones, mensajes | 8+ |
| **NotificacionService** | Crear, listar, marcar leídas | 6+ |
| **AlertaEmpleoService** | Búsquedas personalizadas | 5+ |
| **ProyectoService** | CRUD proyectos académicos | 6+ |
| **CertificadoService** | CRUD certificaciones | 6+ |
| **AvalService** | CRUD avales académicos | 6+ |
| **ArchivoService** | Upload a Azure Blob, gestión URLs | 4+ |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Realiza cambios y tests
4. Commit (`git commit -am 'Agregar mejora'`)
5. Push a la rama (`git push origin feature/mejora`)
6. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto y Soporte

Para preguntas, reportar bugs o sugerencias:
- 📧 Email: support@chapatchamba.com
- 🐛 Issues: [GitHub Issues](https://github.com/...)
- 💬 Discussions: [GitHub Discussions](https://github.com/...)

---

**Última actualización:** Junio 2024  
**Versión:** 1.0.0-MVP
