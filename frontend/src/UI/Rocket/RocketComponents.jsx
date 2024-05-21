import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const RocketComponent = () => {
    const mountRef = useRef(null);
    const groupRef = useRef(null);
    const rocketModelRef = useRef(null);
    const hoveredRef = useRef(false);
    const rotationSpeedRef = useRef(0.01);
    const rendererRef = useRef(null);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 100);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Настройка освещения
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
        directionalLight.position.set(0, -10, 100).normalize();
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1);
        pointLight1.position.set(50, 50, 50);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
        pointLight2.position.set(-50, -50, -50);
        scene.add(pointLight2);

        const loader = new GLTFLoader();

        const handleLoadedModel = (gltf) => {
            if (rocketModelRef.current) {
                groupRef.current.remove(rocketModelRef.current);
            }

            const rocket = gltf.scene;
            rocket.position.set(0, 0, 0);
            rocketModelRef.current = rocket;

            // Создание градиента
            rocket.traverse((child) => {
                if (child.isMesh) {
                    const geometry = child.geometry;
                    const colors = [];
                    const positions = geometry.attributes.position.array;

                    for (let i = 0; i < positions.length; i += 3) {
                        const y = positions[i + 1];
                        let color;
                        if (y < 0) {
                            color = new THREE.Color(0xffffff); 
                        } else if (y < 1) {
                            color = new THREE.Color(0xffffff); 
                        } else {
                            color = new THREE.Color(0xBADDFE); 
                        }
                        colors.push(color.r, color.g, color.b);
                    }

                    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                    child.material = new THREE.MeshStandardMaterial({
                        vertexColors: true,
                        emissive: 0x000000,
                        metalness: 0.3,
                        roughness: 0.5
                    });
                }
            });

            groupRef.current = new THREE.Group();
            groupRef.current.add(rocketModelRef.current);
            scene.add(groupRef.current);

            // Позиционирование и масштабирование в зависимости от ширины экрана
            if (window.innerWidth <= 1024) {
                rocket.scale.set(0.9, 0.9, 0.9);
                groupRef.current.position.x += 45;
                groupRef.current.position.y = 50;
            } else {
                rocket.scale.set(0.18, 0.18, 0.18);
                groupRef.current.position.x += 120;
                groupRef.current.position.y = 35;
            }
            groupRef.current.rotation.z = Math.PI / 2.5;
        };

        loader.load('/assets/rocket_2.gltf', handleLoadedModel, undefined, (error) => {
            console.error('Ошибка загрузки GLTF:', error);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            hoveredRef.current = rocketModelRef.current ? raycaster.intersectObject(rocketModelRef.current, true).length > 0 : false;
        }

        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            if (groupRef.current) {
                if (hoveredRef.current) {
                    rotationSpeedRef.current = Math.min(rotationSpeedRef.current + 0.5, 0.15);
                } else {
                   rotationSpeedRef.current = Math.max(rotationSpeedRef.current - 0.001, 0.01);
                }
                if (rocketModelRef.current) {
                    rocketModelRef.current.rotation.y += rotationSpeedRef.current;
                }
            }
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            scene.remove(groupRef.current);
            groupRef.current = null;
        };
    }, []);

    return (
        <div className="rocket_image">
            <div ref={mountRef} />                   
        </div>
    );
};

export default RocketComponent;
