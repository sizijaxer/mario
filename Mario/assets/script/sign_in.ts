const {ccclass, property} = cc._decorator;
 
@ccclass
export default class sign_in extends cc.Component {
 
    @property(cc.Node)
    Alert: cc.Node = null;

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;
 
    @property
    username: string =null;
    coin_score: number = null;
    life_score: number = null;

    @property(cc.EditBox)
    account: cc.EditBox  = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;
 
    // LIFE-CYCLE CALLBACKS:
 
    onLoad (){
        cc.director.getPhysicsManager().enabled = true;
    }
 
    start () {
        cc.audioEngine.playMusic(this.bgm, true);
    }
    public register(){
        var self = this
        var src;
        firebase.auth().createUserWithEmailAndPassword (self.account.string, self.password.string).then(function(){
            cc.log("register succeed!");
            alert("register succeed");
            for(var i=0;i<self.account.string.length;i++){
                if(self.account.string[i]=="@")break;
            }
            src = self.account.string.slice(0,i);
            src = src.toLowerCase();
            firebase.database().ref('users/' + src).set({
                coin_score: 0,
                life_score: 1,
            });
        }).catch(function(error){
            self.account.string = "";
            self.password.string = "";
            //var errorMessage = error.message;
            alert(error.message);
        });

    }
    
    public load_menu(){
        var self = this;
        cc.log(this.account.string,this.password.string);
        firebase.auth().signInWithEmailAndPassword (this.account.string, this.password.string).then(function(){
            self.login();
        }).catch(function(error){
            //this.account.string = "";
            //this.password.string = "";
            //var errorMessage = error.message;
            alert(error.message);
        });
    }
    public login(){
        var coin_score;
        var life_score;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var a = user.email;
                for(var i=0;i<a.length;i++){
                    if(a[i]=="@")break;
                }
                a = a.slice(0,i);
                cc.log("hi user - 2!",a);
                firebase.database().ref('/users/'+a).once('value').then(function(snapshot) {
                    //cc.log("read succ!",snapshot.val().coin_score);
                    cc.director.loadScene("menu");
                });
            } 
            else {
                cc.log("logout");
            }
        });
    }
}
 
 
