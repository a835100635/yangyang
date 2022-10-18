大佬们点个小小的 start
实现一个简易版本的“羊了个羊” html 版本（过不了关的我直接自己做一个😁）
    不想搞太复杂 直接html一把梭

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcd7966cd27e465fa77560da3d757734~tplv-k3u1fbpfcp-watermark.image?)

[github：在线体验地址 大佬们点个小小的 start ⭐️ https://a835100635.github.io/yangyang/](https://a835100635.github.io/yangyang/)

## 带着疑问去开发？？？
- 该如何设置卡片呈现的机制（网格布局？随机布局？）
- 卡片的数量随机创建
- 卡片的位置是随机呈现？还是网格呈现？而且需要有一定的位置偏移
- 卡片点击后移动至卡槽中，动画效果如何实现
- 点击3个相同的卡片消除掉
- 存放点击卡片的卡槽（下文简称卡槽）数量超过7个判定失败

## 准备工作
创建index.html文件,接下来的主要逻辑代码就在这了

为了省事些也是直接用了 `vue3`，`cdn`的方式直接引入

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1 />
  <link rel="stylesheet" href="index.css">
  <script src="https://unpkg.com/vue@3.2.12/dist/vue.global.js"></script>
  <title>Document</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

## 该如何设置卡片呈现的机制（网格？随机？）
这个问题还是比较重要的，网格呈现和随机出现都是可以的，但是我还是选择了网格+随机出现

先制定好显示范围，设置卡片为 `40px * 40px` 那么制定`8行8列`的话 那就是 `320px * 320px`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79114cedd2b048cf9b750e3cd1c0faca~tplv-k3u1fbpfcp-watermark.image?)
在风格成小网格，这样就搞定了卡片放置的坑位，到时候`随机出现在n行m列`就行了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2086ec0b7e1433f84dd5ca1e020372b~tplv-k3u1fbpfcp-watermark.image?)


卡片图标的话直接用表情，哈哈哈 就不用找图片了

```js
// 卡片默认图标
const defaultIcons = ['🐑','😀', '😭', '😂', '😍', '😎', '😘', '😳', '😇', '🤪'];
```
默认用了10个图标，目前设置是第一关选择两个表情，第二关四个表情，以此类推。。。。。

### 根据关卡生成一定数量的卡片
**首先得思考一下如何根据关卡在 `defaultIcons`中选取图标数量呢**

```js
const data = reactive({
  // 游戏等级
  level: 1,
});
const icons = computed(() => {
  return defaultIcons.slice(0, 2 * data.level);
});

/**
 * 等级切换 重置游戏 
 */
watch(() => data.level, () => {
  // 重置游戏代码
});
```
利用 `computed`计算属性动态的计算根据游戏等级`level`去浅拷贝一份图标`defaultIcons`

例如第一关效果如下

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e7233ea86d849ad878cd7e513b77730~tplv-k3u1fbpfcp-watermark.image?)

第二关效果

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f573b6daa284fc2b3a64550dadeb997~tplv-k3u1fbpfcp-watermark.image?)

等等等。。。以下关卡就不展示了

**接着再考虑生成卡片数量**

游戏设定是3张一样的卡片即为可消除，那为保证能正常的游戏，那单个图片卡片生成的的数量一定数3的倍数。

那好，接下来已`[“🐑”, “😄”]`作为例子

第一关就应该生成这样的6张卡片 `[“🐑”, “🐑”, “🐑”, “😄”, “😄”, “😄”]`

感觉显得有点单调，可以考虑加一个随机数，比如 `“🐑”` 生成6个又或者生成9个（保证是3的倍数就行，如果不是的话那怎么都通过不了）

```js
// 卡片默认生成3的倍数
const defaultRounds = [3, 6, 9, 2, 7];
```
哈哈 加了两个不是3的倍数，有百分之六十的几率可以通关😂

生成卡片， 创建`init`函数 专门处理生成卡片

```js
// 初始化
const init = () => {
  const cards = [];
  for(const i in icons.value) {
    // 随机3的倍数
    const rounds = defaultRounds[Math.floor(Math.random() * defaultRounds.length)];
    for(let k = 0; k < rounds; k++) {
        cards.push(icons.value[i]);
    }
  }
  console.log(cards);
}
```
多随机几次看看效果
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd92aeb86edf47a280eedb3dd981092d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/460fa0dd1b75478a8960337d5ff7cbea~tplv-k3u1fbpfcp-watermark.image?)
哈哈哈这关肯定通过不了，有7个`“😄”`

