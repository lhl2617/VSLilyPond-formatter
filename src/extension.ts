import * as vscode from 'vscode';
import { reformat } from './reformat';



export const activate = (context: vscode.ExtensionContext) => {
	vscode.languages.registerDocumentFormattingEditProvider(`lilypond`, {

		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			return reformat(document.getText());
		}
	});
};
