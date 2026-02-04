[English](guide.md) | [日本語](guide.jp.md)

# ガイド

タイトな衣服のウェブページは、シーン、ビューポートギズモ、コントロールパネルの3つの部分で構成されています。

## シーン

<img src="scene.png" alt="scene.png" width="192">

[シーン](https://threejs.org/docs/#Scene)は、3Dオブジェクトが配置される場所です。デフォルトでは、三頭身の人体と[軸ヘルパー](https://threejs.org/docs/#AxesHelper)がシーンに配置されます。シーンは[平行投影カメラ](https://threejs.org/docs/#OrthographicCamera)を通じてレンダリングされます。カメラの視野はウィンドウのサイズに合わせて調整されます。カメラは次のように操作できます：

- マウスの左ボタンをドラッグすると、ピボットポイントを中心に回転します。カメラは常にピボットポイントの方向を向きます。デフォルトでは、ピボットポイントは原点です。
- マウスの右ボタンをドラッグすると、画面と平行に移動します。
- マウスホイールを回転させて拡大/縮小します。

これらのカメラ操作は[軌道制御](https://threejs.org/docs/#OrbitControls)から来ています。

## ビューポートギズモ

<img src="viewport-gizmo.png" alt="viewport-gizmo.png" width="80">

ビューポートギズモは[THREE Viewport Gizmo](https://fennec-hub.github.io/three-viewport-gizmo/)というライブラリです。ビューポートギズモはXYZ方向を表示します。X、Y、Zの円または空白の-X、-Y、-Zの円をクリックすると、シーン内でマウスの左ボタンをドラッグするのと同じように、カメラがその方向に回転します。

## コントロールパネル

<img src="control-panel.png" alt="control-panel.png" width="55">

コントロールパネルは[lil-gui](https://lil-gui.georgealways.com/)というライブラリです。コントロールパネルはフォルダとコントローラで構成されています。フォルダは、フォルダとコントローラを含むことができます。フォルダをクリックすると開いたり閉じたりし、その内容を表示または非表示にします。コントローラは、ドロップダウン、チェックボックス、テキストフィールド、数値フィールド、カラーフィールド、またはボタンです。

数値フィールドは、マウスの左ボタンをドラッグするか、フィールドにフォーカスがある状態で上矢印キーまたは下矢印キーを押すことで変更することもできます。これらの方法を使用して変更を行う際、Shiftキーを押しながら操作すると値のステップサイズが増加し、Altキーを押しながら操作すると値のステップサイズが減少します。

コントロールパネルを操作するたびに、その現在の状態が状態配列に保存されます。前の状態に戻すには、Ctrl+z (Macの場合はCmd+z)を押してください。次の状態に進むには、Shift+Ctrl+zまたはCtrl+y (Macの場合はShift+Cmd+zまたはCmd+y)を押してください。

コントロールパネルには以下の項目が含まれています。

| 名称                              | 説明 |
| -------------------------------- | --- |
| common                           | 共有可能な項目。 |
| --THREE.Scene                    | 3Dオブジェクトを配置するシーン。<br>リンク：https://threejs.org/docs/#Scene |
| ----background                   | シーンの背景色。 |
| --THREE.AxesHelper               | XYZ軸を持つ軸ヘルパー。<br>リンク：https://threejs.org/docs/#AxesHelper |
| ----visible                      | 軸ヘルパーを表示するかどうか。 |
| ----size                         | 軸ヘルパーの各線の長さ。<br>ステップ：0.01 |
| --PlaneHelper                    | 移動可能な平面ヘルパー。<br>リンク：https://threejs.org/docs/#PlaneHelper |
| ----visible                      | すべての平面ヘルパーを表示するかどうか。 |
| ----size                         | すべての平面ヘルパーのサイズ。<br>ステップ：0.01 |
| ----color                        | 全ての平面ヘルパーの色。 |
| --THREE.ArrowHelper              | 矢印ヘルパー。<br>リンク：https://threejs.org/docs/#ArrowHelper |
| ----visible                      | すべての矢印ヘルパーを表示するかどうか。 |
| ----length                       | すべての矢印ヘルパーの長さ。<br>ステップ：0.01 |
| ----color                        | すべての矢印ヘルパーの色。 |
| --THREE.Material                 | 3Dオブジェクトの外観。<br>リンク：https://threejs.org/docs/#Material |
| ----body (u=uniforms)            | 人体オブジェクトの外観。これはシェーダーマテリアルから作成したオリジナルのメッシュトゥーンマテリアルです。<br>リンク：https://threejs.org/docs/#ShaderMaterial |
| ------wireframe                  | 人体表示をワイヤーフレームに変更するかどうか。 |
| ------u.checkShape               | 人体形状を確認するために人体表示を変更するかどうか。面が正面から背面へと向きを変えるにつれ、色は白から黒へと変化します。 |
| ------u.light.x                  | 人体の光源のx座標。<br>ステップ：0.1 |
| ------u.light.y                  | 人体の光源のy座標。<br>ステップ：0.1 |
| ------u.light.z                  | 人体の光源のz座標。<br>ステップ：0.1 |
| ------u.threshold                | 人体の陰の閾値。この値が大きいほど、陰色で塗りつぶされる領域が大きくなります。<br>最小：0、最大：1、ステップ：0.01 |
| ------u.baseColor                | 人体の基本色。 |
| ------u.shadeColor               | 人体の陰色。 |
| ----area (u=uniforms)            | タイトな衣服を形成する領域オブジェクトの外観。これはシェーダーマテリアルから作成したオリジナルのメッシュトゥーンマテリアルです。フォルダ構造は上記の「body (u=uniforms)」と同じです。<br>リンク：https://threejs.org/docs/#ShaderMaterial |
| PlaneManager                     | 無限遠平面の増減を管理します。 |
| --addFreePlane                   | 位置や向きに制限のない無限遠平面である自由平面を追加します。平面は平面ヘルパーと矢印ヘルパーを使用して可視化されます。 |
| --addVerticalPlane               | 「addVerticalPlane curveKey」で指定された曲線に沿って移動し、その曲線に垂直な無限遠平面である垂直平面を追加します。平面は平面ヘルパーと矢印ヘルパーを使用して可視化されます。 |
| --removePlane                    | 「removePlane key」で指定された平面を削除します。 |
| --addVerticalPlane curveKey      | 垂直平面を追加するときに必要な曲線キー。垂直平面はこの曲線を移動軸として使用します。<br>選択肢：「torso」(胴体)、「leftArm」(左腕)、「leftThumb」(左親指)、「leftIndexFinger」(左人差し指)、「leftMiddleFinger」(左中指)、「leftRingFinger」(左薬指)、「leftLittleFinger」(左小指)、「leftLeg」(左脚)、「leftFoot」(左足)、「rightArm」(右腕)、「rightThumb」(右親指)、「rightIndexFinger」(右人差し指)、「rightMiddleFinger」(右中指)、「rightRingFinger」(右薬指)、「rightLittleFinger」(右小指)、「rightLeg」(右脚)、「rightFoot」(右足) |
| --removePlane key                | 削除する平面キー。 |
| --plane[0] {FreePlane}           | 位置や向きに制限のない無限遠平面である自由平面。平面は平面ヘルパーと矢印ヘルパーを使用して可視化されます。インデックス(0,1,...)は、自由平面と垂直平面の双方に共通です。 |
| ----normal                       | 自由平面の法線方向。 |
| ------x                          | 法線のx座標。これを変更すると、法線が正規化されます。<br>ステップ：0.01 |
| ------y                          | 法線のy座標。これを変更すると、法線が正規化されます。<br>ステップ：0.01 |
| ------z                          | 法線のz座標。これを変更すると、法線が正規化されます。<br>ステップ：0.01 |
| ----point                        | 自由平面の基準点。 |
| ------x                          | 点のx座標。<br>ステップ：0.01 |
| ------y                          | 点のy座標。<br>ステップ：0.01 |
| ------z                          | 点のz座標。<br>ステップ：0.01 |
| ----inverted                     | 自由平面の法線を内部で反転させるかどうか。 |
| --plane[1] torso {VerticalPlane} | 「addVerticalPlane curveKey」で指定された曲線に沿って移動し、その曲線に垂直な無限遠平面である垂直平面。平面は平面ヘルパーと矢印ヘルパーを使用して可視化されます。インデックス(0,1,...)は、自由平面と垂直平面の双方に共通です。名前には、指定された「addVerticalPlane curveKey」が含まれます(例：「torso」)。 |
| ----u                            | 指定された「addVerticalPlane curveKey」曲線内の数値位置。これは、垂直平面上の点/法線を計算するために使用されます。<br>最小：0、最大：1、ステップ：0.01 |
| ----inverted                     | 垂直平面の法線を内部で反転させるかどうか。 |
| Area                             | タイトな衣服を形成する領域に関連します。人体と平面の交点を計算し、交点内のループを見つけます。人体を複製し、交点ループを用いてカットし、平面法線方向における交点ループに隣接する領域を見つけて、その領域に厚みを与えます。 |
| --thickness                      | 領域の厚さ。<br>最小：0、最大：0.01、ステップ：0.0001 |
| --intersection loops...          | 人体と平面の交点内のループ。「intersection loops」の後のテキストは、上記の平面の「plane」の後のテキストと同じです。 |
| ----option                       | 交点ループの選択方法。「all」(全て)はすべてのループを選択します。「including plane」(平面を含む)は平面の点に最も近いループを選択します。「excluding plane」(平面を除く)は、平面の点に最も近いループを除くすべてのループを選択します。「some」(一部)は指定されたインデックスのループを選択します。<br>デフォルト：自由平面の場合は「all」、垂直平面の場合は「including plane」 |
| ----indices                      | 交点ループのインデックス。これは、optionで「some」(一部)が選択されている場合にのみ表示されます。 |
| ------0                          | このインデックス(0,1,...)を有効にするかどうか。 |
