const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const parser = math.parser();
math.config({
    number: 'BigNumber',
    // 'number' (default), 'BigNumber', or 'Fraction'
    precision: 64 // Number of significant digits for BigNumbers
});
const upsideDown = {
    a: "\u0250",
    b: "q",
    c: "\u0254",
    d: "p",
    e: "\u01DD",
    f: "\u025f",
    g: "\u0183",
    h: "\u0265",
    i: "\u1D09",
    j: "\u027E",
    k: "\u029E",
    l: "l",
    m: "\u026f",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "\u0279",
    s: "s",
    t: "\u0287",
    u: "n",
    v: "\u028c",
    w: "\u028d",
    x: "x",
    y: "\u028e",
    z: "z",
    A: "\u2200",
    B: "B",
    C: "\u0186",
    D: "D",
    E: "\u018e",
    F: "\u2132",
    G: "\u2141",
    H: "H",
    I: "I",
    J: "\u017f",
    K: "\ua7b0",
    L: "\u025e",
    M: "\u019c",
    N: "N",
    O: "O",
    P: "\u0500",
    Q: "Q",
    R: "\u1d1a",
    S: "S",
    T: "\ua7b1",
    U: "\u2229",
    V: "\u0245",
    W: "\u028d",
    X: "X",
    Y: "\u2144",
    Z: "Z",
    " ": " ",
    "!": "¡",
    "?": "¿"
};
const circleLetters = {
    A: 9398,
    " ": 32,
    0: 9450,
    1: 9312,
    2: 9313,
    3: 9314,
    4: 9315,
    5: 9316,
    6: 9317,
    7: 9318,
    8: 9319,
    9: 9320
};
for (let x = 1; x < 52; x++) {
    circleLetters[CHARS[x]] = circleLetters["A"] + x;
}
const regexes = [
    [
        /(?<!\\)\\RAND(?:\{([0-9]+) ([0-9]+)\})?\\/g,
        (_, one = null, two = null) => {
            if (!one) {
                one = 0;
                two = 100;
            }
            return Math.floor((Math.random() * two) + 1);
        }
    ],
    [
        /(?<!\\):U_([0-9]+):/g,
        (_, chr) => {
            return String.fromCodePoint(chr);
        }
    ],
    [
        /(?<!\\)\\EMOJI\\/g,
        () => {
            return String.fromCodePoint(Math.floor(Math.random() * (129003 - 127744) + 127744));
        }
    ],
    [
        /(?<!\\):([a-z0-9_]+):/g,
        (_, name) => {
            if (EMOJIS[name])
                return EMOJIS[name];
            else if (imgEmotes[name])
                return `<img src="${imgEmotes[name]}" align="absmiddle" style="width:1em">`;
            else if (hiddenEmotes[name])
                return hiddenEmotes[name];
            return `:${name}:`;
        }
    ],
    [
        /(?<!\\)([0-9\.]+)\/\/([0-9\.]+)/g,
        "$1⁄$2"
    ],
    [
        /(?<!\\)--->/g,
        "→"
    ],
    [
        /(?<!\\)==>/g,
        "⇒"
    ],
    [
        /(?<!\\)-=>/g,
        "⇶"
    ],
    [
        /(?<!\\)<---/g,
        "←"
    ],
    [
        /(?<!\\)<==/g,
        "⇐"
    ],
    [
        /(?<!\\)\|=>/g,
        "⇨"
    ],
    [
        /(?<!\\)<=\|/g,
        "⇦"
    ],
    [
        /(?<!\\)\|\\v/g,
        "↓"
    ],
    [
        /(?<!\\)\|\\\^/g,
        "↑"
    ],
    [
        /(?<!\\)> ?''(.*)''(?:\[(.+?)\])?/g,
        (_, quote, author = null) => {
            if (author) {
                return `<blockquote>❝<i>${quote}</i>❞<br><span style='display:block;margin-left:2em;'>-<i><u>${author}</u></i></span></blockquote>`;
            }
            return `<blockquote>❝<i>${quote}</i>❞</blockquote>`;
        }
    ],
    [
        /(?<!\\)''(.*)''/g,
        "❝$1❞"
    ],
    [
        /(?<!\\)\((\*| )\)\s?(?!\()/g,
        (_, checked) => `<input type="radio" ${checked === "*" ? "checked" : ""} disabled>`
    ],
    [
        /(?<!\\)\{(?:\*|style|css)('|")(.+?)\1 ?(.+?)\}/g,
        "<span style='$2'>$3</span>"
    ],
    [
        /(?<!\\)\[(\.)?( |x)\]\s?(?!\()/g,
        (_, interactive, checked) => `<input type="checkbox" ${checked === "x" ? "checked" : ""} ${!interactive ? "disabled" : ""}>`
    ],
    [
        /(?<!\\)\{g#:?(?:"|')([^\-\n]*, ?)?rainbow(?:"|')(.*)\}/g,
        "<span style='background-image:linear-gradient($1 #ff0000, #00ff00, #0000ff, #ff0000)'>$2</span>"
    ],
    [
        /(?<!\\)\{g#:?("|')(.*), ?([^,\}]*)\1([^\}]*)\}/g,
        "<span style='background-image:linear-gradient($2, $3)'>$4</span>"
    ],
    [
        /(?<!\\)\{#:?(.+?)(?::| )(.+?)\}(?:\[(.+?)\])?/g,
        (_, color, content, title) => {
            return `<span title="${title ? title : ""}" style="color:${color.match(/(?:[0-f]{6}|[0-f]{8})/) ? "#" + color : color}">${content}</span>`;
        }
    ],
    [
        /(?<!\\)#\[(.+?)\]"(.+?)"(?:\[(.+?)\])?/g,
        (_, color, content, title) => {
            return `<span title="${title ? title : ""}" style="color:${color.match(/(?:[0-f]{6}|[0-f]{8})/) ? "#" + color : color}">${content}</span>`;
        }
    ],
    [
        /(?<!\\)\{s(?!hadow|pace|amp):?([^ \n]+) (.*?)\}/g,
        "<span style='font-size:$1'>$2</span>"
    ],
    [
        /(?<!\\)s\[(.+?)\]"(.+?)"(?:\[(.+?)\])?/g,
        "<span style='font-size:$1' title='$3'>$2</span>"
    ],
    [
        /(?<!\\)\{f(?:"|')(.+?)(?:"|')(?::| )?(.*?)\}/g,
        "<span style='font-family:$1'>$2</span>"
    ],
    [
        /(?<!\\)f\[(.+?)\]"(.+?)"(?:\[(.+?)\])?/g,
        "<span title='$3' style='font-family:$1'>$2</span>"
    ],
    [
        /(?<!\\)(\[|\|)\=([0-9]+)(?: ?out ?| ?outof ?)([0-9]+)\=(?:\]|\|)(?:\[(.+?)\])?/g,
        (_, meterOrProgress, value, max, title) => `<${meterOrProgress === '|' ? "meter" : "progress"} value="${value}" max="${max}" title="${title ? title : ""}"></${meterOrProgress === '|' ? "meter" : "progress"}>`
    ],
    [
        /(?<!\\)\|(\^|v|(?:l|<)|>)?\[(.+?)\]"(.+?)"(?:\[(.+)\])?/g,
        (_, bType, bDecoration, text, title) => {
            let borderType = "";
            switch (bType) {
                case "^":
                    borderType = "border-top";
                    break;
                case "v":
                    borderType = "border-bottom";
                    break;
                case "l":
                case "<":
                    borderType = "border-left";
                    break;
                case ">":
                    borderType = "border-right";
                    break;
                default:
                    borderType = "border";
                    break;
            }
            return `<span title="${title}" style="${borderType}: ${bDecoration}">${text}</span>`;
        }
    ],
    [
        /(?<!\\)\{b('|")(.*?)\1 ?(.*?)\}/g,
        "<span style='border: $2'>$3</span>"
    ],
    [
        /(?<!\\)\{b\^:?('|")(.*?)\1 ?(.*?)\}/g,
        "<span style='border-top: $2'>$3</span>"
    ],
    [
        /(?<!\\)\{bv:?('|")(.*?)\1 ?(.*?)\}/g,
        "<span style='border-bottom: $2'>$3</span>"
    ],
    [
        /(?<!\\)\{b(?:l|<):?('|")(.*?)\1 ?(.*?)\}/g,
        "<span style='border-left: $2'>$3</span>"
    ],
    [
        /(?<!\\)\{b>:?('|")(.*?)\1 ?(.*?)\}/g,
        "<span style='border-right: $2'>$3</span>"
    ],
    [
        /(?<!\\)\{bg(?:#|:)?([^ \n]+)(.*?)\}(?:\[(.*?)\])?/g,
        '<span style="background-color:$1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)\((C|R)\)/g,
        (_, CR) => CR == "C" ? "©" : "®"
    ],
    [
        /(?<!\\)\<-->/g,
        "↔"
    ],
    [
        /(?<!\\)\|(\*|>)/g,
        (_, type) => type === "*" ? "⚑" : "🚩"
    ],
    [
        /(?<!\\):reg:([a-z]):/g,
        ":regional&lowbar;indicator_$1:"
    ],
    [
        /(?<!\\)\{(?:->|lindent) ?([^ \n\}]*) (.+?) (?:<-|rindent)(.*?)\}/g,
        "<span style='display:block;margin-left:$1;margin-right:$3'>$2</span>"
    ],
    [
        /(?<!\\)\{(?:->|lindent) ?([^ \n\}]*) (.+?)\}/g,
        "<span style='display:block;margin-left:$1'>$2</span>"
    ],
    [
        /(?<!\\)\{(.+?) (?:<-|rindent)([^ \n\}]*)\}/g,
        "<span style='display:block;margin-right:$2'>$1</span>"
    ],
    [
        /(?<!\\)\\(\^|_)\[(.*?)\](?:\[(.*?)\])?/g,
        (_, upDown, contents, title) => `<${upDown === "^" ? "sup" : "sub"} title='${title ? title : ""}'>${contents}</${upDown === "^" ? "sup" : "sub"}>`
    ],
    [
        /(?<!\\)(?:D(?:ISP(?:LAY)?)?=? ?\[(.*?)\]|("|')(.+?)\2)\s*?T?(?:OOL)?T?(?:IP)?=? ?\[(.*?)\]/g,
        '<span title="$4">$1$3</span>'
    ],
    [
        /(?<!\\)"(.+?)"\s?\.{3}(.*)/g,
        "<details><summary>$1</summary>$2</details>"
    ],
    [
        /(?<!\\)\{(k(?:ey)?|(?:cmd|samp|k(?:ey)?)):(.+?)\}/g,
        (_, type, contents) => `<${type != "k" && type != "key" ? type : "kbd"}>${contents}</${type != "k" && type != "key" ? type : "kbd"}>`
    ],
    [
        /(?<!\\)(?:\[(.*?)\])?\*-(.+?)-\*(?:\[(.+?)\])?/g,
        "<mark title='$3' style='background-color:$1'>$2</mark>"
    ],
    [
        /(?<!\\)([A-z]+|#[0-f]{8}|#[0-f]{6}|#[0-f]{3})(?:-{3,}|<hr>)/g,
        '<hr style="background-color:$1;color:$1;border-color:$1" />'
    ],
    [
        /(?<![\\#])(#{1,6}) ?(.+) \[#(.+?)\]/g,
        (_, heading, contents, id) => `<h${heading.length} id=${id}>${contents}`
    ],
    [
        /(?<!\\)\[(\.)?([0-9]+)->([0-9]+)\](?:\{?([0-9]+)\})?/g,
        (_, disabled, min, max, value) => `${min}<input type="range" min="${min}" max="${max}" value="${value}" ${!disabled ? "disabled" : ""}>${max}`
    ],
    [
        /(?<!\\)\[(.+?)\](?: ?(.*))?:(?: |\n(?: |    )?)?(?:\[|\()(.*)(?:\)|\])/g,
        (_, word, speech, def) => `<u>${word}</u>${speech ? " (" + speech + ")" : ""}:<br><dfn style='margin-left:1.5em;display:block'>${def}</dfn>`
    ],
    [
        /(?<!\\)#\[(.*?)\]/g,
        "<span id='$1'></span>"
    ],
    [
        /(?<!\\|!)\[(.*?)\]\((.+?)(?: |\n)(.*?)\)/g,
        '<a title="$3" href="$2">$1</a>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^\^_(.*?)_\^\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline double $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^_(.*?)_\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^\.(.*?)\.\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline dotted $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^~(.*?)~\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline wavy $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\._(.+?)_\.(?:\[(.+?)\])?/g,
        '<span style="text-decoration:underline dotted $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?~_(.+?)_~(?:\[(.+?)\])?/g,
        '<span style="text-decoration:underline wavy $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?__(.+?)__(?:\[(.+?)\])?/g,
        '<span style="text-decoration:underline double $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\|_)(?:\[(.+?)\])?_(.+?)_(?:\[(.+?)\])?/g,
        "<u style='text-decoration:underline $1' title='$3'>$2</u>"
    ],
    [
        /(?<!\\)\|->(.+?)<-\|/g,
        "<center>$1</center>"
    ],
    [
        /(?<!\\)\|->(.+?)\|/g,
        "<p style='text-align:right'>$1</p>"
    ],
    [
        /(?<!\\)\|(.+?)<-\|/g,
        "<p style='text-align:left'>$1</p>"
    ],
    [
        /(?<!\\)\{shadow:?(?:('|")(.+?)\1)? ?(.*?)\}/g,
        "<span style='text-shadow:$2'>$3</span>"
    ],
    [
        /(?<!\\)\{(?:\.|class)("|')(.+?)\1 ?(.+?)\}/g,
        '<span class="$2">$3</span>'
    ],
    [
        /(?<!\\)(?<=(?:\* ?)?)(?:\.|>)(PRO|CON):?(.*)/g,
        (_, PC, contents) => {
            let Pro = PC === "PRO";
            return `<span style="color:${Pro ? "green" : "red"}>${Pro ? "✓" : "☒"} ${contents}</span>`;
        }
    ],
    [
        /(?<!\\)A!\[(.+?)\]/g,
        "<audio controls='controls' src='$1'>"
    ],
    [
        /(?<!\\)\{(?:scroll|move|shift):?(?:(?:dir)?:?(?:"|')(.+?)(?:"|'))? ?(?:w?(?:idth)?:?(?:"|')(.+?)(?:"|'))? ?(?:h?(?:eight)?:?(?:"|')(.+?)(?:"|'))? ?(?:s?(?:croll)?(?:amount)?(?:peed)?:?(?:"|')(.+?)(?:"|'))?:? ?(.+?)\}/g,
        "<marquee direction='$1' height='$3' width='$2' scrollamount='$4'>$5</marquee>"
    ],
    [
        /(?<!\\)\{(?:white)?space:? ?(?:([^\n ]+))?(?:(?: a:?)?(.+?))?\}/g,
        "<c-spacer color='$1' amount='$2'></c-spacer>"
    ],
    [
        /(?<!\\)\\olm(?:arker)?:([0-9]+)\\?(.+?)\\/g,
        (_, layer, to) => {
            let selector = "ol";
            layer = parseInt(layer);
            for (let i = 0; i < layer; i++) {
                selector += " li ";
            }
            let listStyleType = null;
            if (to.match("TYPE:")) {
                listStyleType = to.split("TYPE:")[1];
                return `<style>
${selector}{
    list-style-type: ${listStyleType}
}
${selector} li{
    list-style-type:inherit;
}
</style>`;
            }
            return `<style>
    ${selector.trim()}::marker{
        content: "${to}\\00a0";
    }
    ${selector} li::marker{
        content:inherit;
    }
</style>`;
        }
    ],
    [
        /(?<!\\)\\ulm(?:arker)?:([0-9]+)\\?(.+?)\\/g,
        (_, layer, to) => {
            let selector = "ul";
            layer = parseInt(layer);
            for (let i = 0; i < layer; i++) {
                selector += " li ";
            }
            let listStyleType = null;
            if (to.match("TYPE:")) {
                listStyleType = to.split("TYPE:")[1];
                return `<style>
${selector}{
    list-style-type: ${listStyleType}
}
${selector} li{
    list-style-type:inherit;
}
</style>`;
            }
            return `<style>
    ${selector.trim()}::marker{
        content: "${to}\\00a0";
    }
    ${selector} li::marker{
        content:inherit;
    }
</style>`;
        }
    ],
    [
        /(?<!\\)\\INCLUDE:(LIMARKER|SOFTBLINK|BLINK|PLACEHOLDER|KBD|SAMP|CMD)\\/g,
        (_, include) => {
            switch (include) {
                case "LIMARKER":
                    return `
<style>
li[marker]::marker{
content:attr(marker);
}
</style>`;
                case "SOFTBLINK":
                    return `
<style>
softblink{
animation: soft-blinking linear infinite;
animation-duration:1000ms;
}
@keyframes soft-blinking{
	0%{
		color:inherit;
        text-shadow:inherit;
	}
	50%{
		color:transparent;
        text-shadow:none;
	}
}
</style>
`;
                case "BLINK":
                    return `
<style>
blink{
animation: blinking linear infinite;
animation-duration:1000ms;
}
@keyframes blinking{
	0%{
		color:inherit;
		background-color:inherit;
        text-shadow:inherit;
	}   
	49%{
		color:inherit;
		background-color:inherit;
        text-shadow:inherit;
	}
	50%{
		color:transparent;	
		background-color:transparent;
        text-shadow:none;
	}
	100%{
		color:transparent;
		background-color:transparent;
        text-shadow:none;
	}
}
</style>
`;
                case "PLACEHOLDER":
                    return `
<style>
placeholder{
color: grey;
user-select:none;
}
</style>
`;
                case "KBD":
                    return `<style>
kbd{
background-color:#fafbfc;
border:1px solid #d1d5da;
border-bottom-color:#c6cbd1;
border-radius:3px;
box-shadow:inset 0 -1px 0 #c6cbd1;
color:#444d56;display:inline-block;
font:.8em SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
line-height:.9em;
padding:3px 5px;
vertical-align:middle
}</style>`;
                case "SAMP":
                case "CMD":
                    return `<style>
${include}{
    font-family:monospace, monospace;
    color:green;
    background-color:black;
    padding:2px;
}
${include}::selection{
    background-color:white;
}</style>`;
            }
        }
    ],
    [
        /(?<!\\)#\[(.*)\]/g,
        '<BLANK id="$1"></BLANK>'
    ],
    [
        /(?<!\\)\\(FONT|SIZE|COLOR|CUSTOM)(?::| )(.*)\\/g,
        (_, type, value) => {
            switch (type) {
                case "FONT":
                    return `<div style='font-family:${value}'>`;
                case "SIZE":
                    return `<div style='font-size:${value}'>`;
                case "COLOR":
                    return `<div style='color:${value}'>`;
                case "CUSTOM":
                    return `<div style="${value}">`;
            }
        }
    ],
    [
        /(?<!\\)\\SECTION (.*?)\\/g,
        "<div id='$1'>"
    ],
    [
        /(?<!\\)\\ENDF(?:ONT)? (.*)\\/g,
        "</div><div style='font-family:$1'>"
    ],
    [
        /(?<!\\)\\ENDS(?:IZE)? (.*)\\/g,
        "</div><div style='font-size:$1'>"
    ],
    [
        /(?<!\\)\\END(?:#|COLOR) (.*)\\/g,
        "</div><div style='color:$1'>"
    ],
    [
        /(?<!\\)\\ENDC(?:USTOM) (.*)\\/g,
        "</div><div style='$1'>"
    ],
    [
        /(?<!\\)\\ENDSECTION (.*)\\/g,
        "</div><div id='$1'>"
    ],
    [
        /(?<!\\)\\END.*?\\/g,
        "</div>"
    ],
    [
        /(?<!\\)\\THEME:(.*)\\/g,
        (_, theme) => {
            return `<link rel="stylesheet" type="text/css" href="./Themes/${theme}.css" id="_theme">`;
        }
    ],
    [
        /(?<!\\)\$(none|unit|simplify)?\$(.*?)\$(nohover)?\$/g,
        (_, re, expr, settings) => {
            if (re == "unit") {
                try {
                    expr = `createUnit("${expr.split(",")[0].trim()}", "${expr.split(",")[1].trim()}")`;
                    const evaled = parser.evaluate(expr);
                }
                catch (err) {
                }
                return "";
            }
            else if (re == "simplify") {
                const evaled = math.simplify(expr);
                return settings != "nohover" ? `<span title="${expr}">${evaled}</span>` : evaled;
            }
            const evaled = parser.evaluate(expr);
            if (re == "none")
                return "";
            return typeof evaled != "function" ? (settings != "nohover" ? `<span title="${expr}">${evaled}</span>` : evaled) : "";
        }
    ],
    [
        /(?<!\\)\{cur(?:sor)?:? ?([^\n:]*):(.+?)\}(?:\[(.*?)\])?/g,
        '<span style="cursor:$1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)\*\[(.+?)\] (.*)/g,
        "<li marker='$1&nbsp;'>$2</li>"
    ],
    [
        /(?<!\\)\\count:([^\n]+)((?:\n)re)?\\/g,
        (_, search, Re) => {
            if (Re) {
                return [...preview.textContent.matchAll(search)].length;
            }
            return preview.textContent.split(search).length - 1;
        }
    ],
    [
        /(?<!\\)\\;(.*?)\\/g,
        "<!--$1-->"
    ],
    [
        /(?<!\\)\\s\\/g,
        ""
    ],
];
function convert(value, custom = true) {
    if (custom) {
        //handles the [$x=2] thing
        for (let x of value.matchAll(/(?:\[|<)(?:var:|\$)([^=]*)=([^\]]+)(?:\]|>)/g)) {
            let regex = new RegExp(`(?:\\[|<)${x[1]}(?:>|\\])`, "g");
            value = value.replace(x[0], "");
            value = value.replace(regex, x[2]);
        }
        let replaces = [...value.matchAll(/(?<!\\)\\replace:?(.+)\n(.*)((?:\n)re)?\\/g)];
        for (let match of replaces) {
            //makes it replace only the text after the declartation
            value = value.split(match[0]);
            //for regex replace
            if (match[3]) {
                value[1] = value[1].replace(new RegExp(match[1], "gm"), match[2]);
            }
            else
                value[1] = value[1].replaceAll(match[1], match[2]); //for non-regex replace
            value = value.join("");
        }
        //loops through the lists of regexes
        for (let regexReplace of regexes) {
            value = value.replace(regexReplace[0], regexReplace[1]);
        }
    }
    return marked(value);
}
