const FormRule = {
    require:(one)=>{
        one._type = (!one.value || one.value.trim()=="")?"error":""
        one._label = "不能为空"
    },
    number:(one)=>{
        one._type = /^[0-9]+$/.test(one.value)?"":"error"
        one._label = "必须数字"
    },
    http:function(one){
        one._type = /^http\:\/\/.*/.test(one.value)?"":"error"
        one._label = "地址格式错误"
    },
    email:function(one){
        one._type = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(one.value)?"":"error"
        one._label = "邮箱格式错误"
    },
    'number+word':function(one){
        one._type = /^[\da-zA-Z]*$/.test(one.value)?"":"error"
        one._label = "只能为字母、数字"
    }
}

export default function(column,error){
    let arr = column.valid || [];
    arr.every((v)=>{
        let fn = v;
        if(typeof v == "string"){
            fn = FormRule[v]
        }
        fn(column,error);
        return !column._type;
    })
    return column;
}
