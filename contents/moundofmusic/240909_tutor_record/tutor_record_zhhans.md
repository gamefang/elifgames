---
export_on_save:
    html: true
---

<a href="/index_zhhans.html">返回主页</a>
<details open>
<summary>LANGUAGE</summary>

[English](tutor_record.html) | [简体中文](tutor_record_zhhans.html)
</details>

# 录音教程
- 所有原创曲目所在文件夹：`%USERPROFILE%/AppData/LocalLow/ElifGames/MoundofMusic/UGC/Record`

## 文件说明
- 录音文件均为csv文件，格式如下：

play_time|stop_time|pitch|instrument|misc
--|--|--|--|--
-1||||level:4021
8578|8636|-56|304	
10269|10365|-56|304
12076|12141|61|304

- 文件中第一行为表头，数据不会被加载
- 文件中第二行为杂项数据记录
    - 首列为-1
    - 末列为杂项信息记录，如曲目录音会记录level信息，万能音乐盒会记录str信息
- 从第三行起为实际录音数据
    - play_time：音符开始的时间，单位为毫秒，即10.5秒需要写为10500
    - stop_time：音符结束的时间，单位为毫秒
    - pitch：音符的音高key，详见[音高数据](#音高数据)
    - instrument：音符的乐器key，详见[乐器数据](#乐器数据)
- 可随意修改csv文件内的数据
    - 保存并关闭后，随时在录音棚中试听，无需重启游戏
    - 通过修改可以创作原创多音轨的曲目
    - 拼接play_time（需除1000）和pitch两列信息，即可用作原创曲目的配置数据

---

## 配置项数据

### 音高数据

音高key|简谱唱名|意式唱名|音名|对应钢琴
--|--|--|--|--
41|1,|do,|c|小字组c
-41|#1,|dod,|#c|
42|2,|re,|d|小字组d
-42|#2,|red,|#d|
43|3,|mi,|e|小字组e
44|4,|fa,|f|小字组f
-44|#4,|fad,|#f|
45|5,|sol,|g|小字组g
-45|#5,|sold,|#g|
46|6,|la,|a|小字组a
-46|b7,|sib,|#a|
47|7,|si,|b|小字组b
51|1|do|c1|小字一组c1
-51|#1|dod|#c1|
52|2|re|d1|小字一组d1
-52|#2|red|#d1|
53|3|mi|e1|小字一组e1
54|4|fa|f1|小字一组f1
-54|#4|fad|#f1|
55|5|sol|g1|小字一组g1
-55|#5|sold|#g1|
56|6|la|a1|小字一组a1
-56|b7|sib|#a1|
57|7|si|b1|小字一组b1
61|1'|do'|c2|小字二组c2
-61|#1'|dod'|#c2|
62|2'|re'|d2|小字二组d2
-62|#2'|red'|#d2|
63|3'|mi'|e2|小字二组e2
64|4'|fa'|f2|小字二组f2
-64|#4'|fad'|#f2|
65|5'|sol'|g2|小字二组g2
-65|#5'|sold'|#g2|
66|6'|la'|a2|小字二组a2
-66|b7'|sib'|#a2|
67|7'|si'|b2|小字二组b2
- 游戏内仅支持这三个八度内的音高

### 乐器数据

乐器key|乐器名称
--|--
101|钢片琴
103|马林巴
105|姆比拉
303|羽管键琴
304|钢琴
306|巴拉莱卡
307|班卓琴
308|大提琴
310|吉他
311|竖琴
312|鲁特琴
314|曼陀林
315|乌德琴
317|三味线
318|西塔琴
319|尤克里里
320|小提琴
401|手风琴
402|口琴
404|风笛
405|巴松
406|单簧管
407|迪吉里杜
409|长笛
410|圆号
411|双簧管
412|陶笛
413|管风琴
415|竖笛
416|萨克斯
417|尺八
418|哨笛
419|长号
420|小号
601|合唱
603|八音盒