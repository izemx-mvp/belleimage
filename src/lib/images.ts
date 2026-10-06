// Chargement des images par nom. Jamais d'import statique d'image : un fichier absent
// ne doit jamais casser le build. Le glob est résolu à la compilation (identique serveur/client).
import { imageManifest } from "@/data/images";

const files = import.meta.glob("/src/assets/images/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const file = path.split("/").pop() ?? "";
  const name = file.replace(/\.(webp|jpe?g|png|avif)$/i, "");
  byName[name] = url;
}

// Logo officiel : src/assets/belle-image-logo.(png|webp|jpg|svg), exposé sous le nom « logo ».
// Glob (et non import statique) : si le fichier est retiré, le site retombe sur le badge de repli.
const logoFiles = import.meta.glob("/src/assets/belle-image-logo.{png,webp,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const officialLogo = Object.values(logoFiles)[0];
if (officialLogo) byName["logo"] = officialLogo;

/** URL de l'image `name` (nom de fichier sans extension), ou `undefined` si absente. */
export function getImage(name: string | undefined): string | undefined {
  return name ? byName[name] : undefined;
}

export const hasImage = (name: string | undefined) => Boolean(getImage(name));

/** Noms du manifeste sans fichier correspondant. */
export function missingImages(): string[] {
  return imageManifest.filter((i) => !byName[i.name]).map((i) => i.name);
}

let logged = false;
/** En développement uniquement : liste les images manquantes dans la console (une fois). */
export function logMissingImages() {
  if (!import.meta.env.DEV || logged) return;
  logged = true;
  const missing = missingImages();
  if (missing.length) {
    console.info(
      `[Belle Image] ${missing.length} image(s) à déposer dans src/assets/images/ :\n` +
        missing.map((n) => `  • ${n}`).join("\n"),
    );
  }
}
