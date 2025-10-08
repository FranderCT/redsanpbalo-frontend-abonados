// Ejemplo con axios
import axios from 'axios';

async function uploadProjectFiles(projectId: number, files: File[], subfolder = 'Complementarios') {
  const form = new FormData();
  files.forEach(f => form.append('files', f)); // 👈 mismo key 'files'
  form.append('subfolder', subfolder);

  const res = await axios.post(`/projects/${projectId}/files`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}