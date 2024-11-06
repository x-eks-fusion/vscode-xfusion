import * as vscode from 'vscode';
import { log } from './log';
import * as xfusion from './xfusion';
import * as welcome from './welcome';
import { XF_Explorer } from './explore';

function command_register(context: vscode.ExtensionContext, command: string, callback: (...args: any[]) => any) {
	let cmd = vscode.commands.registerCommand(command, callback);
	context.subscriptions.push(cmd);
}

export function activate(context: vscode.ExtensionContext) {
	// log 初始化
	log.initialize(context);

	const explorer = new XF_Explorer(context);

	const config = vscode.workspace.getConfiguration('xf_code');
	const XF_ROOT = config.get<string>('XF_ROOT'); // 获取字符串设置

	if (XF_ROOT == "") {
		welcome.showWelcomePage(context);
	}

	command_register(context, 'xf-code.build', xfusion.xf_build_run);
	command_register(context, 'xf-code.clean', xfusion.xf_clean_run);
	command_register(context, 'xf-code.create', xfusion.xf_create_run);
	command_register(context, 'xf-code.export', xfusion.xf_export_run);
	command_register(context, 'xf-code.flash', xfusion.xf_flash_run);
	command_register(context, 'xf-code.install', xfusion.xf_install_run);
	command_register(context, 'xf-code.menuconfig', xfusion.xf_menuconfig_run);
	command_register(context, 'xf-code.monitor', xfusion.xf_monitor_run);
	command_register(context, 'xf-code.search', xfusion.xf_search_run);
	command_register(context, 'xf-code.target_show', xfusion.xf_target_show_run);
	command_register(context, 'xf-code.target_download', xfusion.xf_target_download_run);
	command_register(context, 'xf-code.uninstall', xfusion.xf_uninstall_run);
	command_register(context, 'xf-code.update', xfusion.xf_update_run);
	command_register(context, 'xf-code.view_build', xfusion.xf_build_run);
	command_register(context, 'xf-code.view_clean', xfusion.xf_clean_run);
	command_register(context, 'xf-code.view_export', xfusion.xf_export_run);
	command_register(context, 'xf-code.view_update', xfusion.xf_update_run);
	command_register(context, 'xf-code.view_flash', xfusion.xf_flash_run);
	command_register(context, 'xf-code.view_monitor', xfusion.xf_monitor_run);
	command_register(context, 'xf-code.view_menuconfig', xfusion.xf_menuconfig_run);
	command_register(context, 'xf-code.active', xfusion.xf_active_run);
	let start = vscode.commands.registerCommand('xf-code.start', () => {
		// 使用捕获的 context
		welcome.showWelcomePage(context);
	});
	context.subscriptions.push(start);
}
