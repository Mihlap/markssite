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

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(25, 50, 25);
        scene.add(pointLight);

        const loader = new GLTFLoader();

        if (window.innerWidth <= 1024) {
            loader.load('/assets/scene.gltf', gltf => {
                const rocket = gltf.scene;
                rocket.position.set(0, 0, 0);
                rocket.scale.set(130, 130, 130);
                rocketModelRef.current = rocket;        
    
                groupRef.current = new THREE.Group();
                groupRef.current.add(rocketModelRef.current);
                if (groupRef.current) {
                    groupRef.current.position.x += 45;
                    groupRef.current.position.y = 50;
                }
                groupRef.current.rotation.z = Math.PI / 2.5;
                scene.add(groupRef.current);           
            }, undefined, error => {
                console.error('Ошибка загрузки GLTF:', error);
            })
        } else {
            loader.load('/assets/scene.gltf', gltf => {
                const rocket = gltf.scene;
                rocket.position.set(0, 0, 0);
                rocket.scale.set(200, 200, 200);
                rocketModelRef.current = rocket;        
    
                groupRef.current = new THREE.Group();
                groupRef.current.add(rocketModelRef.current);
                if (groupRef.current) {
                    groupRef.current.position.x += 120;
                    groupRef.current.position.y = 35;
                }
                groupRef.current.rotation.z = Math.PI / 2.5;
                scene.add(groupRef.current);           
            }, undefined, error => {
                console.error('Ошибка загрузки GLTF:', error);
            })
        }
      
        

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
                    rotationSpeedRef.current += 0.005;
                } else {
                   rotationSpeedRef.current = Math.max(rotationSpeedRef.current - 0.01, 0.01);
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
            }
          renderer.dispose();
        };
    }, []);

    return (
        <div className="rocket_image">
            <div ref={mountRef} />                   
        </div>
    );
};

export default RocketComponent;





