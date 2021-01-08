function invisiblitizeElement(elem) {
    elem.style.visibility = "hidden";
    elem.style.position = "absolute";
}
function visibilitizeElement(elem) {
    elem.style.visibility = "unset";
    elem.style.position = "unset";
}
function setResults(value) {
    document.getElementById("results-counter").innerHTML = `Results: ${value}`;
}
let counter = 0;
let emojis = document.querySelectorAll(".data-emoji-div");
let emojiCount = emojis.length;
const search = document.getElementById("search");
search.addEventListener("input", e => {
    new Promise((resolve, reject) => {
        let value = new RegExp(search.value, "i");
        for (let elem of emojis) {
            visibilitizeElement(elem);
            if (!elem.id.match(value)) {
                if (!(elem.style.display == "none")) {
                    invisiblitizeElement(elem);
                }
            }
        }
        resolve();
    }).then(() => {
        for (let i = 0; i < emojis.length; i++) {
            if (emojis[i].style.visibility == "hidden") {
                counter++;
            }
        }
        setResults(emojiCount - counter);
    });
    counter = 0;
});
