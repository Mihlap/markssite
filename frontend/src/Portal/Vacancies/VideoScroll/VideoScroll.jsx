import React, { useLayoutEffect, useRef }  from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

import styles from "./VideoScroll.module.scss";

import videoFile from "../icons/video/mock-video.mp4";

const VideoScroll = () => {
	const videoRef = useRef(null);

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.VideoScroll}`,
				start: 'top 590px',
				end:'bottom top',
				// markers: true,
			},
		});

		tl.fromTo(videoRef.current,
			{
				height: '0',
				width: '0',
			},
			{
				height: '100vh',
				width:  '100%',
			}
		)
	}, [videoRef]);


	return (
		<>
			<section className={styles.VideoScroll}>
				<video
					ref={videoRef}
					playsInline
					autoPlay
					muted
					loop
					className={styles.VideoScroll__video}
				>
				<source src={videoFile} type="video/mp4" />
				</video>
			</section>
		</>
	);
};

export default VideoScroll;