这样下来数量搞定了

### 数量搞定了，光一个表情肯定是不行的，那接着完善一下卡片信息

跟位置有关那先定义一下默认偏移量的集合，之所以需要偏移量的集合，那是因为观察“羊了个羊”游戏，可以确定没有出现过完全重叠的情况，那么就要考虑卡片偏移的因素，当然这个值是随意定的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/078860098339474ba70c2696ff0f5036~tplv-k3u1fbpfcp-watermark.image?)

例如下图，绿框和红框是不能完全覆盖重叠的，所以出现偏移的情况，而又需要偏移的角度不能固定死，有上下左右组合成八个方向的偏移

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e43ba9138245a5bd6a6808b052bddb~tplv-k3u1fbpfcp-watermark.image?)

由此设置以下`defaultOffsetValue`偏移量集合

```js
// 卡片默认偏移值
const defaultOffsetValue = [7, -7, 20, -20, 25, -25, 33, -33, 40, -40];
const defaultOffsetValueLength = defaultOffsetValue.length;
```

那怎么使用这个偏移呢，随机在集合中取一个，真是机智

```js
// 偏移 
const offset = defaultOffsetValue[Math.floor(defaultOffsetValueLength * Math.random())];
```
接下来就是生成行列，为了不让卡片太飘逸的生成位置，决定固定列数`8 * 8`

```js
// 随机8列 8行 
const row = Math.floor(Math.random() * 8); 
const col = Math.floor(Math.random() * 8);
```
重点来了，生成卡片的`xy轴`位置信息 

`x位置 = 列 * 宽度 + 偏移量`

`y位置 = 行 * 高度 + 偏移量`

```js
// 默认这是卡片高宽度 40px
let x = col * 40 + offset; 
let y = row * 40 + offset;
```

下一步把`cards.push(cards);`代码改造一下，抽离成功函数 定义成 `createCardInfo`函数

在此之前先把卡片配置项声明一下，还有生成id的随机函数

```js
// 卡片配置项
const config = reactive({
    // 默认卡片宽高
    base: 40，
    // 行
    row: 8,
    // 列
    col: 8
});

const data = reactive({
  // 游戏等级
  level: 1,
  // 卡片信息集合
  cards: []
});

/**
 * 随机生成指定长度id
 */
const randomCreateId = (length) => {
    return (Math.random() + new Date().getTime()).toString(32).slice(0,length);
}
```
**修改后的`init函数`**

```js

// 初始化
const init = () => {
  for(const i in icons.value) {
    // 随机3的倍数
    const rounds = defaultRounds[Math.floor(Math.random() * defaultRounds.length)];
    for(let k = 0; k < rounds; k++) {
        // 把图标传入创建卡片属性函数中
        createCardInfo(icons.value[i])
    }
  }
}
init();
```
 **`createCardInfo`函数主体**

卡片的信息包括 （目前只考虑这么多）
- id
- 图标
- x
- y
- 控制遮罩层
- 是否在卡槽中
- 是否需要清除
- 清除后是否隐藏
```js
// 创建卡片属性集合
const createCardInfo = (icon) => {
  // 偏移量
  const offset = defaultOffsetValue[Math.floor(defaultOffsetValueLength * Math.random())];
  // 随机8列 8行
  const row = Math.floor(Math.random() * config.row);
  const col = Math.floor(Math.random() * config.col);

  let x = col * config.base + offset;
  let y = row * config.base + offset;

  data.cards.push({
    id: randomCreateId(6),
    icon,
    x,
    y,
    // 控制遮罩层
    not: true,
    // 是否在卡槽中 0否 1是
    status: 0,
    // 是否清除
    clear: false,
    // 隐藏
    display: false
  })
}
```
打印出来瞅一瞅
```js
console.log(data.cards);
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2914d3d5264846209247c691dda4d865~tplv-k3u1fbpfcp-watermark.image?)

看看打印出来的效果，符合预期

### 接下来就是要考虑怎么把他呈现在容器里边 🤔

先设计一下html标签的设计

```html
<div id="app">
    <!-- 容器 -->
    <div class="container">
      <div class="card" 
        v-for="(item, index) in cards" 
        :key="index">
        <span>{{ item.icon }}</span>
      </div>
    </div
</div>

