import { configure } from "@storybook/react";
// import { configureActions } from '@storybook/addon-actions';

// configureActions({
  // depth: 100,
  // Limit the number of items logged into the actions panel
  // limit: 20,
// })

function loadStories() {
  require("../stories");
}

configure(loadStories, module);
