# CLAUDE.md

このファイルは、このリポジトリでコード作業を行う際にClaude Code (claude.ai/code) が参照するガイダンスです。

## 言語設定
- 常に日本語で会話する
- コメントも日本語で記述する
- エラーメッセージの説明も日本語で行う
- ドキュメントも日本語で生成する

## プロジェクト概要

Three.jsで構築された、ブラウザ上で動作する3D衣装デザインツール。独立した2つの静的シングルページアプリとして提供される(2つの間でランタイム状態は共有されない):

- **hair-bundle**(`hair-bundle.html` → `src/hair-bundle/`) — 円柱を元に、カーブとコントロールポイントを使って毛束を構築する。
- **tight-clothing**(`tight-clothing.html` → `src/tight-clothing/`) — 断面プレインと領域の押し出しを使い、体のメッシュにぴったりフィットする衣服(トップス、ボトムス、手袋、タイツ、靴下)を作成する。

どちらもGitHub Pagesに静的ページとしてデプロイされる(`.github/workflows/deploy.yml`参照)。`dist/tight-clothing.html`は`404.html`としてコピーされ、サイトのフォールバックとして機能する。

## コマンド

```bash
npm run dev       # Vite開発サーバーを起動
npm run build     # tscの型チェック + viteビルド(dist/に出力)
npm run preview   # 本番ビルドをプレビュー

npm run format    # biome format --write
npm run lint      # biome lint --write
npm run check     # biome check --write(フォーマット + lint + import整理)
npm run ci        # biome ci(チェックのみ、CIで使用)

npm test          # vitestをwatchモードで実行
npm run coverage  # vitest run --coverage
```

単一のテストファイルを実行: `npx vitest run test/hair-bundle/curve/curve.test.ts`
名前でテストを絞り込んで実行: `npx vitest run -t "some test name"`

CI(`.github/workflows/ci.yml`)はNode 20.x/22.xで以下を実行する: `npm run build`、`npm run ci`、`npm run test`。

## アーキテクチャ

### エントリーポイントとアプリのライフサイクル

`src/hair-bundle/main.ts`と`src/tight-clothing/main.ts`が2つのアプリのエントリーポイントであり、どちらも同じ構造に従う:

1. `init()`がレンダラー、カメラ、コントロール/ギズモ、lil-guiの`GUI`、シーンを作成し、続いて機能ごとのオブジェクトグラフを構築してシーンに追加する。
2. **undo/redoスタック**(`undos`/`redos`というJSONスナップショットの配列)を自前で実装している — ライブラリは使用していない。`save()`は、GUI変更のたびに(`gui.onChange`/`onFinishChange`/`onOpenClose`)、各ドメインオブジェクト自身の`toJSON()`とGUIパネル状態(`saveGui`/`saveClosed`)から組み立てたJSONスナップショットをプッシュする。Ctrl+Z / Ctrl+Shift+Z(またはCtrl+Y)はスタックをpopして`loadLastUndo()`を呼び出す。これは現在のThree.jsグループを破棄し(`disposeGroup`)、スナップショットから各オブジェクトの`fromJSON()`を使って再構築する。
3. `animate()`は`createRenderer`に渡されるレンダーループである。

どちらかのアプリに新しいステートフルなオブジェクトを追加する場合、以下が必要になる: `toJSON()`/`fromJSON()`のペア、undo/redoスナップショット形状への組み込み、GUIコントロールを持つ場合は`setGUI(gui)`メソッド — 既存の`Tube`/`PlaneManager`/`Area`クラスをパターンとして参考にすること。

### `src/common/` — 両アプリ共通

- `renderer.ts`、`camera.ts`、`controls.ts` — Three.jsのレンダラー/正投影カメラ/orbit-controls、および`three-viewport-gizmo`のセットアップ。
- `object-3d/scene.ts`、`axes-helper.ts`、`plane-helper.ts`、`arrow-helper.ts` — シーンおよびデバッグ用ヘルパーのファクトリ。それぞれlil-guiのフォルダに紐付けられている。
- `gui.ts` — 上述のundo/redo用GUI状態永続化ヘルパー群(`saveGui`/`saveClosed`/`loadClosed`/`deleteFolder`/`closeFolder`)。`saveGui`内の`foldersToSave`という許可リストが、undo/redoの状態に含まれるトップレベルGUIフォルダを制御している — 新しく永続化対象のフォルダを追加する際はここも更新すること。
- `utils.ts` — `disposeGroup`(グループ再構築前に使う、Three.jsのジオメトリ/オブジェクトを再帰的に破棄する処理)、`createColor`(リニアsRGBカラーヘルパー)、`createEmptyGeometry`、`objectMap`。
- `material/` — 共通のマテリアルファクトリ(line、points、toon)。