<style>
/*** 卡片容器 ***/
.container {
  position: relative;
  width: 320px;
  height: 320px;
  border: 1px solid #ccc;
}
/*** 卡片 ***/
.card {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  font-size: 30px;
  cursor: pointer;
  user-select: none;
}
.card span {
  opacity: 0.5;
  font-size: 24px;
}
</style>
```
`div.container是卡片容器 也就是8*8的div` `div.card就是卡片` 看看效果，所有的卡片都重叠在一起了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9187007ece9846089f499a20dda903a4~tplv-k3u1fbpfcp-watermark.image?)
目前完成一大半了 nice 😊 接下来就是位置了 这我打算用`translate`来做 当然用`top left`也可以，看自己吧
```js
<div class="card" 
    v-for="(item, index) in cards" 
    :key="index" 
    :style="`transform: translateX(${item.x}px) translateY(${item.y}px);`">
    <span>{{ item.icon }}</span>
</div>
```
再看看效果，位置随机了，但是又发现一个小问题，有的卡片出容器外面了，这是为什么？

原来是设置的偏移量导致的，例如`defaultOffsetValue`中有一个`-40`，刚好算的`x轴是-40px`，而卡片又是`40*40`，这种情况就导致了笑脸卡片刚好出去了，我们可以对`html标签`结构做个小改动，外面在包一层然后在给个`padding` 不就搞定了吗 真是小机灵鬼
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b39903c11de042db953d9fe1ed6576a6~tplv-k3u1fbpfcp-watermark.image?)

```html
<div id="app">
    <!-- 容器 -->
    <div class="wrap">
        <div class="container">
          <div class="card" 
            v-for="(item, index) in cards" 
            :key="index">
            <span>{{ item.icon }}</span>
          </div>
        </div
    </div>
