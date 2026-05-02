import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgxDropzoneModule
  ],
  templateUrl: './image-upload.html'
})
export class ImageUploadComponent {

  @Input() multiple = false;

  @Input() imageUrls: string[] = [];

  @Output() fileChange = new EventEmitter<File[]>();

  previews: string[] = [];

  files: File[] = [];

  ngOnInit() {

    if (this.imageUrls?.length) {
      this.previews = [...this.imageUrls];
    }

  }

  onSelect(event: any) {

    if (!this.multiple) {
      this.files = [];
      this.previews = [];
    }

    for (let file of event.addedFiles) {

      this.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        this.previews.push(reader.result as string);
      };

      reader.readAsDataURL(file);
    }

    this.fileChange.emit(this.files);
  }

  removeImage(index: number) {

    this.previews.splice(index, 1);

    this.files.splice(index, 1);

    this.fileChange.emit(this.files);
  }

}
