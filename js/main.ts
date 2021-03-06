const textEditor = document.querySelector('.text-editor') as HTMLTextAreaElement
const preview = document.querySelector('.preview') as HTMLDivElement
const cusotmMdChkbx = document.getElementById("custom") as HTMLInputElement
const fileReader = document.getElementById("fileReader") as HTMLInputElement
const contextMenuColorpicker = document.getElementById("context-menu-color-picker")
const contextMenu = document.getElementById("context-menu") as HTMLDivElement
const useMathJaxCheckbox = document.getElementById("mathjax") as HTMLInputElement
const useSyntaxHighlighting = document.getElementById("syntax-parsing") as HTMLInputElement
const saveIcon = document.getElementById("save-icon") as HTMLSpanElement

let contextOn = false
let InterprateLive = (<HTMLInputElement>document.getElementById("live-interprate")).checked
let Preview = (<HTMLInputElement>document.getElementById("previews")).checked
let tabs: Tab[] = []
let DarkMode = (<HTMLInputElement>document.getElementById("darkmode")).checked
let TypingElem = false;
let currTypingElem = []
let extraElemTextLength = 0;
let elementInnerHTML;
let AutoCompleteElements = (<HTMLInputElement>document.getElementById("autocomplete-elements")).checked
let tabOverAmount = 0
let lastKeyStrokeWasEnter = false;
let autoTab = document.getElementById("auto-tab") as HTMLInputElement

const actionHistory = {
    history: [],
    undo(){
        actionHistory.history.splice(actionHistory.history.length - 1, 1)
        textEditor.value = actionHistory.history[actionHistory.history.length - 1];
    },
    add(){
        actionHistory.history.push(textEditor.value)
    }
}

function highlightCode(){
    if(useSyntaxHighlighting.checked)
    //@ts-ignore
        Prism.highlightAll()
}
if(localStorage.getItem("textEditorValue")){
    textEditor.value = localStorage.getItem("textEditorValue")
    preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked)
    if(useMathJaxCheckbox.checked) mathJax()
    highlightCode()
}
textEditor.style.backgroundColor = (<HTMLInputElement>document.getElementById("text-editor-color")).value
textEditor.style.color = (<HTMLInputElement>document.getElementById("text-editor-text-color")).value

preview.style.backgroundColor = (<HTMLInputElement>document.getElementById("preview-color")).value
preview.style.color = (<HTMLInputElement>document.getElementById("preview-text-color")).value

const urlParams = new URLSearchParams(location.search.replace("*", "#"))
for(let queary of urlParams){
    let [q, value] = queary
    switch(q){
        case "editor":
            textEditor.style.backgroundColor = value; break;
        case "editortext": textEditor.style.color = value; break;
        case "darkmode": DarkMode = true; break;
        case "lightmode": DarkMode = false; break;
        case "preview":
            preview.style.backgroundColor = value;
            break;
        case "previewtext":
            preview.style.color = value
            break;
    }
}
setDarkMode()
function setDarkMode(){
    //this is very normal syntax that i highly recommend
    document.body.classList[DarkMode ? "add" : "remove"]("darkmode")
}

