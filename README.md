# Backend Adopt Me

API REST con **Express**, **MongoDB** (Mongoose) y documentación **Swagger** en `/api/docs`. Gestión de usuarios, mascotas, adopciones y sesiones.

**Repositorio GitHub:** [evanpereyra/proyectoBackendIIIPereyra](https://github.com/evanpereyra/proyectoBackendIIIPereyra)

---

## Imagen en Docker Hub

- **Página de la imagen:** [https://hub.docker.com/r/evanpereyra/proyectobackendiiipereyra](https://hub.docker.com/r/evanpereyra/proyectobackendiiipereyra)

Nombre de imagen: `evanpereyra/proyectobackendiiipereyra`

### Descargar y ejecutar desde Docker Hub

Requiere **MongoDB** accesible desde el contenedor (Mongo en el host o en otra red Docker).

```bash
docker pull evanpereyra/proyectobackendiiipereyra:latest
```

Ejemplo con MongoDB en el mismo equipo (Windows/Mac: `host.docker.internal`; Linux: IP del host o red Docker según tu configuración):

```bash
docker run --rm -p 3000:3000 ^
  -e MONGO_URI=mongodb://host.docker.internal:27017/adoptme ^
  evanpereyra/proyectobackendiiipereyra:latest
```

PowerShell (una línea):

```powershell
docker run --rm -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/adoptme evanpereyra/proyectobackendiiipereyra:latest
```

- **API:** [http://localhost:3000](http://localhost:3000)  
- **Swagger:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

La imagen expone el puerto **3000** (`PORT=3000` en el contenedor).

---

## Construir y ejecutar con Docker (local)

Desde la raíz del repositorio (donde está el `Dockerfile`):

### 1. Construir la imagen

```bash
docker build -t proyectobackendiiipereyra:local .
```

### 2. MongoDB

Si aún no tienes MongoDB:

```bash
docker run -d --name adoptme-mongo -p 27017:27017 mongo:latest
```

### 3. Ejecutar el contenedor

```bash
docker run --rm -p 3000:3000 ^
  -e MONGO_URI=mongodb://host.docker.internal:27017/adoptme ^
  proyectobackendiiipereyra:local
```

Ajusta `MONGO_URI` si Mongo corre en otro host o en una red Docker compartida (por ejemplo `mongodb://adoptme-mongo:27017/adoptme` con el mismo nombre de servicio y red).

---

## Variables de entorno

| Variable    | Descripción        | Ejemplo por defecto (desarrollo local)   |
|------------|--------------------|------------------------------------------|
| `PORT`     | Puerto HTTP        | `8080` en local; en la imagen Docker: `3000` |
| `MONGO_URI`| Cadena de conexión | `mongodb://localhost:27017/adoptme`    |

Copia `.env.example` a `.env` y edita los valores:

```bash
copy .env.example .env
```

---

## Ejecución sin Docker

Requisitos: **Node.js** (recomendado 20.x) y **MongoDB** en ejecución.

```bash
npm install
npm start
```

Desarrollo con recarga automática:

```bash
npm run dev
```

Por defecto la app usa el puerto **8080** si no defines `PORT` (ver `.env.example`).

---

## Pruebas

```bash
npm test
```

---

## Publicar la imagen en Docker Hub

1. Inicia sesión: `docker login`  
2. Etiqueta y sube (ajusta el tag `latest` si usas versiones):

   ```bash
   docker tag proyectobackendiiipereyra:local evanpereyra/proyectobackendiiipereyra:latest
   docker push evanpereyra/proyectobackendiiipereyra:latest
   ```

---

## Resumen de endpoints útiles

| Recurso      | Prefijo base     |
|-------------|------------------|
| Usuarios    | `/api/users`     |
| Mascotas    | `/api/pets`      |
| Adopciones  | `/api/adoptions` |
| Sesiones    | `/api/sessions`  |
| Mocks       | `/api/mocks`     |
| Documentación OpenAPI (Swagger UI) | `/api/docs` |

Para detalle de rutas y cuerpos de petición, usa **Swagger** en el navegador cuando el servidor esté en marcha.
