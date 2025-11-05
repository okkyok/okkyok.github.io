---
Category:
  - 開発｜Development
Date: 2025-11-05
Published: "true"
Slug: ""
created: 2025-11-05 01:17:00+00:00
title: 📘💻️Obsidian × 自動化の実践録：日々の情報が勝手にたまる仕組み【公開リポジトリ付き】
updated: 2025-11-05 01:17:00+00:00
---
AIでプログラミングするのが楽しくなって、その後Notionからobsidianにしたので、
「じゃぁobsidianを気持ちよく使えるように、いっぱいツール作っちゃうぞ！」
ということで、色んなツールを作ってみた。

ようやく一段落したので、整理して、コードも公開してみることにした。
コードオープンデビュー。


## 13の仕組み導入後イメージ

![[Obsidian-×-自動化の実践録：日々の情報が勝手にたまる仕組み【公開リポジトリ付き】_1.avif]]
デイリーノートはこんな感じ。
何に使うの？ってデータもたくさんあるが、溜まっていってるのがなんとなく嬉しくて満足している。笑

## obsidian-gas-pub (Google Apps Script - 公開版)

```mermaid

graph LR

EMAIL[Email]

CALENDAR[カレンダー]

HANDWRITE[手書きノート]

IMAGE[画像]

TRACKING[トラッキングツール]

subgraph GAS_PUB["obsidian-gas-pub (Google Apps Script - 公開版)"]

GMAIL(Gmail)

GCAL(Google Calendar)

GDRIVE(Google Drive)

TGTR_API(Toggl Track API)

GMAIL --> GMAIL2OBS[gmail2obs-gas-pub<br/>Code.gs]

GCAL --> GCAL2OBS[gcal2obs-gas-pub<br/>Code.gs]

GDRIVE --> ROCKET2OBS[rocket2obs-gas-pub<br/>Code.gs]

GDRIVE --> PHONE2OBS[phone2obs-gas-pub<br/>Code.gs]

TGTR_API --> TGTR2OBS[tgtr2obs-gas-pub<br/>Code.gs]

DN_CREATOR[dn-creator-gas-pub<br/>Code.gs]

GMAIL2OBS --> WEBDAV1[(WebDAV)]

GCAL2OBS --> WEBDAV1

ROCKET2OBS --> WEBDAV1

PHONE2OBS --> WEBDAV1

TGTR2OBS --> WEBDAV1

DN_CREATOR --> WEBDAV1

WEBDAV1 --> OBSIDIAN_GAS(Obsidian Vault)

end

EMAIL --- GMAIL

CALENDAR --- GCAL

HANDWRITE --- GDRIVE

IMAGE --- GDRIVE

TRACKING --- TGTR_API

style EMAIL fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style CALENDAR fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style HANDWRITE fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style IMAGE fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style TRACKING fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style GMAIL fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GCAL fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GDRIVE fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style TGTR_API fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GAS_PUB fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style GMAIL2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style GCAL2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style ROCKET2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style PHONE2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style TGTR2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style DN_CREATOR fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style WEBDAV1 fill:#fff9e6,stroke:#ffcc02,stroke-width:1px

style OBSIDIAN_GAS fill:#e8f5e9,stroke:#81c784,stroke-width:1px

```

  

## obsidian-auto-pub (Python/Cloud Functions - 公開版)

```mermaid

graph LR

WEARABLE[スマートウォッチ]

BOOKMARK[ブックマーク]

TEXT_IMAGE[テキストor画像]

PARTNER[パートナーとの会話]

subgraph AUTO_PUB["obsidian-auto-pub (Python/Cloud Functions - 公開版)"]

FITBIT_API(Fitbit API)

RAINDROP_API(Raindrop API)

TELEGRAM2(Telegram Bot)

ZULIP_API(Zulip API)

FITBIT_API --> FITBIT2OBS[fitbit2obsidian-pub<br/>main.py]

RAINDROP_API --> RAINDROP2OBS[raindrop2obsidian-pub<br/>sync.py]

TELEGRAM2 --> PHOTO2DN[photo2dailynote-pub<br/>main.py]

TELEGRAM2 --> TLGM2OBS2[tlgm2text2obs-pub<br/>main.py]

ZULIP_API --> ZULIP2OBS[zulip2obsidian-pub<br/>main.py]

FITBIT2OBS --> WEBDAV2[(WebDAV)]

RAINDROP2OBS --> WEBDAV2

PHOTO2DN --> WEBDAV2

TLGM2OBS2 --> WEBDAV2

ZULIP2OBS --> WEBDAV2

WEBDAV2 --> OBSIDIAN_AUTO(Obsidian Vault)

end

WEARABLE --- FITBIT_API

BOOKMARK --- RAINDROP_API

TEXT_IMAGE --- TELEGRAM2

PARTNER --- ZULIP_API

style WEARABLE fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style BOOKMARK fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style TEXT_IMAGE fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style PARTNER fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style FITBIT_API fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style RAINDROP_API fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style TELEGRAM2 fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style ZULIP_API fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style AUTO_PUB fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style FITBIT2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style RAINDROP2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style PHOTO2DN fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style TLGM2OBS2 fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style ZULIP2OBS fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style WEBDAV2 fill:#fff9e6,stroke:#ffcc02,stroke-width:1px

style OBSIDIAN_AUTO fill:#e8f5e9,stroke:#81c784,stroke-width:1px

```

  

