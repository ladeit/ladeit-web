/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ViewConfigIcon from '@material-ui/icons/ViewComfy';
import ListIcon from '@material-ui/icons/List';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import DnsIcon from '@material-ui/icons/Dns';
import DescriptionIcon from '@material-ui/icons/Description';
import Label from 'components/Label/Label';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import ExtensionOutlinedIcon from '@material-ui/icons/ExtensionOutlined';
import DataUsageIcon from '@material-ui/icons/DataUsage';


import Icons from 'components/Icons/icons.jsx'
import intl from 'react-intl-universal'

//let menu = {
//    title: 'Chat',
//    href: '/chat',
//    icon: ChatIcon,
//    label: () => (
//        <Label
//            color={colors.red[500]}
//            shape="rounded"
//        >
//            4
//        </Label>
//    ),
//    items: [
//        {
//            title: 'General',
//            href: '/settings/general'
//        }
//    ]
//}

function getMenu(name){
    let menus = {
        services:{
            subheader: '',
            items:  [
                {
                    title: intl.get('services.menuSummary'),
                    icon: DashboardIcon,
                    href: '/summary/$subfix'
                },
                {
                    title: intl.get('services.menuComponent'),
                    icon: Icons.ComponentIcon,
                    href: '/components/$subfix',
                    //items:[
                    //    {
                    //        title: '工作负载',
                    //        href: '/service/$subfix/workload'
                    //    },
                    //    {
                    //        title: '服务',
                    //        href: '/service/$subfix/info'
                    //    },
                    //    {
                    //        title: '配置',
                    //        href: '/service/$subfix/setting'
                    //    },
                    //    {
                    //        title: '存储',
                    //        href: '/service/$subfix/storage'
                    //    }
                    //]
                },
                {
                    title: intl.get('services.menuImage'),
                    icon: StorageOutlinedIcon,
                    href: '/releases/$subfix'
                },
                {
                    title: intl.get('services.menuDeployment'),
                    icon: NearMeOutlinedIcon,
                    href: '/deployments/$subfix'
                },
                {
                    title:intl.get('services.menuTopology'),
                    icon: DeviceHubIcon,
                    iconFix:Icons.TagAlphaIcon,
                    href: '/topology/$subfix'
                },
                {
                    title: intl.get('services.menuSetting'),
                    icon: SettingsIcon,
                    href: '/setting/$subfix'
                }
            ]
        },
        group:{
            subheader: '',
            items: [
                {
                    title: intl.get('group.menuSummary'),
                    icon: DashboardIcon,
                    href: '/group/$subfix',
                },
                {
                    title: intl.get('group.menuMember'),
                    icon: PeopleIcon,
                    href: '/group/$subfix/user'
                },
                {
                    title: intl.get('group.menuTopology'),
                    icon: DeviceHubIcon,
                    iconFix:Icons.TagAlphaIcon,
                    href: '/group/$subfix/topology'
                },
                {
                    title: intl.get('group.menuSetting'),
                    icon: SettingsIcon,
                    href: '/group/$subfix/setting'
                }
            ]
        },
        setting:{
            subheader: '',
            items: [
                {
                    title: intl.get('user.profile'),
                    icon: ListIcon,
                    href: '/setting/profile'
                },
                {
                    title: intl.get('user.account'),
                    icon: PeopleIcon,
                    href: '/setting/account'
                },
                {
                    title: intl.get('user.application'),
                    icon: ReceiptIcon,
                    href: '/setting/application'
                }
            ]
        },
        admin:{
            subheader: '',
            items: [
                {
                    title: intl.get('services.services'),
                    icon: DnsIcon,
                    href: '/admin/services'
                },
                {
                    title: intl.get('cluster.cluster'),
                    icon: Icons.ClustersIcon,
                    href: '/admin/clusters'
                },
                {
                    title: intl.get('adminArea.menuDataTransfer'),
                    icon: DataUsageIcon,
                    href: '/admin/datatransfer'
                }
            ]
        },
        notification:{
            subheader: '',
            items: [
                {
                    title: intl.get('notification.allMessage'),
                    icon: '',
                    href: '/notification/all'
                },
                {
                    title: intl.get('notification.newMessage'),
                    icon: '',
                    href: '/notification/new'
                },
                {
                    title: intl.get('notification.readMessage'),
                    icon: '',
                    href: '/notification/read'
                }
            ]
        },
        cluster:{
            subheader: '',
            items: [
                {
                    title: intl.get('cluster.menuSummary'),
                    icon: DashboardIcon,
                    href: '/cluster/$subfix/summary'
                },
                {
                    title: intl.get('cluster.menuMember'),
                    icon: PeopleIcon,
                    href: '/cluster/$subfix/user'
                },
                {
                    title: intl.get('cluster.menuSetting'),
                    icon: SettingsIcon,
                    href: '/cluster/$subfix/setting'
                },
            ]
        },
        namespace:{
            subheader: '',
            items: [
                {
                    title: intl.get('namespace.menuSummary'),
                    icon: DashboardIcon,
                    href: '/namespace/$subfix/summary'
                },
                {
                    title: intl.get('namespace.menuSetting'),
                    icon: SettingsIcon,
                    href: '/namespace/$subfix/setting'
                },
            ]
        }
    }
    return menus[name]
}


export default function(p,type){
    type = type||'services';
    let menu = getMenu(type);
    let title =  '';// <span><RouterLink to={`/group/${p._group}`} className="link2">{p._group}</RouterLink> / {p._name}</span>
    let subfix = '';
    //
    let map = _.cloneDeep(menu);
    if(type == 'services'){
        subfix = `${p._group}/${p._name}/common`;
    }else if(type == 'group'){
        subfix = p._group;
    }else if(type == 'cluster'){
        subfix = p._name;
    }else if(type == 'namespace'){
        subfix = `${p._name}/${p._namespace}`;
    }else{
        title = map.subheader;
        subfix = '';
    }
    //
    map.subheader = title;
    map.items.map((menu)=>{
        menu.href = menu.href.replace('$subfix',subfix)
        menu.items && menu.items.map((one)=>{
            one.href = one.href.replace('$subfix',subfix)
        })
    })
    //
    return [map]
}