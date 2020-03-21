import { Injectable } from '@angular/core';
import { Constants } from '../utils/constants';
// import * as path from 'path';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor() { }

    public isDroppingFiles(dropEvent: any): boolean {
        return this.getDroppedFilesPaths(dropEvent).length > 0;
    }

    public getDroppedFilesPaths(dropEvent: any): string[] {
        let droppedFilesPaths: string[] = [];

        if (dropEvent.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i: number = 0; i < dropEvent.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them.
                if (dropEvent.dataTransfer.items[i].kind === 'file') {
                    let file: any = dropEvent.dataTransfer.items[i].getAsFile();
                    droppedFilesPaths.push(file.path);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i: number = 0; i < dropEvent.dataTransfer.files.length; i++) {
                droppedFilesPaths.push(dropEvent.dataTransfer.files[i].path);
            }
        }

        return droppedFilesPaths;
    }

    public getNoteFilePaths(filePaths: string[]): string[] {
        let noteFilePaths: string[] ; //= filePaths.filter(x =>  path.extname(x) === Constants.noteExportExtension);

        return noteFilePaths;
    }
}