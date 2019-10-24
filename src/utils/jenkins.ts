interface Dictionary<T> {
  [Key: string]: T;
}

export interface TestResult {
  moduleName: string;
  gtest: Dictionary<string>;
  coverage: Dictionary<string>;
  valgrind: Dictionary<string>;
}

async function getPartialTestResult(
  moduleName: string,
  data: 'coverage' | 'gtest' | 'valgrind'
): Promise<Dictionary<string>> {
  const coverageKeys = [
    'lines-covered',
    'line-rate',
    'lines-valid',
    'branches-covered',
    'branch-rate',
    'branches-valid',
  ];
  const gtestKeys = ['tests', 'failures', 'errors'];
  const valgrindKeys = ['error'];
  const keys = {
    coverage: coverageKeys,
    gtest: gtestKeys,
    valgrind: valgrindKeys,
  };
  const artifactsURL = '/job/Test_Automation/lastSuccessfulBuild/artifact';

  const response = await fetch(`${artifactsURL}/${data}_${moduleName}.xml`);
  const text = await response.text();
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(text, 'text/xml');
  const result: Dictionary<string> = {};
  for (const key of keys[data]) {
    if (data === 'valgrind') {
      const value = parsedDocument.documentElement.getElementsByTagName(key)
        .length;
      result[key] = value.toString();
    } else {
      const value = parsedDocument.documentElement.getAttribute(key) || '';
      result[key] = value;
    }
  }
  return result;
}

async function _getTestResult(moduleName: string): Promise<TestResult> {
  const [gtest, coverage, valgrind] = await Promise.all([
    getPartialTestResult(moduleName, 'gtest'),
    getPartialTestResult(moduleName, 'coverage'),
    getPartialTestResult(moduleName, 'valgrind'),
  ]);

  return {
    moduleName,
    gtest,
    coverage,
    valgrind,
  };
}

export async function getTestResults(): Promise<TestResult[]> {
  const response = await fetch(
    '/job/Test_Automation/lastSuccessfulBuild/api/json'
  );
  const responseData = await response.json();
  const artifacts: { filename: string }[] = responseData['artifacts'];
  const moduleNames = artifacts.map(artifact => {
    const match = artifact.filename.match(/.*_(.*)\..*/);
    return match![1];
  });
  const distinctModuleNames = Array.from(new Set(moduleNames));

  return Promise.all(
    distinctModuleNames.map(moduleName => _getTestResult(moduleName))
  );
}
