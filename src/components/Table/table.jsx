import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

//const rows = [
//    createData('Cupcake', 305, 3.7, 67, 4.3),
//    createData('Donut', 452, 25.0, 51, 4.9),
//    createData('Eclair', 262, 16.0, 24, 6.0),
//    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//    createData('Gingerbread', 356, 16.0, 49, 3.9),
//    createData('Honeycomb', 408, 3.2, 87, 6.5),
//    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//    createData('Jelly Bean', 375, 0.0, 94, 0.0),
//    createData('KitKat', 518, 26.0, 65, 7.0),
//    createData('Lollipop', 392, 0.2, 98, 0.0),
//    createData('Marshmallow', 318, 0, 81, 2.0),
//    createData('Nougat', 360, 19.0, 9, 37.0),
//    createData('Oreo', 437, 18.0, 63, 4.0),
//];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

//const headCells = [
//{ id: 'name', disablePadding: true, label: '名称' },
//{ id: 'route', numeric: 'right', disablePadding: false, label: '路由' },
//{ id: 'deployment', numeric: 'right', disablePadding: false, label: '部署' },
//{ id: 'carbs', numeric: 'right', disablePadding: false, label: '描述' },
//{ id: 'use', numeric: 'right', disablePadding: false, label: '启用' , render:function(row){return row.use?'是':'否'}},
//{ id: 'action1', numeric: 'right', disablePadding: false, label: '操作', render:function(){
//    return (
//        <>
//        <Button size="small" color="primary">编辑</Button>&nbsp;|&nbsp;<Button size="small" color="primary" style={{marginRight:'-16px'}}>删除</Button>
//        </>
//    )
//}},
//];

function EnhancedTableHead(props) {
    const {
        classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,
        columns, noChecked
    } = props;
    const createSortHandler = (column,order) => event => {
        if(column.noSort) {return;}
        let property = column.id;
        onRequestSort(event, property,order);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {
                        noChecked ? '' : (
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={numSelected === rowCount}
                                onChange={onSelectAllClick}
                                padding="default"
                                inputProps={{ 'aria-label': 'select all desserts' }}
                            />
                        )
                    }
                </TableCell>
                {columns.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric || 'left'}
                        padding={headCell.numeric?'default':'none'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell,order)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    return (
        <Toolbar
            className={clsx(classes.root)}
        >
            <Typography className={classes.title} variant="h6" id="tableTitle">
                Nutrition
            </Typography>
            <Tooltip title="Filter list">
                <IconButton aria-label="filter list">
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 450,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const tableToolbar = props.toolbar;
    const className = props.className;
    let $table = props.onRef || { noChecked:false };
    let tableId = $table.id;
    let tableKey = $table.key || 'id';
    let tableDense = $table.dense;
    let tablePerPage = $table.perPage || 15;
    let columns = $table.columns || [];
    let handle = ($table.event || function(){});
    // data
    let rows_loaded = props.rows_loaded;
    let rows = props.rows;

    //
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(Boolean(tableDense));
    const [rowsPerPage, setRowsPerPage] = React.useState(tablePerPage);
    // parent-data
    $table.onDense = (checked) => {
        setDense(checked);
    }

    const handleRequestSort = (event, property , order) => {
        const isDesc = orderBy === property && order === 'desc';
        order = isDesc ? 'asc' : 'desc';
        setOrder(order);
        setOrderBy(property);
        handle('order',{orderBy:property,order:order});
    };

    const handleSelectAllClick = event => {
        let arr = []
        if (event.target.checked) {
            arr = rows.map(n => n[tableKey]);
        }
        setSelected(arr);
        handle('selected',arr);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if($table.noChecked){
            return;
        }

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        handle('selected',newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        handle('page',newPage);
    };

    const handleChangeRowsPerPage = event => {
        const pageSize = parseInt(event.target.value, 10);
        setRowsPerPage(pageSize);
        setPage(0);
        handle('pageSize',pageSize);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = name => selected.indexOf(name) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    return (
        <div className={clsx(classes.root,className)}>
            <Paper className={classes.paper}>
                { tableToolbar }
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            columns={columns}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            noChecked={$table.noChecked}
                        />
                        {
                            rows_loaded ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={columns.length+1} >
                                            {rows_loaded}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : (
                                <TableBody>
                                    {stableSort(rows, getSorting(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row[tableKey]);
                                            const labelId = `${tableId||'enhanced-table'}-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={event => handleClick(event, row[tableKey])}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    {
                                                        $table.noChecked
                                                            ? <TableCell style={{paddingLeft:0,paddingRight:0}}><IconButton></IconButton></TableCell>
                                                            : <TableCell padding="checkbox"><Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} /></TableCell>
                                                    }
                                                    {
                                                        columns.map((v,i)=>{
                                                            let text = ''
                                                            if(v.render){
                                                                text = v.render(row,v)
                                                            }else{
                                                                text = row[v.id] || ''
                                                            }
                                                            return (
                                                                <TableCell id={labelId} className="MuiTableCell-root" key={i} align={v.numeric||'inherit'} padding={v.numeric?'default':'none'} style={v.style}>
                                                                    {text}
                                                                </TableCell>
                                                            )
                                                        })
                                                    }
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                            <TableCell colSpan={columns.length+1} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            )
                        }
                    </Table>
                </div>
                {
                    $table.perPage && (
                        <TablePagination
                            rowsPerPageOptions={[15, 25, 50]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{'aria-label': 'previous page'}}
                            nextIconButtonProps={{'aria-label': 'next page'}}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    )
                }
            </Paper>
        </div>
    );
}
