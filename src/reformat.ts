import * as vscode from 'vscode';
import { notUndefined } from './utils';

const removeTrailingWhiteSpaces = (text: string) => {
    return text.split(/\r?\n/) // split by newlines
        .map((line, i) => { // find trailing whitespaces
            const match = /\s+$/.exec(line);
            if (match) {
                return vscode.TextEdit.delete(new vscode.Range(new vscode.Position(i, match.index), new vscode.Position(i, line.length)));
            }
            return undefined;
        })
        .filter(notUndefined);
};

export const reformat = (text: string) => {
    const x = removeTrailingWhiteSpaces(text);
    console.log(x);
    return x;
};