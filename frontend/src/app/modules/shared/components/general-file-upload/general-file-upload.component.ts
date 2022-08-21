import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileItem, FileLikeObject, FileUploader } from 'ng2-file-upload';
import { MIME_TYPES_REVERSE } from '@modules/shared/constants/mime-types';
import i18next from 'i18next';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
    selector: 'rp-general-file-upload',
    templateUrl: './general-file-upload.component.html',
    styleUrls: ['./general-file-upload.component.less'],
})
export class GeneralFileUploadComponent implements OnInit {
    @Input() multi: boolean = false;
    @Input() limit: number = 1;
    @Input() mimeTypes: string[] = []; // @see MimeTypes

    @Input() spreadSheet: boolean;
    mimeTypesReverse = MIME_TYPES_REVERSE;

    @Output() files: EventEmitter<FileItem[]> = new EventEmitter<FileItem[]>();
    @Output() fileUploadedOnQueue = new EventEmitter<boolean>();
    public uploader: FileUploader;

    @ViewChild('uploadButton', { static: true }) uploadButton: any;

    constructor(private message: NzMessageService, private notification: NzNotificationService) {}

    ngOnInit(): void {
        this.uploader = new FileUploader({
            autoUpload: false,
            queueLimit: this.limit,
            allowedMimeType: this.mimeTypes.length > 0 ? this.mimeTypes : undefined,
        });

        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
        this.uploader.onAfterAddingFile = this.onAfterAddingFile;
        this.spreadSheet = true;
    }

    onRemoveFile(file: FileItem) {
        this.uploader.removeFromQueue(file);
        this.uploadButton.nativeElement.value = '';
        this.files.emit(this.uploader.queue);
        this.fileUploadedOnQueue.emit(false);
    }

    onAfterAddingFile = (item: FileItem) => {
        this.files.emit(this.uploader.queue);
        this.fileUploadedOnQueue.emit(true);
    };

    onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
        this.notification.error(
            `${i18next.t('general-file-upload.failed')} ${((item.rawFile as unknown) as File).name}`,
            `${i18next.t('general-file-upload.issue')} ${filter.name},
            ${i18next.t('general-file-upload.expected')} ${this.mimeTypes},
            ${i18next.t('general-file-upload.got')} ${item.type}`,
        );
    };

    onPreviewFile(file: FileItem) {
        const fileURL = URL.createObjectURL(new Blob([file.file.rawFile], { type: file.file.type }));
        window.open(fileURL, '_blank');
    }
}
