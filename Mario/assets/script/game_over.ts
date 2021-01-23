// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
 
const {ccclass, property} = cc._decorator;
 
@ccclass
export default class NewClass extends cc.Component {
 

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad (){
        cc.director.getPhysicsManager().enabled = true;
    }
 
    start () {
        cc.audioEngine.playMusic(this.bgm, false);
        this.scheduleOnce(function(){
            cc.director.loadScene("menu");
        },4)
    }
 
    // update (dt) {}
}
 
