// DebugUtils.ts
export const logDropboxError = (error: any) => {
  console.group('🔴 Error de Dropbox - Información de Debug');
  
  if (error?.response) {
    console.log('📊 Status:', error.response.status);
    console.log('📝 Message:', error.response.data?.message || error.message);
    console.log('🔗 URL:', error.response.config?.url);
    console.log('📋 Headers:', error.response.config?.headers);
  }
  
  console.log('📄 Error completo:', error);
  
  console.group('💡 Posibles soluciones:');
  console.log('1. Verificar configuración de token de Dropbox en el backend');
  console.log('2. Revisar permisos de la aplicación en Dropbox');
  console.log('3. Validar que el token no haya expirado');
  console.log('4. Comprobar la estructura de carpetas en Dropbox');
  console.groupEnd();
  
  console.groupEnd();
};

export const getFileUploadErrorMessage = (error: any): string => {
  if (!error?.response) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }
  
  const status = error.response.status;
  const message = error.response.data?.message || '';
  
  switch (status) {
    case 400:
      if (message.includes('Dropbox') || message.includes('authorization')) {
        return 'Error de configuración del almacenamiento. Contacta al administrador del sistema.';
      }
      return 'Error en los datos enviados. Verifica que los archivos sean válidos.';
      
    case 401:
      return 'Sin autorización para subir archivos. Verifica tu sesión.';
      
    case 403:
      return 'No tienes permisos para subir archivos en este proyecto.';
      
    case 413:
      return 'Los archivos son demasiado grandes. Reduce el tamaño e intenta nuevamente.';
      
    case 500:
      if (message.includes('Dropbox') || message.includes('DropboxResponseError')) {
        return 'Error de configuración del sistema de almacenamiento. Contacta al administrador.';
      }
      return 'Error interno del servidor. Intenta nuevamente en unos minutos.';
      
    case 502:
    case 503:
    case 504:
      return 'El servidor no está disponible temporalmente. Intenta nuevamente en unos minutos.';
      
    default:
      return `Error inesperado (${status}). Contacta al soporte técnico.`;
  }
};