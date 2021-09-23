<template>
  <div class="threeScene">
    <div class="container" ref="container"></div>
  </div>
</template>

<script>
import MainThreeScene from "@/classes/MainThreeScene";
import MouseController from "@/classes/MouseController";

export default {
  name: "ThreeScene",
  props: {
    msg: String
  },
  mounted() {
    MouseController.start();
    MainThreeScene.init(this.$refs.container);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
