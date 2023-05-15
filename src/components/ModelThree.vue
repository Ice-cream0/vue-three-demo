<template>
  <div class="modelthree">
    <div class="back" @click="back">返回主视角</div>
    <div class="workshop">
      <div class="bg" :class="count == index ? 'bgactive' : ''" v-for="(item, index) in house"
        @click="changeButton(item, index)">
        {{ index + 1 }}#车间</div>
    </div>
    <div class="office">
      <div class="bg" :class="count == index + 9 ? 'bgactive' : ''" v-for="(item, index) in bighouse"
        @click="changeButton(item, index + 9)">
        {{ index + 7 }}号办公楼</div>
    </div>
    <div>
      <div class="floor" v-show="flat">
        <div class="floorc" :class="count1 == index ? 'bgactive' : ''" v-for="(item, index) in floor"
          @click="change(index)">
          {{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three/build/three.module'
import TWEEN from "tween.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { getJson } from "../api/axios.js";
let scene, building, park, group, groups, groupone, title;
var img;
export default {
  name: "ModelThree",
  data() {
    return {
      flat: false,
      floor: ["1F", "2F", "3F"],
      newPosition: null,
      house: [
        "CF089",
        "CF078",
        "CF067",
        "CF056",
        "CF045",
        "CF034",
        "CF023",
        "CF012",
        "CF1213",
      ],
      bighouse: [
        "CF1718",
        "CF1617",
        "CF1516",
        "CF1415",
      ],

      renderer: null,

      camera: null,

      controls: null,

      stats: null,

      mesh: null,

      control: null,

      count: -1,

      count1: -1,

    };
  },
  beforeCreate() {
    this.$nextTick(() => {
      getJson("./1.json").then((res) => {
        // console.log(Object.keys(res.data))
        this.CompanyName = Object.keys(res.data[0]);
        this.spritepictures = res.data[0];
        this.CompanyNameBig = Object.keys(res.data[1]);
        this.spritepicturesBig = res.data[1];
        // console.log(this.spritepicturesBig["10号办公楼"
        // ], this.CompanyNameBig)
        // for (let key in this.spritepicture) {
        //   console.log(this.spritepicture[key])
        // }
      })
    });
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    createpicture(position) {
      let sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.TextureLoader().load(
            '1.png'
          ), //设置精灵纹理贴图
          transparent: true, //开启透明(纹理图片png有透明信息),
          depthTest: true,
        })
      );
      sprite.scale.set(40, 40, 40); //精灵大小
      sprite.position.set(position.x - 70, position.y, position.z); //精灵位置
      group.add(sprite);

    },
    main(name, position1, position2) {
      let c = this.createLabel(name);
      let texture = new THREE.CanvasTexture(c.canvas);
      let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(c.width / 2.2, c.height / 2.2, 0);
      sprite.position.set(position2.x + position1.x, position2.y + 50, position2.z + position1.z);//1600*650
      group.add(sprite);
    },
    title(name, position) {
      let c = this.createLabel(name, 1);
      let texture = new THREE.CanvasTexture(c.canvas);
      let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(c.width / 1.5, c.height / 1.5, 0);
      sprite.position.set(position.x - 400, position.y + 400, position.z);
      title.add(sprite);
      scene.add(title);
    },
    // changeposition(position) {
    //   for (let i = 0; i < group.children.length; i++) {
    //     let positions = new THREE.Vector3(position.x + Math.random() * 650 - 325, position.y, position.z + Math.random() * 1600 - 800);
    //     group.children[i].position.set(positions.x, position.y + 80, positions.z);
    //   }
    // },
    createLabel(ccc, flat) {
      const name = ccc;
      const canvas = document.createElement("canvas");
      // let rg = Math.floor(Math.random() * 256); // 生成 0 到 255 之间的随机数
      // let gg = Math.floor(Math.random() * 256);
      // let bg = Math.floor(Math.random() * 256);
      // const color = "rgb(" + rg + ", " + gg + ", " + bg + ")";0x0000FF
      const color = "white";
      const fontSize = 50;
      const r = fontSize / 2;
      const margin = fontSize / 2;
      const textMarginleft = 10;
      const height = fontSize * 2;
      const width =
        name.length * fontSize + 2 * margin + r * 2 + textMarginleft;
      canvas.height = height;
      canvas.width = width;
      let ctx = canvas.getContext("2d");
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
      //绘制图片
      if (flat != 1) {
        ctx.drawImage(img, 0, 25, 50, 50)
      }
      ctx.fillText(name, margin + r + textMarginleft, height / 2);
      return {
        height,
        width,
        canvas,
      };
    },
    init() {
      img = new Image();
      img.src = './1.png'
      title = new THREE.Group();
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

      this.renderer.setSize(1920, 1080);
      let demo = document.getElementsByClassName("modelthree")[0];
      this.renderer.domElement.id = "model";
      demo.appendChild(this.renderer.domElement);
      // this.stats = new Stats();
      // this.stats.domElement.style.position = 'absolute';
      // this.stats.domElement.style.top = '0px';
      // demo.appendChild(this.stats.domElement);
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
      scene.background = new THREE.Color('#2c3e50');

      let loader = new GLTFLoader();
      loader.setPath('model/')
      loader.load('DJ01.glb', (gltf) => {
        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
          }

        });
        // console.log(gltf.scene)
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
        // console.log(gltf.scene)
        gltf.scene.scale.multiplyScalar(1.5);//模型大小
        building = gltf.scene;
        groupone.add(building);
        // console.log(groups);
      });

      // scene.add(title);
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      // 定向光
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.3);
      directionalLight1.shadow = false;
      directionalLight1.position.set(0, 1000, 0);
      scene.add(directionalLight1);
      // const directionalLight2 = new THREE.SpotLight(0xFFFFFF, 1.8);
      // directionalLight2.position.set(20000, 10000, 0);
      // directionalLight2.intensity = 3;
      // directionalLight2.distance = 200000
      // directionalLight2.angle = 0.2;
      // const directionalLight3 = new THREE.SpotLightHelper(directionalLight2, 50, 0xFFFFFF);

      const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1.3);
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

      // const texture = new THREE.TextureLoader().load('./pano/hdri02.jpg');
      // const material = new THREE.MeshBasicMaterial({ map: texture });

      // const mesh = new THREE.Mesh(geometry, material);

      // scene.add(mesh);

      this.controls.maxDistance = 30000;

    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(scene, this.camera);
      // this.stats.update();
      // this.renderer.toneMappingExposure = 1;
      this.controls.update();
      // console.log(this.controls.maxZoom)
      TWEEN.update()
    },
    change(index) {
      if (this.count1 == index) {
        return
      }
      this.clearGroup(title);
      this.clearGroup(group);
      scene.remove(group);
      scene.remove(title);
      let name = Object.keys(this.spritepicturesBig[this.CompanyNameBig[this.count - 9]]);
      this.title(name[index], this.newPosition);
      let spritepicture = this.spritepicturesBig[this.CompanyNameBig[this.count - 9]][name[index]];
      for (let key in spritepicture) {
        this.main(spritepicture[key].title, { x: spritepicture[key].x, y: 150, z: spritepicture[key].z }, this.newPosition);
      }
      this.count1 = index;
      scene.add(group);
    },
    clearGroup(group) {
      // 释放 几何体 和 材质
      const clearCache = (item) => {
        item.geometry.dispose();
        item.material.dispose();
      };

      // 递归释放物体下的 几何体 和 材质
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
      scene.remove(group);
    },
    changeButton(item, index) {
      if (this.count == index || this.controls.enabled == false) {
        // console.log(1);
        return
      }
      this.count = index;
      let spritepicture;
      if (this.count >= 9) {
        let name = Object.keys(this.spritepicturesBig[this.CompanyNameBig[this.count - 9]]);
        // console.log(name)
        spritepicture = this.spritepicturesBig[this.CompanyNameBig[this.count - 9]][name[0]];
        // console.log(spritepicture)
      } else {
        spritepicture = this.spritepictures[this.CompanyName[this.count]];
        // console.log(spritepicture)
      }
      this.clearGroup(group);
      park.traverse((child) => {
        if (child instanceof Object && child.name == item) {
          let boxMaxY = new THREE.Box3().setFromObject(child).max.y
          let distance = boxMaxY + 2000
          let position = {
            x: child.position.x + distance,
            y: child.position.y + 2000,
            z: child.position.z
          }
          for (let key in spritepicture) {
            this.main(spritepicture[key].title, { x: spritepicture[key].x, y: 150, z: spritepicture[key].z }, child.position);
          }
          let tween = new TWEEN.Tween(this.camera.position).to(position, 2000);
          let tween1 = new TWEEN.Tween(this.controls.target).to(child.position, 2000)

          tween.onStart(() => {
            scene.add(park);
            this.controls.enabled = false;
            this.clearGroup(title);
            scene.remove(groupone);
            scene.remove(group);
          })
          tween.onComplete(() => {
            this.controls.enabled = true;
            scene.remove(park);
            if (index >= 9) {
              this.flat = true;
              this.count1 = -1;
              scene.add(groupone);
              building.position.copy(child.position);
              this.newPosition = child.position;
              this.change(0);
              this.count1 = 0;
            } else if (index < 9) {
              this.flat = false;
              scene.add(group);
              scene.add(groupone);
              building.position.copy(child.position);
              // this.changeposition(child.position);
              this.title(this.CompanyName[this.count], child.position);
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
      if (this.controls.enabled == false) {
        return
      }
      let tween1 = new TWEEN.Tween(this.controls.target).to({ x: 0, y: 0, z: 0 }, 2000);
      let tween = new TWEEN.Tween(this.camera.position).to({ x: 20000, y: 10000, z: 0 }, 2000);
      tween.onComplete(() => {
        this.controls.enabled = false;
        this.count1 = 0;
        this.count = -1;
        this.clearGroup(title);
        this.flat = false;
        this.controls.enabled = true;
        scene.add(park);
        scene.remove(groupone);
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
  left: 1%;
}

.office {
  position: absolute;
  display: flex;
  flex-direction: column;
  float: left;
  top: 10%;
  left: 7%;
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
  width: 96px;
  height: 40px;
  text-align: center;
  color: white;
  line-height: 40px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  margin-left: 10px;
}

.back {
  width: 96px;
  height: 40px;
  text-align: center;
  color: white;
  line-height: 40px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  position: absolute;
  top: 10%;
  left: 13%;
  margin-top: 10px;
}

.bg {
  width: 96px;
  height: 40px;
  text-align: center;
  color: white;
  line-height: 40px;
  background-image: url('../assets/button/button01.png');
  background-size: 100% 100%;
  margin-top: 10px;
}

.bgactive {
  background-image: url('../assets/button/button03.png');
}
</style>
