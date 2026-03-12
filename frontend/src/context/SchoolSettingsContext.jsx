import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SchoolSettingsContext = createContext();

export const SchoolSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios.get("https://smart-curriculum-attendance-app.onrender.com/api/admin/settings/general")
      .then(res => setSettings(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <SchoolSettingsContext.Provider value={{ settings }}>
      {children}
    </SchoolSettingsContext.Provider>
  );
};

export const useSchoolSettings = () => useContext(SchoolSettingsContext);
