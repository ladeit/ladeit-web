import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import Popper from "@material-ui/core/Popper";

// core components
import IconButton from "@material-ui/core/IconButton";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/customDropdownStyle.js";
import LanCom from '@/locales/aboutNew.jsx';

const useStyles = makeStyles(styles);

export default function CustomDropdown(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    if (anchorEl && anchorEl.contains(event.target)) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = param => {
    setAnchorEl(null);
    if (props && props.onClick) {
      props.onClick(param);
    }
  };
  const handleCloseAway = event => {
    if (anchorEl.contains(event.target)) {
      return;
    }
    setAnchorEl(null);
  };
  const classes = useStyles();
  const {
    buttonText,
    buttonIcon,
    dropdownList,
    buttonProps,
    placement,
    dropdownHeader,
    caret,
    hoverColor,
    rtlActive,
    noLiPadding
  } = props;
  const caretClasses = classNames({
    [classes.caret]: true,
    [classes.caretActive]: Boolean(anchorEl),
    [classes.caretRTL]: rtlActive
  });
  const dropdownItem = classNames({
    [classes.dropdownItem]: true,
    [classes[hoverColor + "Hover"]]: true,
    [classes.noLiPadding]: noLiPadding,
    [classes.dropdownItemRTL]: rtlActive
  });
  let icon = null;
  switch (typeof buttonIcon) {
    case "object":
      break;
    case "string":
      icon = <Icon className={classes.buttonIcon}>{props.buttonIcon}</Icon>;
      break;
    default:
      icon = null;
      break;
  }
  return (
    <>
      {
        buttonIcon ? (
              <IconButton
                  aria-label="Notifications"
                  aria-haspopup="true"
                  {...buttonProps}
                  onClick={handleClick}
              >
                {buttonIcon}
              </IconButton>
          ) : (
              <Button
                  aria-label="Notifications"
                  aria-haspopup="true"
                  {...buttonProps}
                  onClick={handleClick}
              >
                {buttonText !== undefined ? buttonText : null}
                {caret ? <b className={caretClasses} /> : null}
              </Button>
          )
      }
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        disablePortal
        placement={placement}
        className={classNames({
          [classes.popperClose]: !anchorEl,
          [classes.popperResponsive]: true
        })}
      >
        {() => (
          <Grow
            in={Boolean(anchorEl)}
          >
            <Paper className={classes.dropdown}>
              <ClickAwayListener
                  onClickAway={handleCloseAway}
              >
                <MenuList role="menu" className={classes.menuList} >
                  {dropdownHeader !== undefined ? (
                    <MenuItem
                      //onClick={() => handleClose(dropdownHeader)}
                      className={classes.dropdownHeader}
                    >
                      {dropdownHeader}
                    </MenuItem>
                  ) : null}
                  {dropdownList.map((prop, key) => {
                    if (prop.divider) {
                      return (
                        <Divider
                          key={key}
                          light={true}
                          //onClick={() => handleClose("divider")}
                          className={classes.dropdownDividerItem}
                        />
                      );
                    }
                    return (
                      <MenuItem
                        key={key}
                        onClick={() => prop !== 'Language'&&handleClose(prop)}
                        className={dropdownItem}
                      >
                        {prop}
                        {
                          prop=='Language'&&<LanCom className="index" callback={(lan)=>{_.href(lan)}}/>
                        }
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

CustomDropdown.defaultProps = {
  caret: true,
  hoverColor: "primary"
};

CustomDropdown.propTypes = {
  hoverColor: PropTypes.oneOf([
    "black",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose"
  ]),
  buttonText: PropTypes.node,
  buttonIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  dropdownList: PropTypes.array,
  buttonProps: PropTypes.object,
  dropdownHeader: PropTypes.node,
  rtlActive: PropTypes.bool,
  caret: PropTypes.bool,
  noLiPadding: PropTypes.bool,
  // function that retuns the selected item
  onClick: PropTypes.func
};