</div>
<style>
.wrap {
  // 给个40px 再加个4px的间隙
  padding: 44px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
```
再看看效果, 这问题不就解决了吗

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d53e1bf01c446b5998e5f89364d0966~tplv-k3u1fbpfcp-watermark.image?)

位置算是搞定了，但出现另外一个问题 那就是被重叠的卡片需要一个阴影且不能点击，如图

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9131f795dad4399bb991fccb5e063ff~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55063078d9a44ef09f43f84454b3fcaf~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，被覆盖的卡片变灰，那怎么判断是否被覆盖呢？？
### 怎么判断是否被覆盖呢？？

首先先制定一下覆盖的边界，如下图所示，8种情况任何一种都属于被重叠覆盖

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1ceaf18c9de465eb3100ae45f51f452~tplv-k3u1fbpfcp-watermark.image?)
假设左上角位置`（x, y）`那么四个顶点的位置坐标分别是`（x+width,y）(x,y+height)(x+width,y+height)`。计算a，b卡片之间是否是重叠状态只要判断b卡片的四个顶点是否在a卡片的范围之中

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe95487633d64d21b95adac0de43eb6b~tplv-k3u1fbpfcp-watermark.image?)

此时我们遍历一下卡片集合。例如有6张卡片，第一张卡片的位置信息跟后面5张卡片做一个比较，以为前面的已经在上一次遍历过程中比较过了，以此类推，8种情况结合一下得出总结以下4种判断条件

`a(x, y)、b(x1, y1) 两种卡片 宽高为40px，例如a在b下面 以下4种情况`
```js
// 1、左上顶点
x1 >= x && x1 <= x + 40 && y1 >= y &7 y1 <= y + 40
// 2、左下顶点
x1 >= x && x1 <= x + 40 && y1 + 40 >= y &7 y1 + 40 <= y + 40
// 3、右上顶点
x1 + 40 >= x && x1 + 40 <= x + 40 && y1 >= y &7 y1 <= y + 40
// 4、右下顶点
x1 + 40 >= x && x1 + 40 <= x + 40 && y1 + 40 >= y &7 y1 + 40 <= y + 40
```
搞定。 这一大串判断种感觉很不简洁，接着来优化一波～～～

`b卡片的 y1 小于或者大于 a卡片的 y，x1 小于或者大于 a卡片的 x`。 再取反值 这样不就搞定了吗

```js
y1 + 40 <= y || y1 >= y + 40 || x1 + 40 <= x || x >= x + 40
```
完整代码如下：

```js
/**
 * 是否有阴影
 */
const checkShading = () => {
const cards = data.cards;
for (let i = 0; i < cards.length; i++) {
    const cur = cards[i];
    // 默认没有遮罩
    cur.not = true;
    const { x: x1, y: y1 } = cur;
    const x2 = x1 + config.base, y2 = y1 + config.base;

    for (let j = i + 1; j < cards.length; j++) {
      const compare = cards[j];
      const { x, y } = compare;
      if (!(y + config.base <= y1 || y >= y2 || x + config.base <= x1 || x >= x2)) {
          // 设置遮罩
          cur.not = false;
          break;
      }
    }
    }
}
```
html中也需要修改，声明一个样式 `.is-allow`

```html
<div id="app">
    <!-- 容器 -->
    <div class="wrap">
        <div class="container">
          <div class="card" 
            v-for="(item, index) in cards" 
            :key="index"
            :class="[item.not && 'is-allow']">
            <span>{{ item.icon }}</span>
          </div>
        </div
    </div>
</div>

<style>
.is-allow {
  background-color: white;
}
.is-allow span {
  opacity: 1;
}
</style>

```
最后的效果。可以看到成功被遮挡，可以点击的用`.is-allow`来表示样式

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39d6fcc7960a493a86810885b482d688~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de48d1838de940c6ac274e8856505955~tplv-k3u1fbpfcp-watermark.image?)

离成功不远啦

### 卡片点击后移动至卡槽中，动画效果如何实现

在容器下方设置一个卡槽，专门存放被点击的卡片 设置7个卡片的位置 `40*7`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7949d28c95064722af941ebe10a3e6dc~tplv-k3u1fbpfcp-watermark.image?)

代码实现

```html
<div id="app">
    <!-- 容器 -->
    <div class="wrap">
        <div class="container">
          <div class="card" 
            v-for="(item, index) in cards" 
            :key="index"
            :class="[item.not && 'is-allow']">
            <span>{{ item.icon }}</span>
          </div>
        </div
    </div>
</div>
<!-- 卡槽 -->
<div class="card-slot"></div>

<style>
/*** 卡槽 ***/
.card-slot {
  margin-top: 20px;
  padding: 10px 20px 10px 20px;
  border: 1px solid #ccc;
  height: 40px;
  width: 280px;
  border-radius: 10px；
}
</style>
```
当我们点击卡片的时候 让卡片的xy坐标设置到卡槽中，设置点击事件，而点击时需要判断点击的卡片是否已存在卡槽中 `status=0 否`、`status=1 在`两种状态 1时禁止点击，并且还需判断`not的状态`是否被覆盖、卡槽中是否已经满了，超过最大限制则判断游戏失败，为什么需要用到`setTimeout`呢，那是因为需要等到动画效果结束后才执行判断，否则的话太突兀的闪烁一下

定义变量存放卡槽中的卡片 `data.select` 初始值默认`Map`，为什么要定义map结构呢 下面会详细讲的。

定义`selectLength`计算属性，为卡槽中卡片的数量

```js
// 卡片配置项
const config = reactive({
    // 默认卡片宽高
    base: 40，
    // 行
    row: 8,
    // 列
    col: 8,
    // 定义动画时间 毫秒
    animationTime: 300，
    // 卡槽存放最大卡片数
    selectMaxLength: 7
});
const data = reactive({
  level: 1,
  cards: [],
  select: new Map()
});

 /**
 * 卡槽已存在卡片长度
 */
const selectLength = computed(() => {
  let length = 0;
  data.select.forEach((item) => {
    length += item.length;
  })
  return length;
});
```
模板中定义`clcik事件`
```js
<div class="card" 
    v-for="(item, index) in cards" 
    :key="index"
    :class="[item.not && 'is-allow']"
    @click="clickCard(item, index)">
    <span>{{ item.icon }}</span>
</div>
 
/**
 * 点击卡片
 */
const clickCard = async (item, index) => {
  // 卡槽中的卡片不允许点击
  if(item.status === 1) return;

  const length = selectLength.value;
  const { selectMaxLength } = config;
  if(item.not && length < selectMaxLength) {
    const cards = data.cards;
    const currentCard = cards[index];
    currentCard.status = 1;

    // 刷新卡槽位置
    await refreshCardPosition(currentCard);
    // 刷新被遮挡卡片
    checkShading();
  };

   // 校验卡片卡槽卡片数量长度
  setTimeout(() => {
    if(selectLength.value >= config.selectMaxLength) {
      alert('游戏失败 重新开始');
      init();
    }
  }, config.animationTime);

}
```

上面代码中提到 `refreshCardPosition`函数是做什么作用的呢？？没错，是用来设置点击卡片新坐标的。如下图 上面的 🐑 需要到卡槽中的 🐑 这一位置该怎么去计算呢？？？

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77405f14a3c94eadac3e7e3eb0985f89~tplv-k3u1fbpfcp-watermark.image?)

第一步是先获取卡槽的位于页面上的位置、第二步获取容器的位置

```js
const data = reactive({
  level: 1,
  cards: [],
  select: new Map(),
  // 容器信息
  containerInfo: null,
  // 卡槽信息
  cardSlotInfo: null
});
onMounted(() => {
  const containerDom = document.querySelector('.container');
  data.containerInfo = containerDom.getClientRects()[0];
  const cardSlotDom = document.querySelector('.card-slot');
  data.cardSlotInfo = cardSlotDom.getClientRects()[0];
})
```
### 新位置怎么算的？？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/272387d0c3b941198bfb2e7a0645554d~tplv-k3u1fbpfcp-watermark.image?)如图我们可以总结一下新坐标是怎么计算的

`newY = cardSlotInfo.y - containerInfo.y + 12(看卡槽上padding) `

`newX = 卡片的index * width + width/2（看卡槽左padding）`

由此引出另外一个问题，两种卡片之间怎么插入进去呢？？第三个 🐑 怎么加入卡槽中的第三个位置，后面的 😀 怎么自动移动一个单元位置（40 * 40）

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffcf3e155abe4190ac13c321a111425a~tplv-k3u1fbpfcp-watermark.image?)

再回到之前定义`select`时，为什么要定义成`Map`结构，好处就体现出来了，每次点击进来的时候只要判断卡槽中是否存在这个表情，有的话就`push`进去。最后把`Map`机构数据 `forEach`以次遍历一下，位置就这样搞定了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6422bc2d34ff42bba00ac7fc663cb360~tplv-k3u1fbpfcp-watermark.image?)
最终看看效果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51759d45fc734bbab06f7acb3286c92b~tplv-k3u1fbpfcp-watermark.image?)
有点生硬 直接变过去，加入个过渡效果

```js
/*** 卡片 ***/
.card {
  ...
  transition: all 0.2s;
}
```

完整代码如下

```js
/**
 * 刷新卡槽卡片位置
 */
const refreshCardPosition = (item) => {
    const { x, y } = data.cardSlotInfo;
    const { top } = data.containerInfo;

    const cards = data.select.get(item.icon);
    if (cards) {
      cards.push(item);
      // 校验是否已经三个一样的卡片
      checkSelectQueue(cards);
    } else {
      data.select.set(item.icon, [item]);
    }
  
    // 重新刷新位置
    let index = 0;
    data.select.forEach((item) => {
        item.forEach((card) => {
          card.x = index * config.base + config.base / 2;
          card.y = y - top + 12;
          index++;
        });
    });
}
```
### 消除效果

然后又需要解决三个一样的卡片即为成功消除的效果，代码中提到的 `checkSelectQueue`函数 就是干这个的 

只需要判断是否等于设定的消除个数就行了，等于的话直接消除，而消除用的`display`来模拟，只是在页面中隐藏，并没有直接删除。原`因是响应式数据v-for的形式，数组改变了 会重新渲染（加入动画后导致)`，消除完后还需判断是否全部消除完，消除完则`data.level++`，自动进入下一关。二话不说 上代码

```js
// 卡片配置项
const config = reactive({
    // 默认卡片宽高
    base: 40，
    // 行
    row: 8,
    // 列
    col: 8,
    // 定义动画时间 毫秒
    animationTime: 300,
    // 可已备消除个数
    maxCount: 3
});
/**
 * 校验卡槽中是否3个相同的存在
 */
