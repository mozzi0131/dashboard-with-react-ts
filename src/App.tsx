import React, { useState, useEffect } from 'react';

import TestDataTable from './components/makeTable';
import { totalCol, unittestCol, coverageCol, SetColumnData, totalRows, unittestRows, coverageRows } from './components/dataManaging'

const App: React.FC = () => {
    //fetch data
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function setModuleData() {
            await SetColumnData();
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
                        <h1 >Dashboard - Unit test report</h1>
                        {/* <div id="search"></div> */}
                        <h2 >Total Info</h2>
                        <TestDataTable columns={totalCol} rows={totalRows} />
                        {/* <div id="totalTable"></div> */}
                        <h2 >Unit Test</h2>
                        <TestDataTable columns={unittestCol} rows={unittestRows} />
                        {/* <div id="gtestTable"></div> */}
                        <h2 >Code Coverage</h2>
                        <TestDataTable columns={coverageCol} rows={coverageRows} />
                        {/* <div id="coverageTable"></div> */}
                    </div>
                </div>
            }

        </div>

    );
}

export default App;
