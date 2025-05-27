<script lang="ts">
  import GenericForm from '$lib/components/GenericForm.svelte';
  import type { FormConfig } from '$lib/types/FormConfig';


  const userFormConfig: FormConfig = {
    title: 'Registro de Usuario',
    showReset: true,
    fields: [
      {
        name: 'name',
        label: 'Nombre completo',
        type: 'text',
        required: true,
        placeholder: 'Ingresa tu nombre',
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        required: true,
        placeholder: 'ejemplo@correo.com',
        validation: {
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        }
      },
      {
        name: 'age',
        label: 'Edad',
        type: 'number',
        required: true,
        validation: {
          min: 18,
          max: 130
        }
      },
      {
        name: 'country',
        label: 'País',
        type: 'select',
        required: true,
        options: [
          { value: 'mx', label: 'México' },
          { value: 'ar', label: 'Argentina' },
          { value: 'co', label: 'Colombia' },
          { value: 'es', label: 'España' }
        ]
      },
      {
        name: 'bio',
        label: 'Biografía',
        type: 'textarea',
        placeholder: 'Cuéntanos sobre ti...',
        validation: {
          maxLength: 500
        }
      },
      {
        name: 'newsletter',
        label: 'Suscribirse al newsletter',
        type: 'checkbox'
      },
      {
        name: 'gender',
        label: 'Género',
        type: 'radio',
        options: [
          { value: 'male', label: 'Masculino' },
          { value: 'female', label: 'Femenino' },
          { value: 'other', label: 'Otro' },
          { value: 'prefer-not-to-say', label: 'Prefiero no decir' }
        ]
      }
    ]
  };

  const initialValues = {
    name: '',
    email: '',
    newsletter: false
  };

  function handleSubmit(event: CustomEvent<{ data: Record<string, any>; isValid: boolean }>) {
    const { data, isValid } = event.detail;
    
    if (isValid) {
      console.log('Formulario válido:', data);
      // Aquí puedes enviar los datos al servidor
    } else {
      console.log('Formulario con errores');
    }
  }

  function handleFieldChange(event: CustomEvent<{ field: string; value: any; formData: Record<string, any> }>) {
    console.log('Campo cambiado:', event.detail);
  }

  function handleReset(event: CustomEvent<Record<string, any>>) {
    console.log('Formulario reseteado:', event.detail);
  }


</script>


<br><br>


<GenericForm
  config={userFormConfig}
  {initialValues}
  on:submit={handleSubmit}
  on:change={handleFieldChange}
  on:reset={handleReset}
/>