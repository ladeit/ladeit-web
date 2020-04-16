import React from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DatePicker from 'antd/es/date-picker'
import intl from 'react-intl-universal'

import Icons from '../Icons/icons.jsx'
import './DatePicker.css'

const styles = theme => ({
})
const { RangePicker } = DatePicker;

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.handle = this.props.handle;
    }

    componentDidMount(){}

    state = {
        //
    }

    changeDate = (dates,str,a)=>{
        this.handle(str);
    }

    onOk = (value)=>{
        // const { format } = this.props;
        // let start = value[0];
        // let end = value[1];
        // this.handle([start.format(format),end.format(format)]);
        this.handle(value);
    }

    render(){
        const sc = this;
        const { classes,format } = this.props;
        let showTime = (format||"").split(/\s/)[1];
        if(showTime){
            return (
                <RangePicker
                    placeholder={[intl.get('services.events.startTime'), intl.get('services.events.endTime')]}
                    format={format}
                    showTime={showTime}
                    onChange={(dates)=>{
                        if(dates.length<1){
                            sc.handle([]);
                        }
                    }}
                    onOk={this.onOk}
                />
            )
        }else{
            return (
                <RangePicker
                    placeholder={[intl.get('services.events.startTime'), intl.get('services.events.endTime')]}
                    format={format||'YYYY-MM-DD'}
                    onChange={this.changeDate}
                />
            )
        }
    }
}

// import Selects from '@/components/Form/selects.jsx'
export default Index;
