import React, { useState, useEffect } from 'react';

import TestDataTable from './components/DataTable';
import SearchBar from "./components/SearchBar";
import { totalCol, unittestCol, coverageCol, setColumnData, totalRows, unittestRows, coverageRows } from './typescripts/manageTableData'

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function setModuleData() {
            await setColumnData();
            setLoading(true);
        }
        setModuleData();
    }, []);

    return (
        <div>
            {loading === false && <div> now loading... </div>}
            {loading === true &&
                <div className="App">
                    <div id="mainbody">
                        <h1>Dashboard - Unit test report</h1>
                        <SearchBar/>
                        <h2>Total Info</h2>
                        <TestDataTable columns={totalCol} rows={totalRows} />
                        <h2>Unit Test</h2>
                        <TestDataTable columns={unittestCol} rows={unittestRows} />
                        <h2>Code Coverage</h2>
                        <TestDataTable columns={coverageCol} rows={coverageRows} />
                    </div>
                </div>
            }

        </div>

    );
}

export default App;
