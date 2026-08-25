// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';
import type {Store} from 'redux';

import type {GlobalState} from '@mattermost/types/store';

import type {PluginRegistry} from 'types/mattermost-webapp';

import MarkdownFilePreview from './components/markdown_file_preview';
import {isMarkdownFile} from './markdown_file';
import './styles.scss';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState>) {
        registry.registerFilePreviewComponent(isMarkdownFile, MarkdownFilePreview);
    }
}

declare global {
    interface Window {
        basename?: string;
        registerPlugin(pluginId: string, plugin: Plugin): void;
        PostUtils: {
            formatText(text: string, options?: Record<string, unknown>): string;
            messageHtmlToComponent(html: string, isRHS?: boolean, options?: Record<string, unknown>): React.ReactNode;
        };
    }
}

window.registerPlugin(manifest.id, new Plugin());
