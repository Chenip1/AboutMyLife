import type { IDiaryImage } from '@/data/diary';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function filesToDiaryImages(files: FileList | File[]): Promise<IDiaryImage[]> {
  const fileArray = Array.from(files);
  const images: IDiaryImage[] = [];
  for (const file of fileArray) {
    if (!file.type.startsWith('image/')) continue;
    const dataUrl = await fileToDataUrl(file);
    images.push({
      id: generateId(),
      dataUrl,
      name: file.name,
    });
  }
  return images;
}
