import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LobbyService } from '@app/core/services/lobby.service';
import { ResourcesService } from '@app/core/services/resources.service';
import convertImageToBase64 from '@app/utils/convert-image-to-base64';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

  defaultImages: File[] = [];
  defaultImagesLoading: Boolean = false;

  puzzleImageFile: File | null = null;

  form: FormGroup = new FormGroup({
    pieces: new FormControl(20, [Validators.required, Validators.min(20), Validators.max(1000)]),
    userCapacity: new FormControl(3, [Validators.required, Validators.min(1), Validators.max(5)]),
    puzzleImage: new FormControl(null, [Validators.required])
  });

  conversionError: string | null = null;
  submitError: string | null = null;

  constructor(private lobbyService: LobbyService, private resourcesService: ResourcesService) {
    // for(let i = 0; i < 7; i++) {
    //   resourcesService.getImageAsFile(`assets/default_images/default00${i+1}.jpg`).subscribe((image:File) => {
    //     console.log(image);
    //     this.defaultImages.push(image);
    //   });
    // }
    this.defaultImagesLoading = true;

    resourcesService.getDefaultImages().subscribe((images: File[]) => {
      this.defaultImages = images;
      this.defaultImagesLoading = false;
    });
  }

  onSubmit(): void {
    if (this.isDataInvalid()) {
      this.submitError = "Submit failed. Please change the given data."
      return;
    }

    this.lobbyService.createRoom({
      pieces: this.pieces.value,
      userCapacity: this.userCapacity.value
    }, this.puzzleImageFile!);

    this.lobbyService.changeCreatingRoom(false);
  }

  uploadImage(event: any): void {
    this.setPuzzleImage(event.target.files[0]);
  }

  clickOnDefaultImage(image: File): void {
    this.setPuzzleImage(image);
  }

  private setPuzzleImage(file: File) {
    this.puzzleImageFile = file;
    console.log(this.puzzleImageFile);


    if (this.puzzleImageFile != null) {
      convertImageToBase64(this.puzzleImageFile, (result: string) => {
        this.puzzleImage.setValue(result);

        this.conversionError = null;
      }, (error: string) => {
        this.conversionError = error;
      });
    }
  }

  get userCapacity(): FormControl {
    return this.form.get('userCapacity') as FormControl;
  }

  get puzzleImage(): FormControl {
    return this.form.get('puzzleImage') as FormControl;
  }

  get pieces(): FormControl {
    return this.form.get('pieces') as FormControl;
  }

  isDataInvalid(): boolean {
    return (this.conversionError != null
      || this.pieces.errors != null || !this.pieces.valid
      || this.userCapacity.errors != null || !this.userCapacity.valid
      || this.puzzleImage.errors != null || !this.puzzleImage.valid);
  }

  public getUploadedImage(): string {
    return this.puzzleImage.value;
  }


}
