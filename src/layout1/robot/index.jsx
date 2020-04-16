"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ArrowForward_1 = require("@material-ui/icons/ArrowForward");
var core_1 = require("@material-ui/core");
var Badge_1 = require("@material-ui/core/Badge");
var Notifications_1 = require("@material-ui/icons/Notifications");
var react_intl_universal_1 = require("react-intl-universal");
//
var mobx_react_1 = require("mobx-react");
var icons_1 = require("components/Icons/icons");
var moment_1 = require("moment");
var Service_1 = require("@/notification/Service");
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            el: null,
            notifications: []
        };
        _this.toUrl = function (url) {
            return function () { History.push(url); };
        };
        _this.clickRobot = function (e) {
            _this.setState({ el: e.currentTarget });
        };
        _this.triggleNotifications = function () {
            _this.setState({ el: null });
        };
        _this.clickMessage = function (one, index) {
            var sc = _this;
            var store = _this.props.store;
            return function () {
                if (!one.read_flag) {
                    Service_1.default.notificationReadList([{ id: one.messagestateid }], function (res) { });
                }
                sc.triggleNotifications();
                store.notification.readNotification(index);
                History.push("/notification/info/" + one.id);
            };
        };
        return _this;
    }
    Index.prototype.componentDidMount = function () {
        var store = this.props.store;
        store.notification.loadNotification();
    };
    Index.prototype.render = function () {
        var sc = this;
        var _a = this.props, classes = _a.classes, store = _a.store;
        var el = this.state.el;
        var id = "robot_png_popover";
        //let active = History.location.pathname.indexOf('/notification')>-1;
        var notifications = store.notification.data.records;
        var notifications_size = store.notification.data.totalRecord;
        //
        return (<>
                <Badge_1.default anchorOrigin={{ vertical: 'top', horizontal: 'left' }} badgeContent={notifications_size} color={"error"}>
                    <core_1.IconButton size="small" color="inherit" aria-describedby={id} className={classes.button} style={{ backgroundColor: 'white' }} onClick={this.clickRobot}>
                        <Notifications_1.default style={{ color: 'black' }}/>
                    </core_1.IconButton>
                </Badge_1.default>
                <core_1.Popover id={id} open={Boolean(el)} anchorEl={el} onClose={this.triggleNotifications} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }} transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}>
                    <core_1.Card className={classes.card}>
                        <core_1.CardHeader title={<span>{react_intl_universal_1.default.get('notification.notification')}</span>}/>
                        <core_1.CardContent className={classes.list}>
                            <core_1.List component="nav">
                                <core_1.Divider light={true}/>
                                {notifications.map(function (one, index) {
            return (<>
                                                <core_1.ListItem key={one} button dense={true} onClick={sc.clickMessage(one, index)}>
                                                    <core_1.ListItemAvatar>
                                                        <core_1.Avatar>
                                                            {one.title.substr(0, 1)}
                                                        </core_1.Avatar>
                                                    </core_1.ListItemAvatar>
                                                    <core_1.ListItemText primary={<core_1.Typography variant="body1">
                                                            <div className="overflow-text" style={{ width: '100%' }}>{one.title}</div>
                                                        </core_1.Typography>} secondary={moment_1.default(one.create_at).format('YYYY-MM-DD HH:mm:ss')}/>
                                                    <core_1.ListItemSecondaryAction>
                                                        <core_1.IconButton edge="end" aria-label="delete">
                                                            <ArrowForward_1.default />
                                                        </core_1.IconButton>
                                                    </core_1.ListItemSecondaryAction>
                                                </core_1.ListItem>
                                                <core_1.Divider light={true}/>
                                            </>);
        })}
                                {notifications.length > 0 ? '' : <icons_1.default.NodataT text={react_intl_universal_1.default.get('notification.tipsNoRead')}/>}
                            </core_1.List>
                        </core_1.CardContent>
                        <core_1.CardActions className="flex-center actions">
                            <core_1.Button size="small" fullWidth onClick={this.toUrl("/notification/new")}>{react_intl_universal_1.default.get('notification.seeAll')}</core_1.Button>
                        </core_1.CardActions>
                    </core_1.Card>
                </core_1.Popover>
            </>);
    };
    Index = __decorate([
        mobx_react_1.inject('store'),
        mobx_react_1.observer
    ], Index);
    return Index;
}(React.PureComponent));
var styles = function (theme) { return ({
    button: {
        width: '40px',
        height: '40px'
    },
    card: {
        width: '350px',
        '& .actions': {
            backgroundColor: '#fafafa'
        }
    },
    list: {
        padding: 0,
        '&>nav': {
            padding: 0
        }
    }
}); };
exports.default = core_1.withStyles(styles)(Index);
