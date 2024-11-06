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

            const config = vscode.workspace.getConfiguration('xf_code');

            config.update('XF_ROOT', selectedPath, vscode.ConfigurationTarget.Workspace)
                .then(() => {
                    log.info(`Updated 'XF_ROOT' to ${selectedPath}`);
                }, (err) => {
                    log.error(`Failed to update 'XF_ROOT': ${err}`);
                });
        }
    });
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
        }
    }, undefined, context.subscriptions);
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
