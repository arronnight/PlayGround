import { useState } from 'react';
import { useOS } from '../store/osStore';
import { bgStyle } from '../assets';

export function LockScreen() {
  const { wallpaper, unlock, restart, powerOff } = useOS();
  const [pw, setPw] = useState('');
  const now = new Date();
  return (
    <div className="desktop lockscreen" style={bgStyle(wallpaper)}>
      <div className="lock-blur" />
      <div className="lock-card">
        <div className="lock-time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="lock-date">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="lock-avatar">◈</div>
        <div className="lock-user">FusionUser</div>
        <form onSubmit={(e) => { e.preventDefault(); unlock(); }}>
          <input autoFocus type="password" placeholder="Password (anything works — press Enter)" value={pw} onChange={(e) => setPw(e.target.value)} />
        </form>
        <div className="row lock-btns">
          <button onClick={restart}>⟳ Restart</button>
          <button onClick={powerOff}>⏻ Shut Down</button>
        </div>
      </div>
    </div>
  );
}

export function PowerOffScreen() {
  const { powerOn } = useOS();
  return (
    <div className="poweroff">
      <button className="powerbtn" onClick={powerOn} title="Power on">⏻</button>
      <p>FusionOS is off. Press ⏻ to boot.</p>
    </div>
  );
}
