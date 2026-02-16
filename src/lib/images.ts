import fs from 'node:fs';
import path from 'node:path';

const IMAGES_DIR = path.join(process.cwd(), 'source', 'images');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

export type GalleryCategory = {
  slug: string;
  name: string;
  images: { src: string; alt: string }[];
};

function isImageFile(name: string): boolean {
  const ext = path.extname(name).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

/** List category folders and their images. Public URL base for static files. */
export function getGalleryCategories(): GalleryCategory[] {
  const categories: GalleryCategory[] = [];
  let dir: string[] = [];

  try {
    dir = fs.readdirSync(IMAGES_DIR, { withFileTypes: false }) as string[];
  } catch {
    return categories;
  }

  const folders = dir.filter((name) => {
    const full = path.join(IMAGES_DIR, name);
    return fs.statSync(full).isDirectory() && !name.startsWith('.');
  });

  for (const folder of folders.sort()) {
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = (fs.readdirSync(folderPath) as string[]).filter(isImageFile).sort();
    const images = files.map((file) => ({
      src: `/api/images/${folder}/${file}`,
      alt: file.replace(path.extname(file), '').replace(/[-_]/g, ' '),
    }));
    if (images.length > 0) {
      categories.push({
        slug: folder,
        name: folder.charAt(0).toUpperCase() + folder.slice(1),
        images,
      });
    }
  }

  return categories;
}