## 統合フロー図（公開版）

```mermaid

graph LR

subgraph CATEGORIES["カテゴリ"]

EMAIL_CAT[Email]

CALENDAR_CAT[カレンダー]

STORAGE_CAT[手書きノートor画像]

TRACKING_CAT[トラッキングツール]

TEXT_IMAGE_CAT[テキストor画像]

WEARABLE_CAT[スマートウォッチ]

BOOKMARK_CAT[ブックマーク]

PARTNER_CAT[パートナーとの会話]

end

subgraph DATA_SOURCES["データソース"]

GMAIL(Gmail)

GCAL(Google Calendar)

GDRIVE(Google Drive)

TGTR(Toggl Track)

TELEGRAM(Telegram)

FITBIT(Fitbit)

RAINDROP(Raindrop)

ZULIP(Zulip)

end

subgraph PROCESSING["処理層（公開版）"]

GAS_PUB["Google Apps Script<br/>GAS Programs -gas-pub"]

PYTHON_PUB["Python Cloud Functions<br/>Auto Programs -pub"]

end

subgraph STORAGE["ストレージ層"]

WEBDAV[(WebDAV Server)]

end

subgraph DESTINATION["保存先"]

OBSIDIAN(Obsidian Vault)

end

EMAIL_CAT --- GMAIL

CALENDAR_CAT --- GCAL

STORAGE_CAT --- GDRIVE

TRACKING_CAT --- TGTR

TEXT_IMAGE_CAT --- TELEGRAM

WEARABLE_CAT --- FITBIT

BOOKMARK_CAT --- RAINDROP

PARTNER_CAT --- ZULIP

GMAIL --> GAS_PUB

GCAL --> GAS_PUB

GDRIVE --> GAS_PUB

TGTR --> GAS_PUB

TELEGRAM --> PYTHON_PUB

FITBIT --> PYTHON_PUB

RAINDROP --> PYTHON_PUB

ZULIP --> PYTHON_PUB

GAS_PUB --> WEBDAV

PYTHON_PUB --> WEBDAV

WEBDAV --> OBSIDIAN

style CATEGORIES fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style EMAIL_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style CALENDAR_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style STORAGE_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style TRACKING_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style TEXT_IMAGE_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style WEARABLE_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style BOOKMARK_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style PARTNER_CAT fill:#f5f5f5,stroke:#ccc,stroke-width:1px

style DATA_SOURCES fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GMAIL fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GCAL fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style GDRIVE fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style TGTR fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style TELEGRAM fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style FITBIT fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style RAINDROP fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style ZULIP fill:#e3f2fd,stroke:#90caf9,stroke-width:1px

style PROCESSING fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style GAS_PUB fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style PYTHON_PUB fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px

style STORAGE fill:#fff9e6,stroke:#ffcc02,stroke-width:1px

style WEBDAV fill:#fff9e6,stroke:#ffcc02,stroke-width:1px

style DESTINATION fill:#e8f5e9,stroke:#81c784,stroke-width:1px

style OBSIDIAN fill:#e8f5e9,stroke:#81c784,stroke-width:1px

```

### obsidian-gas-pub (Google Apps Script - 公開版)

