---
export_on_save:
    html: true
---

<a href="/index_zhhans.html">返回主页</a>
<details open>
<summary>LANGUAGE</summary>

[English](tutor_compose.html) | [简体中文](tutor_compose_zhhans.html)
</details>

# 原创曲目教程

- 所有原创曲目所在文件夹：`%USERPROFILE%/AppData/LocalLow/ElifGames/MoundofMusic/UGC/Music`

## 创建新曲目模板
- 首先进入曲目选择界面，点击右下角的`更多`按钮，弹出原创曲目的入口，点击进入。
![step1](step1.png)

- 原创曲目界面会列出现有的所有原创曲目，点击新建加入新的原创曲目。
![step2](step2.png)

- 你可以输入一个新的原创曲目名称，该字符串将作为唯一的索引名称：
    - 曲目最终显示的名称可以和这个索引名称不一样
    - 不可与其余索引名称重名
    - 不允许包含空格，如输入中包括空格，将被转化为`_`符号
![step3](step3.png)

- 如索引名称无误，将自动跳出游戏，进入如下文件夹：
    - 如未正常跳转，请复制此路径至文件管理器：`%USERPROFILE%/AppData/LocalLow/ElifGames/MoundofMusic/UGC/Music`
![step4](step4.png)

- 运行其中的`init_config.bat`，同步自定义曲目所需的模板文件。
    - 需要保持网络连接顺畅，如无法连接，请加入QQ群索取模板文件：894397045
    - 如果全部下载成功，`init_config.bat`文件执行完毕后，将自动删除自身。
![step5](step5.png)

- 如以上步骤无误，则再次进入游戏的原创曲目列表中，会发现多了一个TwinkleTwinkleLittleStar的曲目。

---

## 曲目内容编辑
> 以模板文件TwinkleTwinkleLittleStar为例，请首先确保上一步的曲目模板已正确创建。

### wave文件
- 文件名：[索引名].wav
- 该文件为背景音乐的音频文件，要求如下：
    - 文件名必须与索引名一致
    - 必须为wav文件
    - 必须为双声道，编码为16bit-PCM
    - 采样率一定要设置为<font color=#ff0000>44100 Hz</font>，否则曲目加载进游戏时有可能变调
    - 建议实际配置的第一个音符在6秒之后，否则在谱面速度调节时可能出现问题。如前奏时间不足，可以在曲目开始前加入空白
