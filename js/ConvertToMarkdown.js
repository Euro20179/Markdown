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
Object.defineProperty(RegExp.prototype, "toJSON", {
    value: RegExp.prototype.toString
});
function addCustomRegex(searcher, replace) {
    userDefinedRegexes.push([new RegExp(searcher, "g"), replace]);
    localStorage.setItem("customRegularExpressions", JSON.stringify(userDefinedRegexes));
}
function removeCustomRegex(searcher) {
    let searcher2 = new RegExp(searcher, "g");
    for (let i = 0; i < userDefinedRegexes.length; i++) {
        let regex = userDefinedRegexes[i];
        if (regex[0].source == searcher2.source) {
            userDefinedRegexes.splice(i, 1);
        }
    }
    localStorage.setItem("customRegularExpressions", JSON.stringify(userDefinedRegexes));
}
let userDefinedRegexes = [];
function loadRegexes() {
    let temp = JSON.parse(localStorage.getItem('customRegularExpressions'));
    for (let regex of temp) {
        regex[0] = regex[0].split("/");
        regex[0] = regex[0].slice(1, regex[0].length - 1).join("/");
        regex[0] = new RegExp(regex[0], "g");
        console.log(regex);
        userDefinedRegexes.push(regex);
    }
}
if (localStorage.getItem("customRegularExpressions")) {
    loadRegexes();
}
else {
    userDefinedRegexes = [];
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
        /(?<!\\)\\EMOJI(?:(?:\{([0-9]+)(?:(?: |, ?)(.*?))?\})|\\)/gi,
        (_, amount, seperator) => {
            let emojis = { ...EMOJIS, ...hiddenEmotes, ...userDefinedEmotes, ...imgEmotes };
            let keys = Object.keys(emojis);
            let imgEmoteValues = Object.values(imgEmotes);
            let sep = seperator ?? "";
            if (amount) {
                let str = "";
                let emoji;
                for (let i = 0; i < amount; i++) {
                    emoji = emojis[keys[Math.floor(Math.random() * keys.length)]];
                    if (imgEmoteValues.indexOf(emoji) >= 0) {
                        str += `<img src="${emoji}" align="absmiddle" style="width:1em">` + sep;
                    }
                    else {
                        str += emoji + sep;
                    }
                }
                return str;
            }
            return emojis[Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)]];
        }
    ],
    [
        /(?<!\\)\\calc\{(.*?)\}/g,
        (_, ev) => eval(ev)
    ],
    [
        /(?<!\\):reg(?::|_)([a-z]):/g,
        ":regional_indicator_$1:"
    ],
    [
        /(?<!\\):(.+?):/g,
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
        /(?<!\\)\|(.*?)->(.+?)<-(.*?)\|/g,
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
        /(?<!\\)\\n/g,
        "<br>"
    ],
    [
        /(?<!\\)(\\u[0-9a-f]{4}|\\u\{[0-9a-f]+\})/gi,
        (_, point) => {
            return eval(`"${point}"`);
        }
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
        /(?<!\\)\((\*| )\)(?!\()/g,
        (_, checked) => `<input type="radio" ${checked === "*" ? "checked" : ""} disabled>`
    ],
    [
        /(?<!\\)\*\[(.*?)\](.*?)\|(?:\[(.*?)\])?/g,
        "<span style='$1' title='$3'>$2</span>"
    ],
    [
        /(?<!\\)\[(\.)?( |x)\](?!\()/g,
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
        /(?<!\\)f\[(.+?)\](.+?)\|(?:\[(.+?)\])?/g,
        "<span title='$3' style='font-family:$1'>$2</span>"
    ],
    [
        /(?<!\\)\|(\^|v|(?:l|<)|>)?\[(.+?)\](.+?)\|(?:\[(.+)\])?/g,
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
        /(?<!\\|\.)(?:\[([0-9]+.{2,4})?(?::|x)([0-9]+.{2,4})?\])(!)?(.+?)\|/g,
        (_, width, height, resize, text) => {
            return `<c-textbox width="${width ?? ""}" height="${height ?? ""}"${resize ? ' style="resize:none;"' : ""}>${text}</c-textbox>`;
        }
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
        /(?<!\\)"(.+?)"(?:::(.+?)(?:\/(.+?))?)?\s?\.{3}(.*)/g,
        "<details><summary data-marker='$2' data-marker-open='$3'>$1</summary>$4</details>"
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
        /(?<!\\)([A-z]+|#[0-fa-fA-F]{8}|#[0-fa-fA-F]{6}|#[0-fa-fA-F]{3})(?:-{3,}|<hr>)/g,
        '<hr style="background-color:$1;color:$1;border-color:$1" />'
    ],
    [
        /(?<![\\#])(#{1,6}) (.+) \[#?(.+?)\]/g,
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
        "<div id='$1'></div>"
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
        /(?<!\\)YT!\[(.+?)\](?:\(([0-9\.]*)(?: |, ?)([0-9\.]*)\))?/g,
        (_, link, width, height) => {
            return `<iframe width="${width}" height="${height}" src="${link.replace("watch?v=", "embed/")}"></iframe>`;
        }
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
        /(?<!\\)\\include(?:\{(summarymarker|softblink|blink|placeholder|kbd|samp|cmd|spin|rainbow|highlight|l#|linenumber|csscolor)\}|(?::|  )(summarymarker|softblink|blink|placeholder|kbd|samp|cmd|spin|rainbow|highlight|l#|linenumber|csscolor)\\)/gi,
        (_, include, include2) => {
            include = include2 ?? include;
            switch (include.toUpperCase()) {
                case "SOFTBLINK":
                    return `<style>softblink{animation:soft-blinking linear infinite;animation-duration:1000ms}@keyframes soft-blinking{0%{color:inherit;text-shadow:inherit}50%{color:transparent;text-shadow:none}}</style>`;
                case "BLINK":
                    return `<style>blink{animation:blinking linear infinite;animation-duration:1000ms}@keyframes blinking{0%{color:inherit;background-color:inherit;text-shadow:inherit}49%{color:inherit;background-color:inherit;text-shadow:inherit}50%{color:transparent;background-color:transparent;text-shadow:none}100%{color:transparent;background-color:transparent;text-shadow:none}}</style>`;
                case "PLACEHOLDER":
                    return `<style>placeholder{color:grey;user-select:none}</style>`;
                case "KBD":
                    return `<style>kbd{background-color:#fafbfc;border:1px solid #d1d5da;border-bottom-color:#c6cbd1;border-radius:3px;box-shadow:inset 0 -1px 0 #c6cbd1;color:#444d56;display:inline-block;font:0.8em SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;line-height:0.9em;padding:3px 5px;vertical-align:middle}</style>`;
                case "SAMP":
                case "CMD":
                    return `<style>${include}{font-family:monospace, monospace;color:green;background-color:black;padding:2px}${include}::selection{background-color:white}</style>`;
                case "SPIN":
                    return `<style>spin{transform:rotate(0deg);display:inline-block;animation-name:spin-animation;animation-iteration-count:infinite;animation-duration:200ms;animation-timing-function:linear}@keyframes spin-animation{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}</style>`;
                case "RAINBOW":
                    return `<style>rainbow{animation:rainbow-an 2000ms linear infinite;color:blue}@keyframes rainbow-an{0%{color:#f00}16%{color:#ffff00}32%{color:#00ff00}48%{color:#00ffff}64%{color:#0000ff}80%{color:#ff00ff}100%{color:#f00}}</style>`;
                case "HIGHLIGHT":
                    return `<style>code[class*="language-"],pre[class*="language-"]{color:black;background:none;text-shadow:0 1px white;font-family:Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*="language-"]::-moz-selection,pre[class*="language-"] ::-moz-selection,code[class*="language-"]::-moz-selection,code[class*="language-"] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*="language-"]::selection,pre[class*="language-"] ::selection,code[class*="language-"]::selection,code[class*="language-"] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*="language-"],pre[class*="language-"]{text-shadow:none}}pre[class*="language-"]{padding:1em;margin:0.5em 0;overflow:auto}:not(pre) > code[class*="language-"],pre[class*="language-"]{background:#f5f2f0}:not(pre) > code[class*="language-"]{padding:0.1em;border-radius:0.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:slategray}.token.punctuation{color:#999}.token.namespace{opacity:0.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#9a6e3a;background:hsla(0, 0%, 100%, .5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#DD4A68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}</style>`;
                case "L#":
                case "LINENUMBER":
                    return `<style>pre[class*="language-"].line-numbers{position:relative;padding-left:3.8em;counter-reset:linenumber}pre[class*="language-"].line-numbers > code{position:relative;white-space:inherit}.line-numbers .line-numbers-rows{position:absolute;pointer-events:none;top:0;font-size:100%;left:-3.8em;width:3em;letter-spacing:-1px;border-right:1px solid #999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.line-numbers-rows > span{display:block;counter-increment:linenumber}.line-numbers-rows > span:before{content:counter(linenumber);color:#999;display:block;padding-right:0.8em;text-align:right}</style>`;
                case "CSSCOLOR":
                    return `<style>span.inline-color-wrapper{background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=");background-position:center;background-size:110%;display:inline-block;height:1.333ch;width:1.333ch;margin:0 0.333ch;box-sizing:border-box;border:1px solid white;outline:1px solid rgba(0,0,0,.5);overflow:hidden}span.inline-color{display:block;height:120%;width:120%}</style>`;
                case "SUMMARYMARKER":
                    return `<style>summary[data-marker]::marker{content: attr(data-marker)}details[open] summary[data-marker-open]::marker{content: attr(data-marker-open)}</style>`;
            }
        }
    ],
    [
        /(?<!\\)\\import(?:\((gf)\))?(?:\{(.*?)\}|(?::| )(.*?)\\)/g,
        (_, g, link, link2) => {
            link = link2 ?? link;
            if (g)
                link = link.replaceAll(",", "&family=").replaceAll("&family= ", "&family=");
            return g
                ? `<link href="https://fonts.googleapis.com/css2?family=${link}&display=swap" rel="stylesheet">`
                : `<link href="${link}" rel="stylesheet">`;
        }
    ],
    [
        /(?<!\\)\\(font|size|color|custom|lineheight|spacing|wordspacing|letterspacing)(?:\{((?:.|\s)*?)\}|(?::| )(.*)\\)/gi,
        (_, type, value, value2) => {
            value = value2 ?? value;
            switch (type.toUpperCase()) {
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
                case "WORDSPACING":
                    return `<div style='word-spacing:${value}'>`;
                case "LETTERSPACING":
                    return `<div style='letter-spacing:${value}'>`;
            }
        }
    ],
    [
        /(?<!\\)\\END(F|S|#|C|H|W|L)(?:\{(.*?)\}| (.*?)\\)/gi,
        (_, type, newValue, newValue2) => {
            newValue = newValue2 ?? newValue;
            switch (type.toUpperCase()) {
                case "F":
                    return `</div><div style="font-family: ${newValue}">`;
                case "S":
                    return `</div><div style="font-size: ${newValue}">`;
                case "#":
                    return `</div><div style="color: ${newValue}">`;
                case "C":
                    return `</div><div style="${newValue}">`;
                case "H":
                    return `</div><div style="line-height: ${newValue}">`;
                case "W":
                    return `</div><div style="word-spacing: ${newValue}">`;
                case "L":
                    return `</div><div style="letter-spacing: ${newValue}">`;
            }
        }
    ],
    [
        /(?<!\\)\\END(?:.*?\\|\{.*?\})/g,
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
        /(?<!\\):=/g,
        "&Assign;"
    ],
    [
        /(?<!\\)<\.\.\./g,
        "&#8672;"
    ],
    [
        /(?<!\\)\.\.\.>/g,
        "&#8674;"
    ],
    [
        /(?<!\\)\[(.+?)\]\*([0-9]+)/g,
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
        /(?<!\\)\\s\\/g,
        ""
    ],
];
function convert(value, custom = true, nonCustom = true) {
    if (custom) {
        //handles the [$x=2] thing
        for (let x of value.matchAll(/(?:\[|<)(?:var:|\$)([^=]*)=([^\]]+)(?:\]|>)/g)) {
            let regex = new RegExp(`(?:\\[|<)${x[1]}(?:>|\\])`, "g");
            value = value.replace(x[0], "");
            value = value.replace(regex, x[2]);
        }
        //loops through the lists of regexes
        userDefinedRegexes.forEach(item => {
            value = value.replace(item[0], item[1]);
        });
        regexes.forEach(item => {
            value = value.replace(item[0], item[1]);
        });
    }
    return nonCustom ? marked(value) : value;
}
