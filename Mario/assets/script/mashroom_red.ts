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
    public right:boolean = true;
    public current_speed_x = 0;
    public onGround: boolean = false;

    @property({type:cc.AudioClip})
    mushroom_red_effect: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        let action;
        cc.audioEngine.playEffect(this.mushroom_red_effect,false);
        action = cc.spawn(cc.moveTo(0.4, this.node.x, this.node.y+16,),cc.scaleBy(0.5, 2));
        this.node.runAction(action);
        this.scheduleOnce(function(){
            action = cc.moveTo(0.4, this.node.x+33, this.node.y);
            this.node.runAction(action);
            this.current_speed_x = 100;
        },0.7)
    }
    update (dt) {
        if(this.onGround){
            if(this.right)this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.current_speed_x, 0);
            else this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.current_speed_x, 0);
        }
    }
    onBeginContact(contact, self, other) {
        if(other.node.name=="mario"  && this.can_eat){
            this.node.destroy();
        }
        else if(other.node.name=="question_block"){

        }
        else if(other.node.name == "ground" || other.node.name=="Turtle" || other.node.name=="mashroon_red" || other.node.name=="Goomba"){cc.log("here!");
            if(contact.getWorldManifold().normal.x<0){
                this.right = true;
            }
            else if(contact.getWorldManifold().normal.x>0){
                this.right = false;
            }
            this.onGround = true;
        }
        else{
            this.onGround = true;
        }
        
    }
    onEndContact(contact, self, other) {
        
        if(other.node.name == "ground" && this.node.getComponent(cc.RigidBody).linearVelocity.y!=0)this.onGround = false;
    }
    
}
