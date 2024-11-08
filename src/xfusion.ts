'use strict';

import * as vscode from 'vscode';
import { log } from './log';
import { SerialPort } from 'serialport';
import { promises as fs } from 'fs';
import old_fs from 'fs';
import path from 'path';
import { generateCppProperties } from './properties';

async function xf_build_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf build');
}

async function xf_clean_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf clean');
}

async function xf_create_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }

    // 打印活动终端的名称
    console.log(`活动终端名称: ${activeTerminal.name}`);
    const command = await vscode.window.showInputBox({
        placeHolder: '请输入你的工程名',
        prompt: '创建新的工程',
    });

    // 检查用户是否输入了命令
    if (!command) {
        vscode.window.showWarningMessage('未输入工程名');
        return;
    }

    // 在终端中执行用户输入的命令
    activeTerminal.sendText(`xf create ${command}`);
}

async function xf_export_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }

    // 打印活动终端的名称
    console.log(`活动终端名称: ${activeTerminal.name}`);
    const command = await vscode.window.showInputBox({
        placeHolder: '请输入你的工程名',
        prompt: '导出新的工程',
    });

    // 检查用户是否输入了命令
    if (!command) {
        vscode.window.showWarningMessage('未输入工程名');
        return;
    }

    // 在终端中执行用户输入的命令
    activeTerminal.sendText(`xf ${command}`);
}

async function xf_flash_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf flash');
}

async function xf_install_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    console.log(`活动终端名称: ${activeTerminal.name}`);
    const command = await vscode.window.showInputBox({
        placeHolder: '请输入安装第三方包名',
        prompt: '下载第三方包',
    });

    // 检查用户是否输入了命令
    if (!command) {
        vscode.window.showWarningMessage('未输入第三方包名');
        return;
    }

    // 在终端中执行用户输入的命令
    activeTerminal.sendText(`xf install ${command}`);
}

async function xf_menuconfig_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf menuconfig');
}

async function xf_monitor_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }

    // 扫描可用的串口
    const ports = await SerialPort.list();

    if (ports.length === 0) {
        vscode.window.showWarningMessage('未找到可用的串口');
        return;
    }

    // 提取串口名称（或其他信息）
    const portNames = ports.map(port => port.path);

    // 弹出选择框让用户选择串口
    const selectedPort = await vscode.window.showQuickPick(portNames, {
        placeHolder: '请选择一个串口',
    });

    if (!selectedPort) {
        vscode.window.showWarningMessage('未选择任何串口');
        return;
    }

    activeTerminal.sendText(`xf monitor ${selectedPort}`);

}

async function xf_search_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    console.log(`活动终端名称: ${activeTerminal.name}`);
    const command = await vscode.window.showInputBox({
        placeHolder: '请输入查询第三方包名',
        prompt: '搜索查询第三方包',
    });

    // 检查用户是否输入了命令
    if (!command) {
        vscode.window.showWarningMessage('未输入第三方包名');
        return;
    }

    // 在终端中执行用户输入的命令
    activeTerminal.sendText(`xf search ${command}`);
}

async function xf_target_show_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf target -s');
}

async function xf_target_download_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf target -d');
}

async function xf_uninstall_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    console.log(`活动终端名称: ${activeTerminal.name}`);
    const command = await vscode.window.showInputBox({
        placeHolder: '请输入第三方包名',
        prompt: '卸载第三方包',
    });

    // 检查用户是否输入了命令
    if (!command) {
        vscode.window.showWarningMessage('未输入第三方包名');
        return;
    }

    // 在终端中执行用户输入的命令
    activeTerminal.sendText(`xf uninstall ${command}`);
}

async function xf_update_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf update');
}

