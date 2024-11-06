'use strict';

import * as vscode from 'vscode';
import { log } from './log';
import * as path from 'path';

export enum XF_ExplorerItemType {
    ROOT,
    GROUP,
    TARGET,
    DIRECTORY,
    FILE,
}

type XF_ExplorerRootInfo = {
    type: XF_ExplorerItemType.ROOT;
}

type XF_ExplorerGroupInfo = {
    type: XF_ExplorerItemType.GROUP;
    group: string[];
}

type XF_ExplorerTargetInfo = {
    type: XF_ExplorerItemType.TARGET;
    group: string[];
    target: string;
    kind: string;
}

type XF_ExplorerDirectoryInfo = {
    type: XF_ExplorerItemType.DIRECTORY;
    group: string[];
    target: string;
    path: string[];
}

type XF_ExplorerFileInfo = {
    type: XF_ExplorerItemType.FILE;
    group: string[];
    target: string;
    path: string[];
    basePath: string;
}

type XF_ExplorerItemInfo = XF_ExplorerRootInfo | XF_ExplorerGroupInfo | XF_ExplorerTargetInfo | XF_ExplorerDirectoryInfo | XF_ExplorerFileInfo;

export interface XF_Targets {
    kind: string;
    group: string;
    name: string;
    files: string[];
    basePath: string;
}

class XF_ExplorerItem extends vscode.TreeItem {
    info: XF_ExplorerItemInfo | undefined;
    constructor(public label: string, info: XF_ExplorerItemInfo) {
        super(label, info.type != XF_ExplorerItemType.FILE ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.info = info;

        if (info.type == XF_ExplorerItemType.TARGET) {
            this.contextValue = "target";
        }

        const resDirPath = [__dirname, "..", "res", "pic"];
        switch (info.type) {
            case XF_ExplorerItemType.GROUP:
                this.iconPath = {
                    dark: path.join(...resDirPath, "dark", "symbol-misc.svg"),
                    light: path.join(...resDirPath, "light", "symbol-misc.svg")
                }
                log.info(`iconPath: ${JSON.stringify(this.iconPath)}`);
                break;
            case XF_ExplorerItemType.TARGET:
                if (info.kind === "binary") {
                    this.iconPath = {
                        dark: path.join(...resDirPath, "dark", "window.svg"),
                        light: path.join(...resDirPath, "light", "window.svg")
                    }
                    log.info(`iconPath: ${JSON.stringify(this.iconPath)}`);
                }
                else if (info.kind === "shared") {
                    this.iconPath = {
                        dark: path.join(...resDirPath, "dark", "gear.svg"),
                        light: path.join(...resDirPath, "light", "gear.svg")
                    }
                }
                else if (info.kind == "static") {
                    this.iconPath = {
                        dark: path.join(...resDirPath, "dark", "library.svg"),
                        light: path.join(...resDirPath, "light", "library.svg")
                    }
                }
                else {
                    this.iconPath = {
                        dark: path.join(...resDirPath, "dark", "archive.svg"),
                        light: path.join(...resDirPath, "light", "archive.svg")
                    }
                }
                break;
            case XF_ExplorerItemType.DIRECTORY:
                this.resourceUri = vscode.Uri.file(path.join(...info.path));
                break;
            case XF_ExplorerItemType.FILE:
                this.resourceUri = vscode.Uri.file(path.join(...info.path));
                break;
            default:
                break;
        }
    }
}

class XF_ExplorerHierarchyNode {

    info: XF_ExplorerItemInfo;
    children: XF_ExplorerHierarchyNode[] = new Array();
    expanded: boolean = false;

    constructor(info: XF_ExplorerItemInfo) {
        this.info = info;
    }

    getName(): string {
        switch (this.info.type) {
            case XF_ExplorerItemType.GROUP:
                return this.info.group[this.info.group.length - 1];
            case XF_ExplorerItemType.TARGET:
                return this.info.target;
            case XF_ExplorerItemType.DIRECTORY:
                return this.info.path[this.info.path.length - 1];
            case XF_ExplorerItemType.FILE:
                return this.info.path[this.info.path.length - 1];
            default:
                return "";
        }
    }
}


export class XF_ExplorerDataProvider implements vscode.TreeDataProvider<XF_ExplorerItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<XF_ExplorerItem | undefined | void> = new vscode.EventEmitter<XF_ExplorerItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<XF_ExplorerItem | undefined | void> = this._onDidChangeTreeData.event;

