import type {FileInfo} from '@mattermost/types/files';

const MARKDOWN_EXTENSIONS = new Set(['md', 'markdown']);

export function isMarkdownFile(fileInfo: FileInfo): boolean {
    const extension = fileInfo.extension?.toLowerCase() || fileInfo.name.split('.').pop()?.toLowerCase();
    return Boolean(extension && MARKDOWN_EXTENSIONS.has(extension));
}

export function getFileDownloadUrl(fileId: string): string {
    const sitePath = window.basename || '';
    return `${sitePath}/api/v4/files/${fileId}`;
}
