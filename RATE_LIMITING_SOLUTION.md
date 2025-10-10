# Solución para Rate Limiting de Dropbox (Error 429)

## Problema Original
El error `429 too_many_write_operations` se produce cuando se hacen demasiadas operaciones de escritura concurrentes en Dropbox en una ventana de tiempo corta.

## Solución Implementada

### 1. Uploads Secuenciales en lugar de Paralelos
**Antes:**
```typescript
// ❌ Malo: Uploads en paralelo causaban 429
const uploadPromises = [];
uploadPromises.push(upload1, upload2, upload3, upload4);
await Promise.all(uploadPromises);
```

**Después:**
```typescript
// ✅ Bueno: Uploads secuenciales con pausa entre ellos
for (const task of uploadTasks) {
    await uploadWithRetry(() => upload(task));
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa 500ms
}
```

### 2. Retry con Exponential Backoff y Respeto de Retry-After
```typescript
const uploadWithRetry = async (uploadFn, maxRetries = 3) => {
    while (attempt < maxRetries) {
        try {
            return await uploadFn();
        } catch (error) {
            if (error?.response?.status === 429) {
                // Respeta Retry-After header o usa exponential backoff
                const retryAfter = error.response.headers['retry-after'];
                const delayMs = retryAfter ? 
                    parseInt(retryAfter) * 1000 : 
                    Math.min(baseDelay * Math.pow(2, attempt), 10000);
                
                // Jitter ±25% para evitar thundering herd
                const jitter = delayMs * 0.25 * (Math.random() - 0.5);
                const finalDelay = Math.max(delayMs + jitter, 500);
                
                await new Promise(resolve => setTimeout(resolve, finalDelay));
            }
        }
    }
};
```

### 3. Mejor Manejo de Errores y Logging
- Log detallado de errores con status, headers y detalles de archivos
- Timeout configurado a 60 segundos para uploads grandes
- Manejo específico de códigos de error 429

### 4. Indicadores de Progreso Mejorados
- Progreso individual por documento: "Subiendo X... (2/4)"
- Toast notifications por cada documento completado
- Estado visual en botón: "Procesando..." → mensaje específico
- Conteo de documentos exitosos vs fallidos

### 5. Configuración Recomendada

#### Tiempos de Espera:
- **Entre uploads**: 500ms mínimo
- **Retry base**: 1000ms
- **Retry máximo**: 10 segundos
- **Jitter**: ±25% del delay calculado

#### Límites:
- **Máximo 3 reintentos** por upload
- **Timeout**: 60 segundos por archivo
- **Uploads secuenciales** (no paralelos)

## Archivos Modificados

### 1. `CreateAvailabilityWaterRqModal.tsx`
- ✅ Implementado upload secuencial
- ✅ Función `uploadWithRetry` con backoff
- ✅ Indicadores de progreso mejorados
- ✅ Manejo de errores específicos

### 2. `ProjectFileServices.ts`
- ✅ Mejor logging de errores
- ✅ Timeout configurado
- ✅ Preparado para retry automático

## Cómo Usar

### Para Nuevos Componentes:
1. **NO uses `Promise.all()`** para múltiples uploads
2. **Usa loops secuenciales** con await
3. **Implementa la función `uploadWithRetry`**
4. **Agrega pausas entre uploads** (500ms mínimo)

### Ejemplo de Implementación:
```typescript
// ✅ Patrón recomendado
const uploadTasks = [
    { name: 'Doc 1', files: files1, subfolder: 'folder1' },
    { name: 'Doc 2', files: files2, subfolder: 'folder2' }
];

for (const task of uploadTasks) {
    await uploadWithRetry(() => upload(task.files, task.subfolder));
    await new Promise(resolve => setTimeout(resolve, 500));
}
```

## Beneficios de la Solución

1. **Elimina errores 429** al respetar límites de Dropbox
2. **Recuperación automática** de fallos temporales
3. **Mejor UX** con progreso detallado
4. **Robusto** contra problemas de red
5. **Escalable** para más documentos en el futuro

## Próximos Pasos Recomendados

1. **Aplicar el mismo patrón** a otros componentes con upload múltiple
2. **Monitorear logs** para identificar otros puntos de mejora
3. **Considerar queue system** si el volumen de uploads crece significativamente
4. **Rate limiting a nivel de aplicación** si es necesario

---

*Esta solución garantiza que los 4 documentos requeridos se suban de manera confiable respetando los límites de Dropbox.*