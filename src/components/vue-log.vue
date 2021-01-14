<template>
  <div class="vue-log">{{ text || "我是日志组件" }}</div>
</template>

<script>
export default {
  name: "vue-log",
  props: {
    text: {
      default: "",
      type: String
    }
  },
  data() {
    return {};
  },
  created() {
    this.showStore();
  },
  methods: {
    showStore() {
      console.log("展示vuex数据", this.$store);
    }
  }
};
</script>

<style scoped lang="scss">
.vue-log {
  width: 500vw;
  height: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  color: #ffffff;
  border-radius: 10px;
}
</style>
