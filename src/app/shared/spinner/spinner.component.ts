import { Component, inject } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `
    @if(isLoading()) { 
    <div class="relative bottom-[10%] left-[7%] md:left-0">
      <div class="flex justify-center items-center min-h-screen">
          <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#a37a57]">
          </div>
      </div>
    </div>
    }
  `,
  styles: ``
})
export default class SpinnerComponent {
  private readonly spinnerService = inject(SpinnerService);
  isLoading = this.spinnerService.isLoading;
}
