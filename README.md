# Markdown (but worse)

I wanted to add some "features" to markdown so I put a bunch of regular expressions in a list and ran input from a textarea through that.

# Queary Strings
* \* or %23 = #
* lightmode: sets to lightmode
* darkmode: sets to darkmode
* editor=color: the color of the editor
* editortext=color: the color of the text of the editor

# Documentation

## Text

### General

* any text below \\COLOR:color\\ will be that color
* any text below \\FONT:font\\ will be that font
* any text below \\SIZE:size\\ will be that size
* {f'font' any text in here will be font}
* f\[font]text in here will be font|\[title (optional)]
* {ssize any text in here will be of size size}
* s\[size]text will be size|\[title (optional)]
* {#color any text in here will be color}\[title (optional)]
* #\[color]text here will be color|\[title (optional)]
* {bg:color any text in here will have a background color of color}\[title (optional)]
* {cursor:type:text} any text will have a cursor of type
* \[angle]*text* text will be skewed by angle
<br>
<br>

* You can add \[color] in front of any of the items below to change the color of the line
    * You can also add \[title] after any of the items below to add a title

* \_underline\_
* \_\_double underline\_\_
* .\_dotted underline\_.
* \~\_wavy underline\_\~
* ^\_overline\_^
* ^^\_double overline\_^^
* ^\~overline wavy\~^
* ^.overline dotted.^
* \*-highlight-*
* \\^\[text]: puts text in a sup element
* \\_\[text]: puts text in a sub element

### General other

* {shadow'.2em .2em 0px grey' any text here will have a text shadow}
* {.'class' any text here will be in a span with the class of class}
* .\[class]text here will be in a span with the class of class|
* {cmd: text}: puts text in a cmd element
* {samp: text}: puts text in a samp element
* |line-height text| makes the text have spacing of line-height
* \SPACING:line-height\ the whole page will have lineheight of line-height
* spaceing<->text
    * spaces the letters in the words
* \[width:height](\[style])textbox|

### Align

* |(margin optional)->center<-(margin optional)|
* |->right(&lt;margin optional)|
* |(margin optional>)left<-|
* 2em-->indented 2em left
* indented 2em right<--2em
* 2em-->indendted 2em right and left<--2em
* 2em->fist line is indneted 2em

---

## Arrows
* --->
* <---
* <-->
* ==>
* <==
* -=>
* <=|
* |=>
* |\v
* |\^
* +-->
* <--+
* <-^->
* <-v->

---

## Quotes

* ''fancy quote''
* \> ''block quote''\[author]

---

## Input types
* [. ] unchecked clickable checkbox
* \[.x] checked clickable checkbox
* ( ) radio unselected
* (*) radio selected
* \[=1 out 10=] a progress bar at 1 out of 10
* |=1 out 10=| a meter bar at 1 out of 10

---

## Custom Elements


### builtins
* c-3d: makes the text have that stereotypical red blue 3d look
* c-rainbow: gives the text a rainbow background
* c-upsidedown: makes the text upsidedown
* c-circled: makes the text circled
* c-unicode: when given any string of numbers it will convert it to unicode
* c-choose: give an items attribute each item is seperated by | put $1 where you wnat the choice to go in the innerHTML
* c-random: give min, max, and round attributes, put $1 where you want the number to go
* c-variables: &lt;c-variables x="yes"&gt;%x%&lt;c-variables&gt;
* c-time: uses datetime formats
* c-spacer: puts whitespace
* c-shadow: shadow element
* c-alert: has alert when clicked
* c-confirm: has confirm when clicked
* c-prompt: has prompt when clicked
* c-rotate: rotates text
* c-textbox: textbox

### includes
* Start each of these with \\INDLUDE:
    * and end with \\
* SHADOW: shadow element
* LIMARKER: allows you to do &lt;li marker="marker"> for a custom marker
* BLINK: annoying
* SOFTBLINK: blink but smooth transition
* PLACEHOLDER: kinda just grey unslectable text
* KBD: css for the kbd element
* SAMP: css for the samp element
* CMD: css for a cmd element (same css as SAMP)

---

## Emojis

[List](https://euro20179.github.io/Emojis.html)

---

## Media

* A!\[audio file] creates an audio tag

---

## Misc

* \\s\\: special escape, escapes out of my markdown because i'm bad

* \>PRO: pro
* \>CON: con

* |*: ⚑
* |>: 🚩
* (C): copyright
* (R): registered copyright
* \ulmarker:1\cool\\: sets unordered list marker at the 1st level to cool
* \olmarker:2\TYPE:lower-alpha\\: sets ordered list marker at the 2nd level to the lower-alpha type
* \EMOJI\: random "emoji"
* 1\/2 makes it look like 1⁄2
* "summary"...details
* "text"\[title]
* \\;comment\\
* \[word]part of speech (optional): (definition)
* \EMOJI :name: value\
    * defines a custom emoji
* \[text]\*number
    * makes it so that text is duplicated by number

## NOT RECOMMENDED (usually causes lag)
* \RAND\\: random number from 1 to 100
* \RAND{50 56}\\: random number from 1 to 56
* \[VAR:x=2]: will replace any \[x] with 2

### Find

```
\count:(search)\
```

OR

```
\count:(search)
re\
```

* replaces that with how many times the search shows up
    * NOTE: it will be one convert behind since it searches the preview's textContent not the value of the textarea

### Find Replace
```
replace:(search)
(replacement)\
```
OR
```
replace:(regex)
(replacement)
re\
```

#### Examples

```
\replace:red
{#red red}\
```
searches through the input and makes the string "red" red

```
\replace:(.red.)
{bg:red $1}
re\
```
matches the regular expression .red. and makes the background red

```
\replace:underline
{*'text-decoration:underline double;' underline}\
```
matches "underline" and gives it a double underline
