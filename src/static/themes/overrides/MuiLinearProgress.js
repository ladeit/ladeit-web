export default {
    root:{
        height:'8px ',
        '&.success>div':{
            background:'green'
        },
        '&.failed>div':{
            background:'red'
        },
        '&.running .MuiLinearProgress-dashed':{
            backgroundImage:'radial-gradient(rgb(206, 206, 206) 0, rgb(179, 179, 179) 40%, transparent 60%)',
            animation:'MuiLinearProgress-keyframes-buffer1 2s infinite linear',
            backgroundSize:'15px 60px'
        }
    },
    barColorSuccess:{// ? 无用
        background:'red'
    }
};
