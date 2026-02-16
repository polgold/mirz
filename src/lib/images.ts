import fs from 'node:fs';
import path from 'node:path';

/** Leer desde public/images (todo ordenado; prebuild ya copió source → public). */
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm']);

/** Solo estas categorías se muestran en Works (sin Home ni Media). */
const WORKS_CATEGORY_SLUGS = new Set(['escultura', 'esculturas', 'vidrio', 'pinturas']);

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
    if (!WORKS_CATEGORY_SLUGS.has(folder.toLowerCase())) continue;
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = (fs.readdirSync(folderPath) as string[]).filter(isImageFile).sort();
    const images = files.map((file) => ({
      src: `/images/${folder}/${file}`,
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

function isVideoFile(name: string): boolean {
  return VIDEO_EXTENSIONS.has(path.extname(name).toLowerCase());
}

/** Hero de la home: video + imágenes mir8..mir15 desde public/images/home. */
export function getHomeHeroMedia(): { video: string | null; images: string[] } {
  const homePath = path.join(IMAGES_DIR, 'home');
  try {
    if (!fs.statSync(homePath).isDirectory()) return { video: null, images: [] };
  } catch {
    return { video: null, images: [] };
  }
  const files = fs.readdirSync(homePath) as string[];
  let video: string | null = null;
  const imageList: { name: string; path: string }[] = [];
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext).toLowerCase();
    if (base === 'video_mir02') {
      if (VIDEO_EXTENSIONS.has(ext)) video = `/images/home/${file}`;
    } else if (IMAGE_EXTENSIONS.has(ext)) {
      const match = /^mir(\d+)$/.exec(base);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= 8 && n <= 15) imageList.push({ name: file, path: `/images/home/${file}` });
      }
    }
  }
  imageList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  return {
    video,
    images: imageList.map((i) => i.path),
  };
}
