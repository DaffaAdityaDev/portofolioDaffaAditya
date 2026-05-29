import { useRouter } from 'next/router';
import { RESUME_URL, DOWNLOAD_URL } from '../constants';

export const useResume = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return {
    resumeUrl: RESUME_URL,
    downloadUrl: DOWNLOAD_URL,
    handleBackToHome,
  };
};
