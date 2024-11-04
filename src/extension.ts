import * as vscode from 'vscode';
import { iorunv, execv } from "./process";
import { log } from './log';
import * as xfusion from './xfusion';

export function activate(context: vscode.ExtensionContext) {
	log.initialize(context);

	let xf_build = vscode.commands.registerCommand("xf-code.build", xfusion.xf_build_run);

	let xf_clean = vscode.commands.registerCommand('xf-code.clean', xfusion.xf_clean_run);

	let xf_create = vscode.commands.registerCommand('xf-code.create', xfusion.xf_create_run);

	let xf_export = vscode.commands.registerCommand('xf-code.export', xfusion.xf_export_run);

	let xf_flash = vscode.commands.registerCommand('xf-code.flash', xfusion.xf_flash_run);

	let xf_install = vscode.commands.registerCommand('xf-code.install', xfusion.xf_install_run);

	let xf_menuconfig = vscode.commands.registerCommand('xf-code.menuconfig', xfusion.xf_menuconfig_run);

	let xf_monitor = vscode.commands.registerCommand('xf-code.monitor', xfusion.xf_monitor_run);

	let xf_search = vscode.commands.registerCommand('xf-code.search', xfusion.xf_search_run);

	let xf_target_show = vscode.commands.registerCommand('xf-code.target_show', xfusion.xf_target_show_run);

	let xf_target_download = vscode.commands.registerCommand('xf-code.target_download', xfusion.xf_target_download_run);

	let xf_uninstall = vscode.commands.registerCommand('xf-code.uninstall', xfusion.xf_uninstall_run);

	context.subscriptions.push(xf_build);
	context.subscriptions.push(xf_clean);
	context.subscriptions.push(xf_create);
	context.subscriptions.push(xf_export);
	context.subscriptions.push(xf_flash);
	context.subscriptions.push(xf_install);
	context.subscriptions.push(xf_menuconfig);
	context.subscriptions.push(xf_monitor);
	context.subscriptions.push(xf_search);
	context.subscriptions.push(xf_target_show);
	context.subscriptions.push(xf_target_download);
	context.subscriptions.push(xf_uninstall);


}
