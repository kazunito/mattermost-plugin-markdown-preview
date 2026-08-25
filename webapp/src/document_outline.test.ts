import {buildDocumentOutline} from './document_outline';

describe('buildDocumentOutline', () => {
    test('extracts headings and ignores fenced code', () => {
        expect(buildDocumentOutline('# Title\n## Setup\n```sh\n# not a heading\n```\n### Check')).toEqual([
            {id: 'title', level: 1, text: 'Title'},
            {id: 'setup', level: 2, text: 'Setup'},
            {id: 'check', level: 3, text: 'Check'},
        ]);
    });

    test('creates unique ids for duplicate headings', () => {
        expect(buildDocumentOutline('## 確認\n## 確認').map((item) => item.id)).toEqual(['確認', '確認-2']);
    });
});
