import { useContext } from "react";

const DashboardAnalyticsContext = React.createContext<{
  totalDonations: number;
  totalDonors: number;
  totalProjects: number;
}>({
  totalDonations: 0,
  totalDonors: 0,
  totalProjects: 0,
});
