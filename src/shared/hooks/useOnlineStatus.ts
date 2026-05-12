import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true);
    });
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected === true);
    });
    return unsub;
  }, []);

  return isOnline;
};
