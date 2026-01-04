import { Injectable, signal, computed, Injector, inject, runInInjectionContext } from '@angular/core';
import { form, validate, required, FieldTree } from '@angular/forms/signals';

export type FormFieldValue = string | number | boolean | Date | null;
export type FormModel = Record<string, FormFieldValue>;

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  value: FormFieldValue;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormSchema {
  fields: FieldDefinition[];
}

/** Type for a dynamic form with string-keyed fields */
type DynamicFormTree = FieldTree<FormModel> & Record<string, FieldTree<FormFieldValue>>;

@Injectable()
export class FormDataService {
  private readonly injector = inject(Injector);

  /** The underlying signal holding the form data model */
  private readonly _model = signal<FormModel>({});

  /** The Signal Form instance - recreated when schema changes */
  private readonly _signalForm = signal<DynamicFormTree | null>(null);

  /** Track the last initialized schema to prevent duplicate initializations */
  private lastSchemaHash = '';

  /** Expose the current form */
  readonly signalForm = computed(() => this._signalForm());

  /** Computed: current form value */
  readonly formValue = computed(() => this._model());

  /** Computed: form validity */
  readonly isValid = computed(() => {
    const currentForm = this._signalForm();
    return currentForm ? currentForm().valid() : false;
  });

  /**
   * Initialize the form from a schema definition.
   * Uses hash comparison to prevent duplicate initializations during streaming.
   */
  initializeFromSchema(formSchema: FormSchema): void {
    // Create a simple hash to detect if schema actually changed
    const schemaHash = JSON.stringify(formSchema.fields.map(f => f.name).sort());

    if (schemaHash === this.lastSchemaHash) {
      return; // Schema hasn't changed, skip re-initialization
    }
    this.lastSchemaHash = schemaHash;

    // Build the model from field definitions
    const modelData: FormModel = {};

    for (const field of formSchema.fields) {
      modelData[field.name] = field.value;
    }

    // Update model
    this._model.set(modelData);

    // Create the form with validation in injection context
    runInInjectionContext(this.injector, () => {
      const newForm = form(this._model, (schemaPath) => {
        for (const field of formSchema.fields) {
          if (!field.validation) continue;

          const fieldPath = schemaPath[field.name];
          if (!fieldPath) continue;

          const rules = field.validation;

          if (rules.required) {
            required(fieldPath, { message: `${field.name} is required` });
          }

          if (rules.min !== undefined || rules.max !== undefined) {
            validate(fieldPath, ({ value }) => {
              const val = value() as number;
              if (typeof val !== 'number' || isNaN(val)) return null;
              if (rules.min !== undefined && val < rules.min) {
                return { kind: 'min', message: `Minimum value is ${rules.min}` };
              }
              if (rules.max !== undefined && val > rules.max) {
                return { kind: 'max', message: `Maximum value is ${rules.max}` };
              }
              return null;
            });
          }

          if (rules.minLength !== undefined || rules.maxLength !== undefined) {
            validate(fieldPath, ({ value }) => {
              const val = value() as string;
              if (typeof val !== 'string') return null;
              if (rules.minLength !== undefined && val.length < rules.minLength) {
                return { kind: 'minLength', message: `Minimum length is ${rules.minLength}` };
              }
              if (rules.maxLength !== undefined && val.length > rules.maxLength) {
                return { kind: 'maxLength', message: `Maximum length is ${rules.maxLength}` };
              }
              return null;
            });
          }
        }
      });

      this._signalForm.set(newForm as DynamicFormTree);
    });

    console.log('Form initialized with schema:', formSchema);
  }

  /**
   * Get a field from the form by name.
   */
  getField<T extends FormFieldValue>(fieldName: string): FieldTree<T> | undefined {
    const currentForm = this._signalForm();
    if (!currentForm) return undefined;
    return currentForm[fieldName] as FieldTree<T> | undefined;
  }

  /** Reset the form */
  reset(): void {
    this._model.set({});
    this._signalForm.set(null);
    this.lastSchemaHash = '';
  }

  /** Submit and return form data */
  submit(): FormModel {
    const value = this._model();
    console.log('Form submitted with data:', value);
    console.log('Form valid:', this.isValid());
    return value;
  }
}
