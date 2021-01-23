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
import player from "./player";
@ccclass
export default class NewClass extends cc.Component {
 
    @property(cc.Label)
    label: cc.Label = null;
    @property({type:cc.AudioClip})
    dead_effect: cc.AudioClip = null;
 
    @property
    text: string = 'hello';
    public isShell: boolean;
    public isDead: boolean;
    public anim = null;
    public right :boolean
    public current_speed_x: number = 0;
    @property(player)
    Player: player = null;
    // LIFE-CYCLE CALLBACKS:
 
    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
    }
 
    start () {
        this.isShell = false;
        this.isDead = false;
        this.anim = this.getComponent(cc.Animation);
        this.current_speed_x = 60;
        this.right=false;
    }
 
    update (dt) {
        if(this.isDead){
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        if(this.right){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.current_speed_x, 0);
            this.node.scaleX = -2;
        }
        else{
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.current_speed_x, 0);
            this.node.scaleX = 2;
        }  
    }
    onBeginContact(contact, self, other) {
        if(other.node.name=="mario" && this.Player.isSuper){
            contact.enabled = false;
            this.Player.getComponent(cc.RigidBody).gravityScale = 1000;
            this.scheduleOnce(function(){
                this.Player.getComponent(cc.RigidBody).gravityScale = 15;
                this.Player.onGround=true;
            },0.01)
            this.isDead = true;
                let action;
                action = cc.jumpTo(2, this.node.x, this.node.y-100,this.node.y,1);
                this.node.scaleY = -2;
                this.node.runAction(action);
                this.scheduleOnce(function(){
                    this.node.destroy();
                },2)
        }
        else if(other.node.name=="lower_bound"){
            this.node.destroy();
        }
        else if(other.node.name == "mario" && other.node.y>this.node.y) {
            if(this.Player.issmalling || this.Player.isundefeated){
                contact.enabled = false;
                cc.log("can kill u")
                return;
            }
            else if(this.anim.getAnimationState("turtle_move").isPlaying){
                this.isShell = true;
                this.current_speed_x = 0;
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
                this.anim.play('turtle_hide');
                //cc.log(this.node.getComponent(cc.PhysicsBoxCollider).size.width);
                this.node.getComponent(cc.PhysicsBoxCollider).size.width=17.9;
                this.node.getComponent(cc.PhysicsBoxCollider).size.height=16.9;
                this.node.getComponent(cc.PhysicsBoxCollider).offset.y = -5.1;
                this.node.getComponent(cc.PhysicsBoxCollider).apply();
            }
            else if(this.anim.getAnimationState("turtle_hide").isPlaying){
                cc.log("qq");
                this.isShell = false;
                this.anim.play('turtle_shell_move');
                this.current_speed_x = 300;
                if(other.node.x<=this.node.x)this.right = true;
                else this.right = false;
            }
            else if(this.anim.getAnimationState("turtle_shell_move").isPlaying && other.node.y>this.node.y){
                this.isDead = true;
                let action;
                action = cc.jumpTo(2, this.node.x, this.node.y-100,this.node.y,1);
                this.node.scaleY = -2;
                this.node.runAction(action);
                this.scheduleOnce(function(){
                    this.node.destroy();
                },2)
            }
        }
        else if((other.node.name == "Turtle" && other.getComponent(cc.Animation).getAnimationState("turtle_shell_move").isPlaying)){
            this.isDead = true;
            cc.audioEngine.playEffect(this.dead_effect,false);
            let action;
            action = cc.jumpTo(2, this.node.x, this.node.y-100,this.node.y,1);
            this.node.scaleY = -2;
            this.node.runAction(action);
            this.scheduleOnce(function(){
                this.node.destroy();
            },2)
        }
        else if(other.node.name == "Goomba" && !this.anim.getAnimationState("turtle_shell_move").isPlaying){
            if(contact.getWorldManifold().normal.x<0){
                this.right = true;
            }
            else if(contact.getWorldManifold().normal.x>0){
                this.right = false;
            }
        }
        else if(other.node.name == "ground" || other.node.name == "mashroom_red" ){
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
 
