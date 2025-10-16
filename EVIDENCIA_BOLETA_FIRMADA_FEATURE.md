# Campo de Evidencia de Boleta Firmada - CreateAssociatedRqModal

## Funcionalidad Agregada

### 📋 Campo de Upload
- **Nombre:** "Evidencia de boleta firmada"
- **Tipo:** Opcional (no requerido)
- **Formatos:** PDF, JPG, JPEG, PNG, DOC, DOCX
- **Tamaño máximo:** 10MB por archivo
- **Múltiples archivos:** Sí

### 🔧 Características Técnicas

#### Upload con Rate Limiting Protection
- ✅ **Upload secuencial** (no paralelo)
- ✅ **Retry automático** con exponential backoff
- ✅ **Respeto de Retry-After** headers de Dropbox
- ✅ **Jitter** para evitar thundering herd effect

#### Validaciones
- ✅ **Tamaño máximo:** 10MB por archivo
- ✅ **Tipos permitidos:** Documentos e imágenes comunes
- ✅ **Feedback visual** de errores y progreso

#### UX Mejorada
- ✅ **Drag & Drop** para facilidad de uso
- ✅ **Preview de archivos** seleccionados con opción de remover
- ✅ **Indicadores de progreso** durante upload
- ✅ **Toast notifications** informativas

### 🎯 Flujo de Trabajo

1. **Usuario completa justificación** (campo obligatorio)
2. **Opcionalmente arrastra/selecciona** archivos de evidencia
3. **Click "Crear Solicitud"**
4. **Proceso secuencial:**
   - Se crea la solicitud primero
   - Si hay archivos, se suben con retry automático
   - Feedback visual del progreso
   - Confirmación final

### 📁 Estructura de Archivos en Dropbox
```
/request-associated-file/{requestId}/
  └── Evidencia-Boleta-Firmada/
      ├── archivo1.pdf
      ├── archivo2.jpg
      └── ...
```

### 🔗 Servicio Utilizado
- **Función:** `UploadAssociatedFiles`
- **Endpoint:** `request-associated-file/{rqId}`
- **Subfolder:** `Evidencia-Boleta-Firmada`

### 🎨 Componentes Visuales
- **FileField:** Componente reutilizable con drag & drop
- **Progress indicator:** Spinner y texto dinámico en botón
- **File preview:** Lista de archivos con tamaños y opción remover
- **Error handling:** Toast notifications para errores específicos

## Beneficios

1. **Robustez:** Maneja errores 429 de Dropbox automáticamente
2. **Usabilidad:** Drag & drop intuitivo
3. **Transparencia:** Usuario ve exactamente qué está pasando
4. **Flexibilidad:** Campo opcional, no bloquea el flujo principal
5. **Escalabilidad:** Preparado para manejar múltiples archivos

---

*El campo mantiene la consistencia con otros modales de upload implementados en el proyecto.*