import React, { useState, useEffect } from "react";
import { string, func } from "prop-types";
import { Promise } from "q";
import { resolve } from "dns";
import { TestResult, Dictionary, getDataList, manageData } from "./testPromise"

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

export default function ReturnModuleList() {
	const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";

	const [modules, setModuleList] = useState<string[]>([]);
	let [testDict, setTestDict] = useState<TestResult[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	console.log("try to call manageData");
	manageData();
	console.log("call manageData - over");

	// useEffect(() => {
	// 	fetch(`${baseURL}/api/json`)
	// 		.then(response => response.json())
	// 		.then(jsonObj => jsonObj["artifacts"])
	// 		.then(result => {
	// 			setModuleList(getModuleList(result));
	// 		})
	// 		.catch(err => console.error());
	// }, []);

	// useEffect(() => {
	// 	for (const module of modules) {
	// 		console.log("call getDataList : module is ", module);
	// 		getDataList(module).then(result => {
	// 			console.log("in testhook getdatalist -> result is ", result)
	// 			//setTestDict 쓰는 방법 없는지..?^^; 
	// 			//setTestDict(testDict.concat(result));
	// 			testDict.push(result);
	// 			if (result.moduleName == "factorymanager") {
	// 				setLoading(true);
	// 				console.log("testDict is ", testDict);
	// 			}
	// 		});
	// 		console.log("end call getDataList");
	// 	}
	// }, [modules]) 

	return (
		<div>
			<h1> Test react hooks </h1>
			{loading === false && <div> <h2> now loading.... </h2> </div>}
			{loading === true &&
				<div>
					<h2>loading value is {loading}</h2>
					<h2> {console.log("module is ", modules)}</h2>
					<h2> {console.log("testdict is ", testDict)}</h2>
					<h2> loading finished : module is {modules} and testdict's len is {testDict.length} </h2>
				</div>}
		</div>
	)
}
