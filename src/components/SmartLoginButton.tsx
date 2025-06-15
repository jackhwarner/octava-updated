
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

/**
 * A login button that checks if the user is logged in before navigating to /login.
 * If the user is already authenticated, it redirects them to /dashboard.
 */
const SmartLoginButton = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const handleLoginClick = async () => {
    setChecking(true);
    const { data: { session } } = await supabase.auth.getSession();
    setChecking(false);
    if (session && session.user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login");
    }
  };

  return (
    <Button variant="ghost" disabled={checking} onClick={handleLoginClick}>
      Log In
    </Button>
  );
};

export default SmartLoginButton;
