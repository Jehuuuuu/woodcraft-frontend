import LoginPage from '@/components/login/login';
import { getCSRFToken } from '@/utils/api'


export default async function Login() {
  try{
    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.error("CSRF token not found");
      return;
    }
  }catch(error){
    console.error("Error fetching CSRF token:", error);
  }

  return (
    <div>
      <LoginPage />
    </div>
  )
}