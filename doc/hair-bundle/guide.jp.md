[English](guide.md) | [日本語](guide.jp.md)

# ガイド

毛束のウェブページは、シーン、ビューポートギズモ、コントロールパネルの3つの部分で構成されています。

## シーン

<img src="scene.png" alt="scene.png" width="192">

[シーン](https://threejs.org/docs/#Scene)は、3Dオブジェクトが配置される場所です。デフォルトでは、薄茶色の円柱と[軸ヘルパー](https://threejs.org/docs/#AxesHelper)がシーンに配置されます。シーンは[平行投影カメラ](https://threejs.org/docs/#OrthographicCamera)を通じてレンダリングされます。カメラの視野はウィンドウのサイズに合わせて調整されます。カメラは次のように操作できます：

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

| 名称                     | 説明         |
| ----------------------- | ----------- |
| common                  | 共有可能な項目。 |
| --THREE.Scene           | 3Dオブジェクトを配置するシーン。<br>リンク：https://threejs.org/docs/#Scene |
| ----background          | シーンの背景色。 |
| --THREE.AxesHelper      | XYZ軸を持つ軸ヘルパー。<br>リンク：https://threejs.org/docs/#AxesHelper |
| ----visible             | 軸ヘルパーを表示するかどうか。 |
| ----size                | 軸ヘルパーの各線の長さ。<br>ステップ：0.01 |
| --THREE.Material        | 3Dオブジェクトの外観。<br>リンク：https://threejs.org/docs/#Material |
| ----points              | 点オブジェクトの外観。これは制御点に使用されます。<br>リンク：https://threejs.org/docs/#PointsMaterial |
| ------color             | 点の色。 |
| ------size              | 点の大きさ(ピクセル単位)。<br>最小：0、最大：10、ステップ：0.01 |
| ------opacity           | 点の不透明度。<br>最小：0、最大：1、ステップ：0.01 |
| ----line                | 線オブジェクトの外観。これは制御点と曲線に使用されます。<br>リンク：https://threejs.org/docs/#LineBasicMaterial |
| ------color             | 線の色。 |
| ------opacity           | 線の不透明度。<br>最小：0、最大：1、ステップ：0.01 |
| ----tube (u=uniforms)   | チューブオブジェクトの外観。これはシェーダーマテリアルから作成したオリジナルのメッシュトゥーンマテリアルです。両面をレンダリングするように設定されています。<br>リンク：https://threejs.org/docs/#ShaderMaterial |
| ------wireframe         | チューブ表示をワイヤーフレームに変更するかどうか。 |
| ------u.checkShape      | チューブ形状を確認するためにチューブ表示を変更するかどうか。面が正面から背面へと向きを変えるにつれ、色は白から黒へと変化します。 |
| ------u.light.x         | チューブの光源のx座標。<br>ステップ：0.1 |
| ------u.light.y         | チューブの光源のy座標。<br>ステップ：0.1 |
| ------u.light.z         | チューブの光源のz座標。<br>ステップ：0.1 |
| ------u.threshold       | チューブの陰の閾値。この値が大きいほど、陰色で塗りつぶされる領域が大きくなります。<br>最小：0、最大：1、ステップ：0.01 |
| ------u.baseColor       | チューブの基本色。 |
| ------u.shadeColor      | チューブの陰色。 |
| TubeGroup               | チューブ関連のオブジェクトを含むグループ。 |
| --visible               | 「{チューブ関連のオブジェクト名}.visible」のコレクション。 |
| ----tube                | チューブオブジェクトを表示するかどうか。 |
| ----axis                | チューブ軸の3D 3次ベジェ曲線オブジェクトを表示するかどうか。 |
| ----cross               | チューブ断面の2D 3次ベジェ曲線オブジェクトを表示するかどうか。 |
| ----scaleC              | チューブ断面のスケール比変化を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| ----xScaleC             | チューブ断面のxスケール比変化を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| ----yScaleC             | チューブ断面のyスケール比変化を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| ----xCurvatureC         | チューブ断面のx曲率変化を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| ----yCurvatureC         | チューブ断面のy曲率変化を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| ----tiltC               | チューブ断面の傾斜変化(度単位)を表す2D 3次ベジェ曲線オブジェクトを表示するかどうか。Cはcurve(曲線)を意味します。 |
| Tube                    | チューブ。 |
| --axis                  | チューブ軸の3D 3次ベジェ曲線。 |
| ----addCpToFirst        | Duplicates the first control point and adds it to the beginning of the control points. All control point indices will be reset. cp stands for control point. |
| ----addCpToLast         | Duplicates the last control point and adds it to the end of the control points. All control point indices will be reset. cp stands for control point. |
| ----interpolateCp       | Creates an interpolated control point from the control points with indices n (interoplateCp index) and n+1 and adds it as the nth control point. This affects the control points with indices n and n+1 before interpolation. All control point indices will be reset. cp stands for control point. |
| ----removeCp            | Remove the nth (removeCp index) control point. All control point indices will be reset. To remove a control point, at least three control points are required. cp stands for control point. |
| ----interoplateCp index | The index at which to interpolate the control point. cp stands for control point. |
| ----removeCp index      | The index from which to remove the control point. cp stands for control point. |
| ----cp0                 | Control point of the tube axis with index (0,1,...). It consists of three point objects and two line object connecting them. cp stands for control point. |
| ------middle.x          | The x-coordinate of the middle point object. Changing this will also change "left.x" and "right.x" by the same amount.<br>Step: 0.01 |
| ------middle.y          | The y-coordinate of the middle point object. Changing this will also change "left.y" and "right.y" by the same amount.<br>Step: 0.01 |
| ------middle.z          | The z-coordinate of the middle point object. Changing this will also change "left.z" and "right.z" by the same amount.<br>Step: 0.01 |
| ------left.x            | The x-coordinate of the left point object. Changing this will be reflected in "left.radius", "left.Ax", "left.Ay", and "left.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------left.y            | The y-coordinate of the left point object. Changing this will be reflected in "left.radius", "left.Ax", "left.Ay", and "left.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------left.z            | The z-coordinate of the left point object. Changing this will be reflected in "left.radius", "left.Ax", "left.Ay", and "left.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------right.x           | The x-coordinate of the right point object. Changing this will be reflected in "right.radius", "right.Ax", "right.Ay", and "right.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------right.y           | The y-coordinate of the right point object. Changing this will be reflected in "right.radius", "right.Ax", "right.Ay", and "right.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------right.z           | The z-coordinate of the right point object. Changing this will be reflected in "right.radius", "right.Ax", "right.Ay", and "right.Az" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------isSyncRadius      | Whether to synchronize the left and right radii to be the same. |
| ------isSyncAngle       | Whether to synchronize the left and right angles so that the difference is 180 degrees. |
| ------local             | Subitems of the control point. |
| --------left.radius     | The relative coordinate distance from the middle point object to the left point object. Changing this will be reflected in "left.x", "left.y", and "left.z" and will apply to all enabled syncs.<br>Min: 0, Step: 0.01 |
| --------left.Ax         | The relative coordinate angle (in degrees) around the x-axis from the middle point object to the left point object. The angle is 0 when (y,z)=(n,0),n>0, and increases counterclockwise in the yz plane. Changing this will be reflected in "left.x", "left.y", and "left.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --------left.Ay         | The relative coordinate angle (in degrees) around the y-axis from the middle point object to the left point object. The angle is 0 when (z,x)=(n,0),n>0, and increases counterclockwise in the zx plane. Changing this will be reflected in "left.x", "left.y", and "left.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --------left.Az         | The relative coordinate angle (in degrees) around the z-axis from the middle point object to the left point object. The angle is 0 when (x,y)=(n,0),n>0, and increases counterclockwise in the xy plane. Changing this will be reflected in "left.x", "left.y", and "left.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --------right.radius    | The relative coordinate distance from the middle point object to the right point object. Changing this will be reflected in "right.x", "right.y", and "right.z" and will apply to all enabled syncs.<br>Min: 0, Step: 0.01 |
| --------right.Ax        | The relative coordinate angle (in degrees) around the x-axis from the middle point object to the right point object. The angle is 0 when (y,z)=(n,0),n>0, and increases counterclockwise in the yz plane. Changing this will be reflected in "right.x", "right.y", and "right.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --------right.Ay        | The relative coordinate angle (in degrees) around the y-axis from the middle point object to the right point object. The angle is 0 when (z,x)=(n,0),n>0, and increases counterclockwise in the zx plane. Changing this will be reflected in "right.x", "right.y", and "right.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --------right.Az        | The relative coordinate angle (in degrees) around the z-axis from the middle point object to the right point object. The angle is 0 when (x,y)=(n,0),n>0, and increases counterclockwise in the xy plane. Changing this will be reflected in "right.x", "right.y", and "right.z" and will apply to all enabled syncs. A stands for angle.<br>Step: 1 |
| --cross                 | チューブ断面の2D 3次ベジェ曲線。 |
| ----addCpToFirst        | Duplicates the first control point and adds it to the beginning of the control points. All control point indices will be reset. cp stands for control point. |
| ----addCpToLast         | Duplicates the last control point and adds it to the end of the control points. All control point indices will be reset. cp stands for control point. |
| ----interpolateCp       | Creates an interpolated control point from the control points with indices n (interoplateCp index) and n+1 and adds it as the nth control point. This affects the control points with indices n and n+1 before interpolation. All control point indices will be reset. cp stands for control point. |
| ----removeCp            | Remove the nth (removeCp index) control point. All control point indices will be reset. To remove a control point, at least three control points are required. cp stands for control point. |
| ----interoplateCp index | The index at which to interpolate the control point. cp stands for control point. |
| ----removeCp index      | The index from which to remove the control point. cp stands for control point. |
| ----cp0                 | Control point of the tube cross-section with index (0,1,...). It consists of three point objects and two line object connecting them. cp stands for control point. |
| ------middle.x          | The x-coordinate of the middle point object. Changing this will also change "left.x" and "right.x" by the same amount.<br>Step: 0.01 |
| ------middle.y          | The y-coordinate of the middle point object. Changing this will also change "left.y" and "right.y" by the same amount.<br>Step: 0.01 |
| ------left.x            | The x-coordinate of the left point object. Changing this will be reflected in "left.radius" and "left.angle" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------left.y            | The y-coordinate of the left point object. Changing this will be reflected in "left.radius" and "left.angle" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------right.x           | The x-coordinate of the right point object. Changing this will be reflected in "right.radius" and "right.angle" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------right.y           | The y-coordinate of the right point object. Changing this will be reflected in "right.radius" and "right.angle" and will apply to all enabled syncs.<br>Step: 0.01 |
| ------isSyncRadius      | Whether to synchronize the left and right radii to be the same. |
| ------isSyncAngle       | Whether to synchronize the left and right angles so that the difference is 180 degrees. |
| ------local             | Subitems of the control point. |
| --------left.radius     | The relative coordinate distance from the middle point object to the left point object. Changing this will be reflected in "left.x" and "left.y" and will apply to all enabled syncs.<br>Min: 0, Step: 0.01 |
| --------left.angle      | The relative coordinate angle (in degrees) from the middle point object to the left point object. The angle is 0 when (x,y)=(n,0),n>0, and increases counterclockwise in the xy plane. Changing this will be reflected in "left.x" and "left.y" and will apply to all enabled syncs.<br>Step: 1 |
| --------right.radius    | The relative coordinate distance from the middle point object to the right point object. Changing this will be reflected in "right.x" and "right.y" and will apply to all enabled syncs.<br>Min: 0, Step: 0.01 |
| --------right.angle     | The relative coordinate angle (in degrees) from the middle point object to the right point object. The angle is 0 when (x,y)=(n,0),n>0, and increases counterclockwise in the xy plane. Changing this will be reflected in "right.x" and "right.y" and will apply to all enabled syncs.<br>Step: 1 |
| --axisSegments          | チューブ軸に沿った面の数。<br>最小：1、ステップ：1 |
| --crossSegments         | チューブ断面の面の数<br>最小：3、ステップ：1 |
| --scaleN                | チューブ断面のスケール比。Nはnumber(数値)を意味します。<br>最小：0、ステップ：0.01 |
| --xScaleN               | チューブ断面のxスケール比。Nはnumber(数値)を意味します。<br>最小：0、ステップ：0.01 |
| --yScaleN               | チューブ断面のyスケール比。Nはnumber(数値)を意味します。<br>最小：0、ステップ：0.01 |
| --xCurvatureN           | チューブ断面のx曲率。Nはnumber(数値)を意味します。<br>ステップ：0.01 |
| --yCurvatureN           | チューブ断面のy曲率。Nはnumber(数値)を意味します。<br>ステップ：0.01 |
| --tiltN                 | チューブ断面の傾斜(度単位)。Nはnumber(数値)を意味します。<br>ステップ：1 |
| --scaleC                | チューブ断面のスケール比変化を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --xScaleC               | チューブ断面のxスケール比変化を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --yScaleC               | チューブ断面のyスケール比変化を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --xCurvatureC           | チューブ断面のx曲率変化を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --yCurvatureC           | チューブ断面のy曲率変化を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --tiltC                 | チューブ断面の傾斜変化(度単位)を表す2D 3次ベジェ曲線。フォルダ構造は上記の「cross」と同じです。Cはcurve(曲線)を意味します。 |
| --curvatureOrder        | x曲率とy曲率が適用される順序。「xy」を選択した場合、曲率はx,yの順に適用されます。「yx」を選択した場合、曲率はy,xの順に適用されます。 |
