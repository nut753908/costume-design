[English](tutorial.md) | [日本語](tutorial.jp.md)

# チュートリアル

このチュートリアルでは、毛束のウェブページで、シンプルな毛束を作成する方法を説明します。

## 手順

まず、新しいタブまたは新しいウィンドウで[毛束のウェブページ](https://nut753908.github.io/costume-design/hair-bundle.html)を開きます。次のような画面が表示されます。

![0.png](0.png)

<br>

「common > THREE.Material > tube (u=uniforms) > wireframe」チェックボックスをオンにして、チューブのワイヤーフレーム表示を有効にします。

![1-1.png](1-1.png)

<br>

「Tube > axisSegments」の値を40に設定し、チューブ軸に沿った面の数を増やします。次に、「Tube > crossSegments」の値を20に設定し、チューブ断面の面の数を増やします。

![1-2.png](1-2.png)

<br>

「Tube > xScaleN」の値を0.2に設定し、チューブ断面のxスケールを縮小します。実際には、チューブ断面のzスケールが縮小されているように見えます。次に、「Tube > yScaleN」の値を0.02に設定し、チューブ断面のyスケールを縮小します。実際には、チューブ断面のxスケールが縮小されているように見えます。

![1-3.png](1-3.png)

<br>

「Tube > yCurvatureN」の値を-4に設定し、チューブ断面を-y方向に湾曲させます。実際には、チューブ断面は-x方向に湾曲しているように見えます。

![1-4.png](1-4.png)

<br>

「common > THREE.Material > tube (u=uniforms) > wireframe」チェックボックスをオフにして、チューブのワイヤーフレーム表示を無効にします。

![1-5.png](1-5.png)

<br>

「TubeGroup > visible > scaleC」チェックボックスをオンにして、チューブ断面のスケール曲線を表示します。マウスホイールを回してズームアウトし、スケール曲線全体が表示されるようにします。

![2-1.png](2-1.png)

<br>

「Tube > scaleC > interpolateCp」ボタンを選択して、2つの制御点の間に補間制御点を追加します。

![2-2.png](2-2.png)

<br>

「Tube > scaleC > cp0 > isSyncRadius」チェックボックスをオンにします。その後、「Tube > scaleC > cp0 > middle.y」の値を0に設定し、「Tube > scaleC > cp0 > local > left.radius」の値を0.75に設定し、「Tube > scaleC > cp0 > local > left.angle」の値を270に設定します。その結果、チューブ断面は中心から上部に向かって徐々に先細りになります。

![2-3.png](2-3.png)

<br>

「Tube > scaleC > cp1 > local > left.radius」を0.75に設定し、より緩やかな先細りにします。

![2-4.png](2-4.png)

<br>

「Tube > scaleC > cp2 > isSyncRadius」チェックボックスをオンにします。その後、「Tube > scaleC > cp2 > middle.y」の値を0に設定し、「Tube > scaleC > cp2 > local > left.radius」の値を0.75に設定し、「Tube > scaleC > cp2 > local > left.angle」の値を90に設定します。その結果、チューブ断面は中心から底部に向かって徐々に先細りになります。

![2-5.png](2-5.png)

<br>

マウスホイールを回して、デフォルトのズームレベルに戻ります。「TubeGroup > visible > scaleC」チェックボックスをオフにして、チューブ断面のスケール曲線を非表示にします。「TubeGroup > visible > axis」チェックボックスをオンにして、チューブ軸曲線を表示します。

![3-1.png](3-1.png)

<br>

「Tube > axis > cp0 > local > left.radius」の値を0.5に設定し、「Tube > axis > cp0 > local > left.Az」の値を180に設定します。その結果、チューブは上部から右に向かって膨らみます。

![3-2.png](3-2.png)

<br>

「Tube > axis > cp1 > local > left.radius」の値を0.3に設定し、カーブを底部に滑らかに接続します。

![3-3.png](3-3.png)

<br>

「TubeGroup > visible > axis」チェックボックスをオフにして、チューブ軸曲線を非表示にします。これで、シンプルな毛束の完成です。

![4-1.png](4-1.png)

<br>

+x方向からのビュー：

![4-2.png](4-2.png)
