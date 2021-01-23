import gameMgr from "./game_manager2";
const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(cc.Node)
    mainCamera: cc.Node = null;

    @property(gameMgr)
    GAME_MGR: gameMgr = null;

    @property({type:cc.AudioClip})
    jump_effect: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    kick_effect: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    growing_effect: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    smalling_effect: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    get_more_mashroom_effect: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    die_bgm: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    win_bgm: cc.AudioClip = null;

    @property
    public playerSpeed: number = 0;
 
    public aDown: boolean = false; // key for player to go left
 
    public dDown: boolean = false; // key for player to go right

    public spaceDown: boolean = false; // key for player to jump
 
    public onGround: boolean = false;

    public trace_player: boolean = false;

    public life: number = 1;

    public isdead: boolean = false;
    public isgrowing: boolean = false;
    public issmalling: boolean = false;
    public isundefeated: boolean = false;
    public iswin: boolean = false;
    public istime_out:boolean = false;
    public isbig:boolean = false;
    public small_mario_jump_force: number = 73000;
    public big_mario_jump_force: number = 110000;

    public dead_pos: number;
    public reborn_x: number = 0;
    public reborn_y: number = 0;
    public reborn_camera_x: number = 0;
    public reborn_camera_y: number = 0;
    public anim = null;
    public animateState = null; //this will use to record animationState


    onLoad (){
        cc.log("hi player");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.life = 1;
        this.reborn_x = this.node.x;
        this.reborn_y = this.node.y;
        this.reborn_camera_x = this.mainCamera.x;
        this.reborn_camera_y = this.mainCamera.y;
        this.dead_pos = this.node.y+10;
    }

    update (dt){
        if(this.istime_out==true)return;
        if(this.GAME_MGR.time_out && !this.isdead){
            this.istime_out = true;
            this.animateState = this.anim.play('mario_dead');
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            cc.audioEngine.playMusic(this.die_bgm,false);
            this.GAME_MGR.updatelife(-1);
            if(this.GAME_MGR.life==-1)this.GAME_MGR.play_gameover();
            else this.GAME_MGR.player_dead();
            this.scheduleOnce(function(){
                this.life = 1;
                let action;
                action = cc.jumpTo(1, this.node.x, -350,100,1);
                this.node.runAction(action);
                /*this.scheduleOnce(function(){
                    cc.director.loadScene("loading");
                },2)*/
            },0.5);
            return
        }
        this.playerMovement(dt);
        if(this.node.x >= this.mainCamera.x )this.trace_player = true;
        if(this.trace_player)this.mainCamera.x = this.node.x;
    }

    onKeyDown(event) {
        cc.log("Key Down: " + event.keyCode);
        if(event.keyCode == cc.macro.KEY.a) {
            this.aDown = true;
            this.dDown = false;
        } 
        else if(event.keyCode == cc.macro.KEY.d) {
            this.dDown = true;
            this.aDown = false;
        }
        else if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = true;
        }
    }
    onKeyUp(event) {
        if(event.keyCode == cc.macro.KEY.a){
            this.aDown = false;
        }
        else if(event.keyCode == cc.macro.KEY.d){
            this.dDown = false;
        }
        else if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = false;
        }

    }
    public jump() {
        cc.log("jump!");
        this.onGround = false;
        this.isundefeated = false;
        if(!this.isbig)this.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0, this.small_mario_jump_force), true);
        else this.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0, this.big_mario_jump_force), true);
        cc.audioEngine.playEffect(this.jump_effect, false);
    }
    public playerMovement(dt) {
        this.playerSpeed = 0;
        if(this.isdead){
            this.animateState = this.anim.play('mario_dead');
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        else if(this.iswin){
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        else if(this.isgrowing){
            cc.log("growing")
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        else if(!this.isgrowing && this.isbig){
            if(this.aDown){
                this.playerSpeed = -300;
                this.node.scaleX = -2;
                if(!this.anim.getAnimationState('big_mario_move').isPlaying || this.animateState == null)this.animateState = this.anim.play('big_mario_move');
                if(this.spaceDown)this.animateState = this.anim.play('big_mario_jump');
            }
            else if(this.dDown){
                this.playerSpeed = 300;
                this.node.scaleX = 2;
                if(!this.anim.getAnimationState('big_mario_move').isPlaying || this.animateState == null)this.animateState = this.anim.play('big_mario_move');
                if(this.spaceDown)this.animateState = this.anim.play('big_mario_jump');
            }
            else if(this.spaceDown){
                this.animateState = this.anim.play('big_mario_jump');
            }
            else{
                this.anim.play('big_mario');
                this.animateState = null;
                this.playerSpeed = 0;
            }
        }
        else if(this.issmalling){
            cc.log("smalling");
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        else if(!this.isgrowing && !this.isbig && !this.issmalling){
            if(this.aDown){
                this.playerSpeed = -300;
                this.node.scaleX = -2;
                if(!this.anim.getAnimationState('small_mario_move').isPlaying || this.animateState == null)this.animateState = this.anim.play('small_mario_move');
                if(this.spaceDown)this.animateState = this.anim.play('jump');
            }
            else if(this.dDown){
                this.playerSpeed = 300;
                this.node.scaleX = 2;
                if(!this.anim.getAnimationState('small_mario_move').isPlaying || this.animateState == null)this.animateState = this.anim.play('small_mario_move');
                if(this.spaceDown)this.animateState = this.anim.play('jump');
            }
            else if(this.spaceDown){
                this.animateState = this.anim.play('jump');
            }
            else{
                this.anim.play('stand');
                this.animateState = null;
                this.playerSpeed = 0;
            }
        }
        this.node.x += this.playerSpeed * dt;
        if(this.spaceDown && this.onGround && !this.isgrowing && !this.issmalling)this.jump();
        
    }

    onBeginContact(contact, self, other) {
        if(other.node.name=="Goomba" && !this.isdead){
            if(this.issmalling || this.isundefeated)contact.enabled = false;
            else if(other.getComponent(cc.Animation).getAnimationState("goomba_move").isPlaying){
                if(contact.getWorldManifold().normal.y>=0 && ((self.node.y<=other.node.y && !this.isbig)||(this.isbig))){
                    if(this.life==1){
                        //cc.log("gg");
                        cc.log("gg",self.node.x,self.node.y);
                        cc.log("gg2",other.node.x,other.node.y);
                        this.life --;
                        this.isdead = true;
                        cc.audioEngine.playMusic(this.die_bgm,false);

                        this.GAME_MGR.updatelife(-1);
                        if(this.GAME_MGR.life==-1)this.GAME_MGR.play_gameover();
                        else this.GAME_MGR.player_dead();

                        this.scheduleOnce(function(){
                            this.life = 1;
                            let action;
                            action = cc.jumpTo(1, this.node.x, -350,100,1);
                            this.node.runAction(action);
                        },0.5);
                    }
                    else if(this.life==2){
                        this.life--;
                        this.issmalling = true;
                        this.isundefeated = true;
                        this.isbig = false;
                        contact.enabled = false;
                        this.scheduleOnce(function(){
                            this.issmalling = false;
                            this.node.getComponent(cc.PhysicsBoxCollider).enabled = true;
                            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                            let action = cc.moveTo(0.1,cc.v2(self.node.x,self.node.y-10));
                            this.node.runAction(action);
                            this.onGround = true;
                        },2)
                        this.scheduleOnce(function(){
                            this.isundefeated = false;
                        },2)
                        this.animateState = this.anim.play('mario_smalling');
                        cc.audioEngine.playEffect(this.smalling_effect,false);
                        this.node.getComponent(cc.PhysicsBoxCollider).size.width=16.3;
                        this.node.getComponent(cc.PhysicsBoxCollider).size.height=16;
                        this.node.getComponent(cc.PhysicsBoxCollider).offset.x = 0;
                        this.node.getComponent(cc.PhysicsBoxCollider).offset.y = 0;
                        this.node.getComponent(cc.PhysicsBoxCollider).apply();
                    }
                }
                else{
                    cc.log("hit gooba");
                    cc.audioEngine.playEffect(this.kick_effect, false);
                    this.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0, 103000), true);
                    this.onGround = false;
                    this.GAME_MGR.updateScore(1);
                }
            }
            else{
                this.onGround = true;
            }
        }
        else if(other.node.name=="Turtle" && !this.isdead ){
            if(this.issmalling || this.isundefeated){contact.enabled = false;cc.log("kk");}
            else if(other.getComponent(cc.Animation).getAnimationState("turtle_move").isPlaying || other.getComponent(cc.Animation).getAnimationState("turtle_shell_move").isPlaying){
                if(contact.getWorldManifold().normal.y>=0 &&  ((self.node.y<=other.node.y && !this.isbig)||(this.isbig))){
                    if(this.life==1){
                        cc.log("gg",self.node.x,self.node.y);
                        cc.log("gg2",other.node.x,other.node.y);
                        this.life --;

                        this.GAME_MGR.updatelife(-1);
                        if(this.GAME_MGR.life==-1)this.GAME_MGR.play_gameover();
                        else this.GAME_MGR.player_dead();

                        this.isdead = true;
                        cc.audioEngine.playMusic(this.die_bgm,false);
                        this.scheduleOnce(function(){
                            this.life = 1;
                            let action;
                            action = cc.jumpTo(1, this.node.x, -350,100,1);
                            this.node.runAction(action);
                        },0.5);
                    }
                    else if(this.life==2){cc.log("hi get samll");
                        this.life--;
                        this.issmalling = true;
                        this.isundefeated = true;
                        this.isbig = false;
                        contact.enabled = false;
                        cc.audioEngine.playEffect(this.smalling_effect,false);
                        this.scheduleOnce(function(){
                            this.issmalling = false;
                            this.node.getComponent(cc.PhysicsBoxCollider).enabled = true;
                            this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                            let action = cc.moveTo(0.1,cc.v2(self.node.x,self.node.y-10));
                            this.node.runAction(action);
                        },2)
                        this.scheduleOnce(function(){
                            this.isundefeated = false;
                        },2)
                        this.animateState = this.anim.play('mario_smalling');
                        this.node.getComponent(cc.PhysicsBoxCollider).size.width=16.3;
                        this.node.getComponent(cc.PhysicsBoxCollider).size.height=16;
                        this.node.getComponent(cc.PhysicsBoxCollider).offset.x = 0;
                        this.node.getComponent(cc.PhysicsBoxCollider).offset.y = 0;
                        this.node.getComponent(cc.PhysicsBoxCollider).apply();
                        this.onGround = true;
                    }
                }
                else{
                    if(other.getComponent(cc.Animation).getAnimationState("turtle_shell_move").isPlaying)this.GAME_MGR.updateScore(1);
                    cc.log("hit turtle hide");
                    cc.audioEngine.playEffect(this.kick_effect, false);
                    this.onGround = false;
                    this.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0, 103000), true);
                }
            }
            else{
                cc.log("hit turtle shell");
                cc.audioEngine.playEffect(this.kick_effect, false);
                if(contact.getWorldManifold().normal.y<0){
                    this.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0, 133000), true);
                    this.onGround = false;
                }
                else{
                    this.onGround = true;
                }
            }

        }
        else if(other.node.name == "question_block" && contact.getWorldManifold().normal.y<0  && !this.isdead){
            cc.log("hit block q");
            this.onGround = true;
        }
        else if(other.node.name == "mashroon_red" && !this.isdead){
            if(this.life<2){
                this.life++;
                this.isgrowing = true;
                cc.audioEngine.playEffect(this.growing_effect,false);
                this.scheduleOnce(function(){
                    this.isgrowing = false;
                    this.node.getComponent(cc.PhysicsBoxCollider).enabled = true;
                    this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                    cc.log('gf');
                    
                },1)
                if(this.onGround){
                    let action = cc.moveTo(0.1,cc.v2(self.node.x,self.node.y+10));
                    this.node.runAction(action);
                }
                this.isbig = true;
                this.animateState = this.anim.play('mario_growing');
                this.node.getComponent(cc.PhysicsBoxCollider).size.width=15;
                this.node.getComponent(cc.PhysicsBoxCollider).size.height=28;
                this.node.getComponent(cc.PhysicsBoxCollider).offset.x = 0;
                this.node.getComponent(cc.PhysicsBoxCollider).offset.y = 0;
                this.node.getComponent(cc.PhysicsBoxCollider).apply();
            }
            else{
                ///get score
                this.GAME_MGR.updatelife(1);
                cc.audioEngine.playEffect(this.get_more_mashroom_effect,false);
            }
            this.GAME_MGR.updateScore(1);
        }
        else if(other.node.name == "ground" && contact.getWorldManifold().normal.y<0  && !this.isdead) {
            cc.log("hits the ground");
            this.onGround = true;
        }
        else if(other.node.name=="lower_bound"){
            this.life=0;
            this.isdead = true;

            this.GAME_MGR.updatelife(-1);
            if(this.GAME_MGR.life==-1)this.GAME_MGR.play_gameover();
            else this.GAME_MGR.player_dead();

            cc.audioEngine.playMusic(this.die_bgm,false);
            this.scheduleOnce(function(){
                this.life = 1;
                let action;
                action = cc.jumpTo(1, this.node.x, -350,100,1);
                this.node.runAction(action);
            },0.5);
        }
        else if(other.node.name=="win_flag"){
            //this.life=0;
            this.iswin = true;
            cc.audioEngine.playMusic(this.win_bgm,false);
            if(this.isbig)this.animateState = this.anim.play('big_mario_win');
            else this.animateState = this.anim.play('small_mario_win');
            this.GAME_MGR.updateScore(10);
            this.GAME_MGR.play_win();
            /*this.scheduleOnce(function(){
                this.scheduleOnce(function(){
                cc.director.loadScene("menu");
                },2)
            },0.5);*/
        }
    }
    onEndContact(contact,self,other){
        if(this.isundefeated)this.onGround = true;
        else this.onGround = false;
    }
        
}
