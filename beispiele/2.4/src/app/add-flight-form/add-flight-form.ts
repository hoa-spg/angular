import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Flight, FlightType } from '../flight';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-flight-form',
  styleUrl: './add-flight-form.css',
  templateUrl: './add-flight-form.html',
})
export class AddFlightForm {
  added = output<Omit<Flight, 'id'>>();

  // Ein FormControl pro Feld: Startwert und Validatoren
  form = new FormGroup({
    flightNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z]{2}\d{3,4}$/)],
    }),
    airline: new FormControl('', { nonNullable: true, validators: Validators.required }),
    type: new FormControl<FlightType>('departure', { nonNullable: true }),
    scheduledTime: new FormControl('', { nonNullable: true, validators: Validators.required }),
    airport: new FormControl('', { nonNullable: true, validators: Validators.required }),
    terminal: new FormControl('T1', { nonNullable: true }),
    gate: new FormControl('', { nonNullable: true }),
  });

  // Fehler erst anzeigen, wenn das Feld schon einmal verlassen wurde
  showError(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.invalid && control.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // alle Fehler sichtbar machen
      return;
    }
    const value = this.form.getRawValue();
    this.added.emit({
      ...value,
      flightNumber: value.flightNumber.toUpperCase(),
      gate: value.gate || undefined,
      status: 'on-time',
    });
    this.form.reset(); // zurück auf die Startwerte
  }
}
