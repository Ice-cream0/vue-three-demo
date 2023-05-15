<!--
 * @Descripttion: 
 * @version: 
 * @Author: chenzhiyuan
 * @Date: 2023-04-21 19:21:42
 * @LastEditors: chenzhiyuan
 * @LastEditTime: 2023-05-10 17:58:18
-->
<template>
  <ModelThree />
</template>

<script>
import ModelThree from './components/ModelThree.vue'
import ModelPano from './components/ModelPano.vue'
export default {
  name: 'App',
  components: {
    ModelThree,
    ModelPano
  },
  mounted() {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight



    const W = 1920
    const H = 1080



    const scaleW = width / W
    const scaleH = height / H

    console.log(width, height)

    console.log(scaleW, scaleH)

    const scale = scaleW > scaleH ? scaleH : scaleW

    const $app = document.getElementById('app')
    $app.style.transform = `scale(${scale})`;
    // $app.style.transform = `scale(0.5)`;
    $app.style.transformOrigin = "0% 0%";
    $app.style.position = "absolute";
    if (scaleW > scaleH) {
      $app.style.left = `${(width - scale * W) / 2}px`
    } else {
      $app.style.top = `${(height - scale * H) / 2}px`
    }
  }
}
</script>

<style>
#app {
  width: 1920px;
  height: 1080px;
  background-color: #2c3e50;
}

html,
body {
  background-color: #2c3e50;
}
</style>
