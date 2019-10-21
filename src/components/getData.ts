import { useState, useEffect } from "react";

interface Dictionary<T> {
    [Key: string]: T;
}

export interface TestResult {
    moduleName: string,
    gtest: Dictionary<string>,
    coverage: Dictionary<string>
}

function getModuleList(moduleInfos: {fileName: string}[]): string[] {
	const moduleNames = moduleInfos.map((m) => m.fileName.split('_')[1].split('.')[0]);
	const distinctModuleNames = Array.from(new Set(moduleNames));
	return distinctModuleNames;
}

async function callArtifactsURL(module: string, data: 'coverage' | 'gtest'): Promise<Dictionary<string>> {
    const coverageKeys = [
	    'lines-covered',
	    'line-rate',
	    'lines-valid',
	    'branches-covered',
	    'branch-rate',
	    'branches-valid',
    ];
    const gtestKeys = [
	    'tests',
	    'failures',
	    'errors',
    ];
    const keys = {
	    'coverage': coverageKeys,
	    'gtest': gtestKeys,
    };

    const baseURL = "/job/Test_Automation/lastSuccessfulBuild";
    const artifactsURL = `${baseURL}/artifact`;

    const response = await fetch(`${artifactsURL}/${data}_${module}.xml`);
    const text = await response.text();
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(text, "text/xml");
    const result: Dictionary<string> = {};
    for (const key of keys[data]) {
        const value = parsedDocument.documentElement.getAttribute(key) || "";
        result[key] = value;
    }
    return result;
}

async function getModuleData(module: string): Promise<TestResult> {
    /* 아래의 case도 가능
     *  const dataList: ('gtest' | 'coverage')[] = ['gtest', 'coverage']

        const result = await Promise.all(
            dataList.map(async(data) => {
                const values = await callArtifactsURL(module, data);
                return { moduleName: module, gtest: values[0], coverage: values[1] };
            })
        );
        return result;
     */
    const result = await Promise.all( [callArtifactsURL(module, 'gtest'), callArtifactsURL(module, 'coverage')]);
    
    return { moduleName: module, gtest: result[0], coverage: result[1] };
}

export async function manageModulesData(): Promise<TestResult[]>{
    const baseURL: string = "/job/Test_Automation/lastSuccessfulBuild";

    const response = await fetch(`${baseURL}/api/json`);
    const json = await response.json();
    const moduleList = getModuleList(json["artifacts"]);

    //진심 왜 여기서 Promise.all이 빛을 발한다고 하셨는지 알 것 같음... ㅜㅜ 감동적
    const moduleData = await Promise.all( moduleList.map(async(module) => {
                                            const data = await getModuleData(module);
                                            return data;
                                         }));

    return moduleData;
}