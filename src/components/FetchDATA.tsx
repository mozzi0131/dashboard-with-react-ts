import React, { useState, useEffect } from "react";
import { returnData } from "./manageData"

export default function ReturnModuleList() {
	return (
		<div>
			<h1> API calls with React Hooks </h1>
			{console.log("returnData is ", returnData())}
		</div>
	)
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<GithubCommit />, rootElement);
