// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import gameMgr from "./game_manager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(gameMgr)
    GAME_MGR: gameMgr = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null; 

    @property
    public anim = null;
    public istouch: boolean;


    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.istouch = false;
    }

    update (dt) {

    }
    onBeginContact(contact, self, other) {
        if(other.node.name=="mario" && other.node.y<this.node.y && contact.getWorldManifold().normal.y<0 && this.istouch==false){
            this.istouch=true;
            this.anim.play("question_block_none");
            if(this.itemPrefab.name=="Coin")this.GAME_MGR.updateScore(1);
            this.createCoin();
        }
    }
    public createCoin()
    {   cc.log("create coin");
        let item = cc.instantiate(this.itemPrefab);
        item.parent = this.node.parent;
        item.setPosition(this.node.x,this.node.y+1);
    }
    
}
