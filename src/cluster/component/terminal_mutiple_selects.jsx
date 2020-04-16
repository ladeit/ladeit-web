import React from 'react';
import ReactDOM from 'react-dom';
import { withStyles,makeStyles } from '@material-ui/core/styles';
import Icons from 'components/Icons/icons'
import Inputs from 'components/Form/inputs'
//
import SubjectIcon from '@material-ui/icons/Subject';
//
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import NativeSelect from '@material-ui/core/NativeSelect';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';

//[
//             {
//                 name:'buzzy-git-ms-5662',
//                 children:[
//                     {
//                         name:'buzzy-git-ms-5662-75c9f677c9-g5wgp',
//                         children:[
//                             {name:'buzzy-git-ms'},
//                             {name:'istio-proxy'}
//                         ]
//                     }
//                 ]classes
//           }
//]

const useStyles = makeStyles(theme =>({
    filter:{
        padding:'16px 24px',
        '&>div':{
            width:'120px',
            padding:'0'
        }
    }
}));

export default function(props){
    const classes = useStyles();
    const list = props.data;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState([
        {name:'deploy',label:'deploy',type:'select',list:list,options:getOptions(list,{key:'',text:'选择depoly'})},
        {name:'pod',label:'pod',type:'select',listHeader:{key:'',text:'选择pod'},options:[]},
        {name:'container',label:'container',listHeader:{key:'',text:'选择container'},type:'select',options:[]}
    ]);
    const onChangeSelect = (index)=>{
        let column = form[index];
        form.forEach(function (v,i) {
            if(index>i){
                // 上级
            }else if(index==i){// 当前
                let nlist = column.list;
                let nextColumn = form[index+1];
                if(column.value){
                    let selMap = nlist.filter(function (v) {return v.name == column.value})[0];
                    if(selMap && nextColumn){
                        nextColumn.list = selMap.children;
                        nextColumn.options = getOptions(nextColumn.list,nextColumn.listHeader);
                    }
                }else{
                    nextColumn.value = '';
                    nextColumn.options.length = 0;
                }
            }else if(index+1==i){// 下级
                v.value = '';
            }else{
                v.value = '';
                v.options.length = 0;
            }
        })
    }

    function changeEvent(column,index){
        return (e)=>{
            column.value = e.target.value;
            onChangeSelect(index);
            //
            if(index==2){
                props.onChange && props.onChange(getFormData(form));
                form[1].value = '';
                form[2].value = '';
                form[2].options.length = 0;
                setOpen(false);
                setForm(form);
            }else{
                setForm([...form]);
            }
        }
    }

    function triggerPopover(event){
        let open_val = !open;
        let open_el = open ? '' : event.target;
        setOpen(open_val);
        setAnchorEl(open_el);
    }
    //
    return (
        <React.Fragment>
            <IconButton size="small" onClick={triggerPopover}>
                <SubjectIcon />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={()=>{setOpen(false)}}
            >
                {
                    form.map(function(one,index){
                        return (
                            <FormControl className={classes.filter} variant="outlined">
                                <NativeSelect
                                    size="small"
                                    value={one.value}
                                    className=""
                                    inputProps={{ 'aria-label': '' }}
                                    onChange={changeEvent(one,index)}
                                >
                                    {one.options.map(function (v) {
                                        return <option value={v.key}>{v.text}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                        )
                    })
                }
            </Popover>
        </React.Fragment>
    )

}


function getDefault(list){
    let res = {depoly:'',pod:'',container:''};
    let depoly = list[0];
    if(depoly){
        res.depoly = depoly.name;
        let pod = depoly.children[0];
        if(pod){
            res.pod = pod.name;
            let container = pod.children[0];
            res.container = container.name;
        }
    }
    return res;
}

function getOptions(list,defaultOption){
    let arr = list.map(function(v){
        return {key:v.name,text:v.name}
    });
    defaultOption && arr.splice(0,0,defaultOption);
    return arr;
}

function getFormData(form){
    let res = {};
    form.forEach(function (v) {
        res[v.name] = v.value;
    })
    return res;
}
