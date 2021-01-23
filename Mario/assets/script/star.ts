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


    @property
    public can_eat = true;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        let action;
        action = cc.spawn(cc.moveTo(0.4, this.node.x, this.node.y+16,),cc.scaleBy(0.5, 2));
        this.node.runAction(action);
    }
    update (dt) {
    }
    onBeginContact(contact, self, other) {
        if(other.node.name=="mario"  && this.can_eat){
            this.node.destroy();
        }
        else if(other.node.name=="question_block"){

        }
        
    }
    onEndContact(contact, self, other) {
        
    }
    
}
