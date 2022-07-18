import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage: any;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contacatNumber: [null,[Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null,[Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }
    this.userService.signUp(data).subscribe((res: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage =res?.message;
      this.snackBarService.openSnackbar(this.responseMessage,"");
      this.router.navigate(['/']);
    },(error) => {
      this.ngxService.stop();
      if(error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackbar(this.responseMessage,GlobalConstants.error);
    })
  }
}
