import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { number } from 'prop-types';
import { maxWidth } from '@material-ui/system';

interface Column {
  id: 'module' | 'passRate' | 'utNum' | 'failNum' | 'lineNum' | 'percentLine' | 'validLine';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'module', label: 'Module', minWidth: 150 },
  { id: 'passRate', label: 'Pass\u00a0Rate', 
  	minWidth: 100, 
 	align: 'right',},
  {
    id: 'utNum',
    label: '#\u00a0UT',
	minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: 'failNum',
    label: '#\u00a0F',
	minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: 'lineNum',
    label: '#\u00a0LN',
	minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  },
  {
    id: 'percentLine',
    label: '%\u00a0LN',
	minWidth: 100,
    align: 'right',
  },
  {
    id: 'validLine',
    label: 'VALID\u00a0LN',
	minWidth: 150,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  }
];

interface Data {
	module: string;
	passRate: string;
  	utNum: number;
  	failNum: number;
  	lineNum: number;
	percentLine: string;
	validLine: number;
}

function createData(module: string, utNum: number, failNum: number,
					lineNum: number, percentLine: string, validLine: number): Data {
  const passRate = (((utNum-failNum) / utNum)*100).toString() + "%";
  return { module, passRate, utNum, failNum, lineNum, percentLine, validLine};
}

const rows = [
  createData("element-base", 49, 0, 406, "72.11%", 563), 
  createData("factorymanager", 9, 0, 163, "1.09%", 14954),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.module}>
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}