| プログラム名 | データソース | 保存方法 | 保存先 | GitHubリポジトリ |
|------------|------------|---------|--------|----------------|
| `gmail2obs-gas-pub` | Gmail | WebDAV | Obsidian Vault | [okkyok-public/gmail2obs-gas-pub](https://github.com/okkyok-public/gmail2obs-gas-pub) |
| `gcal2obs-gas-pub` | Google Calendar | WebDAV | Daily Note | [okkyok-public/gcal2obs-gas-pub](https://github.com/okkyok-public/gcal2obs-gas-pub) |
| `rocket2obs-gas-pub` | Google Drive (RocketBook) | WebDAV | RocketBook フォルダ + Daily Note | [okkyok-public/rocket2obs-gas-pub](https://github.com/okkyok-public/rocket2obs-gas-pub) |
| `phone2obs-gas-pub` | Google Drive (Phone OCR) | WebDAV | Obsidian Vault | [okkyok-public/phone2obs-gas-pub](https://github.com/okkyok-public/phone2obs-gas-pub) |
| `tgtr2obs-gas-pub` | Toggl Track API | WebDAV | Daily Note | [okkyok-public/tgtr2obs-gas-pub](https://github.com/okkyok-public/tgtr2obs-gas-pub) |
| `dn-creator-gas-pub` | デイリーノート自動更新 | WebDAV | Daily Note | [okkyok-public/dn-creator-gas-pub](https://github.com/okkyok-public/dn-creator-gas-pub) |

### obsidian-auto-pub (Python/Cloud Functions - 公開版)

| プログラム名                  | データソース                  | 保存方法   | 保存先            | GitHubリポジトリ                                                                                   |
| ----------------------- | ----------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------- |
| `fitbit2obsidian-pub`   | Fitbit API              | WebDAV | Daily Note     | [okkyok-public/fitbit2obsidian-pub](https://github.com/okkyok-public/fitbit2obsidian-pub)     |
| `raindrop2obsidian-pub` | Raindrop API            | WebDAV | Daily Note     | [okkyok-public/raindrop2obsidian-pub](https://github.com/okkyok-public/raindrop2obsidian-pub) |
| `photo2dailynote-pub`   | Telegram Bot (画像orテキスト) | WebDAV | Daily Note     | [okkyok-public/photo2dailynote-pub](https://github.com/okkyok-public/photo2dailynote-pub)     |
| `tlgm2text2obs-pub`     | Telegram Bot (テキスト)     | WebDAV | Obsidian Vault | [okkyok-public/tlgm2text2obs-pub](https://github.com/okkyok-public/tlgm2text2obs-pub)         |
| `zulip2obsidian-pub`    | Zulip API               | WebDAV | Daily Note     | [okkyok-public/zulip2obsidian-pub](https://github.com/okkyok-public/zulip2obsidian-pub)       |

### 補足プログラム

| プログラム名 | 説明 | GitHubリポジトリ |
|------------|------|----------------|
| `fitbit2tgtr-pub` | Fitbit → Toggl Track (Obsidianには直接書き込まない) | [okkyok-public/fitbit2tgtr-pub](https://github.com/okkyok-public/fitbit2tgtr-pub) |

### システム管理プログラム

| プログラム名                         | 説明                                                              | GitHubリポジトリ                                                                                                 |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `secret-manager-optimizer-pub` | Secret ManagerをはじめとしたGoogle Cloud functionの使用を最適化し、コストを削減するシステム | [okkyok-public/secret-manager-optimizer-pub](https://github.com/okkyok-public/secret-manager-optimizer-pub) |

コード編集→Google Cloud Function にデプロイ→コード編集→...続けていると、気づいたら、過去の不要なバージョンのものを保存されており、効率よく不要なものを削除するために作成したプログラム。

## 保存方法の詳細

### WebDAV経由
- ほとんどのプログラムがWebDAV経由でObsidian Vaultに直接ファイルを書き込みます
- WebDAV URL、ユーザー名、パスワードで認証
- PUT メソッドでMarkdownファイルをアップロード
- 公開版では、環境変数や`env.example`ファイルで設定を管理

## 公開版の特徴

### セキュリティ対策
- すべての機密情報（APIキー、トークン、パスワードなど）は環境変数または`env.example`で管理
- 実際のサーバーURLやプロジェクトIDはexample値に置き換え
- `.gitignore`で機密ファイルを除外

### 環境変数管理
- 各プロジェクトに`env.example`ファイルが含まれています
- 実際の設定値は`.env`ファイルで管理（Git管理対象外）
- 公開用の設定例が`env.example`に記載されています

### デプロイ方法
- **GAS版**: Google Apps Scriptのエディタで直接コピー&ペースト
- **Python版**: Google Cloud Functionsにデプロイ（`deploy.sh`スクリプトを使用）

## 注意事項

- `fitbit2tgtr-pub`はObsidianには直接書き込みません（Toggl Trackにデータを送信するのみ）
- 一部のプログラムは複数のWebDAVサーバーに対応（複数のObsidian Vaultに同時保存可能）
- デイリーノートへの追加は、既存のファイルを読み込んで更新する形式
- すべてのプログラムがWebDAV経由でObsidian Vaultに保存します
- 公開版では、実際のシークレット情報は含まれていません。使用前に`env.example`を参考に`.env`ファイルを作成してください
