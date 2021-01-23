// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
	
import player from "./player";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property({type:cc.AudioClip})
    dead_effect: cc.AudioClip = null;

    @property
    text: string = 'hello';
    public isDead: boolean;
    public anim = null;
    public right :boolean = true;
    @property(player)
    Player: player = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.isDead = false;
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {
        if(!this.isDead ){
            if(this.right)this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(80, 0);
            else this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-80, 0);
        }
        else{
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
    }
    onBeginContact(contact, self, other) {
        if(other.node.name=="mario" && this.Player.isSuper){
            contact.enabled = false;
            contact.enabled = false;
            this.Player.getComponent(cc.RigidBody).gravityScale = 1000;
            this.scheduleOnce(function(){
                this.Player.getComponent(cc.RigidBody).gravityScale = 15;
                this.Player.onGround=true;
            },0.01)
            cc.log("goomba dead");
            this.isDead = true;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.anim.play('goomba_dead');
            cc.log(this.node.getComponent(cc.PhysicsBoxCollider).size.width)
            this.node.getComponent(cc.PhysicsBoxCollider).size.width=16.8;
            this.node.getComponent(cc.PhysicsBoxCollider).size.height=9.5;
            this.node.getComponent(cc.PhysicsBoxCollider).offset.y = -7.2;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();
            cc.log(this.node.getComponent(cc.PhysicsBoxCollider).size.width)
            this.schedule(function(){
                this.node.destroy();
            },0.1)
        }
        else if(other.node.name=="lower_bound"){
            this.node.destroy();
        }
        else if(other.node.name == "mario" && (other.node.y>this.node.y)) {
            if(this.Player.issmalling || this.Player.isundefeated){
                contact.enabled = false;
                return;
            }
            cc.log("goomba dead");
            this.isDead = true;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.anim.play('goomba_dead');
            cc.log(this.node.getComponent(cc.PhysicsBoxCollider).size.width)
            this.node.getComponent(cc.PhysicsBoxCollider).size.width=16.8;
            this.node.getComponent(cc.PhysicsBoxCollider).size.height=9.5;
            this.node.getComponent(cc.PhysicsBoxCollider).offset.y = -7.2;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();
            cc.log(this.node.getComponent(cc.PhysicsBoxCollider).size.width)
            this.schedule(function(){
                this.node.destroy();
            },0.1)
        }
        else if(other.node.name == "Turtle" && other.getComponent(cc.Animation).getAnimationState("turtle_shell_move").isPlaying && !this.isDead){
            this.isDead = true;

            cc.audioEngine.playEffect(this.dead_effect,false);
            let action;
            action = cc.jumpTo(2, this.node.x, this.node.y-100,this.node.y,1);
            this.node.scaleY = -2;
            this.node.runAction(action);
            this.scheduleOnce(function(){
                this.node.destroy();
            },1)
        }
        else if(other.node.name == "ground" || other.node.name == "mashroom_red" || other.node.name=="Goomba"|| (other.node.name == "Turtle" && !other.getComponent(cc.Animation).getAnimationState("turtle_shell_move").isPlaying) && !this.isDead){
            //cc.log(this.node.x)
            if(contact.getWorldManifold().normal.x<0){
                this.right = true;
            }
            else if(contact.getWorldManifold().normal.x>0){
                this.right = false;
            }
        }
    }
}
