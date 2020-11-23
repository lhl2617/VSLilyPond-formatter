import * as vscode from 'vscode';

export const activate = (context: vscode.ExtensionContext) => {
	vscode.languages.registerDocumentFormattingEditProvider(`lilypond`, {

		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			console.log(`Hello world`);
			return [];
		}
	});
};
