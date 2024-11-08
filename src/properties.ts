'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const configurations = {
    bs21: {
        name: 'bs21',
        compileCommands: "${config:xfusion.XF_ROOT}/sdks/bs2x_sdk/output/bs21e/acore/bs21e-sle-ble-slp-central-peripheral/compile_commands.json"
    },
    ws63: {
        name: "ws63",
        compilerPath: "${config:xfusion.XF_ROOT}/sdks/fbb_ws63/src/tools/bin/compiler/riscv/cc_riscv32_musl_100/cc_riscv32_musl_fp/bin/riscv32-linux-musl-gcc",
        includePath: [
            "${workspaceFolder}/**"
        ],
        defines: [
            ""
        ],
        cStandard: "gnu99",
        cppStandard: "gnu++98",
        forcedInclude: [
            "${config:xfusion.XF_ROOT}/sdks/fbb_ws63/src/output/ws63/acore/ws63-liteos-app/mconfig.h"
        ],
        compileCommands: "${config:xfusion.XF_ROOT}/sdks/fbb_ws63/src/output/ws63/acore/ws63-liteos-app/compile_commands.json",
        browse: {
            path: [
                "${workspaceFolder}"
            ],
            limitSymbolsToIncludedHeaders: false
        }
    },
    esp32: {
        name: "esp32",
        compilerPath: "${env:HOME}/.espressif/tools/xtensa-esp32-elf/esp-2022r1-11.2.0/xtensa-esp32-elf/bin/xtensa-esp32-elf-gcc",
        includePath: [
            "${workspaceFolder}/**"
        ],
        cStandard: "gnu99",
        cppStandard: "gnu++98",
        compileCommands: "${config:xfusion.XF_ROOT}/boards/espressif/esp32/build/compile_commands.json"
    }
}

export function generateCppProperties(target: string = "") {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('没有打开工作区');
        return;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const vscodeDir = path.join(workspacePath, '.vscode');
    const cppPropertiesPath = path.join(vscodeDir, 'c_cpp_properties.json');

    // 如果 .vscode 目录不存在，则创建它
    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir);
    }

    let cppProperties;
    if (target == "esp32" || target == "ws63" || target == "bs21") {
        // 生成 c_cpp_properties.json 的内容
        cppProperties = {
            version: 4,
            enableConfigurationSquiggles: true,
            configurations: [
                configurations[target]
            ]
        };
    }
    else if(target === "")
    {
        // 生成 c_cpp_properties.json 的内容
        cppProperties = {
            version: 4,
            enableConfigurationSquiggles: true,
            configurations: [
                configurations.bs21,
                configurations.esp32,
                configurations.ws63
            ]
        };
    }
    else
    {
        return;
    }

    // 将配置写入 c_cpp_properties.json
    fs.writeFileSync(cppPropertiesPath, JSON.stringify(cppProperties, null, 4));
}
