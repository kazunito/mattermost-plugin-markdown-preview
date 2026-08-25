import React, {useEffect, useMemo, useRef, useState} from 'react';

import type {FileInfo} from '@mattermost/types/files';

import {buildDocumentOutline} from '../document_outline';
import {getFileDownloadUrl} from '../markdown_file';

const MAX_PREVIEW_BYTES = 2 * 1024 * 1024;

type Props = {
    fileInfo: FileInfo;
    onModalDismissed: () => void;
};

type ViewMode = 'preview' | 'source';

function formatFileSize(size: number): string {
    if (size < 1024) {
        return `${size} B`;
    }
    if (size < 1024 * 1024) {
        return `${Math.ceil(size / 1024)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MarkdownFilePreview({fileInfo, onModalDismissed}: Props) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('preview');
    const documentRef = useRef<HTMLElement>(null);
    const fileUrl = useMemo(() => getFileDownloadUrl(fileInfo.id), [fileInfo.id]);
    const outline = useMemo(() => buildDocumentOutline(content), [content]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadFile() {
            if (fileInfo.size > MAX_PREVIEW_BYTES) {
                setError('This Markdown file is larger than the 2 MB preview limit. You can still download it.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(fileUrl, {
                    credentials: 'same-origin',
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                setContent(await response.text());
            } catch (fetchError) {
                if ((fetchError as Error).name !== 'AbortError') {
                    setError('The Markdown file could not be loaded. Check your access permissions and try again.');
                }
            } finally {
                setLoading(false);
            }
        }

        loadFile();
        return () => controller.abort();
    }, [fileInfo.size, fileUrl]);

    const renderedMarkdown = useMemo(() => {
        if (!content) {
            return null;
        }
        const html = window.PostUtils.formatText(content, {markdown: true});
        return window.PostUtils.messageHtmlToComponent(html);
    }, [content]);

    useEffect(() => {
        if (viewMode !== 'preview' || !documentRef.current) {
            return;
        }
        const elements = documentRef.current.querySelectorAll('h1, h2, h3');
        elements.forEach((element, index) => {
            if (outline[index]) {
                element.id = outline[index].id;
            }
        });
    }, [outline, renderedMarkdown, viewMode]);

    const scrollToHeading = (id: string) => {
        documentRef.current?.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const formattedSize = formatFileSize(fileInfo.size);

    return (
        <div className='MarkdownFilePreview'>
            <header className='MarkdownFilePreview__header'>
                <div className='MarkdownFilePreview__identity'>
                    <span
                        className='MarkdownFilePreview__fileIcon'
                        aria-hidden='true'
                    >
                        {'MD'}
                    </span>
                    <div>
                        <strong title={fileInfo.name}>{fileInfo.name}</strong>
                        <small>{`Markdownドキュメント ・ ${formattedSize}`}</small>
                    </div>
                </div>
                <div className='MarkdownFilePreview__actions'>
                    {!loading && !error && (
                        <button
                            className='btn btn-link'
                            type='button'
                            onClick={() => setViewMode(viewMode === 'preview' ? 'source' : 'preview')}
                        >
                            {viewMode === 'preview' ? '原文を表示' : '文書を表示'}
                        </button>
                    )}
                    <a
                        className='btn btn-link'
                        href={`${fileUrl}?download=1`}
                        download={fileInfo.name}
                    >
                        {'ダウンロード'}
                    </a>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={onModalDismissed}
                    >
                        {'閉じる'}
                    </button>
                </div>
            </header>
            <main className='MarkdownFilePreview__body'>
                {loading && <div className='MarkdownFilePreview__status'>{'ドキュメントを読み込んでいます…'}</div>}
                {error && <div className='MarkdownFilePreview__status MarkdownFilePreview__status--error'>{error}</div>}
                {!loading && !error && viewMode === 'source' && <pre className='MarkdownFilePreview__source'>{content}</pre>}
                {!loading && !error && viewMode === 'preview' && (
                    <div className='MarkdownFilePreview__workspace'>
                        {outline.length > 0 && (
                            <nav
                                className='MarkdownFilePreview__outline'
                                aria-label='目次'
                            >
                                <div className='MarkdownFilePreview__outlineTitle'>{'目次'}</div>
                                {outline.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`MarkdownFilePreview__outlineItem MarkdownFilePreview__outlineItem--level${item.level}`}
                                        type='button'
                                        title={item.text}
                                        onClick={() => scrollToHeading(item.id)}
                                    >
                                        {item.text}
                                    </button>
                                ))}
                            </nav>
                        )}
                        <div className='MarkdownFilePreview__documentScroll'>
                            <article
                                ref={documentRef}
                                className='post-message__text MarkdownFilePreview__rendered'
                            >
                                {renderedMarkdown}
                            </article>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
