import * as vscode from 'vscode';
import { log } from './log';
import * as xfusion from './xfusion';
import * as welcome from './welcome';
import { XF_Explorer } from './explore';
import { generateCppProperties } from './properties';


export function activate(context: vscode.ExtensionContext) {
	// log 初始化
	log.initialize(context);

	// 创建状态栏按钮
	xfusion.xf_set_status_bar_item(context);

	// 创建文件树
	new XF_Explorer(context);

	// 欢迎页面
	const config = vscode.workspace.getConfiguration('xfusion');
	const XF_ROOT = config.get<string>('XF_ROOT'); // 获取字符串设置
	const dontShowStart = config.get<boolean>('dontShowStart'); // 获取字符串设置

	if (XF_ROOT == "" && dontShowStart == false) {
		welcome.showWelcomePage(context);
	}

	// 生成代码提示
	generateCppProperties();

	// 注册start命令
	const start = vscode.commands.registerCommand('xfusion.start', () => {
		welcome.showWelcomePage(context);
	});
	context.subscriptions.push(start);

	// 注册所有命令
	xfusion.register_all_command(context);

}
