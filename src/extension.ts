import * as vscode from 'vscode';
import { iorunv, execv } from "./process"
import { log } from './log';
import { Terminal } from "./terminal"

export function activate(context: vscode.ExtensionContext) {
	log.initialize(context);
	log.info("start active");
	const terminal = new Terminal();
	terminal.exec("ls", "ls", true);
	let xf_build = vscode.commands.registerCommand('xf-code.build', async () => {

    });

	let xf_clean = vscode.commands.registerCommand('xf-code.clean', async () => {

    });

	let xf_create = vscode.commands.registerCommand('xf-code.create', async () => {

    });

	let xf_export = vscode.commands.registerCommand('xf-code.export', async () => {

    });

	let xf_flash = vscode.commands.registerCommand('xf-code.flash', async () => {

    });

	let xf_install = vscode.commands.registerCommand('xf-code.install', async () => {

    });

	let xf_menuconfig = vscode.commands.registerCommand('xf-code.menuconfig', async () => {

    });

	let xf_monitor = vscode.commands.registerCommand('xf-code.monitor', async () => {

    });

	let xf_search = vscode.commands.registerCommand('xf-code.search', async () => {

    });

	let xf_target = vscode.commands.registerCommand('xf-code.target', async () => {

    });

	let xf_uninstall = vscode.commands.registerCommand('xf-code.uninstall', async () => {

    });

	context.subscriptions.push(xf_build);
	context.subscriptions.push(xf_clean);
	context.subscriptions.push(xf_create);
	context.subscriptions.push(xf_export);
	context.subscriptions.push(xf_flash);
	context.subscriptions.push(xf_install);
	context.subscriptions.push(xf_menuconfig);
	context.subscriptions.push(xf_monitor);
	context.subscriptions.push(xf_search);
	context.subscriptions.push(xf_target);
	context.subscriptions.push(xf_uninstall);


}
