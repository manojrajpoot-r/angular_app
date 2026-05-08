import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from '../../../environments/environment';
import { ValidationErrorComponent } from '../../../shared/components/validation-error-component/validation-error-component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  constructor(private cdr: ChangeDetectorRef) { }
  @Input() multiple = false;
  @Input() imageUrls: string[] = [];

  @Output() fileChange = new EventEmitter<File[]>();
  form!: FormGroup;

  previews: string[] = [];
  files: File[] = [];
  imageBaseUrl = environment.apiUrlImage;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrls'] && this.imageUrls?.length) {
      this.previews = [...this.imageUrls];
    }
  }


  getImageUrl(img: string): string {
    if (!img) return '';

    //  base64 image
    if (img.startsWith('data:')) {
      return img;
    }

    // server image
    return this.imageBaseUrl + '/' + img;
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

        this.cdr.detectChanges();
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

