export default {
    root:{
        '&.success>div':{
            background:'green'
        },
        '&.failed>div':{
            background:'red'
        },
        '& .MuiLinearProgress-dashedColorSecondary':{
            backgroundImage:'radial-gradient(rgb(206, 206, 206) 0, rgb(179, 179, 179) 60%, transparent 40%)',
            animation:'none'
        }
    },
    barColorSuccess:{// ? 无用
        background:'red'
    }
};
