'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { log } from './log';

function openFolderExplorer(panel: vscode.WebviewPanel) {
    // 打开文件夹选择器
    vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: '选择文件夹',
        canSelectFolders: true // 允许选择文件夹
    }).then(fileUri => {
        if (fileUri && fileUri.length > 0) {
            const selectedPath = fileUri[0].fsPath;
            log.info(`选择的文件夹:${selectedPath}`);

            // 发送选择的文件夹路径到 Webview
            panel.webview.postMessage({
                command: 'showFolderPath',
                path: selectedPath
            });

            const config = vscode.workspace.getConfiguration('xfusion');

            config.update('XF_ROOT', selectedPath, vscode.ConfigurationTarget.Workspace)
                .then(() => {
                    log.info(`Updated 'XF_ROOT' to ${selectedPath}`);
                }, (err) => {
                    log.error(`Failed to update 'XF_ROOT': ${err}`);
                });
        }
    });
}

function setDontShowAgainConfig(enable: boolean) {
    const config = vscode.workspace.getConfiguration('xfusion');
    config.update('dontShowStart', enable, vscode.ConfigurationTarget.Workspace);
    log.info(`Updated 'xfusion.dontShowStart' to ${enable}`);
}

export function showWelcomePage(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'welcomePage',
        '欢迎使用 Xfusion',
        vscode.ViewColumn.One,
        {
            enableScripts: true
        } // 允许脚本在 Webview 中运行
    );

    // Webview HTML 内容
    getWebviewContent()
        .then(content => {
            panel.webview.html = content;
        })
        .catch(error => {
            log.error(`读取文件时出错:${error}`);
            return;
        });

    // 监听 Webview 中的消息
    panel.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
            case 'selectFile':
                openFolderExplorer(panel); // 处理选择文件夹
                return;
            case 'dontShowAgain':
                setDontShowAgainConfig(message.value);
                return;
        }
    }, undefined, context.subscriptions);

    const config = vscode.workspace.getConfiguration('xfusion');
    const dontShowStart = config.get<boolean>('dontShowStart'); // 获取字符串设置
    log.info(`showWelcomePage dontShowStart: ${dontShowStart}`);
	panel.webview.postMessage({
                command: 'dontShowAgain',
                value: dontShowStart
            });
    const selectedPath = config.get<string>('XF_ROOT'); // 获取字符串设置
    // 发送选择的文件夹路径到 Webview
    panel.webview.postMessage({
        command: 'showFolderPath',
        path: selectedPath
    });

    // 设置 Webview 标签图标路径
    panel.iconPath = vscode.Uri.file(
        path.join(context.extensionPath, 'res', 'pic', 'coral.svg') // 图标路径
      );
}

function getWebviewContent(): Promise<string> {
    return new Promise((resolve, reject) => {
        const absolutePath = path.resolve(__dirname, "..", "res", "html", "welcome.html");
        fs.readFile(absolutePath, 'utf8', (err, data) => {
            if (err) {
                log.error(`文件welcome.html 不存在: ${absolutePath}, ${err}`);
                reject(err); // Reject the promise with the error
                return "";
            }
            resolve(data); // Resolve the promise with the file content
        });
    });
}
