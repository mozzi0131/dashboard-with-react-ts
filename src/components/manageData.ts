import { async } from "q";
import { useState, useEffect } from "react";
import diff from "jest-diff";

interface TestResult {
    modulename: string,
    gtestResult: string[],
    coverageResult: string[]
}

interface Dictionary<T> {
    [Key: string]: T;
}

const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";
const artifactsURL: string = `${baseURL}/artifact`

const dataList = ['gtest', 'coverage']
const coverage_keylist: string[] = ['lines-covered', 'line-rate', 'lines-valid', 'branches-covered', 'branch-rate', 'branches-valid']
const gtest_keylist: string[] = ['tests', 'failures', 'errors']
const keylist: Dictionary<string[]> = { 'coverage': coverage_keylist, 'gtest': gtest_keylist }

function getModuleList(jsonObj:any):string[]{
    let returnList:string[] = [];

    let setObj = new Set<string>()
    for (let element of jsonObj) {
        let tempVar: string = element["fileName"].split('_')[1].split('.')[0]
        setObj.add(tempVar)
    }
    returnList = (Array.from(setObj.values()))

    return returnList;
}

export default function TEST_REACT(){
    let moduleList:string[] = [];
    let resultList:TestResult[] = [];

    useEffect( () => {
        fetch(`${baseURL}/api/json`)
        .then(response => response.json())
        .then(jsonObj => jsonObj["artifacts"])
        .then(result => {
            moduleList = getModuleList(result);
            console.log("TEST_REACT : moduleList is", moduleList);
        })
        .catch(err => console.error());
    }, []); //가장 처음 렌더링 될 때만 수행되고 그 다음에는 수행될 필요  x

    return moduleList;
}

function returnJSON(url:string):Promise<void | string[]>{
    return fetch(url)
        .then(response => response.json())
        .then(jsonObj => jsonObj["artifacts"])
        .then(result => {
            let moduleList = getModuleList(result);
            console.log("func : moduleList is", moduleList);
            return moduleList;
        })
        .catch(err => console.error());
}

function returnDataList(module: string, datatype: string): string[] {
    console.log("returnDatalist called! ", `${module}`, `${datatype}`);
    let dataList: string[] = [];
    const dataURL = `${artifactsURL}/${datatype}_${module}.xml`

    return dataList;
}

export async function returnData() {
    let resultTestData: TestResult[] = [];
    const moduleList: string[] = TEST_REACT();

//    let returnJSONval:string[] = await returnJSON(`${baseURL}/api/json`);

    //let hey:Promise<string[]>  = await returnModuleList();
    //console.log("hey val is ", hey);

    //returnModuleList();
    // for (let module of moduleList) {
    //     let tempResult: TestResult = { modulename: "", gtestResult: [], coverageResult: [] };

    //     tempResult.modulename = module;
    //     tempResult.gtestResult = returnDataList(module, "gtest");
    //     tempResult.coverageResult = returnDataList(module, "coverage");

    //     resultTestData.push(tempResult);
    // }

    return resultTestData;
}