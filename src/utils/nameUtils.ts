import { Folder, VaultFile } from '../types/vault';

export function getUniqueFileName(name: string, existingFiles: VaultFile[]): string {
  const extension = name.includes('.') ? name.split('.').pop() : '';
  const baseName = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name;
  let newName = name;
  let counter = 1;

  while (existingFiles.some(file => file.name === newName)) {
    newName = `${baseName} (${counter})${extension ? `.${extension}` : ''}`;
    counter++;
  }

  return newName;
}

export function getUniqueFolderName(folders: Folder[]): string {
  const baseNames = folders.map(f => f.name);
  let counter = 1;
  let name = 'Untitled Folder';

  while (baseNames.includes(name)) {
    name = `Untitled Folder ${counter}`;
    counter++;
  }

  return name;
}

export function isNameTaken(name: string, items: (Folder | VaultFile)[]): boolean {
  return items.some(item => item.name.toLowerCase() === name.toLowerCase());
}