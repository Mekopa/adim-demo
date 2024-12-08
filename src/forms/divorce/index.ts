// src/forms/divorce/index.ts

import template from './template';
import promptTemplate from './prompt';

const divorceForm = {
  id: 'divorce',
  template,
  promptTemplate,
  endpoint: 'http://localhost:8082/process', // Adjust the port if needed
};

export default divorceForm;