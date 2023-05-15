<template>
  <div class="modelthree">
    <div class="workshop">
      <div class="bg" :class="count == index ? 'bgactive' : ''" v-for="(item, index) in house"
        @click="changeButton(item, index)">
        {{ index + 1 }}#车间</div>
    </div>
    <div class="office">
      <div class="bg" :class="count == index + 8 ? 'bgactive' : ''" v-for="(item, index) in bighouse"
        @click="changeButton(item, index + 8)">
        {{ index + 9 }}号办公楼</div>
    </div>
    <div>
      <div class="floor" v-show="flat">
        <div class="floorc" :class="count1 == index ? 'bgactive' : ''" v-for="(item, index) in floor"
          @click="change(index)">
          {{ item }}</div>
      </div>
      <div class="back" @click="back">返回主视角</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module'
import TWEEN from "tween.js"
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
let scene, hdrCubeRenderTarget, building, building1, building2, park, group, groups, groupone;
export default {
  name: "ModelThree",
  data() {
    return {
      flat: false,
      floor: ["1F", "2F", "3F"],
      newPosition: null,
      house: [
        "CF012",
        "CF023",
        "CF034",
        "CF045",
        "CF056",
        "CF067",
        "CF078",
        "CF089",
      ],
      bighouse: [
        "CF1415",
        "CF1516",
        "CF1617",
        "CF1718"
      ],

      renderer: null,

      camera: null,

      controls: null,

      stats: null,

      mesh: null,

      control: null,

      count: -1,

      count1: - 1,

      objs: ["●生产设备", "●生产设备", "●生产设备", "●生产设备", "●生产设备", "●生产设备", "●消防器材", "●消防器材", "●消防隐患", "●温度湿度", "●电压电流", "●烟感", "●烟感", "●烟感", "●碳排放"]

    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    createLine(point) {
      // 创建材质
      let material = new THREE.LineDashedMaterial({
        color: 0x0000FF,//线段的颜色
        dashSize: 1,//短划线的大小
        gapSize: 3//
      });
      // 创建空几何体
      let geometry = new THREE.BufferGeometry()
      let points = [];
      points.push(new THREE.Vector3(point.x, point.y + 80, point.z));
      points.push(new THREE.Vector3(point.x, point.y + 530, point.z));
      // 绑定顶点到空几何体
      geometry.setFromPoints(points);

      let line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      scene.add(line);
    },
    createPoint(point) {
      let geometry = new THREE.SphereGeometry(15, 32, 16);
      let material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
      let sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(point.x, point.y + 50, point.z);
      scene.add(sphere);
    },
    main(name, position) {
      let c = this.createLabel(name);
      let texture = new THREE.CanvasTexture(c.canvas);
      let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(c.width / 1.5, c.height / 1.5, 0);
      sprite.position.set(position.x + Math.random() * 650 - 325, 580, position.z + Math.random() * 1600 - 800);//7000*3000
      group.add(sprite);
    },
    changeposition(position) {
      for (let i = 0; i < group.children.length; i++) {
        let positions = new THREE.Vector3(position.x + Math.random() * 650 - 325, position.y, position.z + Math.random() * 1600 - 800);
        group.children[i].position.set(positions.x, position.y + 550, positions.z);
        this.createLine(positions);
        this.createPoint(positions);
      }
    },
    createLabel(ccc) {
      const name = ccc;
      const canvas = document.createElement("canvas");
      // let rg = Math.floor(Math.random() * 256); // 生成 0 到 255 之间的随机数
      // let gg = Math.floor(Math.random() * 256);
      // let bg = Math.floor(Math.random() * 256);
      // const color = "rgb(" + rg + ", " + gg + ", " + bg + ")";0x0000FF
      const color = "0x0000FF";
      const fontSize = 50;
      const r = fontSize / 2;
      const margin = fontSize / 2;
      const textMarginleft = 10;
      const height = fontSize * 2;
      const width =
        name.length * fontSize + 2 * margin + r * 2 + textMarginleft;
      canvas.height = height;
      canvas.width = width;
      const ctx = canvas.getContext("2d");
      // out
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
      // inner
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.stroke();
      // font
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = "start";
      ctx.textBaseline = "middle";
      ctx.fillText(name, margin + r + textMarginleft, height / 2);
      return {
        height,
        width,
        canvas,
      };
    },
    init() {
      building1 = new THREE.Group();
      building2 = new THREE.Group();
      groups = new THREE.Group();

      groupone = new THREE.Group();
      group = new THREE.Group();
      scene = new THREE.Scene();
      // let axes = new THREE.AxisHelper(10000);
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
      // const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      // pmremGenerator.compileCubemapShader();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.sortObjects = true;
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      let demo = document.getElementsByClassName("modelthree")[0];
      this.renderer.domElement.id = "model";
      demo.appendChild(this.renderer.domElement);
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      demo.appendChild(this.stats.domElement);
      // const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];
      // let hdrCubeMap = new HDRCubeTextureLoader()
      //   .setPath('pano/')
      //   .load(hdrUrls, () => {
      //     hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);
      //     // scene.environment = hdrCubeRenderTarget.texture;
      //     hdrCubeMap.magFilter = THREE.LinearFilter;
      //     hdrCubeMap.needsUpdate = true;

      //   });
      // scene.background = hdrCubeMap;
      // let urls = [
      //   'pano/r.jpg',
      //   'pano/l.jpg',
      //   'pano/t.jpg',
      //   'pano/d.jpg',
      //   'pano/f.jpg',
      //   'pano/b.jpg'
      // ];
      // let cubeTexture = new THREE.CubeTextureLoader().load(urls);
      // scene.background = cubeTexture;

      let loader = new GLTFLoader();
      loader.setPath('model/')
      loader.load('DJ01.glb', (gltf) => {
        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
          }

        });
        console.log(gltf.scene)
        park = gltf.scene;
        gltf.scene.scale.multiplyScalar(1);//模型大小
        scene.add(gltf.scene);
      });
      loader.load('Floor01.glb', (gltf) => {
        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            // child.material.envMap = hdrCubeRenderTarget.texture;
            // console.log(child.material.envMapIntensity)
          }

        });
        // gltf.scene.rotation.y = this.models[key].rotation;
        // gltf.scene.position.set(0,0,0);
        console.log(gltf.scene)
        gltf.scene.scale.multiplyScalar(1.5);//模型大小
        building = gltf.scene;
        building1 = building.clone();
        building2 = building.clone();
        groups.add(building1);
        groups.add(building2);
        groups.add(building);
        groupone.add(building);
        console.log(groups);
      });

      for (let i = 0; i < this.objs.length; i++) {
        this.main(this.objs[i], { x: 0, y: 150, z: 0 });
      }

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);
      // 定向光
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
      directionalLight1.shadow = false;
      directionalLight1.position.set(0, 1000, 0);
      scene.add(directionalLight1);
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

      this.controls.target = new THREE.Vector3(0, 0, 0)

      // const raycaster = new THREE.Raycaster()
      // let mouse = new THREE.Vector2()
      // let intersects = null
      // this.renderer.domElement.addEventListener('click', (event) => {
      //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      //   raycaster.setFromCamera(mouse, this.camera);
      //   intersects = raycaster.intersectObject(scene, true);
      //   if (intersects.length > 0) {
      //     console.log(intersects[0].object.parent.name);
      //     // if (intersects[0].object.parent.name !== "Warehouse1") {
      //     //   return
      //     // }
      //     // let boxMaxY = new THREE.Box3().setFromObject(intersects[0].object).max.y
      //     // let distance = boxMaxY + 4000
      //     // let angel = Math.PI / 5
      //     // let position = {
      //     //   x: intersects[0].object.parent.position.x + Math.cos(angel) * distance,
      //     //   y: intersects[0].object.parent.position.y + 2000,
      //     //   z: intersects[0].object.parent.position.z + Math.sin(angel) * distance
      //     // }

      //     // let tween = new TWEEN.Tween(this.camera.position).to(position, 2000);
      //     // let tween1 = new TWEEN.Tween(this.controls.target).to(intersects[0].object.parent.position, 2000)

      //     // this.controls.enabled = false;
      //     // tween.onComplete(() => {
      //     //   this.controls.enabled = true;
      //     //   scene.remove(park);
      //     //   scene.add(building);
      //     //   scene.add(group);
      //     //   building.position.copy(intersects[0].object.parent.position);
      //     //   this.changeposition(intersects[0].object.parent.position);
      //     //   console.log(this.camera.position)
      //     // })

      //     // tween.start()
      //     // tween1.start()
      //   }
      // });
      const geometry = new THREE.SphereGeometry(50000, 600, 400);
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(- 1, 1, 1);

      const texture = new THREE.TextureLoader().load('./pano/hdri02.jpg');
      const material = new THREE.MeshBasicMaterial({ map: texture });

      const mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);

      this.controls.maxDistance = 30000;
      // this.createLine();
      // this.createPoint();

    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(scene, this.camera);
      this.stats.update();
      // this.renderer.toneMappingExposure = 1;
      this.controls.update();
      // console.log(this.controls.maxZoom)
      TWEEN.update()
    },
    change(index) {
      if (this.count1 == index) {
        return
      }
      this.count1 = index;
      if (index == 0) {
        this.changeposition(this.newPosition, -450);
        scene.add(group);
      } else if (index == 1) {
        this.changeposition(this.newPosition);
        scene.add(group);
      } else if (index == 2) {
        this.changeposition(this.newPosition, 550);
        scene.add(group);
      }
    },
    changeButton(item, index) {
      if (this.count == index) {
        return
      }
      this.count = index;
      park.traverse((child) => {
        if (child instanceof Object && child.name == item) {
          let boxMaxY = new THREE.Box3().setFromObject(child).max.y
          let distance = boxMaxY + 4000
          let position = {
            x: child.position.x + distance,
            y: child.position.y + 2000,
            z: child.position.z
          }

          let tween = new TWEEN.Tween(this.camera.position).to(position, 2000);
          let tween1 = new TWEEN.Tween(this.controls.target).to(child.position, 2000)
          this.controls.enabled = false;
          tween.onStart(() => {
            scene.add(park);
            scene.remove(groupone);
            scene.remove(groups);
            scene.remove(group);
          })
          tween.onComplete(() => {
            this.controls.enabled = true;
            scene.remove(park);
            if (index >= 8) {
              this.flat = true;
              this.count1 = -1;
              scene.add(groups);
              scene.add(groupone);
              building.position.copy(child.position);
              building1.position.copy(child.position);
              building1.position.y += 500;
              building2.position.copy(child.position);
              building2.position.y -= 500;
              this.newPosition = child.position;
            } else if (index < 8) {
              this.flat = false;
              scene.add(group);
              scene.add(groupone);
              building.position.copy(child.position);
              this.changeposition(child.position);
            }
          })
          tween.start()
          tween1.start()
        }
      })
      // let tween1 = new TWEEN.Tween(this.controls.target).to({ x: 0, y: 0, z: 0 }, 3000);
      // let tween = new TWEEN.Tween(this.camera.position).to({ x: 20000, y: 10000, z: 0 }, 3000);
      // this.controls.enabled = false;
      // tween.onComplete(() => {
      //   this.controls.enabled = true;
      //   scene.remove(group);
      //   scene.remove(building);
      //   scene.add(park);
      //   console.log(this.camera.position)
      // })
      // tween.start()
      // tween1.start()
    },
    back() {
      let tween1 = new TWEEN.Tween(this.controls.target).to({ x: 0, y: 0, z: 0 }, 3000);
      let tween = new TWEEN.Tween(this.camera.position).to({ x: 20000, y: 10000, z: 0 }, 3000);
      this.controls.enabled = false;
      tween.onComplete(() => {
        this.count1 = -1;
        this.count = -1;
        this.flat = false;
        this.controls.enabled = true;
        scene.add(park);
        scene.remove(groupone);
        scene.remove(groups);
        scene.remove(group);
      })
      tween.start()
      tween1.start()
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
  left: 5%;
}

.office {
  position: absolute;
  display: flex;
  flex-direction: column;
  float: left;
  bottom: 15%;
  left: 5%;
}

.floor {
  position: absolute;
  display: flex;
  float: left;
  bottom: 10%;
  transform: translate(-50%);
  left: 50%;
}

.floorc {
  width: 120px;
  height: 50px;
  text-align: center;
  color: white;
  line-height: 50px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  margin-left: 10px;
}

.back {
  width: 120px;
  height: 50px;
  text-align: center;
  color: white;
  line-height: 50px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  position: absolute;
  bottom: 38%;
  left: 12%;
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
