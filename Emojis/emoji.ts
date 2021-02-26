function invisiblitizeElement(elem: HTMLElement){
    elem.style.visibility = "hidden"
    elem.style.position = "absolute"
}
function visibilitizeElement(elem: HTMLElement){
    elem.style.visibility = "unset"
    elem.style.position = "unset"
}
function setResults(value: number){
    document.getElementById("results-counter").innerHTML = `Results: ${value}`
}
let counter = 0;
let emojis = document.querySelectorAll(".data-emoji-div")
let emojiCount = emojis.length
const search = document.getElementById("search") as HTMLInputElement
search.addEventListener("input", e=>{
    new Promise<void>((resolve, reject)=>{
        let value = new RegExp(search.value, "i")
        for(let elem of emojis){
            visibilitizeElement(elem as HTMLElement)
            if(!elem.id.match(value)){
                if(!((<HTMLElement>elem).style.display == "none")){
                    invisiblitizeElement(elem as HTMLElement)
                }
            }
        }
        resolve()
    }).then(()=>{
        for(let i = 0; i < emojis.length; i++){
            if((emojis[i] as HTMLElement).style.visibility == "hidden"){
                counter++
            }
        }
        setResults(emojiCount - counter)
    })
    counter = 0;
})