import { useState } from "react"
import { useApiRequest } from "@hooks/useApiRequest";

export const useCompetition = (competitionId) => {
  const [competition, setCompetition] = useState(null);
  const { get } = useApiRequest(`/competitions/${competitionId}`);

  const fetchCompetition = async () => {
    const response = await get();

    if (response.status === "success") setCompetition(response.data);
  };

  return { competition, fetchCompetition };
};
