const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    Timer: cc.Node = null;

    @property(cc.Node)
    Life: cc.Node = null;

    @property(cc.Node)
    wait_for_data_pic: cc.Label = null;

    @property(cc.Node)
    Score: cc.Node = null;

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;
    @property
    cnt:number = 300;
    public coin: number = 0;
    public life: number = 0;
    public user:string ;

    public time_out: boolean  = false;

    // LIFE-CYCLE CALLBACKS:
    public player_dead(){
        ////write data;
        var self = this;
        firebase.database().ref('users/' + self.user).set({
            coin_score: self.coin,
            life_score: self.life
        }).then(function(){
            self.scheduleOnce(function(){
                cc.director.loadScene("stage2");
            },2.5)
        });
    }
    public play_gameover(){
        ////write data;
        this.Life.getComponent(cc.Label).string = "0";
        var self = this;
        firebase.database().ref('users/' + self.user).set({
            coin_score: self.coin,
            life_score: 0
        }).then(function(){
            self.scheduleOnce(function(){
                cc.director.loadScene("game_over");
            },2.5)
        });
    }
    public play_win(){
        var self = this;
        firebase.database().ref('users/' + self.user).set({
            coin_score: self.coin,
            life_score: self.life
        }).then(function(){
            self.scheduleOnce(function(){
                cc.director.loadScene("menu");
            },2.5)
        });
    }
    public updatelife(num: number){
        let ori = +(this.Life.getComponent(cc.Label).string);
        let a = num+ori;
        cc.log(ori);
        /*if(a <0){
            cc.log("game over!!");
            this.scheduleOnce(function(){
                //cc.director.loadScene("game_over");
            },2.5)
            return;
        }
        else if(a>=0 && num==-1){
            this.scheduleOnce(function(){
                //cc.director.loadScene("stage1");
            },2.5)
        }*/
        this.Life.getComponent(cc.Label).string = a.toString();
        this.life = a;
    }
    public updateScore(num: number){
        let ori = +(this.Score.getComponent(cc.Label).string);
        this.Score.getComponent(cc.Label).string = (num*100+ori).toString();
        this.coin = (num*100+ori);
    }
    onLoad () {
        var a;
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                a = user.email;
                for(var i=0;i<a.length;i++){
                    if(a[i]=="@")break;
                }
                a = a.slice(0,i);
                firebase.database().ref('/users/'+a).once('value').then(function(snapshot) {
                    self.Score.getComponent(cc.Label).string = snapshot.val().coin_score;
                    self.Life.getComponent(cc.Label).string = snapshot.val().life_score;
                    self.coin = snapshot.val().coin_score;
                    self.life = snapshot.val().life_score;
                    self.user = a;
                    self.wait_for_data_pic.destroy();
                    cc.audioEngine.playMusic(self.bgm, true);
                });
            } 
        });
    }

    start () {
        this.Score.getComponent(cc.Label).string = this.coin.toString();
        this.Timer.getComponent(cc.Label).string = this.cnt.toString();
        this.schedule(function(){
            this.cnt--;
            if(this.cnt<0){
                this.cnt=0;
                this.time_out = true;
            }
            this.Timer.getComponent(cc.Label).string = this.cnt.toString();
        },1);
        this.Life.getComponent(cc.Label).string = this.life.toString();
    }

    update (dt) {
    }

}