function mathJax(){
    // TeX-AMS_HTML
    //@ts-ignore
    MathJax.Hub.Config({
        jax: [
            'input/TeX',
            'output/HTML-CSS',
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
        skipStartupTypeset: false, // disable initial rendering
        positionToHash: false
    })
// set specific container to render, can be delayed too
    //@ts-ignore
    MathJax.Hub.Queue(
        //@ts-ignore
        ['Typeset', MathJax.Hub, 'preview']
    )
    
}

function turnOffAllOtherTabs(currTab){
    for(let tab of tabs){
        tab.turnOff()
    }
    currTab.turnOn()
}

class Tab{
    tab: HTMLDivElement;
    tabTitle: HTMLButtonElement
    constructor(tab, tabTitle){
        this.tab = tab
        this.tabTitle = tabTitle
        this.tabTitle.addEventListener("click", (e)=>{
            for(let tab of tabs){
                tab.turnOff()
            }
            this.turnOn()
        })
        tabs.push(this)
    }
    turnOff(){
        this.tab.classList.value = "bar-section-off"
        this.tabTitle.classList.value = "bar-section-title title-off"
    }
    turnOn(){
        this.tab.classList.value = "bar-section-on"
        this.tabTitle.classList.value = "bar-section-title title-on"
    }
}

const homeTab = new Tab(document.getElementById("home"), document.getElementById("home-title"))
const insertTab = new Tab(document.getElementById("insert"), document.getElementById('insert-title'))
const fileTab = new Tab(document.getElementById("file"), document.getElementById("file-title"))
const optionsTab = new Tab(document.getElementById("options"), document.getElementById("options-title"))
const UIOptionsTab = new Tab(document.getElementById("ui-options"), document.getElementById("ui-title"))
const helpTab = new Tab(document.getElementById("help"), document.getElementById("help-title"))
const countTab = new Tab(document.getElementById("count"), document.getElementById("count-title"))
const emojisTab = new Tab(document.getElementById("emojis"), document.getElementById("emojis-title"))
const regexTab = new Tab(document.getElementById("custom-regex"), document.getElementById("custom-regex-title"))

let currTab = homeTab
turnOffAllOtherTabs(currTab)

var SyncScrolling = (<HTMLInputElement>document.getElementById("syncscrolling")).checked;

function addBorder(){
    let size = (<HTMLInputElement>document.getElementById('border-size')).value; 
    let unit = (<HTMLInputElement>document.getElementById('border-unit')).value;
    let line = (<HTMLInputElement>document.getElementById('border-line-types')).value; 
    let color = (<HTMLInputElement>document.getElementById('border-color')).value;
    let direction = (<HTMLInputElement>document.getElementById('border-direction')).value
    startEndTypeInTextArea(`|${direction}[${size}${unit} ${line} ${color}]`, '|')
}

function addSpace(){
    let color = (<HTMLInputElement>document.getElementById("space-color")).value
    let amount = (<HTMLInputElement>document.getElementById("space-amount")).value
    let unit = (<HTMLInputElement>document.getElementById("space-unit")).value
    startEndTypeInTextArea(`{space${color} ${amount}${unit}}`, "")
}

function addShadow(){
    let unit = (<HTMLInputElement>document.getElementById('shadow-dir-unit')).value;
    let right = (<HTMLInputElement>document.getElementById('shadow-right')).value;
    let down = (<HTMLInputElement>document.getElementById('shadow-down')).value;
    let color = (<HTMLInputElement>document.getElementById('shadow-color')).value;
    let blur = (<HTMLInputElement>document.getElementById('shadow-blur')).value;
    let blurUnit = (<HTMLInputElement>document.getElementById("shadow-blur-unit")).value;
    startEndTypeInTextArea(`{shadow'${right}${unit} ${down}${unit} ${blur}${blurUnit} ${color}'`, '}')
}

function addOLULInclude(){
    let types = (<HTMLInputElement>document.getElementById("ul-ol-types")).value
    if(types){
        startEndTypeInTextArea(`\\${(<HTMLInputElement>document.getElementById('ul-ol')).value}marker:${(<HTMLInputElement>document.getElementById('list-layer')).value}\\TYPE:${types}\\`, "")
    }else startEndTypeInTextArea(`\\${(<HTMLInputElement>document.getElementById('ul-ol')).value}marker:${(<HTMLInputElement>document.getElementById('list-layer')).value}\\${(<HTMLInputElement>document.getElementById('marker-text')).value}\\`, "")
}

function addToCurrElem(e){
    if(currTypingElem[currTypingElem.length - 1] === " " && TypingElem){
        extraElemTextLength += 1;
        return;
    }
    else if(TypingElem && e.key == "Backspace"){
        currTypingElem.length -= 1
    }
    else if(TypingElem && e.key.length === 1 && e.key != "<"){
        currTypingElem.push(e.key)
    }
    if(TypingElem && !currTypingElem.length){
        TypingElem = false;
        extraElemTextLength = 0;
    }
}

function keyPresses(e: KeyboardEvent){
    if(AutoCompleteElements){
        //starts the element
        if(e.key == "<"){
            elementInnerHTML = [textEditor.selectionStart, textEditor.selectionEnd]
            textEditor.setRangeText("<", textEditor.selectionStart, textEditor.selectionStart)
            textEditor.setSelectionRange(textEditor.selectionStart + 1, textEditor.selectionStart + 1)
            TypingElem = true;
            e.preventDefault()
        }
        else if(TypingElem && e.key == "/"){
            TypingElem = false;
            currTypingElem = []
            elementInnerHTML = []
        }
        //ends the typing element
        else if(TypingElem && e.key == ">"){
            if(["hr", "wbr", "br"].indexOf(currTypingElem.join("")) < 0){

                startEndTypeInTextArea(">", "")

                //+2 is the length of < and >
                //extraElemTextLength is the stuff like style=
                textEditor.setSelectionRange(elementInnerHTML[1] + currTypingElem.length + 2 + extraElemTextLength, elementInnerHTML[1] + currTypingElem.length + 2 + extraElemTextLength)
                textEditor.setRangeText(`</${currTypingElem.join("")}>`)
                currTypingElem = []
                TypingElem = false;
                elementInnerHTML = []
                e.preventDefault();
            }
            currTypingElem = []
            TypingElem = false;
            elementInnerHTML = []
        }
        //appends to curr element if applicable
        else if(TypingElem){
            addToCurrElem(e)
        }
    }
    //non-combo key presses
    if(!e.ctrlKey && !e.altKey && !e.shiftKey){
        switch (e.key) {
            case "Backspace":
                if(autoTab.checked && lastKeyStrokeWasEnter &&  tabOverAmount > 0){
		    tabOverAmount--
		    lastKeyStrokeWasEnter = true
                }
                break;
            case "Enter":
                if(autoTab.checked){
                    if(tabOverAmount > 0){
                        //@ts-ignore
                        if(lastKeyStrokeWasEnter){
                            let start = textEditor.selectionStart
                            textEditor.value = textEditor.value.slice(0, textEditor.selectionStart - 1) + textEditor.value.slice(textEditor.selectionStart)
                            textEditor.selectionStart = start - 1;
                            textEditor.selectionEnd = start - 1;
                        } else startEndTypeInTextArea("\n" + mulString("	", tabOverAmount), "")
                    }
                    else{
                        startEndTypeInTextArea("\n", "")
                    }
                    if(lastKeyStrokeWasEnter){
                        if(tabOverAmount > 0){
                            tabOverAmount--;
                        }
                    }
                    lastKeyStrokeWasEnter = true;
                    e.preventDefault()
                }
                break;
            case "Tab":
                startEndTypeInTextArea("	", "")
                tabOverAmount++;
                e.preventDefault()        
                break;
            case "F6":
                DarkMode = !DarkMode
                setDarkMode()
                e.preventDefault()
                break
            case "F9":
                useMathJaxCheckbox.checked = !useMathJaxCheckbox.checked;
                if(useMathJaxCheckbox.checked)
                    mathJax()
                else
                    preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked)
                e.preventDefault()
                break;
            case "F4":
                document.getElementById("custom").click()
                e.preventDefault()
                break
            case "F2":
                document.getElementById("live-interprate").click()
                e.preventDefault()
                break;
            default:
                break;
        }
        if(e.key != "Enter" && e.key != "Backspace")
            lastKeyStrokeWasEnter = false;
    }
    //ctrl + key
    else if(e.ctrlKey  && !e.shiftKey && !e.altKey){
	if ("q,.burdhiesp1fg23456789kz'".includes(e.key)) e.preventDefault()
        switch(e.key){
            case "q": typeInTextarea("''''", 2); break;                
            case ",": startEndTypeInTextArea("\\_[", "]"); break;
            case ".": startEndTypeInTextArea("\\^[", "]"); break;
            case "b": typeInTextarea("****", 2); break;
            case "u": typeInTextarea("__"); break;
            case "r": typeInTextarea("~__~", 2); break;
            case "d": typeInTextarea(".__.", 2); break;
            case "h": typeInTextarea("*--*", 2); break;
            case "i": typeInTextarea('**'); break;     
            case "e": typeInTextarea("``"); break;           
            case "s": typeInTextarea('~~~~', 2); break;
            case "p": typeInTextarea(">PRO: ", 6);break;
            case "1": fileTab.tabTitle.click(); break
            case "f": countTab.tabTitle.click();document.getElementById("find-search").focus();break;
            case "g": countTab.tabTitle.click();document.getElementById("preview-search-count").focus();break;
            case "2": countTab.tabTitle.click();break;
            case "3": homeTab.tabTitle.click();break;
            case "4": insertTab.tabTitle.click();break;
            case "5": emojisTab.tabTitle.click();break;
            case "6": regexTab.tabTitle.click();break;
            case "7": helpTab.tabTitle.click();break;
            case "8": UIOptionsTab.tabTitle.click();break;
            case "9": optionsTab.tabTitle.click();break;
            case "k": startEndTypeInTextArea("[](", ")", {cursor: 1}); break
            case "z": actionHistory.undo();  break;
            case "'":
                addOLULInclude()
                
                e.preventDefault();break;
        }
    }
    //alt key
    else if(e.altKey && !e.shiftKey && !e.ctrlKey){
	if ("pishb69421".includes(e.key)) e.preventDefault()
        switch(e.key){
            case "p":
                contextMenuColorpicker.click();
                break;
            case "i":
                typeInTextarea("``")
                break
            case "s":
                addShadow()
                break
            case "h":
                addSpace();
                break;
            case "b":
                addBorder()
                break;
            case "6":
                DarkMode = !DarkMode
                setDarkMode()
                break
            case "9":
                useMathJaxCheckbox.checked = !useMathJaxCheckbox.checked;
                if(useMathJaxCheckbox.checked)
                    mathJax()
                else
                    preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked)
                break;
            case "4":
                document.getElementById("custom").click()
                break
            case "2":
                document.getElementById("live-interprate").click()
                break;
            case "1":
                textEditor.style.cursor = "wait"
                preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked)
                highlightCode()
                if(useMathJaxCheckbox.checked)mathJax()
                textEditor.style.cursor = "initial"
                break;
        }
    }
    //ctrl + shift + key
    else if(e.ctrlKey && e.shiftKey && !e.altKey){
	if ("URD?FESZBT!@#$%^&*{}|".includes(e.key)) e.preventDefault()
        switch(e.key.toUpperCase()){
        case "U":
            typeInTextarea('^__^', 2);  break;
        case "R":
            typeInTextarea('^~~^', 2);  break;
        case "D":
            typeInTextarea('^..^', 2);  break;
        case "?":
            startEndTypeInTextArea("> ", "\n-");  break;
        case "F":
            startEndTypeInTextArea('f[]', '|', {cursor:2, defaultCursor:2});  break;
        case "E":
            const editingBar = document.getElementById('editing-bar')
	    editingBar.classList.value = editingBar.classList.contains("editing-bar-off") ? "editing-bar" : "editing-bar-off"
            break;
        case "S": 
            let currTextSize = (<HTMLInputElement>document.getElementById("text-size")).value
            const currTextUnit = (<HTMLInputElement>document.getElementById("text-units")).value
            if (parseInt(currTextSize.slice(-1)) >= 0){
                currTextSize += currTextUnit
            }
            startEndTypeInTextArea(`s[${currTextSize}]`, '|')
            break;
        case "Z":
            const currColorSelected = (<HTMLInputElement>document.getElementById("text-color")).value
            startEndTypeInTextArea(`#[${currColorSelected.split("#")[1]}]`, '|')
            break; 
        case "B":
            typeInTextarea('> \'\'\'\'[author]', 4)
            break;
        case "T":
            startEndTypeInTextArea('|', '||\n|---|---|\n|||');break;
        case "!":
            startEndTypeInTextArea(`<c-3d>`, `</c-3d>`);  break
        case "@":
            startEndTypeInTextArea("<c-rainbow>", "</c-rainbow>");  break
        case "#":
            startEndTypeInTextArea("<c-upsidedown>", "</c-upsidedown>");  break;
        case "$":
            startEndTypeInTextArea("<c-circled>", "</c-circled>");  break;
        case "%":
            startEndTypeInTextArea("<c-unicode>", "</c-unicode>");  break;
        case "^":
            startEndTypeInTextArea("<c-choose items=''>", "</c-choose>");  break;
        case "&":
            startEndTypeInTextArea("<c-random min=0 max=100 round=0>", "</c-random>");  break;
        case "*":
            startEndTypeInTextArea("<c-spacer></c-spacer>", "");break;
        case "{":
            startEndTypeInTextArea("|", "<-|");break;
        case "}": startEndTypeInTextArea("|->", "|");break;
        case "|": startEndTypeInTextArea("|->", "<-|");break;
        }
    }
    //alt + ctrl + key
    else if(e.altKey && e.ctrlKey && !e.shiftKey){
        switch(e.key){
            case "u":
                typeInTextarea("____", 2),
                e.preventDefault();
                break
            case "p": startEndTypeInTextArea(">CON: ", "");e.preventDefault(); break
            case "i":startEndTypeInTextArea("```\n", "\n```");e.preventDefault();break;
        }
    }
    //alt + shift + ctrl + key
    else if(e.altKey && e.shiftKey && e.ctrlKey){
        switch(e.key.toUpperCase()){
            case "O": document.getElementById('fileReader').click(); e.preventDefault(); break; 
            case "Z":
                 let currBGColorSelected = (<HTMLInputElement>document.getElementById("background-color")).value
                startEndTypeInTextArea(`[${currBGColorSelected}]*-`, "-*")
                e.preventDefault()           
                break;  
            case "F":
                startEndTypeInTextArea("\\font{arial}\n", "")
                e.preventDefault();
                break;
            case "U":
                typeInTextarea("^^__^^", 3),
                e.preventDefault();
                break;
	    case "C":
                textEditor.style.cursor = "wait"
                preview.innerHTML = convert(textEditor.value, cusotmMdChkbx.checked)
                highlightCode()
                if(useMathJaxCheckbox.checked)mathJax()
                textEditor.style.cursor = "initial"
		e.preventDefault()
		break
        }
    } 
}