const checkSelectQueue = (cards) => {
  if(cards.length === config.maxCount) {
    // 动画效果执行完后执行
    setTimeout(() => {
      // 删除卡槽中卡片
      data.select.delete(cards[0].icon);
      // 删除cards中的卡片 软删除 display代替
      cards.forEach((item) => {
        item.display = true;
      })
      // 属性卡槽卡片位置
      refreshCardPosition();

      // 校验是否卡片列表是否还有未消除的卡片
      const hasCards = data.cards.filter((item) => !item.display);
      if(!hasCards.length) {
        alert(`通关啦, 开始第${data.level + 1}关`);
        data.level++;
      }
    }, config.animationTime);
  }
}
```
加入消除动画效果”缩小“ ,避免卡片突然消失显得很low，我们稍微改一下 `checkSelectQueue`函数，加入`clear`属性控制。

```js
/**
 * 校验卡槽中是否3个相同的存在
 */
const checkSelectQueue = (cards) => {
  if(cards.length === config.maxCount) {
    // 加入clear属性
    cards.forEach((item) => {
      item.clear = true;
    })
    ...... (其他代码)
  }
}
```
为了避免缩小的时候不好看，又在card标签外头嵌套了一层，这样下来 `div.card-wrap` 只要关注位置的变化，`div.card` 关注动画效果

```js
<div class="wrap">
  <div class="container">
    <div class="card-wrap"
      v-for="(item, index) in cards" 
      :key="index"  
      :style="setCardStyle(item)">
      <div class="card" 
        :class="[item.not && 'is-allow', item.id]"
        :style="setAnimation(item)"
        @click="clickCard(item, index)"
      >
        <span>{{ item.icon }}</span>
      </div>
    </div>
  </div>
