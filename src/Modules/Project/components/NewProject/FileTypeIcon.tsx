// FileTypeIcon.tsx
interface FileTypeIconProps {
  fileName: string;
  className?: string;
}

export const FileTypeIcon = ({ fileName, className = "w-5 h-5" }: FileTypeIconProps) => {
  const getFileExtension = (name: string) => {
    return name.split('.').pop()?.toLowerCase() || '';
  };

  const extension = getFileExtension(fileName);

  const getIconByExtension = (ext: string) => {
    switch (ext) {
      case 'pdf':
        return (
          <svg className={`${className} text-red-500`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3 3h6v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h7zm-1 2H5v16h14V7h-5V4H11z"/>
            <text x="12" y="15" textAnchor="middle" fontSize="6" fill="currentColor">PDF</text>
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className={`${className} text-blue-600`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3 3h6v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h7zm-1 2H5v16h14V7h-5V4H11z"/>
            <text x="12" y="15" textAnchor="middle" fontSize="5" fill="currentColor">DOC</text>
          </svg>
        );
      case 'txt':
        return (
          <svg className={`${className} text-gray-600`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3 3h6v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h7zm-1 2H5v16h14V7h-5V4H11z"/>
            <text x="12" y="15" textAnchor="middle" fontSize="5" fill="currentColor">TXT</text>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg className={`${className} text-green-500`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM5 19V5h14v14H5zm4-11a2 2 0 11-4 0 2 2 0 014 0zm11 9l-3-4-6 8h9z"/>
          </svg>
        );
      default:
        return (
          <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3 3h6v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h7zm-1 2H5v16h14V7h-5V4H11z"/>
          </svg>
        );
    }
  };

  return getIconByExtension(extension);
};