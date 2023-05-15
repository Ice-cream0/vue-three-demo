<template>
  <div class="modelpano">
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module'
import * as PANOLENS from 'panolens/build/panolens.module'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Stats from "three/examples/jsm/libs/stats.module.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
let scene;
export default {
  name: "ModelPano",
  data() {
    return {

      renderer: null,

      camera: null,

      controls: null,

      stats: null,

      mesh: null,

      control: null,

    };
  },
  mounted() {
    this.init();
    // this.animate();
  },
  methods: {
    init() {
      let panolens_image = new PANOLENS.ImagePanorama('pano/全景图02.jpg'); //图片路径
      let viewer = new PANOLENS.Viewer({ // 创建全景查看器 
        container: document.getElementsByClassName("modelpano")[0],
      });
      viewer.add(panolens_image); // 将图片添加的查看器
      // scene = new THREE.Scene();
      // this.camera = new THREE.PerspectiveCamera(
      //   750,

      //   window.innerWidth / window.innerHeight,

      //   1,

      //   100000
      // );
      // const geometry = new THREE.SphereGeometry(500, 600, 400);
      // // invert the geometry on the x-axis so that all of the faces point inward
      // geometry.scale(- 1, 1, 1);

      // const texture = new THREE.TextureLoader().load('./pano/全景图02.jpg');
      // const material = new THREE.MeshBasicMaterial({ map: texture });

      // const mesh = new THREE.Mesh(geometry, material);

      // scene.add(mesh);
      // this.camera.position.set(0, 0, 1);
      // this.renderer = new THREE.WebGLRenderer({
      //   antialias: true,
      //   alpha: true,
      //   logarithmicDepthBuffer: true,
      // });
      // this.renderer.setPixelRatio(window.devicePixelRatio);
      // this.renderer.sortObjects = true;
      // // this.renderer.gammaInput = true;
      // // this.renderer.gammaOutput = true;

      // this.renderer.setSize(window.innerWidth, window.innerHeight);
      // let demo = document.getElementsByClassName("modelpano")[0];
      // this.renderer.domElement.id = "model";
      // demo.appendChild(this.renderer.domElement);
      // // this.stats=new Stats();
      // // this.stats.domElement.style.position = 'absolute';
      // // this.stats.domElement.style.top = '0px';
      // // demo.appendChild( this.stats.domElement );


      // this.controls = new OrbitControls(
      //   this.camera,
      //   this.renderer.domElement
      // );
      // // this.controls.enableZoom = false;
      // this.controls.enablePan = false;
      // this.controls.enableDamping = true;
      // this.controls.rotateSpeed = - 0.25;

    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(scene, this.camera);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modelpano {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
