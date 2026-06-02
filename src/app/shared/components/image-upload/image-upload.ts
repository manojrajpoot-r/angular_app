import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    NgxDropzoneModule
  ],
  templateUrl: './image-upload.html'
})

export class ImageUploadComponent implements OnChanges {

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  // ============================================
  // INPUTS
  // ============================================

  @Input() multiple = false;

  @Input() imageUrls: string[] = [];

  @Input() maxFileSize = 5; // MB

  @Input() acceptedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  // ============================================
  // OUTPUTS
  // ============================================

  @Output()
  fileChange = new EventEmitter<File[]>();

  // ============================================
  // SIGNALS
  // ============================================

  previews = signal<string[]>([]);
  files = signal<File[]>([]);

  // ============================================
  // VARIABLES
  // ============================================

  imageBaseUrl = environment.apiUrlImage;

  // ============================================
  // CHANGES
  // ============================================

  ngOnChanges(changes: SimpleChanges): void {

    if (

      changes['imageUrls'] &&
      this.imageUrls?.length

    ) {

      this.previews.set([
        ...this.imageUrls
      ]);

    }

  }

  // ============================================
  // IMAGE URL
  // ============================================

  getImageUrl(img: string): string {

    if (!img) {
      return '';
    }

    // BASE64 IMAGE
    if (img.startsWith('data:')) {
      return img;
    }

    // SERVER IMAGE
    return `${this.imageBaseUrl}/${img}`;
  }

  // ============================================
  // SELECT FILES
  // ============================================

  onSelect(event: {
    addedFiles: File[]
  }): void {

    const selectedFiles =
      event.addedFiles;

    if (!selectedFiles.length) {
      return;
    }

    // SINGLE IMAGE MODE
    if (!this.multiple) {
      this.files.set([]);
      this.previews.set([]);
    }

    selectedFiles.forEach((file) => {
      // FILE TYPE VALIDATION
      if (!this.acceptedTypes.includes(file.type)) {
        alert('Only JPG, PNG, WEBP allowed');
        return;
      }

      // FILE SIZE VALIDATION

      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > this.maxFileSize) {
        alert(`Max file size is ${this.maxFileSize} MB`);
        return;
      }

      // FILES
      this.files.update((files) => [
        ...files,
        file

      ]);

      // PREVIEW
      const reader = new FileReader();
      reader.onload = () => {
        this.previews.update(
          (previews) => [
            ...previews,
            reader.result as string
          ]
        );
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });

    // EMIT FILES
    this.fileChange.emit(this.files());
  }

  // ============================================
  // REMOVE IMAGE
  // ============================================

  removeImage(index: number): void {
    this.previews.update(
      (previews) =>
        previews.filter((_, i) => i !== index)
    );

    this.files.update(
      (files) => files.filter((_, i) => i !== index));
    this.fileChange.emit(
      this.files()
    );

  }

}
