import WebApp from "@twa-dev/sdk";
import MiningStatus from "../components/home/MiningStatus";
import ClaimButton from "../components/home/ClaimButton";

function Home() {
  WebApp.BackButton.hide();

  return (
    <div className="min-h-full">
      <MiningStatus />
      <ClaimButton />
    </div>
  );
}

export default Home;