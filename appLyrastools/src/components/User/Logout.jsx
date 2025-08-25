
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useCart } from '../../hooks/useCart';

export function Logout() {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);
  const {cart, cleanCart}=useCart();
  useEffect(() => {
    cleanCart();
    clearUser();
    setTimeout(() => {
      navigate('/user/login');
    }, 100);
  }, []);
  return null;
}
