import "./styles.css";
import { useEffect, useRef } from "react";
import Matter from "matter-js";
import PathSeg from "pathseg";

export default function MatterTest() {
	const Engine = Matter.Engine;
	const Render = Matter.Render;
	const Runner = Matter.Runner;

	const World = Matter.World;
	const Composite = Matter.Composite;

	const Bodies = Matter.Bodies;
	const Body = Matter.Body;

	const Svg = Matter.Svg;
	const Vector = Matter.Vector;
	const Vertices = Matter.Vertices;
	const MouseConstraint = Matter.MouseConstraint;
	const Mouse = Matter.Mouse;

	let bodies = [];
	let bodies2 = [];

	var head;
	var letters;

	var head2;
	var letters2;

	useEffect(() => {
		head = document.querySelector(".text-to-canvas h1");
		head2 = document.querySelector(".text-to-canvas h2");
		
		letters = head.querySelectorAll("span");
		letters2 = head2.querySelectorAll("span");

		let engine = Engine.create();
		let world = engine.world;

		engine.world.wireframes = false;

		// create renderer
		var render = Render.create({
			element: document.body,
			engine: engine,
			options: {
				bounds: true,
				showBounds: false,
				background: "transparent",
				wireframes: false,
				width: 400,
				height: 300
				// showAngleIndicator: true
			}
		});

		Render.run(render);

		var runner = Runner.create();
		Runner.run(runner, engine);

		// BORDERS // TOP / BOTTOM / LEFT / RIGHT

		//벽 생성 
		World.add(world, [Bodies.rectangle(12.5, 12.5, 800, 25, { isStatic: true })]);
		World.add(world, [Bodies.rectangle(12.5, 287.5, 800, 25, { isStatic: true })]);
		World.add(world, [Bodies.rectangle(12.5, 12.5, 25, 600, { isStatic: true })]);
		World.add(world, [Bodies.rectangle(387.5, 12.5, 25, 600, { isStatic: true })]);


		let categories = {
			catMouse: 0x0002,
			catBody: 0x0004
		};

		// LETTRES ENSEMBLE

		for (let i = 0; i < letters2.length; i++) {
			bodies2.push(
				Bodies.rectangle(
					head2.offsetLeft +
					letters2[i].offsetLeft +
					letters2[i].offsetWidth * 0.5 +
					10,
					150 - i * 2,
					letters2[i].offsetWidth,
					letters2[i].offsetHeight,
					{
						isSleeping: false,
						density: 1,
						restitution: 0.7,
						frictionAir: 0.0001,
						collisionFilter: {
							category: categories.catBody
						},
						render: {
							opacity: 0
						}
					}
				)
			);
		}


		// LETTRES SILLAGES
		for (let i = 0; i < letters.length; i++) {
			bodies.push(
				Bodies.rectangle(
					head.offsetLeft + letters[i].offsetLeft + letters[i].offsetWidth * 0.5,
					// head.offsetTop + letters[i].offsetTop + letters[i].offsetWidth * 0.5,
					180 - i * 2,
					letters[i].offsetWidth,
					letters[i].offsetHeight,
					{
						isSleeping: false,
						density: 1,
						restitution: 0.7,
						frictionAir: 0.0001,
						collisionFilter: {
							category: categories.catBody
						},
						render: {
							opacity: 0
						}
					}
				)
			);
		}

		bodies.push(Bodies.circle(160, 90, 15));
		bodies.push(Bodies.circle(150, 200, 25));
		bodies.push(Bodies.circle(240, 190, 20));
		bodies.push(Bodies.circle(90, 60, 25));
		bodies.push(Bodies.circle(50, 140, 20));
		bodies.push(Bodies.circle(300, 80, 25));
		bodies.push(Bodies.circle(200, 180, 18));
		World.add(world, bodies);
		World.add(world, bodies2);

		//마우스 컨트롤 추가
		var mouse = Mouse.create(render.canvas);
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

		// keep the mouse in sync with rendering
		render.mouse = mouse;

		// fit the render viewport to the scene
		Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: 400, y: 300 }
		});

		// for (var i = 0; i < letters.length; i++) {
		//   letters[i].style.left =
		//     bodies[i].position.x - letters[i].offsetWidth * 0.5 + "px";
		//   letters[i].style.top =
		//     bodies[i].position.y - letters[i].offsetWidth * 0.5 + "px";
		// }

		updatePosition();
	}, []);

	function updatePosition() {
		requestAnimationFrame(updatePosition);

		// SILLAGES
		for (var i = 0; i < letters.length; i++) {
			letters[i].style.left = bodies[i].position.x - letters[i].offsetWidth * 0.5 + "px";
			letters[i].style.top = bodies[i].position.y - letters[i].offsetWidth * 0.5 + "px";
			// console.log(bodies[i].position.x - letters[i].offsetWidth * 0.5);
			// letters[i].style.transform =
			//   "translate(" +
			//   (bodies[i].position.x - letters[i].offsetWidth * 0.5) +
			//   "px" +
			//   (bodies[i].position.y - letters[i].offsetWidth * 0.5) +
			//   "px)";
			// letters[i].style.transform = "translate('20px','30px')";
			// WHYYYYYYYYY

			letters[i].style.transform = "rotate(" + bodies[i].angle + "rad)";
		}

		// ENSEMBLE
		for (var j = 0; j < letters2.length; j++) {
			letters2[j].style.left = bodies2[j].position.x - letters2[j].offsetWidth * 0.5 + "px";
			letters2[j].style.top = bodies2[j].position.y - letters2[j].offsetWidth * 0.5 + "px";
			letters2[j].style.transform = "rotate(" + bodies2[j].angle + "rad)";
		}
	}

	return (
		<div class="text-to-canvas">
			<h2>
				<span>E</span>
				<span>L</span>
				<span>B</span>
				<span>M</span>
				<span>E</span>
				<span>S</span>
				<span>N</span>
				<span>E</span>
			</h2>
			<h1>
				<span>S</span>
				<span>E</span>
				<span>G</span>
				<span>A</span>
				<span>L</span>
				<span>L</span>
				<span>I</span>
				<span>S</span>
			</h1>
		</div>
	)
}