<script lang="ts">
import type { FormConfig, FormField } from '$lib/types/FormConfig';
import { createEventDispatcher } from 'svelte';

  // Props del componente
export let config: FormConfig;
export let initialValues: Record<string, any> = {};

  // Estado del formulario
let formData: Record<string, any> = { ...initialValues };
let errors: Record<string, string> = {};
let isSubmitting = false;

  // Event dispatcher
const dispatch = createEventDispatcher<{
    submit: { data: Record<string, any>; isValid: boolean };
    change: { field: string; value: any; formData: Record<string, any> };
    reset: Record<string, any>;
}>();

  // Inicializar formData con valores por defecto
$: {
    config.fields.forEach(field => {
if (!(field.name in formData)) {
        formData[field.name] = field.type === 'checkbox' ? false : '';
}
    });
}

  // Función de validación
function validateField(field: FormField, value: any): string {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
return `${field.label} es requerido`;
    }

    if (field.validation) {
    const val = field.validation;
    
    if (typeof value === 'string') {
        if (val.minLength && value.length < val.minLength) {
        return `${field.label} debe tener al menos ${val.minLength} caracteres`;
        }
        if (val.maxLength && value.length > val.maxLength) {
        return `${field.label} no puede tener más de ${val.maxLength} caracteres`;
        }
        if (val.pattern && !new RegExp(val.pattern).test(value)) {
        return `${field.label} no tiene el formato correcto`;
        }
    }

    if (typeof value === 'number') {
        if (val.min !== undefined && value < val.min) {
        return `${field.label} debe ser mayor o igual a ${val.min}`;
        }
        if (val.max !== undefined && value > val.max) {
        return `${field.label} debe ser menor o igual a ${val.max}`;
        }
    }
    }

    return '';
}

  // Validar todo el formulario
function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    
    config.fields.forEach(field => {
    const error = validateField(field, formData[field.name]);
    if (error) {
        newErrors[field.name] = error;
    }
    });

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
}

  // Manejar cambios en los campos
function handleFieldChange(field: FormField, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    let value: any;

    if (field.type === 'checkbox') {
    value = (target as HTMLInputElement).checked;
    } else if (field.type === 'number') {
    value = target.value ? Number(target.value) : '';
    } else {
    value = target.value;
    }

    formData[field.name] = value;
    
    // Limpiar error del campo si existe
    if (errors[field.name]) {
    errors[field.name] = '';
    }

    dispatch('change', { field: field.name, value, formData: { ...formData } });
}

  // Manejar envío del formulario
async function handleSubmit(event: Event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    isSubmitting = true;
    const isValid = validateForm();
    
    dispatch('submit', { data: { ...formData }, isValid });
    
    isSubmitting = false;
}

  // Resetear formulario
function handleReset() {
    formData = { ...initialValues };
    errors = {};
    dispatch('reset', { ...formData });
}

  // Función para renderizar un campo (Note: this function is not actually used in the template,
  // the fields are rendered directly in the markup with if/else if blocks. I'm keeping it
  // here as it was in your original code, but it's not affecting the output.)
function renderField(field: FormField) {
    const commonProps = {
    id: field.name,
    name: field.name,
    disabled: field.disabled || isSubmitting,
    class: `form-input ${field.class || ''} ${errors[field.name] ? 'error' : ''}`.trim()
    };

    switch (field.type) {
    case 'textarea':
        return { tag: 'textarea', props: { ...commonProps, placeholder: field.placeholder } };
    case 'select':
        return { tag: 'select', props: commonProps };
    case 'checkbox':
        return {
        tag: 'input',
        props: {
            ...commonProps,
            type: 'checkbox',
            class: `form-checkbox ${field.class || ''} ${errors[field.name] ? 'error' : ''}`.trim()
        }
        };
    case 'radio':
        return { tag: 'radio-group', props: commonProps };
    default:
        return {
        tag: 'input',
            props: {
            ...commonProps,
            type: field.type,
            placeholder: field.placeholder,
            ...(field.validation?.min !== undefined && { min: field.validation.min }),
            ...(field.validation?.max !== undefined && { max: field.validation.max }),
            ...(field.validation?.pattern && { pattern: field.validation.pattern })
            }
        };
    }
}
</script>