    private hierarchy: XF_ExplorerHierarchyNode = new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.ROOT });

    private concatEmptyDirectories(dirNode: XF_ExplorerHierarchyNode) {
        const concatPath: string[] = new Array();
        const dirInfo = <XF_ExplorerDirectoryInfo>dirNode.info;
        concatPath.push(dirInfo.path[dirInfo.path.length - 1]);

        let concatChild = dirNode;
        while (concatChild.children.length == 1 && concatChild.children[0].info.type == XF_ExplorerItemType.DIRECTORY) {
            concatChild = concatChild.children[0];
            const collapsedDirInfo = <XF_ExplorerDirectoryInfo>concatChild.info;
            concatPath.push(collapsedDirInfo.path[collapsedDirInfo.path.length - 1]);
        }

        return new XF_ExplorerItem(path.join(...concatPath), concatChild.info);
    }

    private getRootElements() {
        const rootElements: XF_ExplorerItem[] = new Array();

        for (let child of this.hierarchy.children)
            rootElements.push(new XF_ExplorerItem(child.getName(), child.info));

        return rootElements;
    }

    private getGroupChildren(groups: string[]) {
        let current = this.hierarchy;
        for (let group of groups) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.GROUP && item.getName() == group);
            if (foundItem) {
                current = foundItem;
            }
            else {
                break;
            }
        }

        const groupElements: XF_ExplorerItem[] = new Array();
        if (current) {
            for (let child of current.children)
                groupElements.push(new XF_ExplorerItem(child.getName(), child.info));
        }

        return groupElements;
    }

    private getTargetChildren(groups: string[], targetName: string) {
        let current = this.hierarchy;

        // Traverse groups
        for (let group of groups) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.GROUP && item.getName() == group);
            if (foundItem) {
                current = foundItem;
            }
            else {
                break;
            }
        }

        // Find the target
        if (current) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.TARGET && item.getName() == targetName);
            if (foundItem) {
                current = foundItem;
            }
        }

        // Create target children
        const targetElements: XF_ExplorerItem[] = new Array();
        if (current) {
            for (let child of current.children) {
                if (child.info.type == XF_ExplorerItemType.DIRECTORY)
                    targetElements.push(this.concatEmptyDirectories(child));
                else
                    targetElements.push(new XF_ExplorerItem(child.getName(), child.info));
            }
        }

        return targetElements;
    }

    private getDirectoryChildren(groups: string[], targetName: string, path: string[]) {
        let current = this.hierarchy;

        // Traverse groups
        for (let group of groups) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.GROUP && item.getName() == group);
            if (foundItem) {
                current = foundItem;
            }
            else {
                break;
            }
        }

        // Find the target
        if (current) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.TARGET && item.getName() == targetName);
            if (foundItem) {
                current = foundItem;
            }
        }
        // Traverse the directory path
        for (let dir of path) {
            const foundItem = current.children.find(item => item.info.type == XF_ExplorerItemType.DIRECTORY && item.getName() == dir);
            if (foundItem) {
                current = foundItem;
            } else {
                break;
            }
        }

        // Create directory child elements
        const dirElements: XF_ExplorerItem[] = new Array();
        if (current) {
            for (let child of current.children) {
                if (child.info.type == XF_ExplorerItemType.DIRECTORY)
                    dirElements.push(this.concatEmptyDirectories(child));
                else
                    dirElements.push(new XF_ExplorerItem(child.getName(), child.info));
            }
        }

        return dirElements;
    }

    getTreeItem(element: XF_ExplorerItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: XF_ExplorerItem): XF_ExplorerItem[] | Thenable<XF_ExplorerItem[]> {
        if (element && element.info) {
            if (element.info.type === XF_ExplorerItemType.GROUP)
                return Promise.resolve(this.getGroupChildren(element.info.group));
            else if (element.info.type === XF_ExplorerItemType.TARGET)
                return Promise.resolve(this.getTargetChildren(element.info.group, element.info.target));
            else if (element.info.type === XF_ExplorerItemType.DIRECTORY)
                return Promise.resolve(this.getDirectoryChildren(element.info.group, element.info.target, element.info.path));
            else
                return Promise.resolve([]);
        }
        else {
            return Promise.resolve(this.getRootElements());
        }
    }

    private mergeExpandState(oldHierarchy: XF_ExplorerHierarchyNode, newHierarchy: XF_ExplorerHierarchyNode) {
        for (let oldChild of oldHierarchy.children) {
            const newChild = newHierarchy.children.find(item => item.info.type == oldChild.info.type && item.getName() == oldChild.getName());
            if (newChild) {
                newChild.expanded = oldChild.expanded;
                this.mergeExpandState(oldChild, newChild);
            }
        }
    }

    private splitPath(file_path: string) {
        const parts: string[] = new Array();

        parts.push(path.basename(file_path));

        let dir_path = path.dirname(file_path);
        while (dir_path != ".") {
            const dir = path.basename(dir_path);
            if (dir)
                parts.unshift(dir);
            else
                break;

            dir_path = path.dirname(dir_path);
        }

        return parts;
    }

    refresh(targets: XF_Targets[]): void {

        if (targets == null) {
            return;
        }

        // Sort targets so they appear correctly in the tree view
        targets.sort((t1: XF_Targets, t2: XF_Targets) => {
            if (t1.group === t2.group)
                return t1.basePath.localeCompare(t2.basePath);

            return t1.group.localeCompare(t2.group);
        });

        const root = new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.ROOT });

        for (let target of targets) {

            let current = root;

            // Create the group hierarchy
            const groups = target.group != "" ? target.group.trim().split("/") : [];
            if (groups.length > 0) {
                const currentGroup: string[] = new Array();
                for (let group of groups) {

                    currentGroup.push(group);

                    // Find or create the group node
                    let groupNode = current.children.find(node => node.info.type == XF_ExplorerItemType.GROUP && node.info.group[node.info.group.length - 1] == group);
                    if (!groupNode) {
                        current.children.push(new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.GROUP, group: [...currentGroup] }))
                        groupNode = current.children[current.children.length - 1];
                    }

                    current = groupNode;
                }
            }

            // Add the target
            current.children.push(new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.TARGET, group: groups, target: target.name, kind: target.kind }));
            current = current.children[current.children.length - 1];

            const targetNode = current;

            // Sort files so that they appear the same when refreshed
            if (target.files != null && Array.isArray(target.files)) {
                target.files.sort();
            } else {
                target.files = [];
            }

            // Create folder hierarchy
            for (let file of target.files) {
                const path = this.splitPath(file);
                let subPath: string[] = new Array();

                current = targetNode;

                // Create the sub directory hierarchy
                for (let i = 0; i < path.length - 1; i++) {
                    const subDirName = path[i];
                    subPath.push(subDirName);

                    let subDirNode = current.children.find(node => node.info.type == XF_ExplorerItemType.DIRECTORY && node.info.path[node.info.path.length - 1] == subDirName);
                    if (!subDirNode) {
                        current.children.push(new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.DIRECTORY, group: groups, target: target.name, path: [...subPath] }));
                        subDirNode = current.children[current.children.length - 1];
                    }

                    current = subDirNode;
                }
            }

            // Add the file node
            for (let file of target.files) {
                const path = this.splitPath(file);
                let subPath: string[] = new Array();

                current = targetNode;

                for (let i = 0; i < path.length - 1; i++) {
                    const subDirName = path[i];
                    subPath.push(subDirName);

                    let subDirNode = current.children.find(node => node.info.type == XF_ExplorerItemType.DIRECTORY && node.info.path[node.info.path.length - 1] == subDirName);
                    if (!subDirNode) {
                        subDirNode = current.children[current.children.length - 1];
                    }

                    current = subDirNode;
                }

                current.children.push(new XF_ExplorerHierarchyNode({ type: XF_ExplorerItemType.FILE, group: groups, target: target.name, path: path, basePath: target.basePath }));
                current = current.children[current.children.length - 1];
            }
        }

        // Merge expand status
        this.mergeExpandState(this.hierarchy, root);

        // Set the new hierarchy
        this.hierarchy = root;

        // Refresh the tree view
        this._onDidChangeTreeData.fire();
    }
}