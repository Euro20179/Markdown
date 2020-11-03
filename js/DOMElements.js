class Upsidedown extends HTMLElement{
    connectedCallback(){
        this.style.transform = this.transform
        this.style.display = this.display
    }
    get display(){
        return this.style.display || "inline-block"
    }
    get transform(){
        return this.style.transform || "rotate(180deg)"
    }
}
class Circled extends HTMLElement{
    connectedCallback(){
        let newStr = "";
        let Close = true;
        for(let char of this.innerHTML){
            if(char == "<"){
                Close = false;
            }
            else if(Close){
                if(char in circleLetters) newStr += String.fromCharCode(circleLetters[char])
                else newStr += char;
                continue;
            }
            else if(char == ">"){
                Close = true;
            }
            newStr += char;
        }
        this.innerHTML = newStr;
    }
}
class threeDGlasses extends HTMLElement{
    connectedCallback(){
        this.style.textShadow = this.textShadow
        this.style.color = this.color
    }
    get textShadow(){
        if(this.style.textShadow){
            return this.style.textShadow
        }
        return ".3em .2em red"
    }
    get color(){
        if(this.style.color){
            return this.style.color;
        }
        return "blue"
    }
}
class Unicode extends HTMLElement{
    connectedCallback(){
        let newStr = "";
        let Close = true;
        let currCode = "";
        for(let char of this.innerHTML){
            if(char == "<"){
                Close = false;
                newStr += String.fromCodePoint(parseInt(currCode)) + " "
                currCode = ""
            }
            else if(char === " " && Close && currCode){
                newStr += String.fromCodePoint(parseInt(currCode)) + " "
                currCode = ""
                continue;
            }
            else if(Close){
                if(parseInt(char) >= 0) currCode += parseInt(char)
                else newStr += char
                continue;
            }
            else if(char == ">"){
                Close = true;
            }
            newStr += char;
        }
        newStr += String.fromCodePoint(currCode) + " "
        this.innerHTML = newStr;
    }
}
class Rainbow extends HTMLElement{
    connectedCallback(){
        this.style.backgroundImage = `linear-gradient(${this.direction}, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`
        this.style.color = this.color
        this.style.position = this.position
        if(this.absolute){
            this.style.position = "absolute"
        }
        this.style.display = this.display
    }
    get display(){
        if(this.getAttribute("inline") != null)
            return "inline"
        else if(this.style.display)
            return this.style.display
        return "inline-block"
    }
    get position(){
        if(this.style.position){
            return this.style.position
        }
        return "static"
    }
    get absolute(){
        return this.getAttribute("absolute") != null
    }
    get color(){
        if(this.style.color){
            return this.style.color
        }
        return "black"
    }
    get direction(){
        if (this.getAttribute("direction")){
            return this.getAttribute("direction")
        }
        return "to right"
    }
    get spin(){
        if(this.getAttribute('spin')){
            return this.getAttribute('spin')
        }
        return false;
    }
    set direction(val="0deg"){
        this.setAttribute('direction', val)
    }
}

class Choose extends HTMLElement{
    connectedCallback(){
        if(this.items){
            const items = this.items.split("|")
            this.innerHTML = this.innerHTML.replaceAll("$1", items[~~(items.length * Math.random())])
        }
    }
    get items(){
        return this.getAttribute("items")
    }
}

class Rand extends HTMLElement{
    connectedCallback(){
        if(!this.answer){
            this.genNumber()
        }
        this.innerHTML = this.innerHTML.replace(/(?:\{value\}|\$1)/g, this.answer)
    }
    genNumber(){
        this.answer = (Math.random() * (this.max - this.min) + this.min).toFixed(this.round)
    }
    get max(){
        const _max = this.getAttribute("max")
        return _max ? parseInt(_max) : 100
    }
    get min(){
        const _min = this.getAttribute("min")
        return _min ? parseInt(_min) : 1
    }
    get round(){
        const _round = this.getAttribute("round")
        return _round ? parseInt(_round) : 0
    }
}

class Spacer extends HTMLElement{
    connectedCallback(){
        this.style.paddingLeft = this.padding
        this.style.backgroundColor = this.color
    }
    get color(){
        return this.style.backgroundColor ? this.style.backgroundColor : this.getAttribute("color")
    }
    get padding(){
        if(this.getAttribute("amount")){
            if(parseInt(this.amount.slice(-1)) >= 0) return this.amount +  "ch"
            return this.amount
        }
        return this.style.paddingLeft ?? "1ch"
    }
    get amount(){
        return this.getAttribute("amount")
    }
}
class Shadow extends HTMLElement{
    connectedCallback(){
        this.style.textShadow = `${this.left} ${this.down} ${this.blur} ${this.color}`
    }
    get left(){
        return this.getAttribute("left") ?? ".2em"
    }
    get down(){
        return this.getAttribute("down") ?? ".2em"
    }
    get blur(){
        return this.getAttribute("blur") ?? "2px"
    }
    get color(){
        return this.getAttribute("color") ?? "lightgrey"
    }
}
class Alert extends HTMLElement{
    connectedCallback(){
        this.onclick = ()=>{
            alert(this.alert)
        }
    }
    get alert(){
        return this.getAttribute("alert") ?? this.textContent
    }
}

class Confirm extends HTMLElement{
    connectedCallback(){
        this.onclick = ()=>{
            if(confirm(this.prompt)){
                if(this.getAttribute("onconfirm")){
                    Function(this.getAttribute("onconfirm"))()
                }
            }
            else{
                if(this.getAttribute("onreject")){
                    Function(this.getAttribute("onreject"))()
                }
            }
        }
    }
    get prompt(){
        return this.getAttribute("prompt") ?? this.textContent
    }
}

