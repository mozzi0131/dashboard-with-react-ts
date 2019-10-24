import React, { useState, useEffect } from 'react';

import TestDataTable, { Column } from './components/DataTable';
import SearchBar from './components/SearchBar';
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
  { id: 'passRate', label: 'Pass\u00a0Rate', minWidth: 100, align: 'right' },
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
  },
];

export const unittestCol: Column[] = [
  { id: 'module', label: 'Module', minWidth: 100 },
  { id: 'passRate', label: 'Pass\u00a0Rate', minWidth: 100, align: 'right' },
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
  },
  {
    id: 'memoryLeak',
    label: '# LEAK',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  },
];

export const coverageCol: Column[] = [
  { id: 'module', label: 'Module', minWidth: 100 },
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
    minWidth: 100,
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
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString(),
  },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    (async function() {
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
            <SearchBar />
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