async function findTargetJsonFolders(dir: string): Promise<string[]> {
    const foldersWithTargetJson: string[] = [];

    // 获取当前目录下的所有文件和文件夹
    const entries = await fs.readdir(dir, { withFileTypes: true });

    // 创建一个数组来存储所有的扫描任务
    const promises: Promise<void>[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // 检查当前目录是否有 target.json 文件
            const targetJsonPath = path.join(fullPath, 'target.json');
            const targetJsonPromise = fs.stat(targetJsonPath)
                .then(stats => {
                    if (stats.isFile()) {
                        // 如果存在 target.json 文件，添加文件夹名
                        foldersWithTargetJson.push(entry.name);
                    }
                })
                .catch(async () => {
                    // 如果文件不存在，继续扫描子文件夹
                    const subFolders = await findTargetJsonFolders(fullPath);
                    if (subFolders.length > 0) {
                        foldersWithTargetJson.push(...subFolders);
                    }
                });

            // 将任务添加到数组
            promises.push(targetJsonPromise);
        }
    }

    // 等待所有的扫描任务完成
    await Promise.all(promises);

    return foldersWithTargetJson;
}

let statusBarItem: vscode.StatusBarItem;;

async function xf_active_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        vscode.window.showWarningMessage("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);

    const config = vscode.workspace.getConfiguration('xfusion');
    const XF_ROOT = config.get<string>('XF_ROOT'); // 获取字符串设置

    if (XF_ROOT == "" || XF_ROOT == null) {
        log.error("没有设置XF_ROOT");
        return;
    }

    const shellPath = path.join(XF_ROOT, "export.sh");
    
    if (!old_fs.existsSync(shellPath)) {
        vscode.window.showWarningMessage(`没有找到${shellPath}文件`);
        return;
    }

    let targets: string[] = [];

    // 创建一个函数来获取目标文件夹并处理选择
    const fetchTargetsAndShowPicker = async () => {
        try {
            targets = await findTargetJsonFolders(XF_ROOT);
            const selectedTarget = await vscode.window.showQuickPick(targets, {
                placeHolder: '请选择一个target目标',
            });

            if (!selectedTarget) {
                vscode.window.showWarningMessage('未选择任何目标');
                return;
            }

            log.info(`source ${shellPath} ${selectedTarget}`);
            statusBarItem.text = selectedTarget;
            statusBarItem.show();
            generateCppProperties(selectedTarget);
            activeTerminal.sendText(`source ${shellPath} ${selectedTarget}`);
        } catch (error) {
            vscode.window.showWarningMessage(`没找到target.json, ${error}`);
        }
    };

    // 立即调用获取目标和显示选择框的函数
    fetchTargetsAndShowPicker();
}

export function xf_set_status_bar_item(context: vscode.ExtensionContext) {
    // 创建状态栏按钮
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'xfusion.active';
	statusBarItem.text = 'xfusion';
	statusBarItem.tooltip = '点击设置target';
	statusBarItem.show();
  
    context.subscriptions.push(statusBarItem);
}


function command_register(context: vscode.ExtensionContext, command: string, callback: (...args: any[]) => any) {
	let cmd = vscode.commands.registerCommand(command, callback);
	context.subscriptions.push(cmd);
}

export function register_all_command(context: vscode.ExtensionContext)
{
    command_register(context, 'xfusion.build', xf_build_run);
	command_register(context, 'xfusion.clean', xf_clean_run);
	command_register(context, 'xfusion.create', xf_create_run);
	command_register(context, 'xfusion.export', xf_export_run);
	command_register(context, 'xfusion.flash', xf_flash_run);
	command_register(context, 'xfusion.install', xf_install_run);
	command_register(context, 'xfusion.menuconfig', xf_menuconfig_run);
	command_register(context, 'xfusion.monitor', xf_monitor_run);
	command_register(context, 'xfusion.search', xf_search_run);
	command_register(context, 'xfusion.target_show', xf_target_show_run);
	command_register(context, 'xfusion.target_download', xf_target_download_run);
	command_register(context, 'xfusion.uninstall', xf_uninstall_run);
	command_register(context, 'xfusion.update', xf_update_run);
	command_register(context, 'xfusion.view_build', xf_build_run);
	command_register(context, 'xfusion.view_clean', xf_clean_run);
	command_register(context, 'xfusion.view_export', xf_export_run);
	command_register(context, 'xfusion.view_update', xf_update_run);
	command_register(context, 'xfusion.view_flash', xf_flash_run);
	command_register(context, 'xfusion.view_monitor', xf_monitor_run);
	command_register(context, 'xfusion.view_menuconfig', xf_menuconfig_run);
	command_register(context, 'xfusion.active', xf_active_run);
}