document.addEventListener("keydown", e=>{
    if(e.key == "Escape" && (PreviewMode || EditMode)){
        if(PreviewMode)
            setPreviewMode()
        else
            setEditMode()
    }
    else if(e.altKey && e.key == "q"){
        printMe(preview)
    }
    else if(e.altKey && e.shiftKey && e.ctrlKey){
	if ("SBP".includes(e.key)) e.preventDefault()
        switch(e.key.toUpperCase()){
            case "S": 
                saveFile();       
                document.getElementById("download").click()    
                break;
            case "B":
                savePlain();
                document.getElementById("download-plain").click();
                break;
            case "P":
                savePDF();
                break; 
        }
        if(document.activeElement == textEditor){
            keyPresses(e)
        }
    }
    else if(document.activeElement == textEditor){
        keyPresses(e)
    }
})

document.getElementById("preview-search-count").addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        document.getElementById("count-of-button").click()
        e.preventDefault();
    }
})

let EditMode = false;
function setEditMode(){
    const editingBar = document.getElementById("editing-bar");
    [editingBar.classList.value, textEditor.style.width, preview.style.display] = EditMode ? ["editing-bar", "50%", "initial"] : ["editing-bar-off", "100%", "none"]
    EditMode = !EditMode
}

let PreviewMode = false;
function setPreviewMode(){
    if(!PreviewMode){
        const editingBar = document.getElementById('editing-bar')
        editingBar.classList.value = "editing-bar-off"
        preview.style.width = "100%";
        preview.style.height = "100%";
        textEditor.style.display = "none"
    }
    else{
        const editingBar = document.getElementById('editing-bar')
        editingBar.classList.value = "editing-bar"
        preview.style.width = "50%";
        preview.style.height = "100%";
        textEditor.style.display = "initial"
    }
    PreviewMode = !PreviewMode
}

