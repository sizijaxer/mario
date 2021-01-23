// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    public anim = null;
    public can_eat = true;
    // LIFE-CYCLE CALLBACKS:

    @property({type:cc.AudioClip})
    coin_effect: cc.AudioClip = null;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        cc.audioEngine.playEffect(this.coin_effect,false);
        this.anim = this.getComponent(cc.Animation);
        let action;
        action = cc.spawn(cc.jumpTo(0.4, this.node.x, this.node.y+32,50,1), cc.fadeTo(2.4, 0));
        this.node.runAction(action);
    }
    update (dt) {
    }
    
    
}
