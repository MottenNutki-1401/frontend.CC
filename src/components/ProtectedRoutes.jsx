import { Navigate }
from "react-router-dom";

import { useEffect, useState }
from "react";

import { supabase }
from "../api/supabase";

function ProtectedRoute({ children }) {

  const [loading, setLoading] =
    useState(true);

  const [authenticated,
    setAuthenticated] =
    useState(false);

  useEffect(() => {

    checkUser();

  }, []);

  async function checkUser() {

    const { data } =
      await supabase.auth.getUser();

    if (data.user) {

      setAuthenticated(true);

    } else {

      setAuthenticated(false);
    }

    setLoading(false);
  }

  // loading
  if (loading) {

    return <p>Loading...</p>;
  }

  // not logged in
  if (!authenticated) {

    return <Navigate to="/" replace />;
  }

  // logged in
  return children;
}

export default ProtectedRoute;