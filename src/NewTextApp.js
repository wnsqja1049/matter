import "./NewTextApp.css";
import { useEffect } from "react";
import Matter from "matter-js";

export default function NewTextApp() {
	const Engine = Matter.Engine;
	const Render = Matter.Render;
	const Runner = Matter.Runner;

	const Bodies = Matter.Bodies;
	const Body = Matter.Body;
	const Svg = Matter.Svg;
	const Vertices = Matter.Vertices;
	const Composite = Matter.Composite;
	const World = Matter.World;
	const MouseConstraint = Matter.MouseConstraint;
	const Mouse = Matter.Mouse;

	const A = 'M 18 114 46 114 70 37 81 74 57 74 51 94 87 94 93 114 121 114 81 7 57 7 z'
	const U = 'M 16 7 16 82 C 17 125 101 125 99 82 L 99 82 99 7 74 7 74 82 C 73 100 41 99 41 82 L 41 82 41 7 16 7 z'
	const W = 'M 6 7 29 114 56 114 70 53 84 114 111 114 134 7 108 7 96 74 81 7 59 7 44 74 32 7 6 7 z'
	const N = 'M 16 114 16 7 42 7 80 74 80 7 106 7 106 114 80 114 42 48 42 114 16 114 z'
	const P = 'M 20 8 20 114 46 114 46 28 66 28 C 83 28 83 59 66 58 L 66 58 46 58 46 78 67 78 C 116 78 116 7 65 8 L 65 8 z'
	const D = 'M 19 7 57 7 C 120 13 120 109 57 114 L 57 114 45 114 45 94 56 94 C 85 93 86 30 56 27 L 56 27 45 27 45 114 19 114 19 7 z'
	const O = 'M 13 59 C 9 -12 109 -12 107 59 L 107 59 80 59 C 84 14 34 14 39 59 L 39 59 C 33 107 86 107 80 59 L 80 59 107 59 C 109 133 9 133 13 59 L 13 59 z'
	const R = 'M 21 114 21 7 64 7 C 122 8 105 67 85 69 L 85 69 107 113 80 113 61 76 47 76 47 56 65 56 C 84 57 84 26 65 27 L 65 27 47 27 47 114 z'


	const toVertices = path => {
		const pathEl = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		)
		pathEl.setAttribute('d', path)
		return Svg.pathToVertices(pathEl, 1)
	}

	const toBody = function (letter) {
		const vertices = toVertices(letter)

		return Bodies.fromVertices(0, 0, vertices, {
			render: {
				fillStyle: '#fff',
				strokeStyle: '#fff',
				lineWidth: 1,
			}
		})
	}

	const bodiesUpward = [
		toBody(U),
		toBody(P),
		toBody(W),
		toBody(A),
		toBody(R),
		toBody(D),
	]

	const bodiesDownward = [
		toBody(D),
		toBody(O),
		toBody(W),
		toBody(N),
		toBody(W),
		toBody(A),
		toBody(R),
		toBody(D),
	]

	const positionLeftBodies = () => {
		let leftY = 0
		bodiesUpward.forEach(body => {
			Body.setPosition(body, {
				x: 200,
				y: leftY,
			})
			Body.setAngle(body, -Math.PI / 2) // 90deg in Radians

			// Important to not have any "left-over" movement.
			Body.setVelocity(body, { x: 0, y: 0 })

			leftY -= 100
			console.log(leftY)
		})
	}

	const positionRightBodies = () => {
		let rightY = 600
		bodiesDownward.forEach(body => {
			Body.setPosition(body, {
				x: 200,
				y: rightY,
			})
			Body.setAngle(body, -Math.PI / 2) // 90deg in Radians

			// Important to not have any "left-over" movement.
			Body.setVelocity(body, { x: 0, y: 0 })

			rightY += 120
		})
	}


	// setInterval(() => {
	// 	positionLeftBodies()
	// 	positionRightBodies()
	// }, 6000)

	useEffect(() => {

		// Engine
		const leftEngine = Engine.create()
		const rightEngine = Engine.create()

		// World
		const leftWorld = leftEngine.world
		const rightWorld = rightEngine.world

		// Create the render instances with the same options
		const options = {
			wireframes: false,
			width: 400,
			height: 600,
			background: '#000'
		}

		// Renderer
		const leftRender = Render.create({
			element: document.querySelector('#left'),
			engine: leftEngine,
			options
		})
		const rightRender = Render.create({
			element: document.querySelector('#right'),
			engine: rightEngine,
			options
		})

		Render.run(leftRender)
		const leftRunner = Runner.create()
		Runner.run(leftRunner, leftEngine)

		Render.run(rightRender)
		const rightRunner = Runner.create()
		Runner.run(rightRunner, rightEngine)

		// 중력 설정
		leftEngine.gravity.y = 0.6
		rightEngine.gravity.y = -0.6

		//마우스 컨트롤 추가
		var leftMouse = Mouse.create(leftRender.canvas)
		var leftMouseConstraint = MouseConstraint.create(leftEngine, {
			mouse: leftMouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false
				}
			}
		});

		var rightMouse = Mouse.create(rightRender.canvas)
		var rightMouseConstraint = MouseConstraint.create(rightEngine, {
			mouse: rightMouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false
				}
			}
		});

		//마우스 컨트롤 추가
		World.add(leftWorld, leftMouseConstraint);
		World.add(rightWorld, rightMouseConstraint);

		// 바닥 추가
		World.add(leftWorld, Bodies.rectangle(0, 601, 800, 10, { isStatic: true }))
		World.add(rightWorld, Bodies.rectangle(0, 0, 800, 10, { isStatic: true }))

		//텍스트 오브젝트 추가
		bodiesUpward.forEach(body => {
			World.add(leftWorld, body)
		})
		bodiesDownward.forEach(body => {
			World.add(rightWorld, body)
		})

		positionLeftBodies()
		positionRightBodies()
	}, []);

	return (
		<div class="container">
			<div id="left"></div>
			<div id="right"></div>
		</div>
	)
}