class Prompt extends HTMLElement{
    connectedCallback(){
        this.onclick = ()=>{
            let value = prompt(this.prompt)
            if(value){
                this.oninput(value)
            }
            else{
                if(this.getAttribute("onreject")){
                    Function(this.getAttribute("onreject"))()
                }
            }
        }
    }
    get oninput(){
        return this.getAttribute("oninput") ? Function(this.getAttribute("oninput")) : value=>{
            this.innerHTML = value;
        }
    }
    get prompt(){
        return this.getAttribute("prompt") ?? this.textContent
    }
}

class Time extends HTMLElement{
    constructor(){
        super()
        this.unformattedText = this.textContent
    }
    updateSelf(f){
        const date = new Date()
        this.textContent = this.unformattedText
        .replaceAll("%a", this.numberToShortDay(date.getDay()))
        .replaceAll("%A", this.numberToDay(date.getDay()))
        .replaceAll("%w", date.getDay() + 1)
        .replaceAll("%d", date.getDate())
        .replaceAll("%b", this.numberToShortMonth(date.getMonth()))
        .replaceAll("%B", this.numberToMonth(date.getMonth()))
        .replaceAll("%m", date.getMonth() + 1)
        .replaceAll("%y", String(date.getFullYear()).slice(-2))
        .replaceAll("%Y", date.getFullYear())
        .replaceAll("%H", date.getHours())
        .replaceAll("%h", date.getHours() >= 13 ? date.getHours() - 12 : date.getHours())
        .replaceAll("%p", date.getHours() >= 12 ? "PM" : "AM")
        .replaceAll("%M", date.getMinutes())
        .replaceAll("%S", date.getSeconds())
        .replaceAll("%f", date.getMilliseconds())
        .replaceAll("%z", date.getTimezoneOffset() / 60)
        .replaceAll("%X", date.toLocaleTimeString())
        .replaceAll("%x", date.toLocaleDateString())
    }
    connectedCallback(){
        this.updateSelf()
    }
    numberToDay(n){
        switch(n){
            case 0: return "Sunday"
            case 1: return "Monday"
            case 2: return "Tuesday"
            case 3: return "Wednesday"
            case 4: return "Thursday"
            case 5: return "Friday"
            case 6: return "Saturday"
        }
    }
    numberToShortDay(n){
        switch(n){
            case 0: return "Sun"
            case 1: return "Mon"
            case 2: return "Tue"
            case 3: return "Wed"
            case 4: return "Thu"
            case 5: return "Fri"
            case 6: return "Sat"
        }
    }
    numberToMonth(n){
        switch (n){
            case 0: return "January"
            case 1: return "February"
            case 2: return "March"
            case 3: return "April"
            case 4: return "May"
            case 5: return "June"
            case 6: return "July"
            case 7: return "August"
            case 8: return "September"
            case 9: return "October"
            case 10: return "November"
            case 11: return "December"
        }
    }
    numberToShortMonth(n){
        switch(n){
            case 0: return "Jan"
            case 1: return "Feb"
            case 2: return "Mar"
            case 3: return "Apr"
            case 4: return "May"
            case 5: return "Jun"
            case 6: return "Jul"
            case 7: return "Aug"
            case 8: return "Sep"
            case 9: return "Oct"
            case 10: return "Nov"
            case 11: return "Dec"
        }
    }
}

class Variables extends HTMLElement{
    connectedCallback(){
        for(let attr of this.getAttributeNames()){
            this.innerHTML = this.innerHTML.replaceAll(`%${attr}%`, this.getAttribute(attr))
        }
    }
}

class Rotate extends HTMLElement{
    connectedCallback(){
        this.style.display = this.display
        this.style.transform = `rotate(${this.rotate})`
    }
    get display(){
        return this.style.display || "inline-block"
    }
    get rotate(){
        return this.getAttribute("rotate") || "0deg"
    }
}

class Textbox extends HTMLElement{
    connectedCallback(){
        this.style.overflow = this.overflow;
        this.style.width = this.width;
        this.style.height = this.height;
        this.style.display = this.display;
        this.style.border = this.border;
        this.style.resize = this.resize;
    }
    get overflow(){
        return this.style.overflow || "auto"
    }
    get width(){
        return this.getAttribute("width") ?? ""
    }
    get height(){
        return this.getAttribute("height") ?? ""
    }
    get display(){
        return this.style.display || "inline-block"
    }
    get border(){
        return this.style.border || "1px solid black"
    }
    get resize(){
        if(this.getAttribute("width") || this.getAttribute("height")){
            return "none"
        }
        return this.style.resize || "both"
    }
}

customElements.define("c-textbox", Textbox)
customElements.define("c-variables", Variables)
customElements.define("c-time", Time)
customElements.define('c-upsidedown', Upsidedown)
customElements.define('c-circled', Circled)
customElements.define('c-rainbow', Rainbow)
customElements.define("c-3d", threeDGlasses)
customElements.define("c-choose", Choose)
customElements.define("c-random", Rand)
customElements.define("c-unicode", Unicode)
customElements.define("c-spacer", Spacer)
customElements.define("c-shadow", Shadow)
customElements.define("c-alert", Alert)
customElements.define("c-confirm", Confirm)
customElements.define("c-prompt", Prompt)
customElements.define("c-rotate", Rotate)