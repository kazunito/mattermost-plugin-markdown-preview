import type {FileInfo} from '@mattermost/types/files';

import {getFileDownloadUrl, isMarkdownFile} from './markdown_file';

const file = (name: string, extension: string) => ({name, extension} as FileInfo);

describe('isMarkdownFile', () => {
    test.each([
        ['document.md', 'md'],
        ['README.MD', 'MD'],
        ['document.markdown', 'markdown'],
    ])('accepts %s', (name, extension) => {
        expect(isMarkdownFile(file(name, extension))).toBe(true);
    });

    test('rejects non-Markdown files', () => {
        expect(isMarkdownFile(file('document.txt', 'txt'))).toBe(false);
    });
});

describe('getFileDownloadUrl', () => {
    test('includes a Mattermost subpath', () => {
        window.basename = '/mattermost';
        expect(getFileDownloadUrl('file-id')).toBe('/mattermost/api/v4/files/file-id');
    });
});
