const primaryColor = "#36cadc";
const warningColor = "#ff9800";
const dangerColor = "#f44336";
const successColor = "#4caf50";
const infoColor = "#00acc1";
const roseColor = "#e91e63";
const grayColor = "#999999";

export default {
    root:{
        '&.top24':{
            marginTop:'24px'
        }
    },
    underline:{
        "&:hover:not($disabled):before,&:before": {
            borderColor: "#D2D2D2 !important",
            borderWidth: "1px !important"
        },
        "&:after": {
            borderBottom: `2px solid ${primaryColor}`
        }
    }
};