<form
class="generic-form {config.class || ''}"
onsubmit={handleSubmit}
novalidate
>
{#if config.title}
    <h2 class="form-title">{config.title}</h2>
{/if}

{#each config.fields as field}
    <div class="form-field">
    <label for={field.name} class="form-label">
        {field.label}
        {#if field.required}<span class="required">*</span>{/if}
    </label>

    {#if field.type === 'textarea'}
        <textarea
        id={field.name}
        name={field.name}
        bind:value={formData[field.name]}
        placeholder={field.placeholder}
        disabled={field.disabled || isSubmitting}
        class="form-input {field.class || ''} {errors[field.name] ? 'error' : ''}"
        oninput={(e) => handleFieldChange(field, e)}
        ></textarea>
    {:else if field.type === 'select'}
        <select
        id={field.name}
        name={field.name}
        bind:value={formData[field.name]}
        disabled={field.disabled || isSubmitting}
        class="form-input {field.class || ''} {errors[field.name] ? 'error' : ''}"
        onchange={(e) => handleFieldChange(field, e)}
        >
        <option value="">Selecciona una opción</option>
        {#each field.options || [] as option}
            <option value={option.value}>{option.label}</option>
        {/each}
        </select>
    {:else if field.type === 'checkbox'}
        <input
        type="checkbox"
        id={field.name}
        name={field.name}
        bind:checked={formData[field.name]}
        disabled={field.disabled || isSubmitting}
        class="form-checkbox {field.class || ''} {errors[field.name] ? 'error' : ''}"
        onchange={(e) => handleFieldChange(field, e)}
        />
    {:else if field.type === 'radio'}
        <div class="radio-group">
        {#each field.options || [] as option}
            <label class="radio-label">
            <input
                type="radio"
                name={field.name}
                value={option.value}
                bind:group={formData[field.name]}
                disabled={field.disabled || isSubmitting}
                class="form-radio {field.class || ''}"
                onchange={(e) => handleFieldChange(field, e)}
            />
            {option.label}
            </label>
        {/each}
        </div>
    {:else}
        <input
        type={field.type}
        id={field.name}
        name={field.name}
        bind:value={formData[field.name]}
        placeholder={field.placeholder}
        disabled={field.disabled || isSubmitting}
        class="form-input {field.class || ''} {errors[field.name] ? 'error' : ''}"
        min={field.validation?.min}
        max={field.validation?.max}
        pattern={field.validation?.pattern}
        oninput={(e) => handleFieldChange(field, e)}
        />
    {/if}

    {#if errors[field.name]}
        <span class="error-message">{errors[field.name]}</span>
    {/if}
    </div>
{/each}

<div class="form-actions">
    <button
    type="submit"
    class="btn btn-primary"
    disabled={isSubmitting}
    >
    {isSubmitting ? 'Enviando...' : (config.submitText || 'Enviar')}
    </button>
    
    {#if config.showReset}
    <button
        type="button"
        class="btn btn-secondary"
        disabled={isSubmitting}
        onclick={handleReset}
    >
        {config.resetText || 'Limpiar'}
    </button>
    {/if}
</div>
</form>

<style lang="scss">
/* Definición de variables CSS para los colores */
:root {
    --color-primary-teal: #2E9C9D;
    --color-primary-red: #D92127;
    --color-complementary-white: #FFFFFF;
    --color-complementary-light-blue: #CDEEEE;
    --color-complementary-medium-teal: #66BBBA;
    --color-complementary-light-red: #ED8380;
    --color-error: var(--color-primary-red); /* Usar el rojo principal para errores */
}

.generic-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--color-complementary-white); /* Fondo blanco */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
    margin: 0 0 2rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333; /* Mantener un color oscuro para el texto del título */
    text-align: center;
}

.form-field {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555; /* Mantener un color oscuro para el texto de la etiqueta */
}

.required {
    color: var(--color-error);
    margin-left: 0.25rem;
}

.form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--color-complementary-light-blue); /* Borde basado en color complementario */
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
    outline: none;
    border-color: var(--color-primary-teal); /* Borde al enfocar con el teal principal */
    box-shadow: 0 0 0 3px rgba(46, 156, 157, 0.1); /* Sombra basada en el teal principal */
    }

    &.error {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(217, 33, 39, 0.1); /* Sombra de error basada en el rojo principal */
    }

    &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
    }
}

.form-checkbox, .form-radio {
    width: auto;
    margin-right: 0.5rem;
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    font-weight: normal;
    cursor: pointer;
}

.error-message {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-error);
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    }
}

.btn-primary {
    background-color: var(--color-primary-teal); /* Botón primario con el teal principal */
    color: var(--color-complementary-white); /* Texto del botón primario blanco */

    &:hover:not(:disabled) {
    background-color: var(--color-complementary-medium-teal); /* Hover del botón primario con el teal complementario */
    }
}

.btn-secondary {
    background-color: var(--color-complementary-light-red); /* Botón secundario con el rojo claro complementario */
    color: var(--color-complementary-white); /* Texto del botón secundario blanco */

    &:hover:not(:disabled) {
    background-color: var(--color-primary-red); /* Hover del botón secundario con el rojo principal */
    }
}

textarea.form-input {
    min-height: 100px;
    resize: vertical;
}

select.form-input {
    cursor: pointer;
}
</style>