import './types'
export const hash = (str: string): number => {
	let hash = 0;
	if (str.length == 0) return hash;
	for (let i = 0; i < str.length; i++) {
		let char = str.charCodeAt(i);
		hash = ( (hash <<5 ) - hash) + char;
		hash = hash & hash;
	}
	return Math.abs(hash);
};

interface JitsiMeetExternalAPI {

}

export const importJitsiApi = (): Promise<any> => new Promise(async (resolve) => {
	if(window.JitsiMeetExternalAPI) {
		resolve(window.JitsiMeetExternalAPI)
	} else {
		const head = document.getElementsByTagName("head")[0];
		const script = document.createElement("script");
		
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", "https://meet.jit.si/external_api.js");
		
		head.addEventListener("load", function(event: any) {
			if (event.target.nodeName === "SCRIPT") {
				resolve(window.JitsiMeetExternalAPI)
			}
		}, true);
		
		head.appendChild(script);
	}
})