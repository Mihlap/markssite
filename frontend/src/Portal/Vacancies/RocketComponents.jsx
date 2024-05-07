// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// const RocketComponent = () => {
//     const mountRef = useRef(null);
//     const rocketMeshRef = useRef(null);
//     const frameIdRef = useRef(null);
//     const rotationSpeedRef = useRef(0);

//     useEffect(() => {
//         if (!mountRef.current) return; // Проверяем, существует ли элемент

//         let width = mountRef.current.clientWidth;
//         let height = mountRef.current.clientHeight;

//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setClearColor("#F6F6F6"); 
//         renderer.setSize(width, height);
//         camera.position.z = 5;

//         mountRef.current.appendChild(renderer.domElement); // Добавляем renderer в DOM

//         const textureLoader = new THREE.TextureLoader();
//         textureLoader.load('/assets/rocket.png', texture => {
//             // Создаем плоскость с текстурой ракеты после загрузки текстуры
//             const geometry = new THREE.PlaneGeometry(3, 5);
//             const material = new THREE.MeshBasicMaterial({ map: texture });
//             const rocketMesh = new THREE.Mesh(geometry, material);
//             scene.add(rocketMesh);
//             rocketMeshRef.current = rocketMesh;

//             // Теперь можно безопасно начать анимацию
//             animate();
//         }, undefined, error => {
//             console.error('An error happened during texture loading:', error);
//         });

//         const raycaster = new THREE.Raycaster();
//         const mouse = new THREE.Vector2();

//         const onMouseMove = (event) => {
//             if (!mountRef.current) return; // Проверяем, существует ли элемент

//             mouse.x = (event.clientX / width) * 2 - 1;
//             mouse.y = -(event.clientY / height) * 2 + 1;
//             raycaster.setFromCamera(mouse, camera);
//             const intersects = raycaster.intersectObjects(scene.children);

//             if (intersects.length > 0 && intersects[0].object === rocketMeshRef.current) {
//                 if (!frameIdRef.current) {
//                     rotationSpeedRef.current = 0.01; // начальная скорость вращения
//                     frameIdRef.current = setInterval(() => {
//                         if (rotationSpeedRef.current < 0.2) { // максимальная скорость
//                             rotationSpeedRef.current += 0.001; // ускорение
//                         }
//                         rocketMeshRef.current.rotation.z += rotationSpeedRef.current;
//                     }, 16);
//                 }
//             } else {
//                 clearInterval(frameIdRef.current);
//                 frameIdRef.current = null;
//             }
//         };

//         window.addEventListener('mousemove', onMouseMove);

//         const animate = () => {
//             if (!mountRef.current) return; // Проверяем, существует ли элемент
//             requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         };

//         return () => { // Очистка ресурсов
//             clearInterval(frameIdRef.current);
//             window.removeEventListener('mousemove', onMouseMove);
//             mountRef.current.removeChild(renderer.domElement);
//             scene.remove(rocketMeshRef.current);
//             if (rocketMeshRef.current) {
//                 rocketMeshRef.current.geometry.dispose();
//                 rocketMeshRef.current.material.dispose();
//             }
//         };
//     }, []);

//     return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
// };

// export default RocketComponent;
