import "./NewTextApp.css";
import { useState, useEffect, useRef } from "react";
import Matter from "matter-js";

export default function NewTextApp() {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);

	const Engine = Matter.Engine;
	const Render = Matter.Render;
	const Runner = Matter.Runner;
	const World = Matter.World;
	const Bodies = Matter.Bodies;
	const Composite = Matter.Composite;
	const Composites = Matter.Composites;
	const Mouse = Matter.Mouse;
	const MouseConstraint = Matter.MouseConstraint;
	const Events = Matter.Events;

	var ceil;
	var floor;
	var leftWall;
	var rightWall;

	useEffect(() => {

		const engine = Engine.create();
		const world = engine.world;

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

		// Run the renderer
		Render.run(render);


		var runner = Runner.create();
		Runner.run(runner, engine);


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

		Composite.add(world, mouseConstraint);
		//World.add(world, mouseConstraint);
		
		render.mouse = mouse;

		mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
		mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

		render.canvas.addEventListener('scroll', () => {
			console.log('scroll');
			window.scrollTo(0, 100);
		});

		// Run the engine
		Engine.run(engine);

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

		// canvasRef.current.addEventListener('wheel', ()=>{
		// 	console.log('here')
		// 	//window.scrollTo(window.scrollX, window.scrollY + 100)
		// });
		//window.addEventListener('wheel', ()=>{console.log(mouseConstraint.mouse.wheelDelta)});

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div>
			<div ref={containerRef} style={{
				border:'solid red 1px',
				position:'absolute',
				top:0,
				left:0,
				width:'100%',
				height:'100%',
				//pointerEvents:'none',
				//overflow:'scroll'
			}}>
				<canvas id="id_canvas" ref={canvasRef} />
			</div>
			<div style={{width:'500px', height:'1000px'}}>
				<canvas style={{border:'solid red 4px',
					marginTop:'1000px',
					width:'300px',
					height:'300px',
					'pointerEvents':'none'
				}}>
				</canvas>
				<button onClick={()=>{window.scrollTo(0,0)}}>top</button>
			</div>
		</div>
	)
}