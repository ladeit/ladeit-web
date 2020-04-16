import React from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Select from 'antd/es/select'

import Icons from '../Icons/icons.jsx'
import './selects.css'

const styles = theme => ({
    select:{
        '& .ant-select-selection':{
            borderRight: 0,
            borderRadius:0,
            //borderTopRightRadius: 0,
            //borderBottomRightRadius: 0
        }
    },
    button:{
        width:'80px',
        '& button':{
            height: '100%',
            width: '100%',
            borderRadius: 0,
            padding: 0,
            margin: 0
        }
    }
})

@withStyles(styles)
class Index extends React.PureComponent {
    componentWillMount(){
        this.loadUser = _.debounce(this.loadUser,600)
        this.renderData = this.props.renderData;
        this.renderInvite = _.debounce(this.props.invite,600);
    }

    componentDidMount(){}

    loadUser = (value)=>{
        const sc = this;
        if(value.trim()){
            sc.setState({ data: [], fetching: true })
            sc.renderData(value,(res)=>{
                sc.setState({ data: res, fetching: false })
            })
        }else{
            sc.setState({ data: [], fetching: false })
        }
    }

    state = {
        data: [],// 可选择数据集
        value: [],// 已选数据集
        fetching: false,// 是否加载中
    }

    changeSelect = value => {
        console.log(value);
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    }

    render(){
        const { classes } = this.props;
        const {fetching,data,value} = this.state;
        return (
            <div className={clsx('flex-r',classes.select)} >
                <div className="flex-box">
                    <Select
                        className={classes.select}
                        mode="multiple"
                        labelInValue
                        value={value}
                        placeholder="Select users"
                        notFoundContent={fetching ? <Icons.Loading style={{padding:0,margin:'0 0 16px 0'}}/> : null}
                        filterOption={false}
                        onSearch={this.loadUser}
                        onChange={this.changeSelect}
                        style={{ width: '100%' }}
                    >
                        {data.map(d => {
                            let filter = value.filter((v)=>{return v.key == d.userId; })
                            return <Select.Option key={d.userId} disabled={filter.length || !d.addflag}>{d.userName}</Select.Option>
                        })}
                    </Select>
                </div>
                <div className={clsx('flex-one','flex-center',classes.button)}>
                    <Button size="small" variant="contained" color="primary" onClick={()=>{this.renderInvite(value)}} >Invite</Button>
                </div>
            </div>
        )
    }
}

// import Selects from '@/components/Form/selects.jsx'
export default Index;
