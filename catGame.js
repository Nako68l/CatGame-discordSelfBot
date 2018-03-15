const Eris = require("eris");

let bot = new Eris.CommandClient("NDIzOTE3MzA1MzIwMTc3Njk5.DYxTfw.8FVCJWhD7ChwCIcpAymlReka_ts", {}, {
    prefix: "c",
    ignoreSelf: false
});

//getting self id to setup permission on CatCommand to react only when it typed by client
// can be set up like token, than unnecessary callbacks can be removed
let botId = "";
bot.getSelf().then(me => {
    botId = me["id"]
}).then(() => registerCatCommand());

let cell = "⬛";
let cat = "😼";
let knife = "🔪";
let sknife = "🗡";
let hammer = "🔨";
let cake = "🐟";
let shaurma = "🥙";
let ramen = "🍜";
let pizza = "🍕";
let pill = "💊";
let syringe = "💉";
let tea = "🍵";
let pray = "🙏";
let food = [cake, shaurma, ramen, pizza];
let weapons = [knife, sknife, hammer];
let heals = [pill, tea, syringe];
let emojis = [cake, shaurma, ramen, pizza, knife, sknife, hammer, pill, tea, syringe];
let cats = ["😿", "😾", "😼", "😸", "😺"];
let clocks = ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛"];
let clocksPosition = 0;
let secondsLive = 0;
let endMessage = "⚰\tTOTAL SCORE: ";
let catRow = new Array(15);
catRow.fill(cell);
let roadEndPosition = catRow.length - 1;
let catLives = 9;
let catHappiness = 59;
let gameStatus = ["\t", "❤", catLives, "🕐", secondsLive];
let catPosition = 3;
let foodValue = 20;
let items = {};
let currentReactions = {};
let gameIteration;
let catMessage;

bot.on("ready", () => {
    console.log("Ready!");
});

function registerCatCommand() {
    bot.registerCommand("at",
        msg => {
            catMessage = msg;
            emojis.forEach(emoji => {
                msg.addReaction(emoji);
                currentReactions[emoji] = {count: 1, me: true};
            });
            beginGame();
            return msg;
        }, { requirements : { userIDs : [botId]}});
}

let beginGame = () => {
    gameIteration = setInterval(() => {
        bot.editMessage(catMessage.channel.id, catMessage.id, setCatPosition())
            .then(res => updateReactions(res.reactions))
    }, 1000);
};

function updateReactions(reactions) {
    Object.entries(reactions).forEach(([reaction, reactionValue]) => {
        if (currentReactions.hasOwnProperty(reaction)) {
            let newReactionCount = reactionValue.count - currentReactions[reaction].count
            if (newReactionCount > 0) {
                items[reaction] = newReactionCount;
                currentReactions[reaction].count += newReactionCount;
            }
        }
    });
}

function setCatPosition() {
    catRow[catPosition] = cell;
    decreaseCatHappiness();
    changeCatPosition();
    insertCat();
    if (items !== null) insertItems();
    increaseAlarm();
    console.log(gameMessage() + "  " + Math.floor(catHappiness / 20));
    return gameMessage();
}

function decreaseCatHappiness() {
    catHappiness--;
    if (catHappiness > 79) {
        foodValue = 5;
        cat = cats[4];
    } else {
        foodValue = 20;
        catHappiness > 0 ? cat = cats[Math.floor(catHappiness / 20)] : endGame();
    }
}

let catPositionChanger = 1;

function changeCatPosition() {
    if (catPosition < 1) {
        catPositionChanger = 1;
    } else if (catPosition === roadEndPosition) {
        catPositionChanger = -1;
    }
    catPosition += catPositionChanger;
}


function insertCat() {
    let element = catRow[catPosition];
    if (food.includes(element)) {
        catHappiness += foodValue;
    } else if (weapons.includes(element)) {
        --gameStatus[2] < 1 ? endGame() : cat = "🙀";

    } else if (heals.includes(element)) {
        gameStatus[2]++;
        cat = "😻"//TODO: change to pleasure
    }
    catRow[catPosition] = cat;
}

let freeCells = [];

function insertItems() {
    catRow.forEach((rowCel, index) => {
        if (rowCel === cell) {
            freeCells.push(index)
        }
    });
    Object.entries(items).forEach(([reaction, reactionValue]) => {
        while (items[reaction] > 0) {
            if (freeCells.length > 0) {
                insertItem(reaction)
            }
        }
    });
    freeCells = [];
}

function insertItem(reaction) {
    let randomFreeCellPosition = Math.floor(Math.random() * (freeCells.length));
    catRow[freeCells[randomFreeCellPosition]] = reaction;
    freeCells.splice(randomFreeCellPosition, 1);
    items[reaction]--;
    return catRow
}


function increaseAlarm() {
    if (clocksPosition === 12) clocksPosition = 0;
    gameStatus[3] = clocks[clocksPosition++];
    gameStatus[4]++;
}

function gameMessage() {
    return catRow.concat(gameStatus).toString().replace(/,/g, "");
}

function endGame() {
    clearInterval(gameIteration);
    cat = "☠";
    catRow[catPosition + 1] = "☠";
    bot.editMessage(catMessage.channel.id, catMessage.id, gameMessage());
    setTimeout(() => {
        bot.editMessage(catMessage.channel.id, catMessage.id, endMessage + gameStatus[4]);
    }, 3000);
    bot.disconnect();
}

bot.connect();
