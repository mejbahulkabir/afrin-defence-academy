import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to fetch payment currencies");
  }
  return response.json();
}


export function formatTimestamp(timestamp: any, onlyDate?: boolean) {
  if (onlyDate) {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } else {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export function formatDate(timestamp: any){
  return formatTimestamp(timestamp, true);
}


export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {}

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    return false;
  }
}

export function generateInitials(name?: string | null): string {
  if (!name || !name.trim()) return "";
  // Strip parentheses content like (Retd.), (retd)
  const cleaned = name.replace(/\([^)]*\)/g, "").trim();
  const titles = new Set([
    "col", "col.", "lt", "lt.", "gen", "gen.", "maj", "maj.",
    "capt", "capt.", "brig", "brig.", "cdr", "cdr.", "dr", "dr.",
    "prof", "prof.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.",
    "slt", "slt.", "wg", "cmde", "air", "sub", "adm", "hav", "nb", "sub.",
  ]);
  const words = cleaned
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, ""))
    .filter(Boolean);

  const nonTitleWords = words.filter((w) => !titles.has(w.toLowerCase()));
  const targetWords = nonTitleWords.length > 0 ? nonTitleWords : words;

  if (targetWords.length === 0) return "";
  if (targetWords.length === 1) {
    return targetWords[0].slice(0, 2).toUpperCase();
  }
  return (targetWords[0][0] + targetWords[targetWords.length - 1][0]).toUpperCase();
}

export function getYouTubeId(url?: string | null): string | null {
  if (!url || !url.trim()) return null;
  const match = url.trim().match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}