<template>
  <div class="modelthree">
    <div class="workshop">
      <div class="bg" :class="count == index ? 'bgactive' : ''" v-for="(item, index) in 8" @click="changeButton(index)">
        {{ index + 1 }}#车间</div>
    </div>
    <div class="office">
      <div class="bg" :class="count == index ? 'bgactive' : ''" v-for="(item, index) in 3" @click="changeButton(index)">
        {{ index + 6 }}号办公楼</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module'
import TWEEN from "tween.js"
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
let scene, hdrCubeRenderTarget, building, park;
export default {
  name: "ModelThree",
  data() {
    return {

      renderer: null,

      renderer2: null,

      camera: null,

      controls: null,

      controls2: null,

      stats: null,

      mesh: null,

      control: null,

      count: 1,

    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    tag3DSprite(name) {
      // 创建div元素(作为标签)
      var div = document.createElement('div');
      div.innerHTML = name;
      div.classList.add('tag');
      //div元素包装为CSS3模型对象CSS3DSprite
      var label = new CSS3DSprite(div);
      div.style.pointerEvents = 'none';//避免HTML标签遮挡三维场景的鼠标事件
      div.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
      div.style.color = 'red';
      // 设置HTML元素标签在three.js世界坐标中位置
      // label.position.set(x, y, z);
      //缩放CSS3DSprite模型对象
      label.scale.set(1, 1, 1);//根据相机渲染范围控制HTML 3D标签尺寸
      label.rotateY(Math.PI / 2);//控制HTML标签CSS3对象姿态角度
      label.rotateX(-Math.PI / 2);
      return label;//返回CSS3模型标签    
    },
    init() {
      scene = new THREE.Scene();
      // let axes = new THREE.AxisHelper(100);
      // scene.add(axes);
      this.camera = new THREE.PerspectiveCamera(
        750,

        window.innerWidth / window.innerHeight,

        1,

        100000
      );
      this.camera.position.set(20000, 10000, 0);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
      });


      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      pmremGenerator.compileCubemapShader();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.sortObjects = true;
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;

      this.renderer2 = new CSS3DRenderer();
      this.renderer2.setSize(window.innerWidth, window.innerHeight);
      this.renderer2.domElement.style.position = 'absolute';
      this.renderer2.domElement.style.top = 0;
      // this.renderer2.domElement.style.pointerEvents = 'none';

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      let demo = document.getElementsByClassName("modelthree")[0];
      this.renderer.domElement.id = "model";
      demo.appendChild(this.renderer.domElement);
      demo.appendChild(this.renderer2.domElement);

      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      demo.appendChild(this.stats.domElement);
      const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];
      let hdrCubeMap = new HDRCubeTextureLoader()
        .setPath('pano/')
        .load(hdrUrls, () => {
          hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
          // scene.environment = hdrCubeRenderTarget.texture;
          hdrCubeMap.magFilter = THREE.LinearFilter;
          hdrCubeMap.needsUpdate = true;

        });
      // scene.background = hdrCubeMap;
      let loader = new GLTFLoader();
      loader.setPath('model/')
      loader.load('1.glb', (gltf) => {
        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            child.material.envMap = hdrCubeRenderTarget.texture;
            console.log(child.material.envMapIntensity)
          }

        });
        // gltf.scene.rotation.y = this.models[key].rotation;
        // gltf.scene.position.set(0,0,0);
        console.log(gltf.scene)
        park = gltf.scene;
        gltf.scene.scale.multiplyScalar(1);//模型大小
        scene.add(gltf.scene);
      });
      loader.load('Floor.glb', (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            let label3D = this.tag3DSprite("消防器材");//设置标签名称
            var pos2 = new THREE.Vector3();
            child.getWorldPosition(pos2);//获取obj世界坐标、
            pos2.y += 5;
            label3D.position.copy(pos2);//标签标注在obj世界坐标
            scene.add(label3D);//标签插入场景 
            // child.material.envMap = hdrCubeRenderTarget.texture;
            // console.log(child.material.envMapIntensity)
          }

        });
        // gltf.scene.rotation.y = this.models[key].rotation;
        // gltf.scene.position.set(0,0,0);
        // console.log(gltf.scene)
        gltf.scene.scale.multiplyScalar(10);//模型大小
        // gltf.scene.visible = false;
        // scene.add(gltf.scene);
        building = gltf.scene;
        console.log(building);
      });

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      // 定向光
      // const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight1.shadow = false;
      // directionalLight1.position.set(-30, 7000, -10000);
      // scene.add(directionalLight1);
      // const directionalLight2 = new THREE.SpotLight(0xFFFFFF, 1.8);
      // directionalLight2.position.set(20000, 10000, 0);
      // directionalLight2.intensity = 3;
      // directionalLight2.distance = 200000
      // directionalLight2.angle = 0.2;
      // const directionalLight3 = new THREE.SpotLightHelper(directionalLight2, 50, 0xFFFFFF);

      const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1.8);
      directionalLight2.position.set(20000, 10000, 0);

      scene.add(directionalLight2);

      this.controls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls2 = new OrbitControls(this.camera, this.renderer2.domElement);

      this.controls.target = new THREE.Vector3(0, 0, 0);
      this.controls2.target = new THREE.Vector3(0, 0, 0);

      const raycaster = new THREE.Raycaster()
      const raycaster1 = new THREE.Raycaster();
      let mouse = new THREE.Vector2()
      let intersects = null
      this.renderer2.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        intersects = raycaster.intersectObject(scene, true);
        if (intersects.length > 0) {
          console.log(intersects);
          if (intersects[0].object.parent.name !== "Warehouse1") {
            return
          }
          let boxMaxY = new THREE.Box3().setFromObject(intersects[0].object).max.y
          let distance = boxMaxY + 4000
          let angel = Math.PI / 5
          let position = {
            x: intersects[0].object.parent.position.x + Math.cos(angel) * distance,
            y: intersects[0].object.parent.position.y + 2000,
            z: intersects[0].object.parent.position.z + Math.sin(angel) * distance
          }

          let tween = new TWEEN.Tween(this.camera.position).to(position, 2000);
          let tween1 = new TWEEN.Tween(this.controls.target).to(intersects[0].object.parent.position, 2000)
          let tween2 = new TWEEN.Tween(this.controls2.target).to(intersects[0].object.parent.position, 2000)

          this.controls.enabled = false;
          this.controls2.enabled = false;
          tween.onComplete(() => {
            this.controls.enabled = true;
            this.controls2.enabled = true;
            scene.remove(park);
            scene.add(building);
            building.position.copy(intersects[0].object.parent.position);
            building.visible = true;
            console.log(this.camera.position)
          })

          tween.start()
          tween1.start()
          tween2.start()
        }
      });
      // this.renderer2.domElement.addEventListener('click', (event) => {
      //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      //   raycaster1.setFromCamera(mouse, this.camera);
      //   intersects = raycaster1.intersectObject(scene, true);
      //   if (intersects.length > 0) {
      //     console.log(intersects);
      //   }
      // });

    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(scene, this.camera);
      this.renderer2.render(scene, this.camera);
      this.stats.update();
      // this.renderer.toneMappingExposure = 1;
      this.controls.update();
      this.controls2.update();
      TWEEN.update()
    },
    changeButton(index) {
      this.count = index;
      console.log(index);
      let tween1 = new TWEEN.Tween(this.controls.target).to({ x: 0, y: 0, z: 0 }, 3000);
      let tween2 = new TWEEN.Tween(this.controls2.target).to({ x: 0, y: 0, z: 0 }, 3000);
      let tween = new TWEEN.Tween(this.camera.position).to({ x: 20000, y: 10000, z: 0 }, 3000);
      this.controls.enabled = false;
      this.controls2.enabled = true;
      tween.onComplete(() => {
        this.controls.enabled = true;
        this.controls2.enabled = true;
        scene.remove(building);
        scene.add(park);
        console.log(this.camera.position)
      })
      tween.start()
      tween1.start()
      tween2.start()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.modelthree {
  width: 100%;
  height: 100%;
  position: relative;
}

.workshop {
  position: absolute;
  display: flex;
  flex-direction: column;
  float: left;
  top: 10%;
  left: 10%;
}

.office {
  position: absolute;
  display: flex;
  flex-direction: column;
  float: left;
  bottom: 25%;
  left: 10%;
}

.bg {
  width: 120px;
  height: 50px;
  text-align: center;
  color: white;
  line-height: 50px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  margin-top: 10px;
}

.bgactive {
  background-image: url('../assets/button/button03.png');
}
</style>