トゥーンシェーディングには独自のGLSL頂点/フラグメントシェーダーペアを使用しており、`.glsl`ファイルではなく`hair-bundle.html`/`tight-clothing.html`内に`<script>`タグ(id: `toonVertex`/`toonFragment`)として直接埋め込まれている。

### `src/hair-bundle/`

パイプライン: **コントロールポイント → カーブ → チューブジオメトリ**。

- `control-point/` — `ControlPoint2`/`ControlPoint3`(2D/3Dのコントロールポイント)を`ControlPointGroup`でグループ化。`circular.ts`/`spherical.ts`は座標変換を提供し、`math.ts`は補助的な幾何計算を持つ。
- `curve/` — コントロールポイントから`CurveGroup`経由で構築される`Curve2`/`Curve3`。`sample-curve-2.ts`/`sample-curve-3.ts`はカーブに沿った点のサンプリングを行う。
- `tube/` — `TubeBaseGeometry` → `TubeGeometry` → `Tube`(`toJSON`/`fromJSON`/`setGUI`を持つトップレベルのステートフルオブジェクト) → `TubeGroup`(`createTubeGroup`で構築される描画対象の`THREE.Group`)。

### `src/tight-clothing/`

パイプライン: **体のメッシュ → 中心線 → 断面プレイン → 交差点 → 領域 → 押し出し**。

- `body/` — `public/models/body1-22.glb`と、事前計算されたn角形の面データ(`public/models/body1-22-n-polygon-{indices,positions}.txt`。Blenderの`body/save-n-polygon-data.py`から再生成される — これはTSビルドに含まれない独立したBlenderスクリプト)から体のメッシュを読み込む(`body-group.ts`)。`body-geometry.ts`はこのn角形データを読み込んだ`BufferGeometry`に付与する。
- `centerline/` — 体のn角形データからエッジループ/エッジ/頂点/点を導出し(`edge*.ts`、`vertices.ts`、`points.ts`)、プレインの配置を導く中心線を構築する(`centerline.ts`)。
- `plane/` — `Plane`/`VerticalPlane`/`FreePlane`の断面プレイン。`PlaneManager`によって管理される(hair-bundleの`Tube`に相当する、ステートフルでGUIに紐付き、JSONシリアライズ可能なオブジェクト)。プレインの変更は、`main.ts`で配線された`_addCrossSection`/`_removeCrossSection`/`_updateCrossSection`コールバックをトリガーする。
- `intersection/` — プレインが体のメッシュと交差する箇所を計算する: `edge-intersection.ts`/`vertex-intersection.ts` → `intersection.ts` → `intersection-loop.ts`/`intersection-loops.ts`(`intersection-loop-picker.ts`で選別される)。
- `area/` — `Area`(ステートフルでGUIに紐付き、JSONシリアライズ可能。`Tube`/`PlaneManager`に相当)が断面領域を保持する。`cut.ts`/`extrude.ts`/`find.ts`は衣服形状の幾何計算を実装し、`AreaGroup`が描画対象の出力となる。

`main.ts`は、`Area`の断面処理メソッドを`PlaneManager`の`_addCrossSection`/`_removeCrossSection`/`_updateCrossSection`フックにバインドすることで、`PlaneManager`と`Area`を接続している — これがプレインサブシステムと領域サブシステムの境界(接続点)である。

### パスエイリアス

インポートには`src/...`形式の絶対パスを使う(例: `import { createCamera } from "src/common/camera"`)。これは`vite-tsconfig-paths`が`tsconfig.json`の`baseUrl: "./"`を読み取ることで有効になっている。相対パス(`../../`)ではなく、このスタイルを使用すること。

### テスト

happy-dom環境でVitestを使用し、`test/`配下は`src/`の構造と1:1で対応する(例: `src/hair-bundle/curve/curve.ts` → `test/hair-bundle/curve/curve.test.ts`)。`mockReset: true`がグローバルに設定されている。

## ドキュメント

機能ごとのガイドとチュートリアルは`doc/hair-bundle/`と`doc/tight-clothing/`にある(英語版、および日本語版の`.jp.md`)。`README.md`/`README.jp.md`からリンクされている。そこに記載されているユーザー向けの挙動を変更する際は、両方の言語版を合わせて更新すること。
