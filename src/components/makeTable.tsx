import React, { useState, useEffect, FunctionComponent } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    tableWrapper: {
        maxHeight: 440,
        overflow: 'auto',
    },
});

//이 함수의 columns, rows가 각각 (totalColumn, totalRows)/(unittestColumn, unittestRows)/(coverageColumn, coverageRows)로 props로 보내서 그릴 수 있는..? 방법이 있는지..?
export default function DataTable({columns, rows}:any) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(2);

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
                            {columns.map((column: any) => (
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
                        {
                            rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.module}>
                                        {columns.map((column: any) => {
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
                rowsPerPageOptions={[1, 2, 4]}
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