textEditor.addEventListener("click", e=>{
    if(e.altKey || (e.ctrlKey && e.shiftKey)){
        setEditMode()
        e.preventDefault()
    }
    if(contextOn){
        contextMenu.classList.replace("visible", "hidden")
        contextOn = false;
    }
})

preview.addEventListener("click", e=>{
    if(e.altKey || (e.ctrlKey && e.shiftKey)){
        setPreviewMode()
        e.preventDefault();
    }
})

//when changing the settings for the space insert, this changes the A next to it
function updateSpaceButton(){
    if(Preview){
        let color = (<HTMLInputElement>document.getElementById("space-color")).value;
        let amount = (<HTMLInputElement>document.getElementById("space-amount")).value;
        let amountUnit = (<HTMLInputElement>document.getElementById("space-unit")).value;
        let spaceButton = document.getElementById("space-button")
        spaceButton.style.marginLeft=amount + amountUnit
        spaceButton.style.backgroundColor = color;
    }
}

//when changing the settings for the border insert, this changes the A next to it
function updateBorderButton(){
    if(Preview){
        let size = (<HTMLInputElement>document.getElementById('border-size')).value; 
        let unit = (<HTMLInputElement>document.getElementById('border-unit')).value;
        let line = (<HTMLInputElement>document.getElementById('border-line-types')).value; 
        let color = (<HTMLInputElement>document.getElementById('border-color')).value;
        let side = (<HTMLInputElement>document.getElementById("border-direction")).value;
        const borderButton = document.getElementById('border-button')
        borderButton.style.border = "";
        switch(side){
            case ">":
                borderButton.style.borderRight = `${size}${unit} ${line} ${color}`; break
            case "<":
                borderButton.style.borderLeft = `${size}${unit} ${line} ${color}`; break
            case "v":
                borderButton.style.borderBottom = `${size}${unit} ${line} ${color}`; break;
            case "^":
                borderButton.style.borderTop = `${size}${unit} ${line} ${color}`; break
            default:
                borderButton.style.border = `${size}${unit} ${line} ${color}`; break
        }
    }
}

