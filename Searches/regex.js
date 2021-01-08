const container = document.querySelector(".regular-expression-container");
const expressions = JSON.parse(localStorage.getItem("customRegularExpressions"));
const regContainer = document.querySelector(".regular-expression-container");
const copySpot = document.getElementById("copy-spot");
for (let regex of expressions) {
    let div = document.createElement("div");
    div.classList.add("regular-expression");
    let toolTip = document.createElement("span");
    toolTip.classList.add("tool-tip");
    toolTip.innerText = regex[0];
    let value = document.createTextNode(regex[1]);
    div.appendChild(value);
    div.appendChild(toolTip);
    new Promise((resolve, reject) => {
        div.addEventListener("click", e => {
            copySpot.value = regex[0];
            copySpot.select();
            document.execCommand("copy");
        });
        div.addEventListener("contextmenu", e => {
            copySpot.value = value.textContent;
            copySpot.select();
            document.execCommand('copy');
            e.preventDefault();
        });
        resolve("");
    }).then(() => {
        regContainer.appendChild(div);
    });
}
