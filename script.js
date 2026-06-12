/* =========================
   SCRATCH FETEC
========================= */

document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    initializeScratch();

});

/* =========================
   ESTADO
========================= */

let scriptSequence = [];

let running = false;

let sprite = {
    x: 0,
    y: 0,
    rotation: 0,
    hue: 0
};

/* =========================
   BLOCOS
========================= */

const BLOCKS = [

    {
        type: "move",
        text: "Mover 20 passos",
        color: "#4D97FF"
    },

    {
        type: "rotate",
        text: "Girar 15°",
        color: "#4D97FF"
    },

    {
        type: "say",
        text: "Dizer Olá",
        color: "#9966FF"
    },

    {
        type: "color",
        text: "Trocar Cor",
        color: "#9966FF"
    },

    {
        type: "sound",
        text: "Tocar Som",
        color: "#CF63CF"
    },

    {
        type: "wait",
        text: "Esperar 1s",
        color: "#FFAB19"
    },

    {
        type: "reset",
        text: "Voltar ao Centro",
        color: "#FF8C1A"
    }

];

/* =========================
   INICIALIZAÇÃO
========================= */

function initializeScratch() {

    createToolbox();

    createWorkspace();

    createStage();

}

/* =========================
   TOOLBOX
========================= */

function createToolbox() {

    const toolbox =
        document.querySelector(".toolbox");

    toolbox.innerHTML = `
        <h3>Blocos</h3>
        <p>Clique para adicionar</p>
    `;

    BLOCKS.forEach(block => {

        const btn =
            document.createElement("button");

        btn.className = "scratch-block";

        btn.innerText = block.text;

        btn.style.background =
            block.color;

        btn.onclick = () =>
            addBlock(block.type);

        toolbox.appendChild(btn);

    });

}

/* =========================
   WORKSPACE
========================= */

function createWorkspace() {

    const workspace =
        document.querySelector(".workspace");

    workspace.innerHTML = `

        <div class="workspace-header">

            <h3>Meu Script</h3>

            <div class="workspace-buttons">

                <button id="runBtn">
                    ▶ Executar
                </button>

                <button id="clearBtn">
                    ✖ Limpar
                </button>

            </div>

        </div>

        <div id="workspaceBlocks">

            <p class="placeholder">
                Adicione blocos para começar
            </p>

        </div>

    `;

    document
        .getElementById("runBtn")
        .addEventListener(
            "click",
            runScript
        );

    document
        .getElementById("clearBtn")
        .addEventListener(
            "click",
            clearWorkspace
        );

}

/* =========================
   PALCO
========================= */

function createStage() {

    const stage =
        document.querySelector(".stage");

    stage.innerHTML = `

        <h3>Palco</h3>

        <div id="stageArea">

            <div id="speechBubble"></div>

            <div id="cat">

                🐱

            </div>

        </div>

        <div id="status">

            X: 0 | Y: 0

        </div>

    `;

    updateSprite();

}

/* =========================
   ADICIONAR BLOCO
========================= */

function addBlock(type) {

    scriptSequence.push(type);

    renderWorkspace();

}

/* =========================
   RENDER
========================= */

function renderWorkspace() {

    const area =
        document.getElementById(
            "workspaceBlocks"
        );

    if (scriptSequence.length === 0) {

        area.innerHTML = `
            <p class="placeholder">
                Adicione blocos para começar
            </p>
        `;

        return;
    }

    area.innerHTML = "";

    scriptSequence.forEach(
        (block, index) => {

            const div =
                document.createElement("div");

            div.className =
                "workspace-block";

            div.innerHTML = `

                <span>

                    ${index + 1}.
                    ${getBlockName(block)}

                </span>

                <button
                onclick="removeBlock(${index})">

                    🗑

                </button>

            `;

            area.appendChild(div);

        }
    );

}

/* =========================
   REMOVER
========================= */

function removeBlock(index) {

    scriptSequence.splice(index, 1);

    renderWorkspace();

}

/* =========================
   LIMPAR
========================= */

function clearWorkspace() {

    scriptSequence = [];

    renderWorkspace();

}

/* =========================
   EXECUTAR
========================= */

async function runScript() {

    if (running) return;

    if (scriptSequence.length === 0)
        return;

    running = true;

    const visualBlocks =
        document.querySelectorAll(
            ".workspace-block"
        );

    for (let i = 0; i <
        scriptSequence.length; i++) {

        if (!running)
            break;

        visualBlocks[i]
            ?.classList.add(
                "executing"
            );

        await executeBlock(
            scriptSequence[i]
        );

        await sleep(600);

        visualBlocks[i]
            ?.classList.remove(
                "executing"
            );

    }

    running = false;

}

/* =========================
   LÓGICA DOS BLOCOS
========================= */

async function executeBlock(type) {

    switch (type) {

        case "move":

            sprite.x += 25;

            updateSprite();

            break;

        case "rotate":

            sprite.rotation += 15;

            updateSprite();

            break;

        case "color":

            sprite.hue += 45;

            updateSprite();

            break;

        case "say":

            say("Olá FETEC!");

            await sleep(1500);

            break;

        case "sound":

            playSound();

            break;

        case "wait":

            await sleep(1000);

            break;

        case "reset":

            sprite.x = 0;
            sprite.y = 0;
            sprite.rotation = 0;
            sprite.hue = 0;

            updateSprite();

            break;

    }

}

/* =========================
   SPRITE
========================= */

function updateSprite() {

    const cat =
        document.getElementById("cat");

    if (!cat) return;

    cat.style.transform =

        `translate(
            ${sprite.x}px,
            ${sprite.y}px
        )
        rotate(
            ${sprite.rotation}deg
        )`;

    cat.style.filter =

        `hue-rotate(
            ${sprite.hue}deg
        )`;

    const status =
        document.getElementById(
            "status"
        );

    status.innerText =

        `X: ${Math.round(sprite.x)}
         | Rotação:
         ${sprite.rotation}°`;

}

/* =========================
   FALA
========================= */

function say(text) {

    const bubble =
        document.getElementById(
            "speechBubble"
        );

    bubble.innerText = text;

    bubble.style.display =
        "block";

    setTimeout(() => {

        bubble.style.display =
            "none";

    }, 1500);

}

/* =========================
   SOM
========================= */

function playSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const ctx =
            new AudioContext();

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.connect(gain);

        gain.connect(
            ctx.destination
        );
const audio = new Audio("audio/faaah_203440.mp3");
audio.play();
        

        gain.gain.value =
            0.1;

        osc.start();

        osc.stop(
            ctx.currentTime + 0.2
        );

    } catch (e) {

        console.log(
            "Som indisponível"
        );

    }
  

}

/* =========================
   AUXILIARES
========================= */

function getBlockName(type) {

    const block =
        BLOCKS.find(
            b => b.type === type
        );

    return block
        ? block.text
        : type;

}

function sleep(ms) {

    return new Promise(
        resolve =>
        setTimeout(
            resolve,
            ms
        )
    );

}