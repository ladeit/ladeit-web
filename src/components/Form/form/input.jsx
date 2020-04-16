import React,{ useState,useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

const FormRule = {
    require:(one)=>{
        let err = (!one.value || one.value.trim()=="");
        one.error = err?"不能为空":''
    },
    name:function(one){
        let err = !/^[\da-zA-Z\-]*$/.test(one.value);
        one.error = err?"包含特殊符号":''
    },
    number:(one)=>{
        let err = !/^[0-9]+$/.test(one.value);
        one.error = err?"必须数字":''
    },
    http:function(one){
        let err = !/^http\:\/\/.*/.test(one.value);
        one.error = err?"地址格式错误":''
    },
    email:function(one){
        let err = !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(one.value);
        one.error = err?"邮箱格式错误":''
    },
    'number+word':function(one){
        let err = !/^[\da-zA-Z]*$/.test(one.value);
        one.error = err?"只能为字母、数字":''
    },
}
const FormValid = function (column) {
    let arr = column.valid || [];
    arr.every((v)=>{
        let fn = v;
        if(typeof v == "string"){
            fn = FormRule[v];
            fn(column);
        }else{
            fn(column);
        }
        return !column.error;
    })
    return column;
}
const propsFilter = {
    input:function (col) {
        let props = {};
        if(!col.label){
            props.style = {marginTop:'16px'};
        }
        _.extend(props,col.inputProps);
        return props;
    }
}

// export
export default {
    input:function({column}) {
        const [value, setValue] = useState(column.value);
        const [error, setError] = useState(column.error);
        const onChange = function(e){
            column.value = e.target.value;
            //
            FormValid(column);
            column._render();
        }
        // 设定：handle
        column._render = function(){
            setValue(column.value)
            setError(column.error)
        }
        //
        let label = column.label;
        let inputProps = propsFilter.input(column);
        return (
            <TextField
                error={Boolean(error)}
                label={label}
                inputProps={inputProps}
                fullWidth
                onChange={onChange}
                value={value}
                helperText={error||' '}
            />
        )
    },
    select:function () {

        return (
            <FormControl className={clsx(classes.selectFormControl,className)} {...this.formProps} error={Boolean(msg)} disabled={inputProps.disabled}>
                <InputLabel
                    htmlFor="multiple-select"
                    className={classes.selectLabel}
                >
                    {column.label}
                </InputLabel>
                <Select
                    value={column.value||''}
                    MenuProps={{
                        className: classes.selectMenu,
                        classes: { paper: classes.selectPaper }
                    }}
                    classes={{ select: classes.select }}
                    inputProps={inputProps}
                    onChange={this.changeInput(column)}
                >
                    {
                        options.map((v)=>{
                            let key = v,text = v;
                            if(typeof v == 'object'){
                                key = v.key;
                                text = v.text
                            }
                            return (
                                <MenuItem
                                    classes={{root: classes.selectMenuItem,selected: classes.selectMenuItemSelectedMultiple}}
                                    value={key}
                                >
                                    {text}
                                </MenuItem>
                            )
                        })
                    }
                </Select>
                <FormHelperText>{msg}</FormHelperText>
            </FormControl>
        )
    }
}


// html_select = (column)=>{// { options:[{key,text},'']}
//     const { classes,className } = this.props;
//     const { error } = this.state;
//     let msg = error[column.name];
//     let options = column.options || [];
//     let id = this.prefix + column.name;
//     let inputProps = _.extend({
//         name:column.name||'',
//         onChange:this.changeInput(column)
//     },column.inputProps)
//     //
//     return (
//         <>
//             <FormControl className={clsx(classes.selectFormControl,className)} {...this.formProps} error={Boolean(msg)} disabled={inputProps.disabled}>
//                 <InputLabel
//                     htmlFor="multiple-select"
//                     className={classes.selectLabel}
//                 >
//                     {column.label}
//                 </InputLabel>
//                 <Select
//                     value={column.value||''}
//                     MenuProps={{
//                         className: classes.selectMenu,
//                         classes: { paper: classes.selectPaper }
//                     }}
//                     classes={{ select: classes.select }}
//                     inputProps={inputProps}
//                     onChange={this.changeInput(column)}
//                 >
//                     {
//                         options.map((v)=>{
//                             let key = v,text = v;
//                             if(typeof v == 'object'){
//                                 key = v.key;
//                                 text = v.text
//                             }
//                             return (
//                                 <MenuItem
//                                     classes={{root: classes.selectMenuItem,selected: classes.selectMenuItemSelectedMultiple}}
//                                     value={key}
//                                 >
//                                     {text}
//                                 </MenuItem>
//                             )
//                         })
//                     }
//                 </Select>
//                 <FormHelperText>{msg}</FormHelperText>
//             </FormControl>
//         </>
//     )
// }