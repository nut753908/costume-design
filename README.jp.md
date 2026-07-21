[English](README.md) | [日本語](README.jp.md)

# 衣装デザイン

このプロジェクトは当初、ユーザーが詳細な衣装デザインを楽しめるツールとして構想されました。しかし、開発を進むにつれ、一つの機能を作るだけでも膨大な時間と労力がかかることが明らかになりました。必要な機能をすべて実装することは不可能だと悟り、すべてを作ることを諦め、これまでに開発した機能のみを提供することにしました。ここでは、その二つの機能をご紹介します。

[Three.js](https://threejs.org/)、TypeScript、[Vite](https://vitejs.dev/)を使用して構築されています。

## 毛束

毛束とは髪の毛の束のことです。どんなヘアスタイルも複数の毛束で構成できます。この機能を使えば、円柱から任意の形状の毛束を作成できます。

※複数の毛束を使ってヘアスタイルを作成する機能はありません。

- ウェブページ：https://nut753908.github.io/costume-design/hair-bundle.html
- ガイド：[doc/hair-bundle/guide.jp.md](doc/hair-bundle/guide.jp.md)
- チュートリアル：[doc/hair-bundle/tutorial.jp.md](doc/hair-bundle/tutorial.jp.md)

## タイトな衣服

タイトな衣服とは、体にぴったりとフィットする衣服のことです。例えば、タイトなトップス、タイトなボトムス、手袋、タイツ、靴下などです。この機能を使えば、そのような衣服を作成できます。

- ウェブページ：https://nut753908.github.io/costume-design/tight-clothing.html
- ガイド：[doc/tight-clothing/guide.jp.md](doc/tight-clothing/guide.jp.md)
- チュートリアル：[doc/tight-clothing/tutorial.jp.md](doc/tight-clothing/tutorial.jp.md)

## 開発

```bash
npm install
npm run dev
```

コマンドやアーキテクチャの詳細は[CLAUDE.md](CLAUDE.md)を参照してください。

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)のもとで公開されています。
