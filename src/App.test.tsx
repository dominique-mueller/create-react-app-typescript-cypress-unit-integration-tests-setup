import App from './App';
import { mount } from '@cypress/react';

it('renders learn react link', () => {
  mount(<App />);

  // Without testing-library
  // cy.get('a').should('exist');

  // With testing-library
  cy.findByText(/learn react/i).should('exist');
});
