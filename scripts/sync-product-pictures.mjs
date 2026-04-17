import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sourceRoot = path.join(repoRoot, "Product Pictures");
const publicRoot = path.join(repoRoot, "public", "product-pictures");
const generatedRoot = path.join(repoRoot, "lib", "generated");
const manifestPath = path.join(generatedRoot, "product-pictures-manifest.ts");
const sourceTopLevelFolders = [
  "Backdrop",
  "Bench",
  "Bench Cloth",
  "Curtains",
  "Dhol",
  "Extras",
  "Floor Cushion",
  "Garlands",
  "Large Props",
  "Neon Sign",
  "Thaal",
];
const videoExtensions = new Set([".mp4", ".mov", ".m4v", ".webm", ".ogv", ".ogg"]);
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const isHiddenPath = (value) => path.basename(value).startsWith(".");
const hasSourceRoot = fs.existsSync(sourceRoot);

const ensureDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true });
};

const syncSourceIntoPublic = () => {
  ensureDirectory(publicRoot);

  for (const folderName of sourceTopLevelFolders) {
    const sourcePath = path.join(sourceRoot, folderName);
    const destinationPath = path.join(publicRoot, folderName);

    if (!fs.existsSync(sourcePath)) {
      continue;
    }

    fs.rmSync(destinationPath, { recursive: true, force: true });
    fs.cpSync(sourcePath, destinationPath, {
      recursive: true,
      force: true,
      filter: (currentPath) => !isHiddenPath(currentPath),
    });
  }
};

const getManifestScanRoot = () => {
  if (hasSourceRoot) {
    return sourceRoot;
  }

  if (fs.existsSync(publicRoot)) {
    return publicRoot;
  }

  throw new Error(
    "Unable to generate product picture manifest. Neither 'Product Pictures' nor 'public/product-pictures' exists.",
  );
};

const toPublicSrc = (relativePath) =>
  `/product-pictures/${relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;

const compareEntries = (left, right) => {
  if (left.kind !== right.kind) {
    return left.kind === "image" ? -1 : 1;
  }

  return collator.compare(left.fileName, right.fileName);
};

const buildDirectoryManifest = (scanRoot) => {
  const manifest = {};

  const visitDirectory = (absoluteDirectoryPath, relativeDirectoryPath = "") => {
    const directoryEntries = fs
      .readdirSync(absoluteDirectoryPath, { withFileTypes: true })
      .filter((entry) => !entry.name.startsWith("."))
      .sort((left, right) => collator.compare(left.name, right.name));

    const fileEntries = directoryEntries.filter((entry) => entry.isFile());

    if (fileEntries.length > 0 && relativeDirectoryPath) {
      manifest[relativeDirectoryPath.split(path.sep).join("/")] = fileEntries
        .map((entry) => {
          const extension = path.extname(entry.name).toLowerCase();
          const relativeFilePath = path.join(relativeDirectoryPath, entry.name);

          return {
            fileName: entry.name,
            kind: videoExtensions.has(extension) ? "video" : "image",
            src: toPublicSrc(relativeFilePath),
          };
        })
        .sort(compareEntries);
    }

    for (const entry of directoryEntries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const nextRelativePath = relativeDirectoryPath
        ? path.join(relativeDirectoryPath, entry.name)
        : entry.name;

      visitDirectory(path.join(absoluteDirectoryPath, entry.name), nextRelativePath);
    }
  };

  for (const folderName of sourceTopLevelFolders) {
    const folderPath = path.join(scanRoot, folderName);

    if (!fs.existsSync(folderPath)) {
      continue;
    }

    visitDirectory(folderPath, folderName);
  }

  return Object.fromEntries(
    Object.entries(manifest).sort(([left], [right]) => collator.compare(left, right)),
  );
};

const writeManifest = (manifest) => {
  ensureDirectory(generatedRoot);

  const contents = `export type ProductPictureFile = {
  fileName: string;
  kind: "image" | "video";
  src: string;
};

export const productPictureManifest: Record<string, readonly ProductPictureFile[]> = ${JSON.stringify(
    manifest,
    null,
    2,
  )} as const;
`;

  fs.writeFileSync(manifestPath, contents);
};

if (hasSourceRoot) {
  syncSourceIntoPublic();
}

const scanRoot = getManifestScanRoot();
const manifest = buildDirectoryManifest(scanRoot);

writeManifest(manifest);

console.log(
  `Generated product picture manifest from ${path.relative(repoRoot, scanRoot) || "."} with ${Object.keys(manifest).length} product folders.`,
);
