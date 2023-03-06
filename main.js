"use strict";

const electron = require("electron");
const path = require("path");

let win;

electron.app.whenReady().then(() => {
	win = new electron.BrowserWindow({
		webPreferences: {
			backgroundThrottling: false,
			contextIsolation: false,
			nodeIntegration: true,
			spellcheck: false,
		}
	});
	win.loadFile(path.join(__dirname, "renderer.html"));
});
