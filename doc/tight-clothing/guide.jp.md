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
| --PlaneHelper                    | Plane Helper. This extends THREE.PlaneHelper to allow for repositioning.<br>Link: https://threejs.org/docs/#PlaneHelper |
| ----visible                      | Whether to display all plane helpers. |
| ----size                         | The size of all plane helpers.<br>Step: 0.01 |
| ----color                        | The color of all plane helpers. |
| --THREE.ArrowHelper              | Arrow Helper.<br>Link: https://threejs.org/docs/#ArrowHelper |
| ----visible                      | Whether to display all arrow helpers. |
| ----length                       | The length of all arrow helpers.<br>Step: 0.01 |
| ----color                        | The color of all arrow helpers. |
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
| ----area (u=uniforms)            | タイトな衣服領域オブジェクトの外観。これはシェーダーマテリアルから作成したオリジナルのメッシュトゥーンマテリアルです。フォルダ構造は上記の「body (u=uniforms)」と同じです。<br>リンク：https://threejs.org/docs/#ShaderMaterial |
| PlaneManager                     | Manages the increase and decrease of infinite planes. |
| --addFreePlane                   | Adds a free plane, which is an infinite plane with no restrictions on position or orientation. The plane is visualized using the plane and arrow helper. |
| --addVerticalPlane               | Adds the vertical plane specified by "addVerticalPlane curveKey", which is an infinite plane perpendicular to the curve at position u. The plane is visualized using the plane and arrow helper. |
| --removePlane                    | Removes the plane specified by "removePlane key". |
| --addVerticalPlane curveKey      | Curve key to add a vertical plane. |
| --removePlane key                | Key to remove the plane. |
| --plane[0] {FreePlane}           | A free plane, which is an infinite plane with no restrictions on position or orientation. The plane is visualized using the plane and arrow helper. The index (0,1,...) is common to both the free and vertical planes. |
| ----normal                       | Normal direction of the free plane. |
| ------x                          | The x-coordinate of the normal. Changing this will normalize the normal.<br>Step: 0.01 |
| ------y                          | The y-coordinate of the normal. Changing this will normalize the normal.<br>Step: 0.01 |
| ------z                          | The z-coordinate of the normal. Changing this will normalize the normal.<br>Step: 0.01 |
| ----point                        | Reference point for the free plane. |
| ------x                          | The x-coordinate of the point.<br>Step: 0.01 |
| ------y                          | The y-coordinate of the point.<br>Step: 0.01 |
| ------z                          | The z-coordinate of the point.<br>Step: 0.01 |
| ----inverted                     | Whether to invert the normal of the free plane internally. |
| --plane[1] torso {VerticalPlane} | A vertical plane, which is an infinite plane perpendicular to the curve at position u. The plane is visualized using the plane and arrow helper. The index (0,1,...) is common to both the free and vertical planes. The name includes the specified "addVerticalPlane curveKey", such as "torso". |
| ----u                            | The numeric position within the specified "addVerticalPlane curveKey" curve. This is used to calculate a point/normal on the vertical plane.<br>Min: 0, Max: 1, Step: 0.01 |
| ----inverted                     | Whether to invert the normal of the vertical plane internally. |
| Area                             | Relates to tight clothing area. Calculates the intersections of the body with the plane and finds loops within the intersections. Duplicates the body, cuts it using the intersection loops, finds the area adjacent to the intersection loops in the plane normal direction, and gives thickness to that area. |
| --thickness                      | The thickness of the area.<br>Min: 0, Max: 0.01, Step: 0.0001 |
| --intersection loops...          | Loops within the intersections of the body and the plane. The text after "intersection loops" is the same as the text after "plane" in the plane above. |
| ----option                       | How to select the intersection loops. "all" selects all loops. "including plane" selects the loop closest to the plane point. "excluding plane" selects all loops except the loop closest to the plane point. "some" selects the loops at the specified indices.<br>Default: "all" for the free plane, "including plane" for the vertical plane |
| ----indices                      | The indices of the intersection loops. This is only visible if the "some" option is selected. |
| ------0                          | Whether to enable this index (0,1,...). |
