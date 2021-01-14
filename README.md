# vue-log

用于创建 vue 日志

生成 localstorage

# install

```js
npm install @trumangao/vue-log
```

# use

```js
// main.js
import vueLog from "@trumangao/vue-log";
Vue.use(vueLog);
```

```vue
<!-- demo.vue -->
<template>
  <div class="demo">
    <vue-log :text="text"></vue-log>
  </div>
</template>
<script>
export default {
  name: "demo",
  data() {
    return {
      text: "trumanGao 测试用日志文件"
    };
  }
};
</script>
```
