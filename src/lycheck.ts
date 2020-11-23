import * as commandExists from 'command-exists';
import * as vscode from 'vscode';
import { getConfiguration, outputChan } from './util';
import * as cp from 'child_process';

export const checkPythonInstallation = (pythonPath: string) => {
    if (!commandExists.sync(pythonPath)) {
        throw new Error(`Python installation not found at \`${pythonPath}\``);
    }
};

export const checkLyInstallation = (pythonPath: string) => {
    const res = cp.spawnSync(pythonPath, [`-c`, `import ly`]);
    outputChan.appendLine(`[COMMAND]: ${pythonPath} -c "import ly"`);
    if (res.error || res.status !== 0) {
        outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
        outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
        throw new Error(`python-ly not installed. Please install python-ly (${pythonPath} -m pip install python-ly).`);
    }
};

export const runReformat = (pythonPath: string, doc: vscode.TextDocument): string => {
    const config = getConfiguration(doc);
    const timeout = config?.general?.reformatTimeout ?? 10000;
    const res = cp.spawnSync(pythonPath, [`-m`, `ly`, `indent; reformat`, doc.fileName], { timeout: timeout });
    outputChan.appendLine(`[COMMAND]: ${pythonPath} -m ly "indent; reformat" ${doc.fileName}`);
    if (res.error) {
        outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
        outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
        throw res.error;
    }
    if (res.status !== 0) {
        outputChan.appendLine(`[STDOUT]: ${res.stdout.toString()}`);
        outputChan.appendLine(`[STDERR]: ${res.stderr.toString()}`);
        throw new Error(`Python-ly error. See output for "VSLilyPond: Formatter".`);
    }
    return res.stdout.toString();
};