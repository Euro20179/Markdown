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
            return this.style.resize || "none"
        }
        return this.style.resize || "both"
    }
}
class Curisve extends HTMLElement{
    connectedCallback(){
        let newStr = "";
        let Close = true;
        for(let char of this.innerHTML){
            if(char == "<"){
                Close = false;
            }
            else if(Close){
                if("abcdefghijklmnopqrstuvwxyz".indexOf(char.toLocaleLowerCase()) > -1) newStr += `&${char}scr;`
                else newStr += char
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
class Midieval extends HTMLElement{
    connectedCallback(){
        let newStr = "";
        let Close = true;
        for(let char of this.innerHTML){
            if(char == "<"){
                Close = false;
            }
            else if(Close){
                if("abcdefghijklmnopqrstuvwxyz".indexOf(char.toLocaleLowerCase()) > -1) newStr += `&${char}fr;`
                else newStr += char
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
class Hollow extends HTMLElement{
    connectedCallback(){
        let newStr = "";
        let Close = true;
        for(let char of this.innerHTML){
            if(char == "<"){
                Close = false;
            }
            else if(Close){
                if("abcdefghijklmnopqrstuvwxyz".indexOf(char.toLocaleLowerCase()) > -1) newStr += `&${char}opf;`
                else newStr += char
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

customElements.define("c-textbox", Textbox)
customElements.define("c-variables", Variables)
customElements.define('c-circled', Circled)
customElements.define('c-rainbow', Rainbow)
customElements.define("c-3d", threeDGlasses)
customElements.define("c-choose", Choose)
customElements.define("c-random", Rand)
customElements.define("c-spacer", Spacer)
customElements.define("c-shadow", Shadow)
customElements.define("c-alert", Alert)
customElements.define("c-rotate", Rotate)
customElements.define("c-cursive", Curisve)
customElements.define("c-midieval", Midieval)
customElements.define("c-hollow", Hollow)