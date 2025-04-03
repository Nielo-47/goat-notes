'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { logOutAction } from '@/actions/users';

function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    console.log('Logging out...');
    setLoading(true);

    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
      toast.success('Logged out', {
        description: "You've successfully logged out",
        duration: 5000,
      });
      router.push('/');
    } else {
      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
    }

    setLoading(false);
  };

  return (
    <Button variant="outline" onClick={handleLogOut}>
      {loading ? <Loader2 className="animate-spin" /> : 'Log out'}
    </Button>
  );
}

export default LogOutButton;
