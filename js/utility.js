//inverting colors
function invertHex(hex) {
    return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
}
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];
            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }
        return str;
    };
//importing files
function dropHandler(e) {
    e.preventDefault();
    const fr = new FileReader();
    fr.onload = () => {
        textEditor.value = fr.result;
        preview.innerHTML = convert(fr.result, cusotmMdChkbx.checked);
    };
    fr.readAsText(e.dataTransfer.files[0]);
}
function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}
//saving files
function saveFile() {
    const downloadB = document.getElementById("download");
    let file = new Blob([preview.innerHTML], { type: "text/markdown" });
    downloadB.href = URL.createObjectURL(file);
    const fileName = document.getElementById("file-name").value;
    downloadB.download = `${fileName}.md`;
}
function savePDF() {
    (new Promise((resolve, reject) => {
        html2pdf()
            .set({
            image: { type: "png" },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: "in",
                orientation: "landscape"
            },
        })
            .from(preview)
            .save();
        resolve("success");
    })).then(value => {
        console.log("saved");
    });
}
function savePlain() {
    const downloadB = document.getElementById("download-plain");
    let file = new Blob([textEditor.value], { type: "text/markdown" });
    downloadB.href = URL.createObjectURL(file);
    const fileName = document.getElementById("file-name").value;
    downloadB.download = `${fileName}-plain.txt`;
}
function printMe(elem) {
    var myframe = document.createElement('IFRAME');
    myframe.domain = document.domain;
    myframe.style.position = "absolute";
    myframe.style.top = "-10000px";
    document.body.appendChild(myframe);
    myframe.contentDocument.write(elem.innerHTML);
    myframe.focus();
    myframe.contentWindow.print();
    myframe.parentNode.removeChild(myframe); // remove frame
    // wait for images to load inside iframe
    window.focus();
}
/**
*
* @param {string} newText
* @param {number} endSpot
*/
function typeInTextarea(newText, endSpot = 1) {
    let el = textEditor;
    let [start, end] = [el.selectionStart, el.selectionEnd];
    el.setRangeText(newText.substring(0, endSpot), start, start, 'end');
    el.setRangeText(newText.substring(endSpot, newText.length), end + endSpot, end + endSpot);
    if (start != end)
        end += endSpot;
    el.setSelectionRange(end + endSpot, end + endSpot);
    preview.innerHTML = convert(el.value, cusotmMdChkbx.checked);
}
/**
 *
 * @param {string} startText
 * @param {string} endText
 */
function startEndTypeInTextArea(startText, endText, options = null) {
    let el = textEditor;
    let [start, end] = [el.selectionStart, el.selectionEnd];
    if (options) {
        if (options.special) {
            if (el.value.slice(start, end).match(options.specialMatch)) {
                startText = options["special"].start;
                endText = options["special"].end;
            }
        }
    }
    el.setRangeText(startText, start, start, 'end'); //the start text placement
    el.setRangeText(endText, end + startText.length, end + startText.length); //the end text  placement
    if (start != end)
        end += endText.length;
    let cursorStart = end + startText.length;
    //default cursor is when it's replacing no text
    //cursor is when it's putting text in the new text
    if (options) {
        if (options.cursor) {
            if (options.defaultCursor && start == end) {
                cursorStart = start + options.defaultCursor;
            }
            else if (options.cursor < 0) {
                cursorStart += options.cursor;
            }
            else
                cursorStart = start + options.cursor;
        }
    }
    el.setSelectionRange(cursorStart, cursorStart);
    preview.innerHTML = convert(el.value, cusotmMdChkbx.checked);
}
function addTextTypeInTextArea(text, selectType = "end") {
    let el = textEditor;
    el.setRangeText(text, el.selectionStart, el.selectionEnd, selectType);
    preview.innerHTML = convert(el.value, cusotmMdChkbx.checked);
}
String.prototype.multiply = function (times) {
    let newString = this;
    for (let i = 1; i < times; i++) {
        newString += this;
    }
    return newString;
};
