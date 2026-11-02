import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateFlightPayload, FlightType } from './flight';

const FLIGHT_NUMBER_PATTERN = /^[A-Za-z]{2}\d{3,4}$/;

@Component({
  selector: 'app-add-flight-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-flight-form.component.html',
})
export class AddFlightFormComponent {
  @Output() add    = new EventEmitter<CreateFlightPayload>();
  @Output() cancel = new EventEmitter<void>();

  private submitted = false;

  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    flightNumber:  ['', [Validators.required, Validators.pattern(FLIGHT_NUMBER_PATTERN)]],
    airline:       ['', Validators.required],
    type:          ['departure' as FlightType, Validators.required],
    scheduledTime: ['', Validators.required],
    airport:       ['', Validators.required],
    terminal:      ['T1', Validators.required],
    expectedTime:  [''],
    gate:          [''],
  });

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.submitted);
  }

  getError(field: string): string {
    const errors = this.form.get(field)?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Pflichtfeld';
    if (errors['pattern'])  return 'Ungültiges Format (z.B. OS123)';
    return 'Ungültig';
  }

  submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.add.emit({
      flightNumber:  v.flightNumber!.trim().toUpperCase(),
      airline:       v.airline!.trim(),
      type:          v.type as FlightType,
      scheduledTime: v.scheduledTime!,
      expectedTime:  v.expectedTime || undefined,
      airport:       v.airport!.trim(),
      terminal:      v.terminal!,
      gate:          v.gate?.trim() || undefined,
    });
    this.form.reset({ type: 'departure', terminal: 'T1' });
    this.submitted = false;
  }
}
