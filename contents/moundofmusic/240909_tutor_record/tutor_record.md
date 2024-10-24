---
export_on_save:
    html: true
---

<a href="/index.html">HOME</a>
<details open>
<summary>LANGUAGE</summary>

[English](tutor_record.html) | [简体中文](tutor_record_zhhans.html)
</details>

# Recording Tutorial
- Folder containing all recording files: `%USERPROFILE%/AppData/LocalLow/ElifGames/MoundofMusic/UGC/Record`

## File Description
- All recording files are in CSV format, as follows:

play_time|stop_time|pitch|instrument|misc
--|--|--|--|--
-1||||level:4021
8578|8636|-56|304	
10269|10365|-56|304
12076|12141|61|304

- The first row in the file is the header, and the data will not be loaded.
- The second row in the file contains miscellaneous data:
    - The first column is -1
    - The last column contains miscellaneous informations, such as level information for track recordings and string information for universal music boxes.
- From the third row onwards are the actual recording data:
    - play_time: The start time of the note in milliseconds; for example, 10.5 seconds should be written as 10500.
    - stop_time: The end time of the note in milliseconds.
    - pitch: The pitch key of the note; see [Pitch Data](#PitchData) for details.
    - instrument: The instrument key of the note; see [Instrument Data](#InstrumentData) for details.
- You can freely modify the data within the CSV file:
    - After saving and closing, you can preview the recordings in the recording studio at any time without restarting the game.
    - By modification, you can create original multi-track music.
    - By concatenating the play_time (divided by 1000) and pitch columns, you can use them as configuration data for Self-Compose.

---

## Configuration Data

### Pitch Data<a id="PitchData"></a>

Pitch Key|Chev System|Italiano System|Note Name|Corresponding Piano Key
--|--|--|--|--
41|1,|do,|c|C4
-41|#1,|dod,|#c|
42|2,|re,|d|D4
-42|#2,|red,|#d|
43|3,|mi,|e|E4
44|4,|fa,|f|F4
-44|#4,|fad,|#f|
45|5,|sol,|g|G4
-45|#5,|sold,|#g|
46|6,|la,|a|A4
-46|b7,|sib,|#a|
47|7,|si,|b|B4
51|1|do|c1|C5
-51|#1|dod|#c1|
52|2|re|d1|D5
-52|#2|red|#d1|
53|3|mi|e1|E5
54|4|fa|f1|F5
-54|#4|fad|#f1|
55|5|sol|g1|G5
-55|#5|sold|#g1|
56|6|la|a1|A5
-56|b7|sib|#a1|
57|7|si|b1|B5
61|1'|do'|c2|C6
-61|#1'|dod'|#c2|
62|2'|re'|d2|D6
-62|#2'|red'|#d2|
63|3'|mi'|e2|E6
64|4'|fa'|f2|F6
-64|#4'|fad'|#f2|
65|5'|sol'|g2|G6
-65|#5'|sold'|#g2|
66|6'|la'|a2|A6
-66|b7'|sib'|#a2|
67|7'|si'|b2|B6
- The game only supports pitches within these three octaves.

### Instrument Data<a id="InstrumentData"></a>

Instrument Key|Instrument Name|Picture
--|--|--
101|Celesta|<img src="../instruments/celesta.png" width="128" height="128" alt="celesta">
103|Marimba|<img src="../instruments/marimba.png" width="128" height="128" alt="marimba">
105|Mbira|<img src="../instruments/mbira.png" width="128" height="128" alt="mbira">
303|Harpsichord|<img src="../instruments/harpsichord.png" width="128" height="128" alt="harpsichord">
304|Piano|<img src="../instruments/piano.png" width="128" height="128" alt="piano">
306|Balalaika|<img src="../instruments/balalaika.png" width="128" height="128" alt="balalaika">
307|Banjo|<img src="../instruments/banjo.png" width="128" height="128" alt="banjo">
308|Cello|<img src="../instruments/cello.png" width="128" height="128" alt="cello">
310|Guitar|<img src="../instruments/guitar.png" width="128" height="128" alt="guitar">
311|Harp|<img src="../instruments/harp.png" width="128" height="128" alt="harp">
312|Lute|<img src="../instruments/lute.png" width="128" height="128" alt="lute">
314|Mandolin|<img src="../instruments/mandolin.png" width="128" height="128" alt="mandolin">
315|Oud|<img src="../instruments/oud.png" width="128" height="128" alt="oud">
317|Shamisen|<img src="../instruments/shamisen.png" width="128" height="128" alt="shamisen">
318|Sitar|<img src="../instruments/sitar.png" width="128" height="128" alt="sitar">
319|Ukulele|<img src="../instruments/ukulele.png" width="128" height="128" alt="ukulele">
320|Violin|<img src="../instruments/violin.png" width="128" height="128" alt="violin">
401|Accordion|<img src="../instruments/accordion.png" width="128" height="128" alt="accordion">
402|Harmonica|<img src="../instruments/harmonica.png" width="128" height="128" alt="harmonica">
404|Bagpipes|<img src="../instruments/bagpipes.png" width="128" height="128" alt="bagpipes">
405|Bassoon|<img src="../instruments/bassoon.png" width="128" height="128" alt="bassoon">
406|Clarinet|<img src="../instruments/clarinet.png" width="128" height="128" alt="clarinet">
407|Didgeridoo|<img src="../instruments/didgeridoo.png" width="128" height="128" alt="didgeridoo">
409|Flute|<img src="../instruments/flute.png" width="128" height="128" alt="flute">
410|French Horn|<img src="../instruments/frenchhorn.png" width="128" height="128" alt="frenchhorn">
411|Oboe|<img src="../instruments/oboe.png" width="128" height="128" alt="oboe">
412|Ocarina|<img src="../instruments/ocarina.png" width="128" height="128" alt="ocarina">
413|Organ|<img src="../instruments/organ.png" width="128" height="128" alt="organ">
415|Recorder|<img src="../instruments/recorder.png" width="128" height="128" alt="recorder">
416|Saxophone|<img src="../instruments/saxophone.png" width="128" height="128" alt="saxophone">
417|Shakuhachi|<img src="../instruments/shakuhachi.png" width="128" height="128" alt="shakuhachi">
418|Tin whistle|<img src="../instruments/tinwhistle.png" width="128" height="128" alt="tinwhistle">
419|Trombone|<img src="../instruments/trombone.png" width="128" height="128" alt="trombone">
420|Trumpet|<img src="../instruments/trumpet.png" width="128" height="128" alt="trumpet">
601|Choir|<img src="../instruments/choir.png" width="128" height="128" alt="choir">
603|Music box|<img src="../instruments/musicbox.png" width="128" height="128" alt="musicbox">