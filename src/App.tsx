import React, { useState, useEffect } from 'react';

import TestDataTable, { Column } from './components/DataTable';
import ProgressBar from './components/ProgressBar';
import { TestResult, getTestResults } from './utils/jenkins';

// TODO 각 column의 format 함수 구현해서 빨간줄 없애기
export const totalCol: Column[] = [
	{
		id: 'module',
		label: 'Module',
		minWidth: 100,
		format: testResult => testResult.moduleName,
	},
	{
		id: 'passRate',
		label: 'Pass\u00a0Rate',
		minWidth: 100,
		align: 'right',
		format: testResult => {
			try{
				const total = parseFloat(testResult.gtest["tests"]);
				const fail = parseFloat(testResult.gtest["failures"]);
				const passRate = (((total - fail) / total) * 100).toFixed(2).toString() + "%";
				return passRate;
			}
			catch{
				return "0%";
			}
		},
	},
  	{
		id: 'utNum',
		label: '#\u00a0UT',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.gtest["tests"],
	},
	{
		id: 'failNum',
		label: '#\u00a0F',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.gtest["failures"],
	},
	{
		id: 'coveredLine',
		label: '#\u00a0LN',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.coverage["lines-covered"],
	},
	{
		id: 'linePercentage',
		label: '%\u00a0LN',
		minWidth: 100,
		align: 'right',
		format: testResult => { 
			const returnRate = (parseFloat(testResult.coverage["line-rate"])*100).toFixed(2).toString() + "%";
			return returnRate; 
		},
	},
	{
		id: 'validLine',
		label: 'VALID\u00a0LN',
		minWidth: 150,
		align: 'right',
		format: testResult => testResult.coverage["lines-valid"],
	},
];

export const unittestCol: Column[] = [
	{ 
		id: 'module', 
		label: 'Module', 
		minWidth: 100,
		format: testResult => testResult.moduleName,
	},
	{ 
		id: 'passRate', 
		label: 'Pass\u00a0Rate',
		minWidth: 100, 
		align: 'right',
		format: testResult => {
			try{
				const total = parseFloat(testResult.gtest["tests"]);
				const fail = parseFloat(testResult.gtest["failures"]);
				const passRate = (((total - fail) / total) * 100).toFixed(2).toString() + "%";
				return passRate;
			}
			catch{
				return "0%";
			}
		},
	},
	{
		id: 'utNum',
		label: '#\u00a0UT',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.gtest["tests"],
	},
	{
		id: 'failNum',
		label: '#\u00a0F',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.gtest["failures"],
	},
	{
		id: 'errNum',
		label: 'Error',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.gtest["errors"],
	},
	{
		id: 'memoryLeak',
		label: '# LEAK',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.valgrind["error"],
	},
];

export const coverageCol: Column[] = [
	{ 
		id: 'module', 
		label: 'Module', 
		minWidth: 100,
		format: testResult => testResult.moduleName,
	},
	{
		id: 'coveredLine',
		label: '#\u00a0LN',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.coverage["lines-covered"],
	},
	{
		id: 'linePercentage',
		label: '%\u00a0LN',
		minWidth: 100,
		align: 'right',
		format: testResult => { 
			const returnRate = (parseFloat(testResult.coverage["line-rate"])*100).toFixed(2).toString() + "%";
			return returnRate; 
		},
	},
	{
		id: 'validLine',
		label: 'VALID\u00a0LN',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.coverage["lines-valid"],
	},
	{
		id: 'coveredBranch',
		label: '#\u00a0BR',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.coverage['branches-covered'],
	},
	{
		id: 'branchPercentage',
		label: '%\u00a0BR',
		minWidth: 100,
		align: 'right',
		format: testResult => { 
			const returnRate = (parseFloat(testResult.coverage["branch-rate"])*100).toFixed(2).toString() + "%";
			return returnRate; 
		},
	},
	{
		id: 'validBranch',
		label: 'VALID\u00a0BR',
		minWidth: 100,
		align: 'right',
		format: testResult => testResult.coverage['branches-valid'],
	},
];

const App: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [testResults, setTestResults] = useState<TestResult[]>([]);

	useEffect(() => {
		(async function () {
			setLoading(true);
			try {
				const fetchedTestResults = await getTestResults();
				setTestResults(fetchedTestResults);
			} catch (err) {
				// TODO 에러 메시지 표시?
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div>
			{loading ? (
				<div>
					<ProgressBar />
				</div>
			) : (
					<div className="App">
						<div id="mainbody">
							<h1>Dashboard - Unit test report</h1>
							<h2>Total Info</h2>
							<TestDataTable columns={totalCol} rows={testResults} />
							<h2>Unit Test</h2>
							<TestDataTable columns={unittestCol} rows={testResults} />
							<h2>Code Coverage</h2>
							<TestDataTable columns={coverageCol} rows={testResults} />
						</div>
					</div>
				)}
		</div>
	);
};

export default App;
