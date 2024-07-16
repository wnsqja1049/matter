import "./NewTextApp.css";
import { useState, useEffect } from "react";

import {
	Engine,
	Render,
	RenderClones,
	Walls,
	Rectangle,
	Circle,
	Constraint,
	Vertices,
	Shape
} from "react-matter-js";
import Matter from "matter-js";

export default function TestApp() {

	const [ windowX, setWindowX ] = useState(600);
	const [ windowY, setWindowY ] = useState(400);

	useEffect(() => {
		window.addEventListener('resize', handleWindowSize);
		return () => window.removeEventListener('resize', handleWindowSize);
	}, []);

	const handleWindowSize = () => {
		setWindowX(window.innerWidth);
		setWindowY(window.innerHeight);
	};

	const width = 600;
	const height = 400;

	const engineOptions = {
		width: 800,
		height: 600,
		options: {
			gravity: { x: 0, y: 0.1 },
			render: {
				background: "red",
				wireframes: false
			}
		}
	};

	const Svg = Matter.Svg;
	const Bodies = Matter.Bodies;

	const A = 'M 18 114 46 114 70 37 81 74 57 74 51 94 87 94 93 114 121 114 81 7 57 7 z'

	const toVertices = path => {
		const pathEl = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		)
		pathEl.setAttribute('d', path)
		return Svg.pathToVertices(pathEl, 1)
	}

	return (
		<div style={{border:'solid red 4px', width: '100%', height: '100vh'}}>
			<Engine options={engineOptions}>
				<Render enableMouse options={engineOptions}>
					<Walls x={0} y={0} width={windowX} height={windowY} wallWidth={25} />
					<Circle clone x={100} y={100} radius={50} options={{
						isStatic: true,
						render: {
							fillStyle: '#555',
							lineWidth: 0.5,
						}
					}} />
					<Vertices x={150} y={100} width={100} height={100} vertexSets={toVertices(A)} />
					<Constraint>
						<Circle clone x={100} y={100} radius={50} />
						<Rectangle clone x={300} y={100} width={100} height={100} />
					</Constraint>
				</Render>
			</Engine>
			<button onClick={() => {setWindowX(windowX + 50)}}>button</button>
		</div>
	)
}