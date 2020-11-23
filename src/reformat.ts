import * as vscode from 'vscode';
import { notUndefined } from './utils';

export const removeTrailingWhiteSpaces = (lines: string[]) => {
    return lines.map((line, i) => { // find trailing whitespaces
        const match = /\s+$/.exec(line);
        if (match) {
            return vscode.TextEdit.delete(
                new vscode.Range(
                    new vscode.Position(i, match.index),
                    new vscode.Position(i, line.length)
                )
            );
        }
        return undefined;
    }).filter(notUndefined);
};

// ensure one space between % and actual comment
export const formatCommentsSpacing = (lines: string[]) => {
    return lines.map((line, i) => {
        const matchNonSpaced = /%\S.+/.exec(line);
        if (matchNonSpaced) {
            return vscode.TextEdit.insert(new vscode.Position(i, matchNonSpaced.index + 1), ` `);
        }
        const matchMultiSpaced = /%\s+/.exec(line);
        // already ran trim whitespace, so we don't need to consider danglers here
        if (matchMultiSpaced) {
            const commentStr = line.substr(matchMultiSpaced.index); // `%   123`
            const matchNonWhiteSpaceComment = /\S+/.exec(commentStr); // `123`
            if (matchNonWhiteSpaceComment) {
                return vscode.TextEdit.replace(
                    new vscode.Range(
                        new vscode.Position(i, matchMultiSpaced.index + 1),
                        new vscode.Position(i, matchMultiSpaced.index + matchNonWhiteSpaceComment.index)),
                    ` `);
            }
        }
        return undefined;
    }).filter(notUndefined);
};

// move line comments to col 0
// move comments to top line if needed (e.g. if `abc % abc` -> `% abc\nabc`)
export const moveSideComments = (lines: string[]) => {
    return lines.map((line, i) => {
        // leading white space
        const matchLeadingWhiteSpaceComments = /^\s+%/.exec(line);
        if (matchLeadingWhiteSpaceComments) {
            return [vscode.TextEdit.delete(
                new vscode.Range(
                    new vscode.Position(i, 0),
                    new vscode.Position(i, matchLeadingWhiteSpaceComments.index)
                )
            )];
        }

        // move to top line of described item
        const matchInlinedComment = /^.+%/.exec(line);
        if (matchInlinedComment) {
            const matchComment = /%/.exec(line);
            const matchCommentWithLeadingWhiteSpace = /\s*%/.exec(line);
            if (matchComment && matchCommentWithLeadingWhiteSpace) {
                const commentStr = line.substr(matchComment.index);
                const insertEdit = vscode.TextEdit.insert(
                    new vscode.Position(i, 0),
                    `${commentStr}\n`
                );
                const removeEdit = vscode.TextEdit.delete(
                    new vscode.Range(
                        new vscode.Position(i, matchCommentWithLeadingWhiteSpace.index),
                        new vscode.Position(i, line.length)
                    )
                );
                return [insertEdit, removeEdit];
            }
        }

        return undefined;
    })
        .filter(notUndefined)
        .flat();
};

export const reformat = (text: string) => {
    const lines = text.split(/\r?\n/);
    return [
        ...removeTrailingWhiteSpaces(lines),
        ...formatCommentsSpacing(lines),
        ...moveSideComments(lines),
    ];
};