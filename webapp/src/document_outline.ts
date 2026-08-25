export type OutlineItem = {
    id: string;
    level: number;
    text: string;
};

export function buildDocumentOutline(markdown: string): OutlineItem[] {
    const headings: OutlineItem[] = [];
    const idCounts = new Map<string, number>();
    let fence = '';

    markdown.split(/\r?\n/).forEach((line) => {
        const fenceMatch = line.match(/^\s*(```+|~~~+)/);
        if (fenceMatch) {
            if (!fence) {
                fence = fenceMatch[1][0];
            } else if (fence === fenceMatch[1][0]) {
                fence = '';
            }
            return;
        }
        if (fence) {
            return;
        }

        const match = line.match(/^(#{1,3})\s+(.+?)\s*#*$/);
        if (!match) {
            return;
        }

        const text = match[2].replace(/!?(\[([^\]]+)\])\([^)]*\)/g, '$2').replace(/[*_~`]/g, '').trim();
        const baseId = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
        const count = idCounts.get(baseId) || 0;
        idCounts.set(baseId, count + 1);
        headings.push({
            id: count === 0 ? baseId : `${baseId}-${count + 1}`,
            level: match[1].length,
            text,
        });
    });

    return headings;
}
