import TravelSnapProvider from './src/hooks/MyContext';
import { NativeWindStyleSheet } from 'nativewind';
import MainNavigation from './src/routes/MainNavigation';

NativeWindStyleSheet.setOutput({
  default: "native"
})

export default function App() {
  return (
    <TravelSnapProvider>
      <MainNavigation />
    </TravelSnapProvider>
  );
}
