# FAQ y Services - Gestión de Tablas

## 📋 Descripción

Se han creado dos módulos completos para la gestión de **FAQ (Preguntas Frecuentes)** y **Services (Servicios)**, basados en la estructura del módulo de Materials.

## 🗂️ Estructura Creada

### FAQ (Preguntas Frecuentes)

```
src/Modules/Lading/FAQ/
├── Components/
│   ├── TableFAQ/
│   │   ├── FAQColumns.tsx      # Definición de columnas
│   │   └── FAQTable.tsx         # Componente de tabla
│   ├── ModalsFAQ/
│   │   ├── CreateFAQModal.tsx   # Modal para crear
│   │   ├── UpdateFAQModal.tsx   # Modal para editar
│   │   └── DeleteFAQModal.tsx   # Botón para eliminar
│   └── PaginationFAQ/
│       ├── FAQHeaderBar.tsx     # Barra de filtros y búsqueda
│       └── FAQPager.tsx         # Componente de paginación
├── Pages/
│   └── ListFAQs.tsx             # Página principal
├── Hooks/
│   └── FAQHooks.ts              # Hooks actualizados (con delete)
├── Services/
│   └── FAQServices.ts           # Servicios API
├── Models/
│   └── FAQ.ts                   # Interfaces TypeScript
└── index.ts                     # Exportaciones
```

### Services (Servicios)

```
src/Modules/Lading/Services/
├── Components/
│   ├── TableServices/
│   │   ├── ServiceColumns.tsx      # Definición de columnas
│   │   └── ServiceTable.tsx         # Componente de tabla
│   ├── ModalsServices/
│   │   ├── CreateServiceModal.tsx   # Modal para crear
│   │   ├── UpdateServiceModal.tsx   # Modal para editar
│   │   └── DeleteServiceModal.tsx   # Botón para eliminar
│   └── PaginationServices/
│       ├── ServiceHeaderBar.tsx     # Barra de filtros y búsqueda
│       └── ServicePager.tsx         # Componente de paginación
├── Pages/
│   └── ListServices.tsx             # Página principal
├── Hooks/
│   └── ServicesHooks.ts             # Hooks (ya existía)
├── Servicios/
│   └── Services.services.ts         # Servicios API (ya existía)
├── Models/
│   └── Services.ts                  # Interfaces TypeScript (ya existía)
└── index.ts                         # Exportaciones
```

## 🚀 Uso

### FAQ

```tsx
// Importar la página principal
import { ListFAQs } from '@/Modules/Lading/FAQ';

// En tu router o componente
<ListFAQs />
```

### Services

```tsx
// Importar la página principal
import { ListServices } from '@/Modules/Lading/Services';

// En tu router o componente
<ListServices />
```

## ✨ Funcionalidades

Ambos módulos incluyen:

### 1. **Tabla con Paginación**
- Visualización de datos en tabla responsiva
- Paginación integrada en el footer
- Navegación: Primera, Anterior, Siguiente, Última página

### 2. **Filtros y Búsqueda**
- Búsqueda en tiempo real (FAQ: pregunta/respuesta, Services: título/descripción)
- Filtro por estado (Activo/Inactivo/Todos)
- Selector de filas por página (5, 10, 20, 50, 100)
- Botón para limpiar filtros

### 3. **CRUD Completo**

#### Crear
- Modal con formulario
- Validación de campos requeridos
- Notificaciones toast de éxito/error

#### Leer
- Listado con toda la información
- Formato visual agradable
- Indicadores de estado con colores

#### Actualizar
- Modal de edición con vista previa de datos actuales
- Modal de confirmación antes de guardar
- Actualización en tiempo real

#### Eliminar
- Modal de confirmación de inhabilitación
- Mensaje descriptivo con el nombre del elemento
- Deshabilitación del botón durante la operación

### 4. **Características Especiales**

#### FAQ
- Visualización completa de pregunta y respuesta
- Campos de texto multilínea para respuestas largas
- Badge de estado (Activo/Inactivo)

#### Services
- Visualización de icono (URL)
- Manejo de errores en carga de imágenes
- Icono placeholder si la URL falla
- Descripción completa del servicio

## 🎨 Diseño

- **Colores principales**: 
  - `#091540` (azul oscuro)
  - `#1789FC` (azul claro)
- **Estados**:
  - Activo: Verde (`bg-green-100 text-green-800`)
  - Inactivo: Rojo (`bg-red-100 text-red-800`)
- **Efectos hover** en botones y filas
- **Bordes y sombras** consistentes con el diseño general

## 🔧 Hooks Utilizados

### FAQ
```typescript
useGetAllFAQs()      // Obtener todas las FAQs
useGetFAQById(id)    // Obtener una FAQ por ID
useCreateFAQ()       // Crear nueva FAQ
useUpdateFAQ()       // Actualizar FAQ existente
useDeleteFAQ()       // Eliminar/Inhabilitar FAQ (NUEVO)
```

### Services
```typescript
useGetAllServices()      // Obtener todos los servicios
useGetServiceById(id)    // Obtener un servicio por ID
useCreateService()       // Crear nuevo servicio
useUpdateService()       // Actualizar servicio existente
useDeleteMaterial()      // Eliminar/Inhabilitar servicio
```

## 📦 Dependencias

Asegúrate de tener instaladas:
- `@tanstack/react-table` - Tablas
- `@tanstack/react-query` - Gestión de estado servidor
- `@tanstack/react-form` - Formularios
- `react-toastify` - Notificaciones
- `lucide-react` - Iconos

## 🎯 Próximos Pasos

Para usar estos módulos en tu aplicación:

1. **Agregar las rutas** en tu configuración de rutas:
```tsx
{
  path: '/admin/faqs',
  element: <ListFAQs />
}
{
  path: '/admin/services',
  element: <ListServices />
}
```

2. **Verificar las URLs del API** en los servicios

3. **Personalizar estilos** si es necesario

4. **Agregar permisos** con el componente `<Can>` si aplica

## 📝 Notas

- Ambos módulos usan **paginación local** (filtrado en frontend)
- Si necesitas paginación del servidor, ajusta los hooks y servicios
- Los modales usan `ModalBase` y componentes de confirmación existentes
- Toast notifications configuradas con posición `top-right` y 3 segundos de duración

---

**Desarrollado siguiendo la estructura de Materials** ✅
