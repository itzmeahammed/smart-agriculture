import './screens/authentication/i18n';
import {I18nextProvider} from 'react-i18next';
import i18n from './screens/authentication/i18n';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;
