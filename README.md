# Mattermost Markdown File Preview

[日本語](#日本語) | [English](#english)

## 日本語

Mattermostに添付された `.md` / `.markdown` ファイルを、ダウンロードせず文書として閲覧できるWeb Appプラグインです。

### 主な機能

- 添付Markdownファイルをクリックしてプレビュー
- 紙面風の文書表示と見出しから生成する目次
- 見出し、表、コードブロック、引用、画像の読みやすい表示
- 文書表示とMarkdown原文表示の切り替え
- Mattermostのライト／ダークテーマに対応
- Mattermostの認証済みファイルAPIを使用し、既存のアクセス権を維持
- 外部サービスへファイル内容を送信しない

### 対応環境

- Mattermost Server 11.8以降
- Mattermost WebおよびDesktopクライアント

Mattermost Mobileのカスタムファイルプレビューには対応していません。

### インストール

#### システムコンソールから

1. [Releases](https://github.com/kazunito/mattermost-plugin-markdown-preview/releases)から最新の `com.kazunito.markdown-preview-*.tar.gz` をダウンロードします。
2. Mattermostへシステム管理者としてログインします。
3. **システムコンソール > プラグイン > プラグイン管理**を開きます。
4. **プラグインをアップロードする**から `.tar.gz` をアップロードします。
5. **Markdown File Preview**を有効にします。
6. `.md` ファイルを投稿し、添付ファイル名をクリックして表示を確認します。

プラグインアップロードが無効の場合は、Mattermostの `PluginSettings.EnableUploads` を有効にするか、次のローカルモードを使用してください。

#### mmctlローカルモードから

Mattermostサーバー上で実行します。

```sh
mmctl --local plugin add com.kazunito.markdown-preview-0.1.3.tar.gz --force
mmctl --local plugin enable com.kazunito.markdown-preview
```

更新後はブラウザを再読み込みします。古い画面が残る場合は、`Command + Shift + R`または`Ctrl + Shift + R`で強制再読み込みしてください。

### アンインストール

システムコンソールで無効化して削除するか、Mattermostサーバー上で次を実行します。

```sh
mmctl --local plugin disable com.kazunito.markdown-preview
mmctl --local plugin delete com.kazunito.markdown-preview
```

### ソースからビルド

Node.js、npm、Goが必要です。

```sh
make dist
```

インストール用ファイルは `dist/com.kazunito.markdown-preview-0.1.3.tar.gz` に生成されます。

### 制限事項

- プレビュー上限は2MBです。上限を超えるファイルもダウンロードできます。
- Markdown内の相対画像パスは自動解決されません。
- Mermaidなどの非標準Markdown拡張は、現時点ではコードブロックとして表示されます。

### トラブルシューティング

- 白い画面になる場合は、最新Releaseへ更新してブラウザを強制再読み込みしてください。
- アップロード時にHTTP 413になる場合は、Mattermostの前段にあるリバースプロキシのアップロード容量制限を確認してください。
- プラグインを更新できない場合は、`mmctl --local plugin add ... --force`を使用してください。

## English

A Mattermost web app plugin that renders attached `.md` and `.markdown` files in a document-style preview without requiring a download.

### Features

- Opens Markdown attachments in Mattermost's file preview modal
- Paper-like document view with a generated table of contents
- Polished headings, tables, code blocks, quotes, and images
- Switches between rendered preview and Markdown source
- Supports Mattermost light and dark themes
- Preserves existing file permissions through Mattermost's authenticated file API
- Never sends file contents to an external service

### Compatibility

- Mattermost Server 11.8 or later
- Mattermost Web and Desktop clients

Custom file previews are not currently supported in Mattermost Mobile.

### Install

1. Download the latest `com.kazunito.markdown-preview-*.tar.gz` from [Releases](https://github.com/kazunito/mattermost-plugin-markdown-preview/releases).
2. Sign in to Mattermost as a system administrator.
3. Open **System Console > Plugins > Plugin Management**.
4. Upload the `.tar.gz` bundle.
5. Enable **Markdown File Preview**.
6. Upload a `.md` file to a post and click its filename.

Alternatively, install it on the Mattermost server using local mode:

```sh
mmctl --local plugin add com.kazunito.markdown-preview-0.1.3.tar.gz --force
mmctl --local plugin enable com.kazunito.markdown-preview
```

Reload Mattermost after updating the plugin. Use a hard refresh if the previous web bundle remains cached.

### Build from source

Node.js, npm, and Go are required.

```sh
make dist
```

The installable bundle is generated at `dist/com.kazunito.markdown-preview-0.1.3.tar.gz`.

### Known limitations

- The preview limit is 2 MB; larger files remain downloadable.
- Relative image paths are not resolved automatically.
- Mermaid and other non-standard Markdown extensions are currently shown as code blocks.

## License

Licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for attribution.
