import React from 'react';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";


class Input extends React.PureComponent{

    changeInput(){
        const sc = this;
        let { map,error } = this.state;
        return (e)=>{
            column.value = e.target.value;
            let valid = FormValid(column,error);
            if(!valid._type){
                map[column.name] = valid.value;
                error[column.name] = false;
                sc.forceUpdate();
            }else{
                error[column.name] = valid._label;
                sc.forceUpdate();
            }
        }
    }

    getData(){}
    setData(){}
    valid(){}

    render =()=> {
        const { column } = this.props;
        const { error } = this.state;

        let msg = error[column.name];
        let inputProps = _.extend({
            name:column.name,
            onChange:this.changeInput
        },column.inputProps)
        //
        return (
            <CustomInput
                error={msg}
                labelText={column.label}
                formControlProps={this.formProps}
                inputProps={inputProps}
            />
        )
    }
}


export default {
    input:Input
}
