import * as THREE from "./three/build/three.module.js";
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js"

var model = 0;

const longitudinalColorScheme = [
{cname:"Center Girder",Color:"blue"},
{cname:"Side Girder",Color:"#e74e1f"},
{cname:"Solid Floor",Color:"#ff15d9"},
{cname:"Bracket Floor",Color:"#c4ff8f"},
{cname:"Bildge Bracket",Color:"#00E725"},
{cname:"Inner Bottom Longitudinal",Color:"#e78916"},
{cname:"Bottom Longitudinal",Color:"#70D2e7"},
{cname:"Margin Plate",Color:"#806b00"},
{cname:"Flat Bar",Color:"#7182e7"},
{cname:"Flat Keel Plate",Color:"white"},
]
const transverseColorScheme = [
    {cname:"Center Girder",Color:"blue"},
    {cname:"Side Girder",Color:"#e74e1f"},
    {cname:"Solid Floor",Color:"#ff15d9"},
    {cname:"Pounding Bracket",Color:"#c4ff8f"},
    {cname:"Bildge Bracket",Color:"#00E725"},
    {cname:"Inner Bottom Frame",Color:"#e78916"},
    {cname:"Bottom Frame",Color:"#70D2e7"},
    {cname:"Margin Plate",Color:"#806b00"},
    {cname:"Flat Keel Plate",Color:"white"},
]

const scene = new THREE.Scene()

var canvas = document.getElementById("viewer")

var light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.setScalar(100);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

scene.background = new THREE.Color( "#555555" );
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(21,21,-7);


const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
const gridHelper = new THREE.GridHelper(400, 200 , "#000" ,"#676A6A");
  gridHelper.position.set(0,-2,0)
scene.add(gridHelper)

const loader = new GLTFLoader()

function load_function(param){
    loader.load(
        param,
        function (gltf) {
            scene.add(gltf.scene)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
}
if(model == 0){
    load_function("./models/glb/transeverse.glb")
}
else{
    load_function("./models/glb/longitudinal.glb")
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
console.log(scene.children)
animate()
document.getElementById("change").addEventListener("click",()=>{
    if(model == 0){
        model = 1
        scene.remove(scene.children[scene.children.length-1])
        load_function("./models/glb/longitudinal.glb")
        document.getElementById("details").innerHTML = ""
        for(var i = 0;i<longitudinalColorScheme.length;i++){
            var compDiv = document.createElement("div")
            compDiv.setAttribute("class","dt")
            var colorBox = document.createElement("div")
            colorBox.setAttribute("class","color")
            colorBox.style.background = longitudinalColorScheme[i].Color
            var cname = document.createElement("div")
            cname.setAttribute("class","component")
            cname.innerText = longitudinalColorScheme[i].cname
            compDiv.appendChild(colorBox)
            compDiv.appendChild(cname)
            document.getElementById("details").appendChild(compDiv)
        }
        document.getElementById("change").innerText = "Click to Visualize Transverse Framing"
    }
    else{
        model = 0
        scene.remove(scene.children[scene.children.length-1])
        load_function("./models/glb/transeverse.glb")
        document.getElementById("details").innerHTML = ""
        for(var i = 0;i<transverseColorScheme.length;i++){
            var compDiv = document.createElement("div")
            compDiv.setAttribute("class","dt")
            var colorBox = document.createElement("div")
            colorBox.setAttribute("class","color")
            colorBox.style.background = transverseColorScheme[i].Color
            var cname = document.createElement("div")
            cname.setAttribute("class","component")
            cname.innerText = transverseColorScheme[i].cname
            compDiv.appendChild(colorBox)
            compDiv.appendChild(cname)
            document.getElementById("details").appendChild(compDiv)
        }
        document.getElementById("change").innerText = "Click to Visualize Longitudinal Framing"
    }
})