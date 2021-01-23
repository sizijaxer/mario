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

    @property(cc.Node)
    label: cc.Node = null;
    @property(cc.Node)
    coin_score: cc.Node = null;
    @property(cc.Node)
    life_score: cc.Node = null;
    @property(cc.Node)
    wait_for_data_pic: cc.Label = null;
 
    @property
    text: string = 'hello';
    coin_n: string;
    life_n: string;
    // LIFE-CYCLE CALLBACKS:
 
    onLoad (){
        //cc.director.getPhysicsManager().enabled = true;

        var a;
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                a = user.email;
                for(var i=0;i<a.length;i++){
                    if(a[i]=="@")break;
                }
                a = a.slice(0,i);
                a = a.toLowerCase();
                firebase.database().ref('/users/'+a).once('value').then(function(snapshot) {
                    self.coin_score.getComponent(cc.Label).string = snapshot.val().coin_score;
                    self.life_score.getComponent(cc.Label).string = snapshot.val().life_score;
                    self.label.getComponent(cc.Label).string = "Hi! "+a;
                    self.wait_for_data_pic.destroy();
                });
            } 
            else {
                cc.log("logout");
            }
        });
    }
    start () {
    }

    public logout(){
        firebase.auth().signOut().then(function() {
            alert('logout success');
            cc.director.loadScene("sign");
        }).catch(function(error){
            alert(error.message);
            
        })
    }

    public load_stage1(){
        cc.director.loadScene("loading");
    }
    public load_stage2(){
        cc.director.loadScene("loading2");
    }
 
    // update (dt) {}
}
 
