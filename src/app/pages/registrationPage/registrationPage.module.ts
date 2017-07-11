import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng2-recaptcha';
import { registrationPageRoute } from 'app/pages/registrationPage/registrationPage.routes';
import { RegistrationPageComponent } from 'app/pages/registrationPage/registrationPage.component';
import {CaptchaComponent} from './captcha/captcha.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(registrationPageRoute),
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule.forRoot()
    ],
    declarations: [RegistrationPageComponent, CaptchaComponent],
    providers: []
})

export class RegistrationPageModule {

}
