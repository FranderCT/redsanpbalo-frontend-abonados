// FileUploadProgress.tsx
import { useState, useEffect } from 'react';

interface FileUploadProgressProps {
  isUploading: boolean;
  uploadedFiles?: number;
  totalFiles?: number;
  error?: string | null;
}

export const FileUploadProgress = ({ 
  isUploading, 
  uploadedFiles = 0, 
  totalFiles = 0, 
  error 
}: FileUploadProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (totalFiles > 0) {
      setProgress((uploadedFiles / totalFiles) * 100);
    }
  }, [uploadedFiles, totalFiles]);

  if (!isUploading && !error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="text-center">
          {error ? (
            <>
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error al subir archivos</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
            </>
          ) : (
            <>
              <div className="text-blue-500 mb-4">
                <svg className="w-12 h-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H10m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subiendo archivos...</h3>
              <p className="text-sm text-gray-600 mb-4">
                {uploadedFiles} de {totalFiles} archivos subidos
              </p>
              
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="text-xs text-gray-500">
                {Math.round(progress)}% completado
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};