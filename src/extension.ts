import * as vscode from 'vscode';
import { iorunv, execv } from "./process";
import { log } from './log';
import * as xfusion from './xfusion';
import * as welcome from './welcome';
import { XF_ExplorerDataProvider, XF_Targets } from './explore';
import * as fs from 'fs';
import * as path from 'path';

interface Component {
	name: string;
	path: string;
	srcs: string[];
	inc_dirs: string[];
	requires: string[];
	cflags: string[];
}

function get_build_environ_json(): Promise<string> {
	return new Promise((resolve, reject) => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length == 0) {
			return reject(new Error("没有找到工作区"));
		}
		const absolutePath = path.resolve(workspaceFolders[0].uri.fsPath, "build", "build_environ.json");
		fs.readFile(absolutePath, 'utf8', (err, data) => {
			if (err) {
				console.error(`文件welcome.html 不存在: ${absolutePath}`, err);
				reject(err); // Reject the promise with the error
				return "";
			}
			resolve(data); // Resolve the promise with the file content
		});
	});
}

function convertJsonStringToTargets(jsonString: string): XF_Targets[] {
	// 解析 JSON 字符串
	const data = JSON.parse(jsonString);
	const targets: XF_Targets[] = [];

	// Helper function to add entries to targets
	function addTargets(group: string, name: string, path: string, srcs: string[]) {
		if (srcs.length == 0) {
			return;
		}
		targets.push({
			kind: "",
			group: group,
			name: name,
			files: srcs.map(src => src.replace(`${path}/`, "")),  // 将路径转换为相对路径
			basePath: path
		});
	}

	// 处理每个组的 entries
	addTargets("user_main", "user_main", data.user_main.path, data.user_main.srcs);

	for (const [name, component] of Object.entries<Component>(data.user_components || {})) {
		addTargets("user_components", name, component.path, component.srcs);
	}

	for (const [name, dir] of Object.entries<Component>(data.user_dirs || {})) {
		addTargets("user_dirs", name, dir.path, dir.srcs);
	}

	for (const [name, component] of Object.entries<Component>(data.public_components || {})) {
		addTargets("public_components", name, component.path, component.srcs);
	}

	return targets;
}

function command_register(context: vscode.ExtensionContext, command: string, callback: (...args: any[]) => any) {
	let cmd = vscode.commands.registerCommand(command, callback);
	context.subscriptions.push(cmd);
}

export function activate(context: vscode.ExtensionContext) {
	log.initialize(context);

	const xfExplorerProvider = new XF_ExplorerDataProvider();

	vscode.window.registerTreeDataProvider('xfusionExplorer', xfExplorerProvider);

	// 示例数据
	get_build_environ_json()
		.then(content => {
			const jsonString = content;
			const exampleTargets = convertJsonStringToTargets(jsonString);
			xfExplorerProvider.refresh(exampleTargets);
		})
		.catch(error => {
			log.error(`读取文件时出错:${error}`);
			return;
		});
	// 使用示例数据刷新视图



	// const config = vscode.workspace.getConfiguration('xf_code');
	// const XF_ROOT = config.get<string>('XF_ROOT'); // 获取字符串设置

	// if (XF_ROOT == "") {
	// 	welcome.showWelcomePage(context);
	// }

	// command_register(context, 'xf-code.build', xfusion.xf_build_run);
	// command_register(context, 'xf-code.clean', xfusion.xf_clean_run);
	// command_register(context, 'xf-code.create', xfusion.xf_create_run);
	// command_register(context, 'xf-code.export', xfusion.xf_export_run);
	// command_register(context, 'xf-code.flash', xfusion.xf_flash_run);
	// command_register(context, 'xf-code.install', xfusion.xf_install_run);
	// command_register(context, 'xf-code.menuconfig', xfusion.xf_menuconfig_run);
	// command_register(context, 'xf-code.monitor', xfusion.xf_monitor_run);
	// command_register(context, 'xf-code.search', xfusion.xf_search_run);
	// command_register(context, 'xf-code.target_show', xfusion.xf_target_show_run);
	// command_register(context, 'xf-code.target_download', xfusion.xf_target_download_run);
	// command_register(context, 'xf-code.uninstall', xfusion.xf_uninstall_run);
	// command_register(context, 'xf-code.update', xfusion.xf_update_run);
	// command_register(context, 'xf-code.view_build', xfusion.xf_build_run);
	// command_register(context, 'xf-code.view_clean', xfusion.xf_clean_run);
	// command_register(context, 'xf-code.view_export', xfusion.xf_export_run);
	// command_register(context, 'xf-code.view_update', xfusion.xf_update_run);
	// command_register(context, 'xf-code.view_flash', xfusion.xf_flash_run);
	// command_register(context, 'xf-code.view_monitor', xfusion.xf_monitor_run);
	// command_register(context, 'xf-code.view_menuconfig', xfusion.xf_menuconfig_run);
	// command_register(context, 'xf-code.active', xfusion.xf_active_run);
	// let start = vscode.commands.registerCommand('xf-code.start', () => {
	// 	// 使用捕获的 context
	// 	welcome.showWelcomePage(context);
	// });
	// context.subscriptions.push(start);
}
