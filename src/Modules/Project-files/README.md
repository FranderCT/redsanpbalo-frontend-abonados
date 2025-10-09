# Documentación del Servicio de Archivos de Proyecto

## Resumen
Este servicio permite manejar la subida, descarga y eliminación de archivos asociados a proyectos en el sistema Red San Pablo.

## Archivos Principales
- `ProjectFileServices.ts` - Servicios para llamadas a la API
- `ProjectFileHooks.ts` - Hooks de React Query para manejo de estado
- `FileUploadProgress.tsx` - Componente UI para mostrar progreso de subida

## Integración en CreateProject

### 1. Importaciones necesarias
```typescript
import { useUploadProjectFiles } from "../../../Project-files/Hooks/ProjectFileHooks";
```

### 2. Estado local para archivos
```typescript
const [projectDocuments, setProjectDocuments] = useState<File[]>([]);
```

### 3. Hook de subida
```typescript
const uploadFilesMutation = useUploadProjectFiles();
```

### 4. Integración en el flujo de creación
Después de crear el proyecto exitosamente, los archivos se suben automáticamente:

```typescript
// 4) Subir archivos si existen
if (projectDocuments.length > 0) {
  try {
    await uploadFilesMutation.mutateAsync({
      projectId: Number(projectId),
      files: projectDocuments,
      subfolder: 'Complementarios',
      uploadedByUserId: value.UserId // ID del usuario que sube los archivos
    });
  } catch (fileError) {
    // Manejo de errores...
  }
}
```

## Funcionalidades Implementadas

### ✅ Subida de múltiples archivos
- Soporte para arrastar y soltar (drag & drop)
- Validación de tipos de archivo permitidos
- Vista previa de archivos seleccionados
- Posibilidad de eliminar archivos antes de enviar

### ✅ Tipos de archivo soportados
- PDF (.pdf)
- Word (.doc, .docx)
- Texto plano (.txt)
- Imágenes (.jpg, .jpeg, .png)

### ✅ Experiencia de usuario
- Indicador visual de progreso de subida
- Mensajes de confirmación y error
- Interfaz responsive y accesible

### ✅ Validación en paso de confirmación
- Muestra lista de archivos que se subirán
- Incluye nombre y tamaño de cada archivo

## API Endpoints Utilizados

### POST `/project-file/{projectId}`
Sube archivos a un proyecto específico usando el método `uploadMany`.

**Body (FormData):**
- `files`: Array de archivos
- `subfolder`: Carpeta destino (default: 'Complementarios')
- `uploadedByUserId`: ID del usuario que sube los archivos (opcional)

**Respuesta:**
```typescript
ProjectFileMetadata[] // Array de metadatos de archivos subidos
```

### GET `/projects/{projectId}/files`
Obtiene lista de archivos de un proyecto.

**Query Params:**
- `subfolder`: Carpeta a consultar

### DELETE `/projects/{projectId}/files/{filename}`
Elimina un archivo específico.

**Query Params:**
- `subfolder`: Carpeta donde está el archivo

## Estructura de Datos

### ProjectFileMetadata
```typescript
{
  Project: {
    Id: number;
    Name: string;
  };
  Path: string;        // Ruta en Dropbox
  FileName: string;    // Nombre original del archivo
  MimeType: string;    // Tipo MIME
  Size: number;        // Tamaño en bytes
  Rev: string;         // Revisión de Dropbox
  Id?: number;         // ID en base de datos
  CreatedAt?: string;  // Fecha de creación
  UpdatedAt?: string;  // Fecha de actualización
}
```

## Manejo de Errores

### Errores de subida
- No interrumpen el flujo principal de creación del proyecto
- Se muestran como advertencias al usuario
- Se registran en consola para debugging

### Errores de validación
- Archivos con tipos no permitidos se filtran automáticamente
- Se muestra mensaje informativo al usuario

## Próximas Mejoras Sugeridas

1. **Compresión de imágenes** antes de subir
2. **Vista previa de archivos** (especialmente imágenes)
3. **Límite de tamaño** por archivo y total
4. **Reintento automático** en caso de fallos de red
5. **Subida en lotes** para mejor rendimiento