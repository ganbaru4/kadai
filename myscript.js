(function(){

    var canvas = document.getElementById('canvas');
    if(!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext('2d');

    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;

    //ボール
    var balls         = [];
    var ballSize      = 50;
    var ballX         = 0;
    var ballY         = 0;
    var ballColor     = 'red';
    var previousTime  = 0;
    var delta         = 0;
    var interval      = 7000;
    var time          = 0;
    var createdTime   = 0;
    var ballSpeed     = 3;


    //バレット
    var bulletX = 0;
    var bulletY = canvasHeight;
    var bullet  = false;
    var bulletSize = 10;
    var bulletColor = 'blue';
    var bulletSpeed = 5;

    var isGameover = false;


    var DEG_TO_RAD = Math.PI / 180;
    var startAngle = 0 * DEG_TO_RAD;
    var endAngle   = 360 * DEG_TO_RAD;

	// 落下ボール作成
	// ===============
    function creatBall(){
    	//x,y座標を持ったオブジェクト
    	var ball = {
    		x: Math.random() * canvasWidth,
    		y: 0
    	};
    	//配列「balls」に追加
    	balls.push(ball);
    	// console.log(balls);
    }

	// 弾発射
	//
	// @param x クリックされたx座標の位置を引数に取る
	// ===============
    function creatBullet(x){
    	//バレットが存在してたら終わり
    	if(bullet){
    		return;
    	}
    	//存在してなかったら座標セット＆存在true
    	bullet = true;
    	bulletX = x;
    	bulletY = canvasHeight;
    }


	// ゲームの1フレーム分をアップデート
	// ===============
    function update(){
    	//アップデート時間取得
    	var now = Date.now();
    	//前回更新時間（初回はスタート時間）との差
    	var delta = now - previousTime;
    	// console.log(delta);
    	//前回更新時間更新
    	previousTime = now;
    	//プレイ時間
    	time += delta;
    	// console.log('プレイ時間：' + time);

    	//プレイ時間-ボール生成時間して
    	//指定インターバルを超えている場合ボール生成
    	if(time - createdTime > interval){
    		//ボール生成
    		creatBall();
    		//ボール生成時間更新
    		createdTime = time;
    	}
    	if(balls.length > 0){
    		// console.log('ボールあるよ');
	    	balls.forEach(function(ball, i){
	    		if(ball.y > canvasHeight){
	    			// console.log('ボール' + i + '削除削除削除削除削除削除削除！！');
	    			// balls.splice(i, 1);
	    			gameOver();
	    		}else{
		    		ball.y = ball.y + ballSpeed;
		    		console.log('ボール' + i + 'のY座標：' + ball.y);
	    		}
	    	});

    	}else{
    		// console.log('ボールないよ');
    	}

    	//バレット位置情報更新
    	//バレットが存在してたら
    	if(bullet){
    		//y座標をバレットスピード分マイナス
    		bulletY -= bulletSpeed;
    		//バレットのy座標がキャンバス上に達したら存在false
    		if(bulletY < 0){
    			bullet = false;
    		}
    	}

    	hitCheck();
    }

	// 当たり判定チェック
	// ===============
	function hitCheck(){
		var newBalls = [];
		balls.forEach(function(ball, i){
			if(!bullet){
				newBalls.push(ball);
				return;
			}

			var deltaX = ball.x - bulletX;
			var deltaY = ball.y - bulletY;
			var len    = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
			var isHit  = len < ballSize + bulletSize;
			if(!isHit){
				newBalls.push(ball);
			}else{
				bullet = false;
			}

		});

		balls = newBalls;

	}

	// レンダリング実行
	// ===============
    function draw(){

    	//一度全クリア
    	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    	//配列に入っているボールオブジェクトをループで取得•描画
    	balls.forEach(function(ball, i){
	        ctx.beginPath();
	        ctx.arc(ball.x, ball.y, ballSize, startAngle, endAngle);
	        ctx.fillStyle = ballColor;
	        ctx.fill();
    	});

    	//バレット描画
    	if(bullet){
	    	ctx.beginPath();
	    	ctx.arc(bulletX, bulletY, bulletSize, startAngle, endAngle);
	    	ctx.fillStyle = bulletColor;
	    	ctx.fill();
    	}

    }

	// ゲーム開始
	// ===============
    function start(){
    	
    	//プレイ開始時間取得
    	previousTime = Date.now();

    	(function loop(){
    		//位置情報更新
    		update();
    		//描画
    		draw();

    		if(isGameover){
    			return;
    		}

    		setTimeout(loop ,100);
    	})();
    }

	// ゲームオーバー
	// ===============
    function gameOver(){
    	isGameover = true;
    	alert('ゲームオーバー！！！！！');
    }

	// バレットのクリックイベント
	// ===============
    canvas.addEventListener('click', function(e){
    	//クリックされたx座標取得
    	var x = e.pageX;
    	console.log( x + 'にバレット!!!');
    	//クリックされたx座標ででバレット生成
    	creatBullet(x);
    }, false);


    start();

})();