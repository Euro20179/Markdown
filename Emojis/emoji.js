function invisiblitizeElement(elem) {
    elem.style.display = "none";
}
function visibilitizeElement(elem) {
    elem.style.display = "";
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
        for (let elem of emojis) {
            if (elem.style.display == "none") {
                counter++;
            }
        }
        setResults(emojiCount - counter);
    });
    counter = 0;
});
