import React, { useLayoutEffect, useRef }  from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

import styles from "./VideoScroll.module.scss";

import videoFile from "../icons/video/mock-video.mp4";

const VideoScroll = () => {
	const video = useRef(null);

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.VideoScroll}`,
				start: 'top 590px',
				end:'bottom top',
				markers: true,
				// scrub: true,
			},
		});

		tl.fromTo(video.current,
			{
				height: '0',
				width: '0',
        transition: 'all 0.3s ease-in-out'
			},
			{
				height: '100%',
				width: '100%',
			}
		)
	}, []);


	return (
		<>
			<section className={styles.VideoScroll}>
				<video
					ref={video}
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