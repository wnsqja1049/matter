import "./Subak.css";
import { useState, useEffect, useRef } from "react";
import Matter from "matter-js";

export default function Subak() {

	const [ testFruitIndex, setTestFruitIndex ] = useState({ now: Math.floor(Math.random() * 5), next: Math.floor(Math.random() * 5) });
	const [ gameOver, setGameOver ] = useState(false);
	const [ score, setScore ] = useState(0);

	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const fruitIndexRef = useRef(testFruitIndex);
	const gameOverRef = useRef(gameOver);
	const worldRef = useRef(world);
	const scoreRef = useRef(score);

	const Engine = Matter.Engine;
	const Render = Matter.Render;
	const Runner = Matter.Runner;
	const World = Matter.World;
	const Bodies = Matter.Bodies;
	const Mouse = Matter.Mouse;
	const Events = Matter.Events;

	//Matter 오브젝트
	var engine;
	var render;
	var runner;
	var world;

	//맵 오브젝트
	var ceil;
	var floor;
	var leftWall;
	var rightWall;

	var wallSize = 100;

	var currentFruit;

	//맵 크기
	const canvasWidth = 400;
	const canvasHeight = 800;
	
	//상한선 높이 설정
	var ceilY = 200;

	//과일 떨어트리는 위치
	var spawnX = 200;
	var spawnY = 100;

	//전체 과일 크기 비율 설정
	var ratio = 0.85;

	//반발력
	var restitution = 0.2;

	//마찰력
	var frictionStatic = 0.1;
	var friction = 0.01;

	//중력
	var gravity = 0.4;

	const fruitList = [
		{ src: 'fruit-1.png',  radius: 16 * ratio,  scale: 0.32 * ratio },
		{ src: 'fruit-2.png',  radius: 24 * ratio,  scale: 0.40 * ratio },
		{ src: 'fruit-3.png',  radius: 32 * ratio,  scale: 0.48 * ratio },
		{ src: 'fruit-4.png',  radius: 40 * ratio,  scale: 0.62 * ratio },
		{ src: 'fruit-5.png',  radius: 48 * ratio,  scale: 0.64 * ratio },
		{ src: 'fruit-6.png',  radius: 56 * ratio,  scale: 0.86 * ratio },
		{ src: 'fruit-7.png',  radius: 64 * ratio,  scale: 1.00 * ratio },
		{ src: 'fruit-8.png',  radius: 72 * ratio,  scale: 1.08 * ratio },
		{ src: 'fruit-9.png',  radius: 80 * ratio,  scale: 1.18 * ratio },
		{ src: 'fruit-10.png', radius: 100 * ratio, scale: 1.42 * ratio },
		{ src: 'fruit-11.png', radius: 140 * ratio, scale: 2.08 * ratio },
	]
	const scoreList = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];


	const createEngine = () => {
		var engine = Engine.create({
			enableSleeping: true,
		});
		engine.gravity.y = gravity;

		return engine;
	}
	const createRender = (engine) => {
		var render = Render.create({
			element: containerRef.current,
			canvas: canvasRef.current,
			engine: engine,
			options: {
				showSleeping: false,
				//showIds:true,
				background: '#333',
				width: canvasWidth,
				height: canvasHeight,
				wireframes: false,
			}
		});

		return render;
	}

	const createWall = (world) => {
		ceil = Bodies.rectangle(canvasWidth / 2, ceilY, canvasWidth, 5, { label: 'ceil', isSensor: true, isStatic: true, render: { fillStyle:'#E7B143' }});
		floor = Bodies.rectangle(canvasWidth / 2, canvasHeight + (wallSize / 2), canvasWidth, wallSize, { label: 'floor', isStatic: true, render: { fillStyle:'#E7B143' }});
		leftWall = Bodies.rectangle(-(wallSize / 2), canvasHeight / 2, wallSize, canvasHeight, { label: 'leftWall', isStatic: true, render: { fillStyle:'#E7B143' }});
		rightWall = Bodies.rectangle(canvasWidth + (wallSize / 2), canvasHeight / 2, wallSize, canvasHeight, { label: 'rightWall', isStatic: true, render: { fillStyle:'#E7B143' }});
		
		World.add(world, [floor, ceil, leftWall, rightWall]);
	}

	useEffect(() => {

		engine = createEngine();
		render = createRender(engine);
		runner = Runner.create();

		Render.run(render);
		Runner.run(engine);
		Runner.run(runner, engine);
		
		world = engine.world;
		worldRef.current = world;

		currentFruit = Bodies.circle(spawnX, spawnY, fruitList[testFruitIndex.now].radius,
			{
				label: 'sensor',
				isSensor: true,
				label: fruitIndexRef.current.now,
				isStatic: true,
				render: {
					sprite: {
						texture: `/subak/${fruitList[testFruitIndex.now].src}`,
						xScale: fruitList[testFruitIndex.now].scale,
						yScale: fruitList[testFruitIndex.now].scale
					}
				}
			}
		);

		createWall(world);

		// 충돌 이벤트
		Events.on(engine, "collisionStart", (event) => {
			var pairs = event.pairs;
        
			for (var i = 0, j = pairs.length; i != j; ++i) {
				var pair = pairs[i];
	
				if (pair.bodyA !== currentFruit && pair.bodyB !== currentFruit) {
					if (pair.bodyA.label === pair.bodyB.label) {
						if (pair.bodyA.label !== 10 && pair.bodyB.label !== 10) {

							World.remove(world, [pair.bodyA, pair.bodyB]);

							scoreRef.current = scoreRef.current += scoreList[pair.bodyA.label]
							setScore(scoreRef.current)

							let index = pair.bodyB.label + 1;

							let posX = pair.collision.supports[0].x;
							let posY = pair.collision.supports[0].y;

							let fruit = createNewFruit(posX, posY, index);
							World.add(world, fruit);
						}
					}
				}
			}
		})

		canvasRef.current.addEventListener('mousemove', handleMouseMove);
		canvasRef.current.addEventListener('click', handleClick);

		//마우스 컨트롤 추가
		var mouse = Mouse.create(render.canvas);

		render.mouse = mouse;

		return () => {
			canvasRef.current.removeEventListener('mousemove', handleMouseMove);
			canvasRef.current.removeEventListener('click', handleClick);
		};
	}, []);

	const handleMouseMove = (event) => {
		if(gameOverRef.current) {
			return;
		}

		World.remove(world, currentFruit);

		currentFruit = Bodies.circle(event.x, spawnY, fruitList[fruitIndexRef.current.now].radius,
			{
				label: 'sensor',
				isSensor: true,
				label: fruitIndexRef.current.now,
				isStatic: true,
				render: {
					sprite: {
						texture: `/subak/${fruitList[fruitIndexRef.current.now].src}`,
						xScale: fruitList[fruitIndexRef.current.now].scale,
						yScale: fruitList[fruitIndexRef.current.now].scale
					}
				}
			}
		);

		World.add(world, currentFruit);
	}
	const handleClick = (event) => {

		if(gameOverRef.current) {
			return;
		}
		
		let fruit = createNewFruit(event.x, spawnY, fruitIndexRef.current.now);
		World.add(world, fruit);

		fruitIndexRef.current = { now: fruitIndexRef.current.next, next: Math.floor(Math.random() * 5) };
		setTestFruitIndex(fruitIndexRef.current);

		World.remove(world, currentFruit);

		currentFruit = Bodies.circle(event.x, spawnY, fruitList[fruitIndexRef.current.now].radius,
			{
				label: 'sensor',
				isSensor: true,
				label: fruitIndexRef.current.now,
				isStatic: true,
				render: {
					sprite: {
						texture: `/subak/${fruitList[fruitIndexRef.current.now].src}`,
						xScale: fruitList[fruitIndexRef.current.now].scale,
						yScale: fruitList[fruitIndexRef.current.now].scale
					}
				}
			}
		);
		
		World.add(world, currentFruit);
	}

	const createNewFruit = (x, y, index) => {
		var newFruit = Bodies.circle(x, y, fruitList[index].radius, {
			label: index,
			restitution: restitution,
			frictionStatic: frictionStatic,
			friction: friction,
			render: {
				sprite: {
					texture: `/subak/${fruitList[index].src}`,
					xScale: fruitList[index].scale,
					yScale: fruitList[index].scale
				}
			}
		})

		Events.on(newFruit, "sleepStart", (event) => {
			if(event.source.position.y - event.source.circleRadius < ceilY) {
				gameOverRef.current = true;
				setGameOver(true);
			}
		})

		return newFruit;
	}

	const retry = () => {
		let randomNow = Math.floor(Math.random() * 5)
		let randomNext = Math.floor(Math.random() * 5)

		fruitIndexRef.current = { now: randomNow, next: randomNext };
		setTestFruitIndex(fruitIndexRef.current);

		World.clear(worldRef.current, true);
		gameOverRef.current = false;
		setGameOver(false);

		scoreRef.current = 0
		setScore(0)
	}

	const fruitListUi = () => {
		return (
			<div className="fruit-list-ui">
				<img src="/subak/fruit-1.png"></img>
				<img src="/subak/fruit-2.png"></img>
				<img src="/subak/fruit-3.png"></img>
				<img src="/subak/fruit-4.png"></img>
				<img src="/subak/fruit-5.png"></img>
				<img src="/subak/fruit-6.png"></img>
				<img src="/subak/fruit-7.png"></img>
				<img src="/subak/fruit-8.png"></img>
				<img src="/subak/fruit-9.png"></img>
				<img src="/subak/fruit-10.png"></img>
				<img src="/subak/fruit-11.png"></img>
			</div>
		)
	}

	return (
		<div>
			<div ref={containerRef} style={{
				width: canvasWidth,
				height: canvasHeight,}}>
				<canvas id="id_canvas" ref={canvasRef}/>

				<div>
					<div className="fruit-ui" style={{'top':'50px'}}>
						<p>NEXT : </p>
						<img src={`/subak/fruit-${testFruitIndex.next + 1}.png`}></img>
					</div>

					<div className="fruit-ui" style={{'top':'100px'}}>
						<p>NOW : </p>
						<img src={`/subak/fruit-${testFruitIndex.now + 1}.png`}></img>
					</div>

					<div className="score-ui">
						<p>점수 : {score.toString()}</p>
					</div>
				</div>

				{gameOverRef.current ? 
				<div className={`gameover-ui`}>
					<p>GAME OVER</p>
					<p>점수 : {score.toString()}</p>
					<button onClick={()=>{retry()}}>RETRY</button>
				</div> : <></>}

				{fruitListUi()}
			</div>
		</div>
	)
}