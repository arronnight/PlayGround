import { useOS } from './store/osStore';
import BootScreen from './shell/BootScreen';
import { LockScreen, PowerOffScreen } from './shell/LockScreen';
import Win11Desktop from './de/win11/Win11Desktop';
import MacDesktop from './de/macos/MacDesktop';
import UbuntuDesktop from './de/ubuntu/UbuntuDesktop';
import FusionDesktop from './de/fusion/FusionDesktop';

export default function App() {
  const { booted, locked, powered, de } = useOS();
  if (powered) return <PowerOffScreen />;
  if (!booted) return <BootScreen />;
  if (locked) return <LockScreen />;
  if (de === 'macos') return <MacDesktop />;
  if (de === 'ubuntu') return <UbuntuDesktop />;
  if (de === 'fusion') return <FusionDesktop />;
  return <Win11Desktop />;
}
