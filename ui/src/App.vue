<template>
  <div id="app">
    <Header />
    <Dashboard />
  </div>
</template>

<script>
import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import Header from "@/components/Header.vue";
import Dashboard from "@/components/Dashboard.vue";

UIkit.use(Icons);
export default {
  name: "App",
  components: {
    Header,
    Dashboard
  }
};
</script>

<style lang="less">
@import "../node_modules/uikit/src/less/uikit.less";
@import "./assets/less/theme.less";

html {
  scroll-behavior: smooth;
}
</style>
