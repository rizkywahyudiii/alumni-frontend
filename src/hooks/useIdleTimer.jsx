import { useEffect } from 'react';

const useIdleTimer = (onIdle, timeout = 1800000) => { // Default 30 menit (1.800.000 ms)
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      // 1. Hapus timer lama
      clearTimeout(timer);
      
      // 2. Set timer baru
      timer = setTimeout(() => {
        // Jika waktu habis, jalankan fungsi onIdle (Logout)
        onIdle();
      }, timeout);
    };

    // Daftar event yang dianggap "Aktivitas"
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Pasang Event Listener
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Jalankan timer pertama kali
    resetTimer();

    // Cleanup saat komponen di-unmount
    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onIdle, timeout]);
};

export default useIdleTimer;