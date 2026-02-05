[English](tutorial.md) | [日本語](tutorial.jp.md)

# チュートリアル

このチュートリアルでは、タイトな衣服のウェブページで、タイトな七分袖トップスを作成する方法を説明します。

まず、新しいタブまたは新しいウィンドウで[タイトな衣服のウェブページ](https://nut753908.github.io/costume-design/tight-clothing.html)を開きます。次のような画面が表示されます。

![0.png](0.png)

「PlaneManager > addVerticalPlane curveKey」ドロップダウンで、「torso」(胴体)を選択します。その後、「PlaneManager > addVerticalPlane」ボタンを選択し、胴体の曲線に沿って移動する垂直平面を作成します。

![1-1.png](1-1.png)

「PlaneManager > plane[0] torso {VerticalPlane} > inverted」チェックボックスをオンにして、平面の向きを反転します。次に、「PlaneManager > plane[0] torso {VercicalPlane} > u」の値を0.9に設定し、平面を首の位置に移動させます。

![1-2.png](1-2.png)

同様に、「PlaneManager > addVerticalPlane curveKey」ドロップダウンで「torso」(胴体)を選択します。その後、「PlaneManager > addVerticalPlane」ボタンを選択し、胴体の曲線に沿って移動する垂直平面を作成します。

![2-1.png](2-1.png)

「PlaneManager > plane[1] torso {VercicalPlane} > u」の値を0.1に設定し、平面を下腹部の位置に移動させます。

![2-2.png](2-2.png)

「PlaneManager > addVerticalPlane curveKey」ドロップダウンで、「leftArm」(左腕)を選択します。その後、「PlaneManager > addVerticalPlane」ボタンを選択し、左腕の曲線に沿って移動する垂直平面を作成します。

![3-1.png](3-1.png)

「PlaneManager > plane[2] leftArm {VercicalPlane} > u」の値を0.2に設定し、平面を七分袖の位置に移動させます。

![3-2.png](3-2.png)

「PlaneManager > addVerticalPlane curveKey」ドロップダウンで、「rightArm」(右腕)を選択します。その後、「PlaneManager > addVerticalPlane」ボタンを選択し、右腕の曲線に沿って移動する垂直平面を作成します。

![4-1.png](4-1.png)

「PlaneManager > plane[3] rightArm {VercicalPlane} > u」の値を0.2に設定し、平面を七分袖の位置に移動させます。

![4-2.png](4-2.png)

「Area > thickness」の値を0.002に設定し、領域を少し厚くします。

![5.png](5.png)

最後に、「common > PlaneHelper > visible」と「common > THREE.ArrowHelper > visible」のチェックボックスをオフにして、ヘルパーを非表示にします。これで、タイトな七分袖トップスの完成です。

![6.png](6.png)