![tip_wave](tip_wave.png)
- 如音频文件无法被正确解析，建议下载Audacity重新导出：
[下载 Audacity](https://www.audacityteam.org/download/)

### 曲目图片
- 文件名：[索引名].png
- 该文件用作曲目在选择界面和碟片上的图片，要求如下：
    - 文件名必须与索引名一致
    - 必须为png文件
- 建议参考模板文件的大小制作，以避免后续再调整大小与位置。

### 背景图片
- 文件名：bg.png
- 该文件仅用作曲目开始、结束过场的大背景图片，要求如下：
    - 文件名必须为：bg.png
    - 非必须配置，删除此文件，则自动使用默认背景图

### info.csv
- 此文件为曲目各项信息的配置文件
- csv文件可以使用Excel编辑，但建议使用Libre Office Calc，能够更好兼容utf8字符（尤其是中文）
[下载 Libre Office Calc](https://www.libreoffice.org/download/download-libreoffice/)
- csv文件的第一行为表头，后续为实际配置行，实际使用数据仅为前两列
- 各项配置数据的说明

Key|Value(默认值)|说明
--|--|--
name|Twinkle Twinkle Little Star|曲目显示的名称，可以与索引名不同
scale_name|C|曲目的调式，会影响曲目的唱名，填写调式key字符串。详见[调式数据](#调式数据)
slice_start|7|曲目wave文件试听开始时间的秒数，会在曲目准备阶段循环播放
slice_end|24|曲目wave文件试听结束时间的秒数
keytype|1|按键类型：1-7键，2-12键。如曲目中使用半音，请务必使用12键
composer|Wolfgang Amadeus Mozart|作曲家姓名，在准备阶段显示
lyrics|Twinkle twinkle little star\nHow I wonder what you are!\nUp above the world so high\nLike a diamond in the sky|歌词，仅显示在过场中，换行请使用\n，另外请勿使用`,`（会导致csv文件解析错误）
copyright|Author: Elif Games|版权信息，可在准备阶段点击info按钮查看
pic_pos|0\|0\|0.5|曲目图片在准备阶段圆形碟片中的位置及缩放：x像素偏移\|y像素偏移\|缩放比例
card_pos|0\|0\|0.7|曲目图片在选择界面方形音乐卡片中的位置及缩放：x像素偏移\|y像素偏移\|缩放比例
video|musicbg1|视频背景，仅支持内置视频：musicbg1 - musicbg9
fade_lose|0.2|视频每秒变暗的百分比
fade_hit|0.2|视频每次三连击时变亮的百分比
alpha_area|0.05\|0.4|视频的透明度区间：最低透明度\|最高透明度
version_info|First version.|本版本的信息说明，将会被提交至创意工坊

- 所有配置文件不支持多语言

### note.csv
- 此文件为曲目所有音符的配置文件
- csv文件的第一行为表头，后续为实际配置行，实际使用数据为前三列
    - id：音符出现顺序的序号
    - pitch：音符的音高key，详见[音高数据](#音高数据)
    - time：音符出现的时间，格式为秒，支持3位小数，即精确到毫秒
- 建议使用config.xlsx配置此文件

### config.xlsx
- 此文件为辅助文件，用于生成note.csv，数据不会被实际加载
- 配置音高，请使用Sheet：config
    - 首先需要记录曲目中所有音的音高
    - 根据个人习惯选择使用音名或唱名来配置数据，仅使用一种即可
    - 如使用唱名，需要在B1单元格正确选择曲目的调式
    - 默认使用音名/意式唱名的写法，详情请参照Sheet：data中的内容，可以将音名/意式唱名列的内容替换为自己熟悉的以方便配置
    - 乐句、歌词两列仅用于辅助定位
    - 如配置的音高超出游戏支持的音域，请使用八度偏移进行调节。1表示向上1个八度，-1表示向下一个八度。
    - 当检查列全部为TRUE时，输出音高列即note.csv中的pitch列，可备用
- 配置时间点
    - 推荐使用Audacity来采集每个音符的时间点：[下载 Audacity](https://www.audacityteam.org/download/)
    - 将时间点数据对应填入表格中的时间点配置列即可
- 组合音高、时间点数据，并顺序编号，如Sheet：note.csv中的格式，然后覆盖note.csv文件即可。

### README.txt
- 说明文件，数据不会被实际加载


## 完成与测试
- 如以上步骤均顺利完成，可在游戏内加载曲目进行测试
- 数据修改并关闭csv文件后，无需重启游戏，再次进入关卡即可刷新内容
- 恭喜你成功创建了自己的曲目，请上传至创意工坊分享给全世界的朋友！

---

## 配置项数据

### 调式数据

调式key|内部调式值|说明
--|--|--
C|1|C大调
C♯|2|C♯大调
D|3|D大调
D♯|4|D♯大调
E|5|E大调
F|6|F大调
F♯|7|F♯大调
G|8|G大调
G♯|9|G♯大调
A|10|A大调
A♯|11|A♯大调，B♭大调也需要填A♯
B|12|B大调
a|1|a小调
a♯|2|a♯小调
b|3|b小调
c|4|c小调
c♯|5|c♯小调
d|6|d小调
d♯|7|d♯小调
e|8|e小调
f|9|f小调
f♯|10|f♯小调
g|11|g小调
g♯|12|g♯小调
- 内部调式值相同，表示为关系大小调，在使用唱名为键位时是相同的。

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

---

## 其他
### 可转化midi单音轨文件为配置的脚本
- 一次性配置python环境（目前工具暂未成熟，后期无问题会制作为exe）
    - 下载并安装Python：[下载Python](https://www.python.org/)
    - 执行cmd，输入并运行：`pip install mido`
    - 将以下代码保存为`mom_converter.py`

```py
# -*- coding: utf-8 -*-
# 将midi文件转化为moundofmusic数据
# pip install mido

# Midi文件名
MIDI_FILE = 'YOUR_MIDI.mid'
# 输出文件名
OUTPUT_FILE = 'note_raw.csv'
# midi音高：moundofmusic音高，音域三个八度
DIC_NOTES = {48: 41, 49: -41, 50: 42, 51: -42, 52: 43, 53: 44, 54: -44, 55: 45, 56: -45, 57: 46, 58: -46, 59: 47, 60: 51, 61: -51, 62: 52, 63: -52, 64: 53, 65: 54, 66: -54, 67: 55, 68: -55, 69: 56, 70: -56, 71: 57, 72: 61, 73: -61, 74: 62, 75: -62, 76: 63, 77: 64, 78: -64, 79: 65, 80: -65, 81: 66, 82: -66, 83: 67}
DIC_NOTES_OUT = {21: 16, 22: -16, 23: 17, 24: 21, 25: -21, 26: 22, 27: -22, 28: 23, 29: 24, 30: -24, 31: 25, 32: -25, 33: 26, 34: -26, 35: 27, 36: 31, 37: -31, 38: 32, 39: -32, 40: 33, 41: 34, 42: -34, 43: 35, 44: -35, 45: 36, 46: -36, 47: 37, 84: 71, 85: -71, 86: 72, 87: -72, 88: 73, 89: 74, 90: -74, 91: 75, 92: -75, 93: 76, 94: -76, 95: 77, 96: 81, 97: -81, 98: 82, 99: -82, 100: 83, 101: 84, 102: -84, 103: 85, 104: -85, 105: 86, 106: -86, 107: 87, 108: 91}

import mido
import csv

def midi_to_mom(filename_midi, filename_csv):
    # 读取MIDI文件
    midi_file = mido.MidiFile(filename_midi)
    # 获取MIDI文件的ticks_per_beat
    ticks_per_beat = midi_file.ticks_per_beat
    # 初始化tempo
    tempo = 1000000  # 默认tempo
    # 计算每个tick的时间（秒）
    tick_time = tempo / (ticks_per_beat * 1000000)
    # 准备CSV文件
    with open(filename_csv, 'w', newline='') as csvfile:
        count = 0
        result = []
        writer = csv.writer(csvfile)
        # 写入标题行
        writer.writerow(['id', 'pitch', 'time'])
        # 初始化变量
        total_time = 0.0
        notes_on = {}  # 存储音符的开始时间和音符号
        # 遍历MIDI文件中的每个轨道
        for track in midi_file.tracks:
            for msg in track:
                if msg.type == 'set_tempo': # 更新tick_time
                    tempo = msg.tempo
                    tick_time = tempo / (ticks_per_beat * 1000000)
                    # print(f'tempo change to: {tempo}')
                total_time += msg.time * tick_time  # 当前累积时间记录
                if msg.type == 'note_on' and msg.velocity > 0:  # 计算当前音符的开始时间
                    notes_on[msg.note] = total_time
                    count += 1
                elif msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0):  # 计算当前音符的停止时间
                    if msg.note in notes_on:
                        play_time = notes_on[msg.note]
                        # 转化、记录数据
                        if (msg.note not in DIC_NOTES.keys()):
                            note = DIC_NOTES_OUT[msg.note]    # 超出音域的音符
                            print(f'WARNING! <id:{count} pitch:{note}> not in range, need to be transpose!')
                        else:
                            note = DIC_NOTES[msg.note]
                        result.append((count, note, play_time))
                        writer.writerow([count, note, round(play_time,3)])  # 时间只保留三位小数
    print(f'Successfully create midi data file: {filename_csv}')
    return midi_file, result

if __name__ == '__main__':
    midi_file, result = midi_to_mom(MIDI_FILE, OUTPUT_FILE)
```

- 转化midi文件
    - 准备完整曲目的midi文件
    - 提取其中的主旋律音轨，可使用[MuseScore](https://musescore.org/en/download)删除其他音轨。如果主旋律分布在多个音轨，则此方法可能不太合适。
    - 导出主旋律midi文件，与`mom_converter.py`放在同文件夹中
    - 右键点击`mom_converter.py`，选择`Edit with IDLE`，打开python脚本
    - 替换脚本第6行的文件名为主旋律midi文件名
    ```
    MIDI_FILE = 'YOUR_MIDI.mid'
    ```
    - 按`F5`执行脚本，如果提示成功，则会生成`note_raw.csv`文件，此文件与[note.csv](#notecsv)格式一致
    - midi文件可能会有部分超出3个八度的地方，脚本导出时也有提示，可借助Excel调整

- 完成其他配置
    - 将完整曲目的midi文件转化为wav，这样确保所有音符的时间与脚本转化的一致
    - 参照上述教程补全其余信息即可