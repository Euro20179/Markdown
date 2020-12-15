const textEditor = document.querySelector('.text-editor');
const preview = document.querySelector('.preview');
const cusotmMdChkbx = document.getElementById("custom");
const fileReader = document.getElementById("fileReader");
const contextMenuColorpicker = document.getElementById("context-menu-color-picker");
const contextMenu = document.getElementById("context-menu");
const useMathJaxCheckbox = document.getElementById("mathjax");
const useSyntaxHighlighting = document.getElementById("syntax-parsing");
let contextOn = false;
let InterprateLive = document.getElementById("live-interprate").checked;
let Preview = document.getElementById("previews").checked;
let tabs = [];
let DarkMode = document.getElementById("darkmode").checked;
let TypingElem = false;
let currTypingElem = [];
let extraElemTextLength = 0;
let elementInnerHTML;
let AutoCompleteElements = document.getElementById("autocomplete-elements").checked;
let tabOverAmount = 0;
let lastKeyStrokeWasEnter = false;
let autoTab = document.getElementById("auto-tab");
function highlightCode() {
    if (useSyntaxHighlighting.checked)
        //@ts-ignore
        Prism.highlightAll();
}
if (localStorage.getItem("textEditorValue")) {
    textEditor.value = localStorage.getItem("textEditorValue");
    preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked);
    if (useMathJaxCheckbox.checked)
        mathJax();
    highlightCode();
}
textEditor.style.backgroundColor = document.getElementById("text-editor-color").value;
textEditor.style.color = document.getElementById("text-editor-text-color").value;
preview.style.backgroundColor = document.getElementById("preview-color").value;
preview.style.color = document.getElementById("preview-text-color").value;
const urlParams = new URLSearchParams(location.search.replace("*", "#"));
for (let queary of urlParams) {
    let [q, value] = queary;
    switch (q) {
        case "editor":
            textEditor.style.backgroundColor = value;
            break;
        case "editortext":
            textEditor.style.color = value;
            break;
        case "darkmode":
            DarkMode = true;
            break;
        case "lightmode":
            DarkMode = false;
            break;
        case "preview":
            preview.style.backgroundColor = value;
            break;
        case "previewtext":
            preview.style.color = value;
            break;
    }
}
setDarkMode();
function setDarkMode() {
    const body = document.getElementsByTagName("body")[0];
    if (DarkMode) {
        body.classList.add("darkmode");
    }
    else
        body.classList.remove("darkmode");
}
function mathJax() {
    // TeX-AMS_HTML
    //@ts-ignore
    MathJax.Hub.Config({
        jax: [
            'input/TeX',
            'output/HTML-CSS',
            'output/PreviewHTML',
        ],
        extensions: [
            'tex2jax.js',
            'AssistiveMML.js',
            'a11y/accessibility-menu.js',
        ],
        TeX: {
            extensions: [
                'AMSmath.js',
                'AMSsymbols.js',
                'noErrors.js',
                'noUndefined.js',
            ]
        },
        tex2jax: {
            inlineMath: [
                ['$', '$'],
                ['\\(', '\\)'],
            ],
            displayMath: [
                ['$$', '$$'],
                ['\\[', '\\]'],
            ],
            processEscapes: true
        },
        showMathMenu: false,
        showProcessingMessages: false,
        messageStyle: 'none',
        skipStartupTypeset: true,
        positionToHash: false
    });
    // set specific container to render, can be delayed too
    //@ts-ignore
    MathJax.Hub.Queue(
    //@ts-ignore
    ['Typeset', MathJax.Hub, 'preview']);
}
function turnOffAllOtherTabs(currTab) {
    for (let tab of tabs) {
        tab.turnOff();
    }
    currTab.turnOn();
}
class Tab {
    constructor(tab, tabTitle) {
        this.tab = tab;
        this.tabTitle = tabTitle;
        this.tabTitle.addEventListener("click", (e) => {
            for (let tab of tabs) {
                tab.turnOff();
            }
            this.turnOn();
        });
        tabs.push(this);
    }
    turnOff() {
        this.tab.classList.value = "bar-section-off";
        this.tabTitle.classList.value = "bar-section-title title-off";
    }
    turnOn() {
        this.tab.classList.value = "bar-section-on";
        this.tabTitle.classList.value = "bar-section-title title-on";
    }
}
const homeTab = new Tab(document.getElementById("home"), document.getElementById("home-title"));
const insertTab = new Tab(document.getElementById("insert"), document.getElementById('insert-title'));
const fileTab = new Tab(document.getElementById("file"), document.getElementById("file-title"));
const optionsTab = new Tab(document.getElementById("options"), document.getElementById("options-title"));
const UIOptionsTab = new Tab(document.getElementById("ui-options"), document.getElementById("ui-title"));
const helpTab = new Tab(document.getElementById("help"), document.getElementById("help-title"));
const countTab = new Tab(document.getElementById("count"), document.getElementById("count-title"));
const emojisTab = new Tab(document.getElementById("emojis"), document.getElementById("emojis-title"));
const regexTab = new Tab(document.getElementById("custom-regex"), document.getElementById("custom-regex-title"));
let currTab = homeTab;
turnOffAllOtherTabs(currTab);
var SyncScrolling = document.getElementById("syncscrolling").checked;
function addBorder() {
    let size = document.getElementById('border-size').value;
    let unit = document.getElementById('border-unit').value;
    let line = document.getElementById('border-line-types').value;
    let color = document.getElementById('border-color').value;
    let direction = document.getElementById('border-direction').value;
    startEndTypeInTextArea(`|${direction}[${size}${unit} ${line} ${color}]`, '|');
}
function addSpace() {
    let color = document.getElementById("space-color").value;
    let amount = document.getElementById("space-amount").value;
    let unit = document.getElementById("space-unit").value;
    addTextTypeInTextArea(`{space${color} ${amount}${unit}}`);
}
function addMarquee() {
    let dir = document.getElementById("marquee-direction").value;
    let width = document.getElementById("marquee-width").value;
    let height = document.getElementById('marquee-height').value;
    let speed = document.getElementById("marquee-speed").value;
    let unit = document.getElementById("marquee-unit").value;
    startEndTypeInTextArea(`{move[dir"${dir}"w"${width}${unit}"h"${height}${unit}"s"${speed}"] `, "}");
}
function addShadow() {
    let unit = document.getElementById('shadow-dir-unit').value;
    let right = document.getElementById('shadow-right').value;
    let down = document.getElementById('shadow-down').value;
    let color = document.getElementById('shadow-color').value;
    let blur = document.getElementById('shadow-blur').value;
    let blurUnit = document.getElementById("shadow-blur-unit").value;
    startEndTypeInTextArea(`{shadow'${right}${unit} ${down}${unit} ${blur}${blurUnit} ${color}'`, '}');
}
function addOLULInclude() {
    let types = document.getElementById("ul-ol-types").value;
    if (types) {
        addTextTypeInTextArea(`\\${document.getElementById('ul-ol').value}marker:${document.getElementById('list-layer').value}\\TYPE:${types}\\`);
    }
    else
        addTextTypeInTextArea(`\\${document.getElementById('ul-ol').value}marker:${document.getElementById('list-layer').value}\\${document.getElementById('marker-text').value}\\`);
}
function addToCurrElem(e) {
    if (currTypingElem[currTypingElem.length - 1] === " " && TypingElem) {
        extraElemTextLength += 1;
        return;
    }
    else if (TypingElem && e.key == "Backspace") {
        currTypingElem.length -= 1;
    }
    else if (TypingElem && e.key.length === 1 && e.key != "<") {
        currTypingElem.push(e.key);
    }
    if (TypingElem && !currTypingElem.length) {
        TypingElem = false;
        extraElemTextLength = 0;
    }
}
function keyPresses(e) {
    if (AutoCompleteElements) {
        //starts the element
        if (e.key == "<") {
            elementInnerHTML = [textEditor.selectionStart, textEditor.selectionEnd];
            textEditor.setRangeText("<", textEditor.selectionStart, textEditor.selectionStart);
            textEditor.setSelectionRange(textEditor.selectionStart + 1, textEditor.selectionStart + 1);
            TypingElem = true;
            e.preventDefault();
        }
        //ends the typing element
        else if (TypingElem && e.key == ">") {
            if (["hr", "wbr", "br"].indexOf(currTypingElem.join("")) < 0) {
                addTextTypeInTextArea(">");
                //+2 is the length of < and >
                //extraElemTextLength is the stuff like style=
                textEditor.setSelectionRange(elementInnerHTML[1] + currTypingElem.length + 2 + extraElemTextLength, elementInnerHTML[1] + currTypingElem.length + 2 + extraElemTextLength);
                textEditor.setRangeText(`</${currTypingElem.join("")}>`);
                currTypingElem = [];
                TypingElem = false;
                elementInnerHTML = [];
                e.preventDefault();
            }
            currTypingElem = [];
            TypingElem = false;
            elementInnerHTML = [];
        }
        //appends to curr element if applicable
        else if (TypingElem) {
            addToCurrElem(e);
        }
    }
    //non-combo key presses
    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.key) {
            case "Backspace":
                if (autoTab.checked) {
                    if (lastKeyStrokeWasEnter) {
                        if (tabOverAmount > 0) {
                            tabOverAmount--;
                        }
                    }
                }
                break;
            case "Enter":
                if (autoTab.checked) {
                    if (lastKeyStrokeWasEnter) {
                        if (tabOverAmount > 0) {
                            tabOverAmount--;
                        }
                    }
                    if (tabOverAmount > 0) {
                        //@ts-ignore
                        startEndTypeInTextArea("\n" + mulString("	", tabOverAmount), "");
                    }
                    else {
                        startEndTypeInTextArea("\n", "");
                    }
                    lastKeyStrokeWasEnter = true;
                    e.preventDefault();
                }
                break;
            case "Tab":
                startEndTypeInTextArea("	", "");
                tabOverAmount++;
                e.preventDefault();
                break;
            case "F6":
                DarkMode = !DarkMode;
                setDarkMode();
                e.preventDefault();
                break;
            case "F9":
                useMathJaxCheckbox.checked = !useMathJaxCheckbox.checked;
                if (useMathJaxCheckbox.checked)
                    mathJax();
                else
                    preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked);
                e.preventDefault();
                break;
            case "F4":
                document.getElementById("custom").click();
                e.preventDefault();
                break;
            case "F2":
                document.getElementById("live-interprate").click();
                e.preventDefault();
                break;
            case "F1":
                textEditor.style.cursor = "wait";
                preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked);
                highlightCode();
                if (useMathJaxCheckbox.checked)
                    mathJax();
                textEditor.style.cursor = "initial";
                e.preventDefault();
                break;
            default:
                break;
        }
        if (e.key != "Enter")
            lastKeyStrokeWasEnter = false;
    }
    //ctrl + key
    else if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        switch (e.key) {
            case "q":
                typeInTextarea("''''", 2);
                e.preventDefault();
                break;
            case ",":
                startEndTypeInTextArea("\\_[", "]");
                e.preventDefault();
                break;
            case ".":
                startEndTypeInTextArea("\\^[", "]");
                e.preventDefault();
                break;
            case "b":
                typeInTextarea("****", 2);
                e.preventDefault();
                break;
            case "u":
                typeInTextarea("__");
                e.preventDefault();
                break;
            case "r":
                typeInTextarea("~__~", 2);
                e.preventDefault();
                break;
            case "d":
                typeInTextarea(".__.", 2);
                e.preventDefault();
                break;
            case "h":
                typeInTextarea("*--*", 2);
                e.preventDefault();
                break;
            case "i":
                typeInTextarea('**');
                e.preventDefault();
                break;
            case "e":
                typeInTextarea("``");
                e.preventDefault();
                break;
            case "s":
                typeInTextarea('~~~~', 2);
                e.preventDefault();
                break;
            case "p":
                addTextTypeInTextArea(">PRO: ");
                e.preventDefault();
                break;
            case "1":
                fileTab.tabTitle.click();
                e.preventDefault();
                break;
            case "f":
                countTab.tabTitle.click();
                document.getElementById("find-search").focus();
                e.preventDefault();
                break;
            case "g":
                countTab.tabTitle.click();
                document.getElementById("preview-search-count").focus();
                e.preventDefault();
                break;
            case "2":
                countTab.tabTitle.click();
                e.preventDefault();
                break;
            case "3":
                homeTab.tabTitle.click();
                e.preventDefault();
                break;
            case "4":
                insertTab.tabTitle.click();
                e.preventDefault();
                break;
            case "5":
                helpTab.tabTitle.click();
                e.preventDefault();
                break;
            case "6":
                UIOptionsTab.tabTitle.click();
                e.preventDefault();
                break;
            case "7":
                optionsTab.tabTitle.click();
                e.preventDefault();
                break;
            case "k":
                startEndTypeInTextArea("[](", ")", { cursor: 1 });
                e.preventDefault();
                break;
            case "'":
                addOLULInclude();
                e.preventDefault();
                break;
        }
    }
    //alt key
    else if (e.altKey && !e.shiftKey && !e.ctrlKey) {
        switch (e.key) {
            case "p":
                contextMenuColorpicker.click();
                e.preventDefault();
                break;
            case "i":
                typeInTextarea("``");
                e.preventDefault();
                break;
            case "s":
                addShadow();
                e.preventDefault();
                break;
            case "h":
                addSpace();
                e.preventDefault();
                break;
            case "b":
                addBorder();
                e.preventDefault();
                break;
        }
    }
    //ctrl + shift + key
    else if (e.ctrlKey && e.shiftKey && !e.altKey) {
        switch (e.key.toUpperCase()) {
            case "U":
                typeInTextarea('^__^', 2);
                e.preventDefault();
                break;
            case "R":
                typeInTextarea('^~~^', 2);
                e.preventDefault();
                break;
            case "D":
                typeInTextarea('^..^', 2);
                e.preventDefault();
                break;
            case "?":
                startEndTypeInTextArea("> ''", "''[]");
                e.preventDefault();
                break;
            case "F":
                startEndTypeInTextArea('f[]', '|', { cursor: 2, defaultCursor: 2 });
                e.preventDefault();
                break;
            case "E":
                const editingBar = document.getElementById('editing-bar');
                if (editingBar.classList.contains("editing-bar-off")) {
                    editingBar.classList.value = "editing-bar";
                }
                else {
                    editingBar.classList.value = "editing-bar-off";
                }
                e.preventDefault();
                break;
            case "S":
                let currTextSize = document.getElementById("text-size").value;
                const currTextUnit = document.getElementById("text-units").value;
                if (parseInt(currTextSize.slice(-1)) >= 0) {
                    currTextSize += currTextUnit;
                }
                startEndTypeInTextArea(`s[${currTextSize}]`, '|');
                e.preventDefault();
                break;
            case "Z":
                const currColorSelected = document.getElementById("text-color").value;
                startEndTypeInTextArea(`#[${currColorSelected.split("#")[1]}]`, '|');
                e.preventDefault();
                break;
            case "B":
                typeInTextarea('> \'\'\'\'[author]', 4);
                e.preventDefault();
                break;
            case "T":
                startEndTypeInTextArea('|', '||\n|---|---|\n|||');
                e.preventDefault();
                break;
            case "K":
                startEndTypeInTextArea("{key:", "}");
                e.preventDefault();
                break;
            case ":":
                startEndTypeInTextArea("{cmd:", "}");
                e.preventDefault();
                break;
            case "!":
                startEndTypeInTextArea(`<c-3d>`, `</c-3d>`);
                e.preventDefault();
                break;
            case "@":
                startEndTypeInTextArea("<c-rainbow>", "</c-rainbow>");
                e.preventDefault();
                break;
            case "#":
                startEndTypeInTextArea("<c-upsidedown>", "</c-upsidedown>");
                e.preventDefault();
                break;
            case "$":
                startEndTypeInTextArea("<c-circled>", "</c-circled>");
                e.preventDefault();
                break;
            case "%":
                startEndTypeInTextArea("<c-unicode>", "</c-unicode>");
                e.preventDefault();
                break;
            case "^":
                startEndTypeInTextArea("<c-choose items=''>", "</c-choose>");
                e.preventDefault();
                break;
            case "&":
                startEndTypeInTextArea("<c-random min=0 max=100 round=0>", "</c-random>");
                e.preventDefault();
                break;
            case "*":
                startEndTypeInTextArea("<c-spacer></c-spacer>", "");
                e.preventDefault();
                break;
            case "{":
                startEndTypeInTextArea("|", "<-|");
                e.preventDefault();
                break;
            case "}":
                startEndTypeInTextArea("|->", "|");
                e.preventDefault();
                break;
            case "|":
                startEndTypeInTextArea("|->", "<-|");
                e.preventDefault();
                break;
        }
    }
    //alt + ctrl + key
    else if (e.altKey && e.ctrlKey && !e.shiftKey) {
        switch (e.key) {
            case "u":
                typeInTextarea("____", 2),
                    e.preventDefault();
                break;
            case "p":
                addTextTypeInTextArea(">CON: ");
                e.preventDefault();
                break;
            case "i":
                startEndTypeInTextArea("```\n", "\n```");
                e.preventDefault();
                break;
        }
    }
    //alt + shift + ctrl + key
    else if (e.altKey && e.shiftKey && e.ctrlKey) {
        switch (e.key.toUpperCase()) {
            case "O":
                document.getElementById('fileReader').click();
                e.preventDefault();
                break;
            case "Z":
                let currBGColorSelected = document.getElementById("background-color").value;
                startEndTypeInTextArea(`[${currBGColorSelected}]*-`, "-*");
                e.preventDefault();
                break;
            case "F":
                addTextTypeInTextArea("\\font{arial}\n");
                e.preventDefault();
                break;
            case "U":
                typeInTextarea("^^__^^", 3),
                    e.preventDefault();
                break;
        }
    }
}
document.addEventListener("keydown", e => {
    if (e.key == "Escape" && (PreviewMode || EditMode)) {
        if (PreviewMode)
            setPreviewMode();
        else
            setEditMode();
    }
    else if (e.altKey && e.key == "q") {
        printMe(preview);
    }
    else if (e.altKey && e.shiftKey && e.ctrlKey) {
        switch (e.key.toUpperCase()) {
            case "S":
                saveFile();
                document.getElementById("download").click();
                e.preventDefault();
                break;
            case "B":
                savePlain();
                document.getElementById("download-plain").click();
                e.preventDefault();
                break;
            case "P":
                savePDF();
                e.preventDefault();
                break;
        }
        if (document.activeElement == textEditor) {
            keyPresses(e);
        }
    }
    else if (document.activeElement == textEditor) {
        keyPresses(e);
    }
});
document.getElementById("preview-search-count").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("count-of-button").click();
        e.preventDefault();
    }
});
let EditMode = false;
function setEditMode() {
    if (!EditMode) {
        const editingBar = document.getElementById("editing-bar");
        editingBar.classList.value = "editing-bar-off";
        textEditor.style.width = "100%";
        preview.style.display = "none";
    }
    else {
        const editingBar = document.getElementById("editing-bar");
        editingBar.classList.value = "editing-bar";
        textEditor.style.width = "50%";
        preview.style.display = "initial";
    }
    EditMode = !EditMode;
}
let PreviewMode = false;
function setPreviewMode() {
    if (!PreviewMode) {
        const editingBar = document.getElementById('editing-bar');
        editingBar.classList.value = "editing-bar-off";
        preview.style.width = "100%";
        preview.style.height = "100%";
        textEditor.style.display = "none";
    }
    else {
        const editingBar = document.getElementById('editing-bar');
        editingBar.classList.value = "editing-bar";
        preview.style.width = "50%";
        preview.style.height = "100%";
        textEditor.style.display = "initial";
    }
    PreviewMode = !PreviewMode;
}
textEditor.addEventListener("click", e => {
    if (e.altKey || (e.ctrlKey && e.shiftKey)) {
        setEditMode();
        e.preventDefault();
    }
    if (contextOn) {
        contextMenu.classList.replace("visible", "hidden");
        contextOn = false;
    }
});
preview.addEventListener("click", e => {
    if (e.altKey || (e.ctrlKey && e.shiftKey)) {
        setPreviewMode();
        e.preventDefault();
    }
});
//when changing the settings for the space insert, this changes the A next to it
function updateSpaceButton() {
    if (Preview) {
        let color = document.getElementById("space-color").value;
        let amount = document.getElementById("space-amount").value;
        let amountUnit = document.getElementById("space-unit").value;
        let spaceButton = document.getElementById("space-button");
        spaceButton.style.marginLeft = amount + amountUnit;
        spaceButton.style.backgroundColor = color;
    }
}
//when changing the settings for the border insert, this changes the A next to it
function updateBorderButton() {
    if (Preview) {
        let size = document.getElementById('border-size').value;
        let unit = document.getElementById('border-unit').value;
        let line = document.getElementById('border-line-types').value;
        let color = document.getElementById('border-color').value;
        let side = document.getElementById("border-direction").value;
        const borderButton = document.getElementById('border-button');
        borderButton.style.border = "";
        switch (side) {
            case ">":
                borderButton.style.borderRight = `${size}${unit} ${line} ${color}`;
                break;
            case "<":
                borderButton.style.borderLeft = `${size}${unit} ${line} ${color}`;
                break;
            case "v":
                borderButton.style.borderBottom = `${size}${unit} ${line} ${color}`;
                break;
            case "^":
                borderButton.style.borderTop = `${size}${unit} ${line} ${color}`;
                break;
            default:
                borderButton.style.border = `${size}${unit} ${line} ${color}`;
                break;
        }
    }
}
//when changing the settings for the shadow insert, this changes the A next to it
function updateShadowButton() {
    if (Preview) {
        let unit = document.getElementById('shadow-dir-unit').value;
        let right = document.getElementById('shadow-right').value;
        let down = document.getElementById('shadow-down').value;
        let color = document.getElementById('shadow-color').value;
        let blur = document.getElementById('shadow-blur').value;
        let blurUnit = document.getElementById("shadow-blur-unit").value;
        const shadowButton = document.getElementById('shadow-button');
        shadowButton.style.textShadow = `${right}${unit} ${down}${unit} ${blur}${blurUnit} ${color}`;
    }
}
//updates the preview when switching between non-custom and custom markdown
cusotmMdChkbx.addEventListener('click', e => {
    if (InterprateLive) {
        let value = textEditor.value;
        preview.innerHTML = convert(value, cusotmMdChkbx.checked);
        if (useMathJaxCheckbox.checked)
            mathJax();
        highlightCode();
    }
});
//updates the preview when the texteditor value changes
textEditor.addEventListener('input', (e) => {
    if (InterprateLive) {
        let { value } = e.target;
        //matches the variable things like [VAR:x=y]
        preview.innerHTML = convert(value, cusotmMdChkbx.checked);
        if (useMathJaxCheckbox.checked)
            mathJax();
        highlightCode();
    }
    save().then();
});
//when ctrl + right click, opens color picker
textEditor.addEventListener("contextmenu", (e) => {
    if (e.ctrlKey) {
        contextMenuColorpicker.click();
        e.preventDefault();
        return;
    }
    if (e.altKey && textEditor.selectionStart - textEditor.selectionEnd < 0) {
        contextMenu.classList.replace("hidden", "visible");
        contextMenu.style.top = String(e.clientY) + "px";
        contextMenu.style.left = String(e.clientX) + "px";
        e.preventDefault();
        contextOn = true;
    }
});
//triggers when a file is added to the page
fileReader.addEventListener("change", (e) => {
    const fr = new FileReader();
    fr.onload = () => {
        textEditor.value = fr.result;
        preview.innerHTML = convert(fr.result, cusotmMdChkbx.checked);
        if (useMathJaxCheckbox.checked)
            mathJax();
        highlightCode();
    };
    fr.readAsText(fileReader.files[0]);
});
//syncs the scrolling of preview and text-editor if that's on
//so that it doesn't scroll on it's own
var pScroll = false;
var eScroll = false;
preview.addEventListener("scroll", (e) => {
    if (!SyncScrolling)
        return;
    if (eScroll) {
        eScroll = false;
        return;
    }
    pScroll = true;
    let percent = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    textEditor.scrollTop = percent * (textEditor.scrollHeight - textEditor.clientHeight);
});
textEditor.addEventListener("scroll", (e) => {
    if (!SyncScrolling)
        return;
    if (pScroll) {
        pScroll = false;
        return;
    }
    eScroll = true;
    let percent = textEditor.scrollTop / (textEditor.scrollHeight - textEditor.clientHeight);
    preview.scrollTop = percent * (preview.scrollHeight - preview.clientHeight);
});
async function save() {
    localStorage.setItem("textEditorValue", textEditor.value);
    localStorage.setItem("customEmojis", JSON.stringify(userDefinedEmotes));
}
function findMatchingRegexes(log = true) {
    return (new Promise((resolve, reject) => {
        let matches = [];
        const selection = textEditor.value.slice(textEditor.selectionStart, textEditor.selectionEnd);
        for (let regex of regexes) {
            let r = regex[0];
            if (selection.match(r)) {
                if (log)
                    console.log(selection, r, typeof regex[1] == 'function' ? regex[1].toString() : regex[1]);
                matches.push([selection, r, regex[1]]);
            }
        }
        matches[0] ? resolve(matches) : reject("no matches");
    })).then(value => {
        return value;
    })
        .catch(reason => {
        console.log(reason);
        return [];
    });
}
document.getElementById("add-custom-emote-value").addEventListener("keydown", e => {
    if (e.key == "Enter") {
        document.getElementById("add-emoji-button").click();
    }
});
document.getElementById("remove-custom-emote").addEventListener("keydown", e => {
    if (e.key == "Enter") {
        document.getElementById("remove-emoji-button").click();
    }
});
document.getElementById("add-custom-emote-name").addEventListener("keydown", e => {
    if (e.key == "Enter") {
        document.getElementById("add-emoji-button").click();
    }
});
document.querySelector("body").removeChild(document.getElementById("loading-screen"));
