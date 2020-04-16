
class Group {
    task = {};

    openWS(){
        let sc = this;
        let user = _.local("user");
        //
        if(!sc.ws){// ws 连接
            sc.userId = user.id;
            sc.task = {};
            sc.ws = setInterval(function () {// TODO ws userId
                let row = {id:'47c12b3c-5469-470a-b4a0-c3080e96864a',status:[0,4][_.random(0,1)]}
                sc.renderRow(row);
            },2000)
        }
    }

    closeWS(){
        clearInterval(this.ws);
        //
        this.ws = '';
    }

    renderRow(row){
        let task = this.task;
        for(let key in task){
            if(row.id == key){
                task[key](row);
            }
        }
    }

    addTask(id,action){
        let task = this.task;
        task[id] = action;
    }
}
//
export default new Group();