//when changing the settings for the shadow insert, this changes the A next to it
function updateShadowButton(){
    if(Preview){
        let unit = (<HTMLInputElement>document.getElementById('shadow-dir-unit')).value;
        let right = (<HTMLInputElement>document.getElementById('shadow-right')).value;
        let down = (<HTMLInputElement>document.getElementById('shadow-down')).value;
        let color = (<HTMLInputElement>document.getElementById('shadow-color')).value;
        let blur = (<HTMLInputElement>document.getElementById('shadow-blur')).value;
        let blurUnit = (<HTMLInputElement>document.getElementById("shadow-blur-unit")).value;
        const shadowButton = document.getElementById('shadow-button')
        shadowButton.style.textShadow = `${right}${unit} ${down}${unit} ${blur}${blurUnit} ${color}`
    }
}

//updates the preview when switching between non-custom and custom markdown
cusotmMdChkbx.addEventListener('click', e=>{
    if(InterprateLive){
        let value  = textEditor.value
        preview.innerHTML = convert(value, cusotmMdChkbx.checked)
        if(useMathJaxCheckbox.checked)mathJax()
        highlightCode()
    }
})
//updates the preview when the texteditor value changes
textEditor.addEventListener('input', (e)=>{
    save().then(()=>{
        if(InterprateLive){
            let { value } = <HTMLTextAreaElement>e.target;
            //matches the variable things like [VAR:x=y]
            preview.innerHTML = convert(value, cusotmMdChkbx.checked)
            if(useMathJaxCheckbox.checked)mathJax()
            highlightCode()
        }
        save().then()
    })
})

