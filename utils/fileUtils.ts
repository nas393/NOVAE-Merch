
export const dataUrlToPng = (
  dataUrl: string
): Promise<{ base64Data: string; mimeType: 'image/png' }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 128;
      canvas.height = img.naturalHeight || 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }
      ctx.drawImage(img, 0, 0);
      const pngDataUrl = canvas.toDataURL('image/png');
      const [, data] = pngDataUrl.split(',');
      if (data) {
        resolve({ base64Data: data, mimeType: 'image/png' });
      } else {
        reject(new Error('Failed to convert canvas to PNG data URL.'));
      }
    };
    img.onerror = (err) => {
      console.error("Image loading error for conversion:", err);
      reject(new Error('Failed to load image for conversion.'));
    };
    img.src = dataUrl;
  });
};

export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const result = reader.result as string;
      
      if (file.type === 'image/svg+xml') {
        try {
          const pngData = await dataUrlToPng(result);
          resolve(pngData);
        } catch (err) {
          reject(err);
        }
      } else {
        const [header, data] = result.split(',');
        const mimeTypeMatch = header.match(/:(.*?);/);
        
        if (data && mimeTypeMatch && mimeTypeMatch[1]) {
          resolve({ base64Data: data, mimeType: mimeTypeMatch[1] });
        } else {
          reject(new Error('Failed to parse file data URL.'));
        }
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
