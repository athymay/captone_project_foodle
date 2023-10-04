import { useContext, useEffect } from 'react';

import { AppContext } from '../../AppContext';

import NewRecipeFormStepper from './NewRecipeFormStepper';

export default function NewRecipeFormContainer() {
  const { setShowSidebarTabOptions } = useContext(AppContext);

  useEffect(() => {
    setShowSidebarTabOptions(false);
  }, [setShowSidebarTabOptions]);

  return <NewRecipeFormStepper />;
}
