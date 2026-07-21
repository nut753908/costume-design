[English](README.md) | [日本語](README.jp.md)

# Costume design

This project was originally conceived as a tool that would allow users to enjoy detailed costume designs. However, as development progressed, it became clear that creating even one feature takes a lot of time and effort. We realized that it would be impossible to implement all the necessary features. So we gave up on making everything and decided to offer only the features we had developed so far. Here we will introduce these two features.

Built with [Three.js](https://threejs.org/), TypeScript, and [Vite](https://vitejs.dev/).

## Hair bundle

A hair bundle is a bunch of hair. Any hairstyle can be made up of multiple hair bundles. This feature allows you to create a hair bundle of any shape from a cylinder.

\* There is no feature to create hairstyles using multiple hair bundles.

- Web page: https://nut753908.github.io/costume-design/hair-bundle.html
- Guide: [doc/hair-bundle/guide.md](doc/hair-bundle/guide.md)
- Tutorial: [doc/hair-bundle/tutorial.md](doc/hair-bundle/tutorial.md)

## Tight clothing

Tight clothing is clothing that fits snugly to the body. For example, tight tops, tight bottoms, gloves, tights, socks, etc. This feature allow users to create such clothes.

- Web page: https://nut753908.github.io/costume-design/tight-clothing.html
- Guide: [doc/tight-clothing/guide.md](doc/tight-clothing/guide.md)
- Tutorial: [doc/tight-clothing/tutorial.md](doc/tight-clothing/tutorial.md)

## Development

```bash
npm install
npm run dev
```

See [CLAUDE.md](CLAUDE.md) (written in Japanese) for details on commands and architecture.

## License

This project is licensed under the [MIT License](LICENSE).
