// ConfigurationErrorModal.tsx
import { useState, useEffect } from 'react';

interface ConfigurationErrorModalProps {
  show: boolean;
  onClose: () => void;
  errorType: 'dropbox' | 'server' | 'network' | 'other';
  errorMessage: string;
}

export const ConfigurationErrorModal = ({ 
  show, 
  onClose, 
  errorType, 
  errorMessage 
}: ConfigurationErrorModalProps) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onClose();
    }
  }, [show, countdown, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (errorType) {
      case 'dropbox':
        return (
          <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'server':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'dropbox':
        return 'Problema de Configuración de Almacenamiento';
      case 'server':
        return 'Error del Servidor';
      case 'network':
        return 'Problema de Conexión';
      default:
        return 'Error Inesperado';
    }
  };

  const getSuggestions = () => {
    switch (errorType) {
      case 'dropbox':
        return [
          'El administrador debe verificar la configuración de Dropbox',
          'Revisar que el token de acceso sea válido y no haya expirado',
          'Verificar los permisos de la aplicación en Dropbox'
        ];
      case 'server':
        return [
          'El servidor está experimentando problemas técnicos',
          'Intenta nuevamente en unos minutos',
          'Si el problema persiste, contacta al soporte técnico'
        ];
      case 'network':
        return [
          'Verifica tu conexión a internet',
          'Intenta recargar la página',
          'Si usas VPN, intenta desconectarla temporalmente'
        ];
      default:
        return [
          'Intenta recargar la página',
          'Verifica tu conexión a internet',
          'Contacta al soporte técnico si el problema persiste'
        ];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="text-center">
          <div className="mb-4">
            {getIcon()}
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {getTitle()}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {errorMessage}
          </p>
          
          <div className="text-left mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">¿Qué puedes hacer?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {getSuggestions().map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 text-xs mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cerrar ({countdown}s)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Recargar Página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};