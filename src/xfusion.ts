'use strict';

import * as vscode from 'vscode';
import { log } from './log';
import { SerialPort } from 'serialport';

export async function xf_build_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf build');
}

export async function xf_clean_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf clean');
}

export async function xf_create_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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

export async function xf_export_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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
    activeTerminal.sendText(`xf export ${command}`);
}

export async function xf_flash_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf flash');
}

export async function xf_install_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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

export async function xf_menuconfig_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf menuconfig');
}

export async function xf_monitor_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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

export async function xf_search_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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

export async function xf_target_show_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf target -s');
}

export async function xf_target_download_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
        return;
    }
    // 打印活动终端的名称
    log.info(`活动终端名称: ${activeTerminal.name}`);
    // 发送命令到当前活动终端
    activeTerminal.sendText('xf target -d');
}

export async function xf_uninstall_run() {
    const activeTerminal = vscode.window.activeTerminal;

    if (!activeTerminal) {
        log.error("没有活动的终端");
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
