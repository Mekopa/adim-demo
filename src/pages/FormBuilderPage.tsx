import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import FormTypeSelector from '../components/formBuilder/FormTypeSelector';
import FormSettingsStep from '../components/formBuilder/FormSettingsStep';
import FormBuilder from '../components/formBuilder/FormBuilder';
import { FormType, FormConfig } from '../types/formBuilder';

export default function FormBuilderPage() {
  const { type } = useParams();
  const [formType, setFormType] = useState<FormType>();
  const [formConfig, setFormConfig] = useState<FormConfig>();

  if (!formType) {
    return <FormTypeSelector onSelect={setFormType} />;
  }

  if (!formConfig) {
    return <FormSettingsStep type={formType} onSubmit={setFormConfig} />;
  }

  return <FormBuilder config={formConfig} />;
}