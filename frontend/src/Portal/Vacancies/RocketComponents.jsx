import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RocketComponent = () => {
    const mountRef = useRef(null);
    const rocketMeshRef = useRef(null);
    const frameIdRef = useRef(null);
    const rotationSpeedRef = useRef(0);

    useEffect(() => {
        let width = mountRef.current.clientWidth;
        let height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor("#F6F6F6"); 
        renderer.setSize(width, height);

       
        camera.position.z = 5;

        const textureLoader = new THREE.TextureLoader();
        const rocketTexture = textureLoader.load('/assets/rocket.png');

        // Создаем плоскость с текстурой ракеты
        const geometry = new THREE.PlaneGeometry(3, 5);
        const material = new THREE.MeshBasicMaterial({ map: rocketTexture });
        const rocketMesh = new THREE.Mesh(geometry, material);
        scene.add(rocketMesh);
        rocketMeshRef.current = rocketMesh;

        // Обработчики событий
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseMove(event) {
            // Расчет позиции мыши
            mouse.x = (event.clientX / width) * 2 - 1;
            mouse.y = -(event.clientY / height) * 2 + 1;

            // Обновляем луч для проверки пересечения с объектом
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0 && intersects[0].object === rocketMesh) {
                if (!frameIdRef.current) {
                    rotationSpeedRef.current = 0.01; // начальная скорость вращения
                    frameIdRef.current = setInterval(() => {
                        if (rotationSpeedRef.current < 0.1) { // максимальная скорость
                            rotationSpeedRef.current += 0.001; // ускорение
                        }
                        rocketMesh.rotation.z += rotationSpeedRef.current;
                    }, 16);
                }
            } else {
                clearInterval(frameIdRef.current);
                frameIdRef.current = null;
            }
        }

        mountRef.current.appendChild(renderer.domElement);
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Очистка
        return () => {
            clearInterval(frameIdRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            mountRef.current.removeChild(renderer.domElement);
            scene.remove(rocketMesh);
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default RocketComponent;
