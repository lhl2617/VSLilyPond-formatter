import * as assert from 'assert';

import * as vscode from 'vscode';

import { removeTrailingWhiteSpaces } from '../../reformat';

const testRemoveTrailingWhiteSpaces = () => {
	const cases = [
		{
			name: `Remove spaces`,
			lines: [`hello `, `hello    `, `   `, `abc\t`, `this is ok`, `abc `, `abc`],
			want: [
				vscode.TextEdit.delete(new vscode.Range(new vscode.Position(0, 5), new vscode.Position(0, 6))),
				vscode.TextEdit.delete(new vscode.Range(new vscode.Position(1, 5), new vscode.Position(1, 9))),
				vscode.TextEdit.delete(new vscode.Range(new vscode.Position(2, 0), new vscode.Position(2, 3))),
				vscode.TextEdit.delete(new vscode.Range(new vscode.Position(3, 3), new vscode.Position(3, 4))),
				vscode.TextEdit.delete(new vscode.Range(new vscode.Position(5, 3), new vscode.Position(5, 4))),
			],
		},
	];

	cases.forEach(c => {
		test(c.name, () => {
			assert.deepStrictEqual(removeTrailingWhiteSpaces(c.lines), c.want);
		});
	});
};


suite(`Test Suite`, () => {
	testRemoveTrailingWhiteSpaces();
});
