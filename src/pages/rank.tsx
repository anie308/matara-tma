import WebApp from "@twa-dev/sdk";
import RankingHeader from "../components/rank/RankingHeader";
import RankingTable from "../components/rank/RankingTable";

function Rank() {
  WebApp.BackButton.hide();

  return (
    <div className="text-white flex w-full px-3 items-center flex-col justify-center">
      <RankingHeader />
      <RankingTable />
    </div>
  );
}

export default Rank;