# Software Studio 2020 Spring Assignment 2
## Web URL
https://mario-107062333.web.app/

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|10%|Y|
|Complete Game Process|5%|Y|
|Basic Rules|45%|Y|
|Animations|10%|Y|
|Sound Effects|10%|Y|
|UI|10%|Y|

## Website Detail Description
### 操作方法:
1. 左右移動
    A->左移
    D->右移
2. 跳躍
    Space(空白鍵)
### 遊戲規則:
1. 遊戲目的:
    利用有限的重生次數來完成遊戲中的兩關關卡。
2. 可重生次數:
    a.每次死亡，將會減少一次的可成生次數。
3. 分數Score:
    a.每次贏得關卡可會得1000分。
    b.每打死一隻怪就能獲得100分。
4. 死亡規則:
    a.超出地圖外面
    ![](https://i.imgur.com/iCCIqfc.png)

    b.在想馬力歐的狀態被怪物打死
    ![](https://i.imgur.com/C7WQL9O.png)

    c.時間到
    ![](https://i.imgur.com/kYsVqI9.png)
### 遊戲介面:
1. 登入畫面
    ![](https://i.imgur.com/lNh9gpZ.png)

    a. 第一次使用需先註冊帳號，在輸入完帳密後，按下            Register按鈕即可完成註冊
        ![](https://i.imgur.com/MORs1gf.png)

    b. 已擁有帳號，在輸入完帳密後，按下Sign in 按鈕即刻        完成登入，並前往任務選單畫面
2. 任務選單
    a. Stage1與Stage2按鈕分別對應到前往兩個不同的關卡
    b. 若要登出則Logout按鈕即可
    ![](https://i.imgur.com/LC1t6mI.png)

3. 失敗畫面
    a. 當可重次數為0並且死亡後，及會跳至Game Over的畫面        並保持剩餘0次重生而回到任務選單
    ![](https://i.imgur.com/zGmZd6a.png)

# Basic Components Description :
1. World map:
    a. Stage 1:
    ![](https://i.imgur.com/PZpJu3f.png)

    b. Stage 2:
    ![](https://i.imgur.com/uuLSmfF.png)

2. Player : 
    a. Small Mario
    ![](https://i.imgur.com/CxhXc8A.png)
    一般狀態，被撞到一次直接死去。
    
    b. Big Mario
    ![](https://i.imgur.com/sSErdud.png)
    被敵人打到時會縮小成原本Small Mario狀態。

    c. Super Rolling Mario
    ![](https://i.imgur.com/n59oT10.png)
    相當於無敵狀態。

4. Enemies:
    a. Goomba
    ![](https://i.imgur.com/skLwa5E.png)
    當被mario踩到時會被壓扁並消失。
    
    b. Turtle
    ![](https://i.imgur.com/UlYHGIg.png)
    
    ![](https://i.imgur.com/Uz4zfiD.png)
    當Tuertle頭被mario踩到時會躲進龜殼
    當在踩下時則會開始以龜殼狀態跑動，撞到敵人或玩家都會使其死去。

5. Question Blocks:
    ![](https://i.imgur.com/JxLY6w6.png)
    
    a. Coin Question Block
    ![](https://i.imgur.com/J2MJMJE.png)
    
    b. Mushroom Question Block
    ![](https://i.imgur.com/k6XmijT.png)
    吃到將使小馬利歐變大，若已經是Big Mario 狀態則會使生命(可成生次數)+1。    
    
    c. Star Question Block
    ![](https://i.imgur.com/8rWNZjp.png)
    吃完將成為 Super Rolling Mario 並維持10秒無敵，以選轉的方式撞死敵人。
    
7. Win flag:
    ![](https://i.imgur.com/WRia560.png)
    當碰到旗幟時，即代表成功過該關卡並能前往下個關卡或任務選單
    
6. UI:
    a. Life
    ![](https://i.imgur.com/YXjVOft.png)
    b. Score
    ![](https://i.imgur.com/9Able7p.png)
    c.time
    ![](https://i.imgur.com/1d8P00Y.png)

