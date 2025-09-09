const serverUrl = import.meta.env.VITE_API_URL;

export async function uploadImage(file, sortiment, componentId, access_token) {
  // Skip if no file
  if (!file || !(file instanceof File)) return;

  // Prepare form data
  const formData = new FormData();
  formData.append('sortiment', sortiment);
  formData.append('file_type', file.type.includes('svg') ? 'vector' : 'image');
  formData.append('component_id', componentId);
  formData.append('file_object', file);

  // Send request with data
  const response = await fetch(`${serverUrl}/api/goldfren/internal/image/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: formData
  });

  // Check for errors
  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.statusText}`);
  }

  return await response.json();
}