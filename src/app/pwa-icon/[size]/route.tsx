import { heartIcon } from "@/lib/iconImage";

const SIZES = new Set([192, 512]);

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = Number((await params).size);
  return heartIcon(SIZES.has(size) ? size : 192);
}
