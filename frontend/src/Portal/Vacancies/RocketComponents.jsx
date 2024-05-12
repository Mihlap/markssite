import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const RocketComponent = () => {
    const mountRef = useRef(null);
    const rocketModelRef = useRef(null);
    const hoveredRef = useRef(false); // используем useRef для отслеживания состояния наведения
    const rotationSpeedRef = useRef(0.01); // начальная скорость вращения также храним в useRef

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 100);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor("#F6F6F6");
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(25, 50, 25);
        scene.add(pointLight);

        const loader = new GLTFLoader();
        loader.load('/assets/rocket.gltf', gltf => {
            const rocket = gltf.scene;
            rocket.position.set(0, 0, 0);
            rocket.scale.set(0.2, 0.2, 0.2);
            scene.add(rocket);
            rocketModelRef.current = rocket;
        }, undefined, error => {
            console.error('Error loading GLTF:', error);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = rocketModelRef.current ? raycaster.intersectObject(rocketModelRef.current, true) : [];
            hoveredRef.current = intersects.length > 0;
        }

        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            if (rocketModelRef.current) {
                if (hoveredRef.current) {
                    rotationSpeedRef.current = Math.min(rotationSpeedRef.current + 0.005, 0.05);
                } else {
                    rotationSpeedRef.current = Math.max(rotationSpeedRef.current - 0.005, 0.01);
                }
                rocketModelRef.current.rotation.y += rotationSpeedRef.current;
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            mountRef.current.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
        };
    }, []);

    


    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default RocketComponent;


// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const RocketComponent = () => {
//   const mountRef = useRef(null);
//   const rotationSpeedRef = useRef(0.01); // Используем useRef для скорости вращения
//   const rocketRef = useRef();

//   useEffect(() => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
//     camera.position.z = 3;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setClearColor("#F6F6F6");
//     renderer.setSize(width, height);
//     mountRef.current.appendChild(renderer.domElement);

//     const light = new THREE.PointLight(0xffffff, 1.5);
//     light.position.set(0, 0, 0);
//       scene.add(light);
      
//           // Создание тела ракеты
//     const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
//     const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//     const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
//     body.position.set(0, 1, 0); // Позиционируем тело ракеты

//     // Создание носовой части ракеты
//     const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
//     const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//     const cone = new THREE.Mesh(coneGeometry, coneMaterial);
//     cone.position.set(0, 2, 0); // Позиционируем носовую часть

//     // Создание сопла ракеты
//     const nozzleGeometry = new THREE.CylinderGeometry(0.5, 0.3, 0.5, 32);
//     const nozzleMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
//     const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
//     nozzle.position.set(0, 0, 0); // Позиционируем сопло ракеты

//     // Добавление всех частей к сцене
//     scene.add(body);
//     scene.add(cone);
//     scene.add(nozzle);

//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
//     const rocket = new THREE.Mesh(geometry, material);
//     rocket.position.set(0, 1, 0);
//     scene.add(rocket);
//     rocketRef.current = rocket;
    

//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();

//     function onMouseMove(event) {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects([rocket]);

//       // Изменяем скорость вращения сразу, используя ref
//       rotationSpeedRef.current = intersects.length > 0 ? 0.05 : 0.01;
//     }

//     window.addEventListener('mousemove', onMouseMove);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       if (rocketRef.current) {
//         rocketRef.current.rotation.y += rotationSpeedRef.current; // Используем значение из ref
//       }
//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       mountRef.current.removeChild(renderer.domElement);
//       scene.clear();
//       renderer.dispose();
//     };
//   }, []);

//   return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
// };

// export default RocketComponent;

