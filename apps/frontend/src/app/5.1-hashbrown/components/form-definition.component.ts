import { Component, effect, inject, input, untracked } from '@angular/core';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import {
  FormDataService,
  FormSchema,
  FieldDefinition,
} from '../form-data.service';

/** Raw field definition from LLM (all values as strings for easier parsing) */
interface RawFieldDefinition {
  name: string;
  type: string;
  value: string;
  required: string;
  min: string;
  max: string;
}

@Component({
  selector: 'app-form-definition',
  template: `<!-- Form schema container -->`,
})
export class FormDefinitionComponent {
  private readonly formDataService = inject(FormDataService);

  /** Track last processed field names to avoid redundant processing */
  private lastFieldNamesHash = '';

  fields = input.required<RawFieldDefinition[]>();

  constructor() {
    effect(() => {
      const rawFields = this.fields();
      if (!rawFields || rawFields.length === 0) return;

      // Early exit if field structure hasn't changed
      const fieldNamesHash = rawFields
        .map((f) => f.name)
        .sort()
        .join(',');
      if (fieldNamesHash === this.lastFieldNamesHash) return;
      this.lastFieldNamesHash = fieldNamesHash;

      const fields: FieldDefinition[] = rawFields.map((raw) => {
        let value: FieldDefinition['value'];

        switch (raw.type) {
          case 'number':
            value = raw.value ? parseFloat(raw.value) : 0;
            break;
          case 'boolean':
            value = raw.value === 'true';
            break;
          default:
            value = raw.value || '';
        }

        const validation: FieldDefinition['validation'] = {};
        if (raw.required === 'true') validation.required = true;
        if (raw.min) validation.min = parseFloat(raw.min);
        if (raw.max) validation.max = parseFloat(raw.max);

        return {
          name: raw.name,
          type: raw.type as FieldDefinition['type'],
          value,
          validation:
            Object.keys(validation).length > 0 ? validation : undefined,
        };
      });

      const schema: FormSchema = { fields };

      untracked(() => {
        this.formDataService.initializeFromSchema(schema);
      });
    });
  }
}

export const exposedFormDefinition = exposeComponent(FormDefinitionComponent, {
  description: `CRITICAL: Generate this component FIRST before any other form components. Defines form schema with all fields, values, and validation. All field components must use matching fieldName values.`,
  input: {
    fields: s.array(
      'Array of ALL field definitions',
      s.object('Field definition', {
        name: s.string('Field name in camelCase (e.g., "numGuests")'),
        type: s.string('Type: "string", "number", "boolean", or "date"'),
        value: s.string('Initial value as string (empty string for none)'),
        required: s.string('Set to "true" if required, otherwise "false"'),
        min: s.string(
          'Min value for numbers (e.g., "1"), empty string if none',
        ),
        max: s.string(
          'Max value for numbers (e.g., "100"), empty string if none',
        ),
      }),
    ),
  },
});
