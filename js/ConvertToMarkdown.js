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
        /(?<!\\)<evaluate>\s?(.+?)\s?(?:<\/evaluate>)/g,
        (_, evaluate) => {
            return eval(evaluate);
        }
    ],
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
        /(?<!\\)\\(?:DEF(?:INE)?)?EMOJI ?:(.+?): ?(.+?)\\/g,
        (_, name, value) => {
            if (!(name in userDefinedEmotes)) {
                userDefinedEmotes[name] = value;
            }
            return "";
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
            else if (userDefinedEmotes[name])
                return userDefinedEmotes[name];
            return `:${name}:`;
        }
    ],
    [
        /(?<!\\)\|(?:(.*?))?->(.+?)<-(?:(.*?))?\|/g,
        "<center style='margin-left:$1;margin-right:$3'>$2</center>"
    ],
    [
        /(?<!\\)([0-9\.]+)\/\/([0-9\.]+)/g,
        "$1⁄$2"
    ],
    [
        /(?<!\\)<spin speed="(.*?)">/g,
        "<spin style='animation-duration: $1'>"
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
        /(?<!\\)<--\+/g,
        "&#10566;"
    ],
    [
        /(?<!\\)\+-->/g,
        "&#10565;"
    ],
    [
        /(?<!\\)<=>/g,
        "&#8660;"
    ],
    [
        /(?<!\\)<-\^->/g,
        "&#8644;"
    ],
    [
        /(?<!\\)<-v->/g,
        "&#8646;"
    ],
    [
        /(?<!\\)<_/g,
        "&le;"
    ],
    [
        /(?<!\\)_>/g,
        "&ge;"
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
        /(?<!\\)''(.*?)''/g,
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
            return `<span title="${title ? title : ""}" style="color:${color.match(/(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})/) ? "#" + color : color}">${content}</span>`;
        }
    ],
    [
        /(?<!\\)#\[(.+?)\](.+?)\|(?:\[(.+?)\])?/g,
        (_, color, content, title) => {
            return `<span title="${title ? title : ""}" style="color:${color.match(/(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})/) ? "#" + color : color}">${content}</span>`;
        }
    ],
    [
        /(?<!\\)\{s(?!hadow|pace|amp):?([^ \n]+) (.*?)\}/g,
        "<span style='font-size:$1'>$2</span>"
    ],
    [
        /(?<!\\)s\[(.+?)\](.+?)\|(?:\[(.+?)\])?/g,
        "<span style='font-size:$1' title='$3'>$2</span>"
    ],
    [
        /(?<!\\)\{f(?:"|')(.+?)(?:"|')(?::| )?(.*?)\}/g,
        "<span style='font-family:$1'>$2</span>"
    ],
    [
        /(?<!\\)f\[(.+?)\](.+?)\|(?:\[(.+?)\])?/g,
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
        /(?<!\\):reg:([a-z]):/g,
        ":regional&lowbar;indicator_$1:"
    ],
    [
        /(?<!\\)^(.+?)-->(.+)<--(.*?)$/gm,
        "<span style='display:inline-block;margin-left:$1;margin-right:$3'>$2</span>"
    ],
    [
        /(?<!\\)^(.+?)-->(.+?)$/gm,
        "<span style='display:inline-block;margin-left:$1'>$2</span>"
    ],
    [
        /(?<!\\)^(.+?)->(.+?)$/gm,
        "<span style='display:inline-block;text-indent:$1'>$2</span>"
    ],
    [
        /(?<!\\)(.+?)<--(.+?)$/gm,
        "<span style='display:inline-block;margin-right:$2'>$1</span>"
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
        /(?<!\\)(?:\[([0-9]+.{2,4})?(?::|x)([0-9]+.{2,4})?])?\[(.*?)](.+?)\|/g,
        "<c-textbox width='$1' height='$2' style='$3'>$4</c-textbox>"
    ],
    [
        /(?<!\\)([A-z]+|#[0-fa-fA-F]{8}|#[0-fa-fA-F]{6}|#[0-fa-fA-F]{3})(?:-{3,}|<hr>)/g,
        '<hr style="background-color:$1;color:$1;border-color:$1" />'
    ],
    [
        /(?<![\\#])(#{1,6}) ?(.+) \[#?(.+?)\]/g,
        (_, heading, contents, id) => `<h${heading.length} id=${id}>${contents}</h${heading.length}>`
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
        /(?<!\\|!)\[(.*?)\]\((.+?)(?:\s(.*?))?\)/g,
        (_, text, link, title) => {
            if (!title)
                return `<a title="${link}" href="${link}">${text}</a>`;
            return `<a title="${title}" href="${link}">${text}</a>`;
        }
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^\^_(.+?)_\^\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline double $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^_(.+?)_\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^\.(.+?)\.\^(?:\[(.+?)\])?/g,
        '<span style="text-decoration:overline dotted $1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)(?:\[(.+?)\])?\^~(.+?)~\^(?:\[(.+?)\])?/g,
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
        /(?<!\\)\|->(.+?)(?: ?<(.*?))?\|/g,
        "<p style='text-align:right;margin-right:$2'>$1</p>"
    ],
    [
        /(?<!\\)\|(?:(.*?)> ?)?(.+?)<-\|/g,
        "<p style='text-align:left;margin-left:$1'>$2</p>"
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
        /(?<!\\)\|(.+?) (.*?)\|/g,
        "<p style='line-height:$1'>$2</p>"
    ],
    [
        /(?<!\\)(?:\.|class)\[(.+?)\](.*?)\|/g,
        '<span class="$1">$2</span>'
    ],
    [
        /(?<!\\)(?<=(?:\* ?)?)(?:\.|>)(PRO|CON):?(.*)/g,
        (_, PC, contents) => {
            let Pro = PC === "PRO";
            return `<span style="color:${Pro ? "green" : "red"}">${Pro ? "✓" : "☒"} ${contents}</span>`;
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
        /(?<!\\)\[([0-9-]+?)\]\*(.+?)\*/g,
        '<span style="transform:skewX($1deg);display:inline-flex">$2</span>'
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
        /(?<!\\)\\INCLUDE:(.*?)\\/g,
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
                case "SPIN":
                    return `<style>
spin{
transform: rotate(0deg);
display:inline-block;
animation-name: spin-animation;
animation-iteration-count: infinite;
animation-timing-function: linear;
}

@keyframes spin-animation{
0%{
transform: rotate(0deg);
}
100%{
transform: rotate(360deg);
}
</style>`;
                case "RAINBOW":
                    return `<style>
rainbow{
animation: rainbow-an 2000ms linear infinite;
color: blue;
}
@keyframes rainbow-an{
0%{
color: #f00;
}
16%{
color: #ffff00;
}
32%{
color: #00ff00;
}
48%{
color: #00ffff;
}
64%{
color: #0000ff;
}
80%{
color: #ff00ff;
}
100%{
color: #f00;
}
}
</style>`;
            }
        }
    ],
    [
        /(?<!\\)#\[(.*)\]/g,
        '<BLANK id="$1"></BLANK>'
    ],
    [
        /(?<!\\)([^\s<]+)<->(.+)/g,
        '<span style="letter-spacing:$1">$2</span>'
    ],
    [
        /(?<!\\)\\(FONT|SIZE|COLOR|CUSTOM|LINHEIGHT|SPACING)(?::| )(.*)\\/g,
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
                case "LINEHEIGHT":
                case "SPACING":
                    return `<div style='line-height:${value}>`;
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
        /(?<!\\)\$\$(none|unit|simplify)?\$(.*?)\$(nohover)?\$\$/g,
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
        /(?<!\\)\{cur(?:sor)?: ?(.*?)(?: |:)(.+?)\}(?:\[(.*?)\])?/g,
        '<span style="cursor:$1" title="$3">$2</span>'
    ],
    [
        /(?<!\\)\*\[(.+?)\] (.*)/g,
        "<li marker='$1&nbsp;'>$2</li>"
    ],
    [
        /(?<!\\)~=/g,
        "&asymp;"
    ],
    [
        /(?<!\\)\+-/g,
        "&plusmn;"
    ],
    [
        /(?<!\\)\.\/\./g,
        "&divide;"
    ],
    [
        /(?<!\\)\/=/g,
        "&ne;"
    ],
    [
        /(?<!\\)\[(.*?)\]\*([0-9]+)/g,
        (_, chars, count) => {
            return chars.multiply(Number(count));
        }
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
