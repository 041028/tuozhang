// 获取随机数
const getRandomNumber = (size) => Math.floor(Math.random() * size);

// 计算鼠标点击位置与目标位置的距离
const getDistance = (event, target) => {
    const diffx = event.offsetX - target.x;
    const diffy = event.offsetY - target.y;
    return Math.sqrt(diffx * diffx + diffy * diffy);
};

// 游戏初始化设置
const width = 400;
const height = 400;
let clicks = 0;
let target = { x: getRandomNumber(width), y: getRandomNumber(height) };

// 显示图片的通用函数
const showImage = (src) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "game-image";
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = "";  // 清空之前的图片
    imageContainer.appendChild(img);
};

// 游戏重置函数
const resetGame = () => {
    $("#output").empty();
    $("#imageContainer").empty();
    clicks = 0;
    target = { x: getRandomNumber(width), y: getRandomNumber(height) };
    $("#distance").text("");
    alert("点击地图来寻找宝藏!");
};

// 处理地图点击事件
$("#map").click((event) => {
    clicks++;
    const distance = getDistance(event, target);
    $("#distance").text("");

    if (distance < 260) {
        $("#output").html("在古老的图书馆里找到了第一个线索...");
        showImage("images/library.jpg");  // 先显示图书馆图片

        // 在图书馆图片显示后，再显示谜题图片
        setTimeout(() => {
            showImage("images/puzzle.jpg");  // 显示谜题图片
        }, 1000);  // 等待1秒后显示谜题图片

        // 点击谜题图片的事件
        $("#imageContainer").off('click').on('click', function() {
            const puzzleRandom = Math.random();
            if (puzzleRandom < 0.5) {
                $("#output").append("<p>解码成功!宝藏在一座古老的神庙中...(点击神庙图片)</p>");
                showImage("images/temple.jpg");  // 显示神庙图片
            } else {
                $("#output").append("<p>解码失败，再找找吧!</p>");
            }
        });

    } else {
        $("#output").append("<p>附近没有宝藏!去远处找找吧!</p>");
    }
});

// 点击神庙图片后，处理找到箱子的逻辑
$("#imageContainer").on('click', function() {
    if ($("#imageContainer img").attr("src") === "images/temple.jpg") {
        const random = Math.random();
        if (random < 0.5) {
            $("#output").append("<p>糟糕!遇到了神庙守卫!</p>");
        } else {
            $("#output").append("<p>找到了一个神秘的箱子,里面有一个谜题</p>");
            showImage("images/box.jpg");  // 显示神秘箱子图片

            // 在箱子图片显示后，再显示谜题图片
            setTimeout(() => {
                showImage("images/problem.jpg");  // 显示谜题图片
            }, 1000);  // 等待1秒后显示谜题图片

            // 点击谜题图片后，处理解开谜题的逻辑
            $("#imageContainer").off('click').on('click', function() {
                const problemRandom = Math.random();
                if (problemRandom < 0.5) {
                    $("#output").append("<p>糟糕!谜题没有解开!</p>");
                } else {
                    $("#output").append("<p>谜题解开了!恭喜!你找到了传说中的宝藏!</p>");
                    setTimeout(() => showImage("images/treasure.jpg"), 1000);  // 显示宝藏图片
                }
            });
        }
    }
});
// 异步加载TXT文件内容并显示
const loadTextData = async (fileName) => {
    try {
        const response = await fetch(fileName);
        const text = await response.text();
        return text;
    } catch (error) {
        console.error('Error loading the text file:', error);
        return "无法加载内容";
    }
};

// 加载并显示图书馆信息
const loadLibraryInfo = async () => {
    const libraryInfo = await loadTextData('library.txt');
    $("#output").html(libraryInfo);
};

// 加载并显示神庙信息
const loadTempleInfo = async () => {
    const templeInfo = await loadTextData('temple.txt');
    $("#output").html(templeInfo);
};

// 加载并显示守卫信息
const loadGuardInfo = async () => {
    const guardInfo = await loadTextData('guard.txt');
    $("#output").html(guardInfo);
};
// 保存玩家信息
const savePlayerData = (playerId, nickname) => {
    const playerData = {
        playerId: playerId,
        nickname: nickname,
        gameHistory: [],
    };
    localStorage.setItem('playerData', JSON.stringify(playerData));
};

// 读取玩家信息
const loadPlayerData = () => {
    const savedData = localStorage.getItem('playerData');
    if (savedData) {
        const playerData = JSON.parse(savedData);
        $("#playerInfo").html(`欢迎回来, ${playerData.nickname}!`);
        return playerData;
    } else {
        $("#playerInfo").html("欢迎来到寻宝游戏，请输入你的信息。");
        return null;
    }
};

// 更新玩家游戏历史
const updateGameHistory = (historyItem) => {
    let playerData = loadPlayerData();
    if (playerData) {
        playerData.gameHistory.push(historyItem);
        localStorage.setItem('playerData', JSON.stringify(playerData));
    }
};

// 初始化游戏，检查是否已有玩家数据
const initGame = () => {
    const playerData = loadPlayerData();
    if (!playerData) {
        const playerId = "player_" + Date.now(); // 生成唯一ID
        const nickname = prompt("请输入你的昵称：");
        savePlayerData(playerId, nickname);
    }
};
// 播放背景音乐
const playBackgroundMusic = () => {
    const music = document.getElementById('backgroundMusic');
    music.play();
};

// 停止背景音乐
const stopBackgroundMusic = () => {
    const music = document.getElementById('backgroundMusic');
    music.pause();
};

// 在游戏开始时播放背景音乐
document.getElementById('startButton').addEventListener('click', () => {
    initGame();  // 初始化游戏
    playBackgroundMusic(); // 游戏开始时播放背景音乐
});

// 在游戏结束时停止背景音乐
const gameEnd = () => {
    stopBackgroundMusic(); // 游戏结束时停止背景音乐
};
// 场景选择按钮点击事件
document.getElementById('libraryButton').addEventListener('click', loadLibraryInfo);
document.getElementById('templeButton').addEventListener('click', loadTempleInfo);
document.getElementById('guardButton').addEventListener('click', loadGuardInfo);


// 开始游戏按钮
document.getElementById('startButton').addEventListener('click', resetGame);
