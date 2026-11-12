/**
 * Kliensoldali képtömörítés Canvas segítségével.
 * Egy 5-10MB-os okostelefon fotót 40-80KB méretűre tömörít le másodpercek alatt,
 * így azonnal beilleszthető a hirdetésbe extra tárhely vagy S3/Cloudinary konfiguráció nélkül.
 */
export async function compressImage(file: File, maxDimension = 960, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // WebP formátum támogatás ha elérhető, egyébként jpeg
        const mimeType = 'image/webp';
        let dataUrl = canvas.toDataURL(mimeType, quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Nem sikerült betölteni a képet.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Nem sikerült beolvasni a fájlt.'));
    reader.readAsDataURL(file);
  });
}