</div>

// 设置卡片位置
const setCardStyle = ({ x, y }) => {
  return `
    transform: translateX(${x}px) translateY(${y}px);
  `;
}
```
设置卡片缩小动画
```css
/*** 卡片动画 ***/
@keyframes scaleDraw {
  0% {
    transform: scale(1.1);
  }
  20% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
```

```js
 <div class="card" 
    :class="[item.not && 'is-allow', item.id]"
    :style="setAnimation(item)"
    @click="clickCard(item, index)"
  >
    <span>{{ item.icon }}</span>
  </div>

// 设置卡片动画
const setAnimation = ({ id, clear, display }) => {
  let isClear = ''
  if(clear) {
    isClear = `animation: scaleDraw ${config.animationTime}ms;`
  }
  if(display) {
    isClear += 'display: none;';
  }
  return isClear;
}

```
### 怎么判断都消除成功了呢？？

`clickCard`函数中判断卡槽卡片是否等于设定的

```js
/**
 * 点击卡片
 */
const clickCard = async (item, index) => {
  ......(其他代码)

  // 校验卡片卡槽卡片数量长度
  setTimeout(() => {
    if(selectLength.value >= config.selectMaxLength) {
      alert('游戏失败 重新开始');
      init();
    }
  }, config.animationTime);

}
```
### 游戏重置
卡片清空，卡槽清空，再初始化游戏

```js
<span class="btn" @click="handleReset">重置</span>

/**
 * 重置游戏
 */
const handleReset = () => {
  // 清空已有的卡片
  data.cards.length = 0;
  data.select.clear();
  init();
}
```

### 上下关

```js
<span class="btn" @click="handleSwitch('prev')">上一关</span>
<span class="btn" @click="handleSwitch('next')">下一关</span>

/**
 * 切换关卡
 */
const handleSwitch = (type) => {
  if(type === 'prev') {
    if(data.level === 1) {
      window.alert('已经是第一关了');
      return;
    }
    data.level--;
  } else {
    if(data.level === defaultIcons.length) {
      window.alert('已经是最后一关了');
      return;
    }
    data.level++;
  }
}
```

## 背景音乐
   使用audio标签进行控制
```js
// 创建音乐构造函数
function CustomAudio(config) {
    this.config = config;
}
```
初始化
```js
CustomAudio.prototype.init = function() {
  const { bgmSrc, clickBgm } = this.config;
  this.createAudioDom([
    {
      key: 'audio',
      loop: true,
      src: bgmSrc
    }, 
    {
      key: 'clickBgmAudio',
      loop: false,
      src: clickBgm
    }
  ]);
}
```

```js

// 创建audio dom元素
CustomAudio.prototype.createAudioDom = function(config) {
  const { template } = this.config;
  config.forEach(item => {
    this[item.key] = document.createElement('audio');
    this[item.key].setAttribute('controls', '');
    if (item.loop) {
      this[item.key].setAttribute('loop', '');
    }
    
    const source = document.createElement('source');
    source.setAttribute('type', "audio/mpeg");
    source.src = item.src;
    
    this[item.key].appendChild(source);
    
    this[item.key].setAttribute('style', 'display: none');
    
    document.querySelector(template).appendChild(this[item.key])
  });
}
```


## 总结：目前所有功能都在这咯 后续加入其他的道具功能

后续补上其他

**有建议的欢迎评论**

## 效果图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54d3dff39ca94dd1aac64a66180007e0~tplv-k3u1fbpfcp-watermark.image?)

## 完整代码 有兴趣的话可以去github地址：https://github.com/a835100635/yangyang



