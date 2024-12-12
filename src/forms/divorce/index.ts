// src/forms/divorce/index.ts

import template from './template';
import promptTemplate from './prompt';

const divorceForm = {
  id: 'divorce',
  template,
  promptTemplate,
  endpoint: 'https://divoce-flow.onrender.com/process/', // Adjust the port if needed
};

export default divorceForm;