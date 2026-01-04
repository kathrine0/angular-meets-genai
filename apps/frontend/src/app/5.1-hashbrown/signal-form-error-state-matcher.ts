import { ErrorStateMatcher } from '@angular/material/core';
import { FieldTree } from '@angular/forms/signals';

/**
 * ErrorStateMatcher that works with Angular Signal Forms.
 * It checks the field's signal-based state instead of FormControl.
 */
export class SignalFormErrorStateMatcher implements ErrorStateMatcher {
  constructor(private fieldRef: () => FieldTree<unknown> | undefined) {}

  isErrorState(): boolean {
    const field = this.fieldRef();
    if (!field) return false;

    const state = field();
    return state.touched() && state.invalid();
  }
}