//when ctrl + right click, opens color picker
textEditor.addEventListener("contextmenu", (e)=>{
    if(e.ctrlKey){
        contextMenuColorpicker.click()
        e.preventDefault()
        return;
    }
    if(e.altKey && textEditor.selectionStart - textEditor.selectionEnd < 0){
        contextMenu.classList.replace("hidden", "visible")
        contextMenu.style.top = String(e.clientY) + "px"
        contextMenu.style.left = String(e.clientX) + "px"
        e.preventDefault()
        contextOn = true
    }
})

//triggers when a file is added to the page
fileReader.addEventListener("change", (e)=>{
    const fr = new FileReader();
    fr.onload=()=>{
        textEditor.value = <string>fr.result
        preview.innerHTML = convert(fr.result, cusotmMdChkbx.checked)
        if(useMathJaxCheckbox.checked)mathJax()
        highlightCode()
    }
    fr.readAsText(fileReader.files[0])

})

//syncs the scrolling of preview and text-editor if that's on
//so that it doesn't scroll on it's own
var pScroll = false;
var eScroll = false;

preview.addEventListener("scroll", (e)=>{
    if(!SyncScrolling) return;
    if(eScroll){
        eScroll = false;
        return;
    }
    pScroll = true;
    let percent = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
    textEditor.scrollTop = percent * (textEditor.scrollHeight - textEditor.clientHeight)
})


textEditor.addEventListener("scroll", (e)=>{
    if(!SyncScrolling) return;
    if(pScroll){
        pScroll = false;
        return;
    }
    eScroll = true;
    let percent = textEditor.scrollTop / (textEditor.scrollHeight - textEditor.clientHeight)
    preview.scrollTop = percent * (preview.scrollHeight - preview.clientHeight)
})

async function save(){
    localStorage.setItem("textEditorValue", textEditor.value)
    localStorage.setItem("customEmojis", JSON.stringify(userDefinedEmotes))
}

function findMatchingRegexes(log=true){
    return (new Promise((resolve, reject)=>{
        let matches = []
        const selection = textEditor.value.slice(textEditor.selectionStart, textEditor.selectionEnd)
        for(let regex of regexes){
            let r = <RegExp>regex[0]
            if(selection.match(r)){
                if(log)console.log(selection, r, typeof regex[1] == 'function' ? regex[1].toString() : regex[1])
                matches.push([selection, r, regex[1]])
            }
        }
        matches[0] ? resolve(matches) : reject("no matches")
    })).then(value=>{
        return value
    })
    .catch(reason=>{
        console.log(reason)
        return []
    })
}
document.querySelector("body").removeChild(document.getElementById("loading-screen"))
