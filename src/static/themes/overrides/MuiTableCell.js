import palette from '../pallete';
import typography from '../typography';

export default {
    root: {
        ...typography.body1,
        borderBottom: `1px solid ${palette.divider}`
    },
    head:{
        color:'#546e7a',
        fontSize: '0.75rem',
        fontWeight: '500',
        lineHeight: '1.3125rem'
    },
    paddingNone:{
        padding:'8px 4px 8px 0'
    },
    sizeSmall:{
        padding:'8px 4px 8px 4px'
    }
};
