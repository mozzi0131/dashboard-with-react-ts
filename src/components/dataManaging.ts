import { useState, useEffect } from "react";
import { TestResult, manageModulesData } from "./getData"

interface Column {
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

interface TotalCol extends Column {
    id: 'module' | 'passRate' | 'utNum' | 'failNum' | 'coveredLine' | 'linePercentage' | 'validLine';
}

interface UnitTestCol extends Column {
    id: 'module' | 'passRate' | 'utNum' | 'failNum' | 'errNum';
}

interface CoverageCol extends Column {
    id: 'module' | 'coveredLine' | 'linePercentage' | 'validLine' | 'coveredBranch' | 'branchPercentage' | 'validBranch';
}

interface TotalData {
    module: string;
    passRate: string;
    utNum: string;
    failNum: string;
    coveredLine: string;
    linePercentage: string;
    validLine: string;
}

interface UnitTestData {
    module: string;
    passRate: string;
    utNum: string;
    failNum: string;
    errNum: string;
}

interface CoverageData {
    module: string;
    coveredLine: string;
    linePercentage: string;
    validLine: string;
    coveredBranch: string;
    branchPercentage: string;
    validBranch: string;
}

export const totalCol: TotalCol[] = [
    { id: 'module', label: 'Module', minWidth: 150 },
    { id: 'passRate', label: 'Pass\u00a0Rate', minWidth: 100, align: 'right', },
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
        id: 'coveredLine',
        label: '#\u00a0LN',
        minWidth: 100,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
    {
        id: 'linePercentage',
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

export const unittestCol: UnitTestCol[] = [
    { id: 'module', label: 'Module', minWidth: 150 },
    {
        id: 'passRate', label: 'Pass\u00a0Rate',
        minWidth: 100,
        align: 'right',
    },
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
        id: 'errNum',
        label: 'Error',
        minWidth: 100,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    }
];

export const coverageCol: CoverageCol[] = [
    { id: 'module', label: 'Module', minWidth: 150 },
    {
        id: 'coveredLine',
        label: '#\u00a0LN',
        minWidth: 100,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
    {
        id: 'linePercentage',
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
    },
    {
        id: 'coveredBranch',
        label: '#\u00a0BR',
        minWidth: 100,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
    {
        id: 'branchPercentage',
        label: '%\u00a0BR',
        minWidth: 100,
        align: 'right',
    },
    {
        id: 'validBranch',
        label: 'VALID\u00a0BR',
        minWidth: 150,
        align: 'right',
        format: (value: number) => value.toLocaleString(),
    },
];

export let totalRows: TotalData[] = [];
export let unittestRows: UnitTestData[] = [];
export let coverageRows: CoverageData[] = [];

function returnPercentStr(value: string): string {
    return ((+value) * 100).toFixed(2).toString() + "%";
}

function returnPassRate(total: number, fail: number): string {
    if (total != 0) {
        return (((total - fail) / total) * 100).toFixed(2).toString() + "%";
    }
    else {
        return "0%"
    }
}

function createTotalData(module: string, utNum: string, failNum: string, coveredLine: string,
    lineRatio: string, validLine: string): TotalData {
    const linePercentage = returnPercentStr(lineRatio);
    const passRate = returnPassRate(+utNum, +failNum);
    return { module, passRate, utNum, failNum, coveredLine, linePercentage, validLine };
}

function createUnitTestData(module: string, utNum: string, failNum: string, errNum: string): UnitTestData {
    const passRate = returnPassRate(+utNum, +failNum);
    return { module, passRate, utNum, failNum, errNum };
}

function createCoverageData(module: string, coveredLine: string, lineRatio: string, validLine: string,
    coveredBranch: string, branchRatio: string, validBranch: string): CoverageData {
    const linePercentage = returnPercentStr(lineRatio);
    const branchPercentage = returnPercentStr(branchRatio);
    return { module, coveredLine, linePercentage, validLine, coveredBranch, branchPercentage, validBranch };
}

export async function SetColumnData() {

    totalRows = [];
    unittestRows = [];
    coverageRows = [];

    const moduleData = await manageModulesData();

    for (const data of moduleData) {
        const moduleName = data.moduleName;
        const tempUTnum = data.gtest["tests"];
        const tempFailure = data.gtest["failures"];
        const tempErr = data.gtest["errors"];
        const lineCover = data.coverage["lines-covered"];
        const lineRate = data.coverage["line-rate"];
        const lineValid = data.coverage["lines-valid"];
        const branchCover = data.coverage['branches-covered'];
        const branchRate = data.coverage['branch-rate'];
        const branchValid = data.coverage['branches-valid'];

        totalRows.push(createTotalData(moduleName, tempUTnum, tempFailure, lineCover, lineRate, lineValid));
        unittestRows.push(createUnitTestData(moduleName, tempUTnum, tempFailure, tempErr));
        coverageRows.push(createCoverageData(moduleName, lineCover, lineRate, lineValid, branchCover, branchRate, branchValid));
    }
}