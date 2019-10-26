var audioElem;
var startTime = 0;//ms
var systemState = 0;
var sound_flag = false;
var game_time = 150;
var setting_time = 60;
var display_elm;

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
    systemState = 0;
    sound_flag = false;
    StopSound();
}
function playSound(soundName) {
    audioElem = new Audio();
    audioElem.src = "./sound/" + soundName + ".wav";
    audioElem.play();
}
function StopSound() {
    audioElem.pause();
}
var display = function () {
    // Dateオブジェクトを作成
    var date = new Date();
    // UNIXタイムスタンプを取得する (ミリ秒単位)
    var nowTime = date.getTime();
    var fontsize_1 = 0.2 * window.innerWidth;
    var fontsize_2 = 0.3 * window.innerWidth;
    display_elm = document.getElementById("main-display");
    var div_pose_y = (window.innerHeight - display_elm.clientHeight) / 2;
    display_elm.style.marginTop = div_pose_y + "px";
    document.getElementById("button-group").style.marginTop = window.innerHeight - (div_pose_y + display_elm.clientHeight) - 40 + "px";
    if (systemState === 0) {
        display_elm.style.fontSize = fontsize_1 + "px";
        display_elm.innerHTML = "READY";
    } else if (systemState === 1) {
        // スタート前カウントダウン
        var elapsed_sec = (nowTime - startTime) / 1000;
        var remaining_sec = Math.floor(6 - elapsed_sec);
        if (remaining_sec !== 5) {
            display_elm.style.fontSize = fontsize_2 + "px";
            display_elm.innerHTML = remaining_sec;
        }
        if (remaining_sec == 3 && sound_flag == false) {
            sound_flag = true;
            playSound("count");
        }
        if (remaining_sec == 0) {
            systemState++;
        }
    } else if (systemState === 2) {
        // 「START」描画
        display_elm.style.fontSize = fontsize_1 + "px";
        sound_flag = false;
        var elapsed_sec = Math.floor(nowTime / 1000 - startTime / 1000 - 6);
        display_elm.innerHTML = "START";
        if (elapsed_sec > 1) {
            systemState++;
        }
    } else if (systemState === 3) {
        // カウント中
        display_elm.style.fontSize = fontsize_2 + "px";
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
    } else if (systemState == 10) {
        // セッティングタイムカウント
        var elapsed_sec = Math.floor(nowTime / 1000 - startTime / 1000);
        if (elapsed_sec == setting_time) {
            playSound("whistle");
            systemState = 11;
        }
    }
}
window.onload = function () {
    //1000ミリ秒（1秒）毎に関数「showNowDate()」を呼び出す
    setInterval("showNowDate()", 30);
}
//現在時刻を表示する関数
function showNowDate() {
    display();
}
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