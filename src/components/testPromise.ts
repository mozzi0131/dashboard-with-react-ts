import { resolve } from "q"


export interface Dictionary<T> {
    [Key: string]: T;
}

export interface TestResult {
    moduleName: string,
    gtest: Dictionary<string | null>,
    coverage: Dictionary<string | null>
}


function getModuleList(jsonObj: any): string[] {
	let returnList: string[] = [];

	let setObj = new Set<string>()
	for (let element of jsonObj) {
		let tempVar: string = element["fileName"].split('_')[1].split('.')[0]
		setObj.add(tempVar)
	}
	returnList = (Array.from(setObj.values()))

	return returnList;
}

function callArtifactsURL(module: string, data: string): Promise<Dictionary<string | null>> {
    const coverage_keylist: string[] = ['lines-covered', 'line-rate', 'lines-valid', 'branches-covered', 'branch-rate', 'branches-valid'];
    const gtest_keylist: string[] = ['tests', 'failures', 'errors'];
    const keylist: Dictionary<string[]> = { 'coverage': coverage_keylist, 'gtest': gtest_keylist };

    const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";
    const artifactsURL: string = `${baseURL}/artifact`;

    return new Promise((resolve) => {
        fetch(`${artifactsURL}/${data}_${module}.xml`)
            .then(response => response.text())
            .then(textobj => {
                const parser: DOMParser = new DOMParser();
                const parsingResult: Document = parser.parseFromString(textobj, "text/xml");
                let dictList: Dictionary<string | null> = {};
                for (const item of keylist[data]) {
                    const itemVal: (string | null) = parsingResult.documentElement.getAttribute(item);
                    dictList[item] = itemVal;
                }
                resolve(dictList);
            })
            .catch(err => console.error());
    });
}

export function getDataList(module: string): Promise<TestResult> {
    const dataList: string[] = ['gtest', 'coverage']
    let resultList: TestResult;

    return new Promise((resolve) => {
        Promise.all(dataList.map(data => callArtifactsURL(module, data)))
            .then(values => {
                console.log(values)
                resultList = { moduleName: module, gtest: values[0], coverage: values[1] };
                console.log("resultList is ", resultList);
                resolve(resultList);
            })
    });
}

/*
 * 1. api에서 data 받아와서 module list 긁어오기
 * 2. module list만큼 fetch 돌면서 data 받아오고 --> dictionary list push하기
 * 3. 해당 data 바탕으로 material-ui update하기
 */
export function manageData(){
    const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";
    let moduleList:string[] = [];
    let testDict:TestResult[] = [];

    console.log("call manageData!")

	fetch(`${baseURL}/api/json`)
		.then(response => response.json())
		.then(jsonObj => jsonObj["artifacts"])
		.then(result => {
           return getModuleList(result);
        })
        .then(modules => {
            modules.map(module => getDataList(module)
                                  .then(result => {
                                    testDict.push(result);
                                    console.log("testDict is ", testDict);
                                  })
                        )
        //data gathering 완료 : 이제 이거 바탕으로..? graph용 data 만들기
        })
        .then()
		.catch(err => console.error());
}