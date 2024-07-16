import "./NewTextApp.css";
import { useState, useEffect, useRef } from "react";
import Matter from "matter-js";

export default function NewTextApp() {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);

	const engine = Matter.Engine.create();
	const world = engine.world;

	const Engine = Matter.Engine;
	const Render = Matter.Render;
	const Runner = Matter.Runner;
	const World = Matter.World;
	const Bodies = Matter.Bodies;
	const Mouse = Matter.Mouse;
	const MouseConstraint = Matter.MouseConstraint;

	var ceil;
	var floor;
	var leftWall;
	var rightWall;

	useEffect(() => {

		const render = Render.create({
			element: containerRef.current,
			canvas: canvasRef.current,
			engine: engine,
			options: {
				background: '#333',
				width: window.innerWidth,
				height: window.innerHeight,
				wireframes: false  // optional: makes shapes solid
			}
		});

		// Add some bodies
		const boxA = Bodies.circle(400, 300, 80, {
			isStatic: false,
		});
		const boxB = Bodies.circle(450, 150, 80);

		ceil = Bodies.rectangle(window.innerWidth / 2, 10, window.innerWidth, 20, { 
			isStatic: true,
			render: {
				fillStyle:'#555'
			}
		});
		floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { 
			isStatic: true,
			render: {
				fillStyle:'#555'
			}
		});
		leftWall = Bodies.rectangle(10, window.innerHeight / 2, 20, window.innerHeight, { 
			isStatic: true,
			render: {
				fillStyle:'#555'
			}
		});
		rightWall = Bodies.rectangle(window.innerWidth - 10, window.innerHeight / 2, 20, window.innerHeight, { 
			isStatic: true,
			render: {
				fillStyle:'#555'
			}
		});

		World.add(world, [boxA, boxB, floor, ceil, leftWall, rightWall]);

		// Run the engine
		Engine.run(engine);

		// Run the renderer
		Render.run(render);

		var runner = Runner.create();
		Runner.run(runner, engine);

		engine.gravity.y = 0.6;

		//마우스 컨트롤 추가
		var mouse = Mouse.create(render.canvas)
		var mouseConstraint = MouseConstraint.create(engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false
				}
			}
		});
		World.add(world, mouseConstraint);


		// Adjust canvas size on window resize
		const handleResize = () => {

			Render.stop(render);
			World.remove(world, [floor, ceil, leftWall, rightWall]);
			ceil = Bodies.rectangle(window.innerWidth / 2, 10, window.innerWidth, 20, { 
				isStatic: true,
				render: {
					fillStyle:'#555'
				}
			});
			floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { 
				isStatic: true,
				render: {
					fillStyle:'#555'
				}
			});
			leftWall = Bodies.rectangle(10, window.innerHeight / 2, 20, window.innerHeight, { 
				isStatic: true,
				render: {
					fillStyle:'#555'
				}
			});
			rightWall = Bodies.rectangle(window.innerWidth - 10, window.innerHeight / 2, 20, window.innerHeight, { 
				isStatic: true,
				render: {
					fillStyle:'#555'
				}
			});
			World.add(world, [floor, ceil, leftWall, rightWall]);
			render.canvas.width = window.innerWidth - 18;
			render.canvas.height = window.innerHeight;

			Render.run(render);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div ref={containerRef} style={{border:'solid red 1px'}}>
				<canvas ref={canvasRef} />
			</div>
			<div style={{width:'300px', height:'1000px'}}>

			</div>
		</>
	)
}