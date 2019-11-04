var audioElem;
var startTime = 0;//ms
var systemState = 0;
var sound_flag = false;
var game_time = 150;
var setting_time = 60;
var display_elm;

window.onload = function () {
    setInterval("process()", 100);
}

var process = function () {
    var date = new Date();
    var nowTime = date.getTime();

    display_elm = document.getElementById("main-display");

    var font_type = 0;  // 0: 小さめ， 1: 大きめ

    if (systemState === 0) {
        // イベント発生待ち
        font_type = 0;
        display_elm.innerHTML = "READY";
    }

    if (systemState === 1) {
        // スタート前カウントダウン
        var elapsed_sec = (nowTime - startTime) / 1000;
        var remaining_sec = Math.floor(6 - elapsed_sec);
        if (remaining_sec < 5) {
            font_type = 1;
            display_elm.innerHTML = remaining_sec;
        }
        if (remaining_sec == 3 && sound_flag == false) {
            sound_flag = true;
            playSound("count");
        }
        if (remaining_sec == 0) {
            systemState++;
        }
    }

    if (systemState === 2) {
        // 「START」描画
        font_type = 0;

        sound_flag = false;
        var elapsed_sec = Math.floor(nowTime / 1000 - startTime / 1000 - 6);
        display_elm.innerHTML = "START";
        if (elapsed_sec > 1) {
            systemState++;
        }
    }

    if (systemState === 3) {
        // カウント中
        font_type = 1;
        var elapsed_sec = Math.floor(nowTime / 1000 - startTime / 1000 - 6);
        // 描画文字列の生成
        var min_str = String(Math.floor(elapsed_sec / 60));
        var sec_str = String(Math.floor(elapsed_sec % 60));
        // ゼロ埋め
        if (elapsed_sec % 60 < 10) {
            sec_str = "0" + sec_str;
        }
        // 終了カウントダウン
        if (elapsed_sec >= game_time - 3) {
            display_elm.style.color = "yellow";
            if (sound_flag === false) {
                sound_flag = true;
                playSound("count");
            }
        }
        // 試合時間終了後は赤
        if (elapsed_sec >= game_time) {
            display_elm.style.color = "red";
        }
        display_elm.innerHTML = min_str + ":" + sec_str;
    }

    if (systemState === 10) {
        // セッティングタイムカウント
        var elapsed_sec = Math.floor(nowTime / 1000 - startTime / 1000);
        if (elapsed_sec == setting_time) {
            playSound("whistle");
            systemState = 11;
        }
    }

    // フォントサイズと表示画面divの高さ指定
    var font_size = [0.2 * window.innerWidth, 0.3 * window.innerWidth];
    var display_size = [0.217 * window.innerWidth, 0.322 * window.innerWidth];
    display_elm.style.fontSize = font_size[font_type] + "px";
    display_elm.style.height = display_size[font_type] + "px";

    var div_pose_y = (window.innerHeight - display_elm.clientHeight) / 2;
    display_elm.style.marginTop = div_pose_y + "px";
    document.getElementById("button-group").style.marginTop = window.innerHeight - (div_pose_y + display_elm.clientHeight) - 40 + "px";

}

// キー入力のイベント関係
document.onkeydown = keydown;
function keydown() {
    if (event.keyCode == 83) {
        start();
    }
    if (event.keyCode == 67) {
        setting();
    }
    if (event.keyCode == 87) {
        whistle();
    }
    if (event.keyCode == 82) {
        reset();
    }
}

function start() {
    if (getUrlQueries().gameTime !== undefined) {
        game_time = getUrlQueries().gameTime;
    }
    systemState = 1;
    var date = new Date();
    startTime = date.getTime();
    playSound("startcall");
}
function setting() {
    if (getUrlQueries().settingTime !== undefined) {
        setting_time = getUrlQueries().settingTime;
    }
    playSound("whistle");
    var date = new Date();
    startTime = date.getTime();
    systemState = 10;
}
function whistle() {
    playSound("whistle");
}
function reset() {
    display_elm.style.color = "white";
    display_elm.style.background = "#222";
    systemState = 0;
    sound_flag = false;
    StopSound();
}

// 音声関係
function playSound(soundName) {
    audioElem = new Audio();
    audioElem.src = "./sound/" + soundName + ".wav";
    audioElem.play();
}
function StopSound() {
    audioElem.pause();
}

// クエリ処理関係
function getUrlQueries() {
    var queryStr = window.location.search.slice(1);  // 文頭?を除外
    queries = {};
    // クエリがない場合は空のオブジェクトを返す
    if (!queryStr) {
        return queries;
    }
    // クエリ文字列を & で分割して処理
    queryStr.split('&').forEach(function (queryStr) {
        // = で分割してkey,valueをオブジェクトに格納
        var queryArr = queryStr.split('=');
        queries[queryArr[0]] = queryArr[1];
    });
    return queries;
}