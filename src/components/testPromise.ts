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

function manageGraphData(dataList:TestResult[]){
    //여기서 관리
}

/*
 * 1. api에서 data 받아와서 module list 긁어오기
 * 2. module list만큼 fetch 돌면서 data 받아오고 --> dictionary list push하기
 * 3. 해당 data 바탕으로 data list update하기 (기본 view가 있고..))
 */
export async function manageData(){
    const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";
    let moduleList:string[] = [];
    let testDict:TestResult[] = [];

    await fetch(`${baseURL}/api/json`)
	// .then(response => response.json())
	// .then(jsonObj => jsonObj["artifacts"])
	// .then(result => {
    //       return getModuleList(result);
    //    })
    //    .then(modules => {
    //        modules.map((module, idx, tempArr) => {
    //            getDataList(module)
    //             .then(result => {
    //                 testDict.push(result);
    //                 //문제의 코드
    //                 if(tempArr.length -1 === idx){
    //                     return testDict;
    //                 }
    //             })
    //             /* 하고싶었던것.. 
    //             .then(dict => {
    //                 manageGraphData(dict);
    //             })
    //             */
    //         })
    //     })
	// 	.catch(err => console.error());*/
}