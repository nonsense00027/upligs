import React from "react";
import Card from "../../components/Card";

function Games() {
  return (
    <div className="pt-32 max-w-screen-xl mx-auto">
      <h1 className="text-5xl font-bold text-center">Games 🎮</h1>
      <div className="mt-16 flex justify-evenly">
        <Card
          title="Harvesting Apple"
          link="https://assets5.lottiefiles.com/packages/lf20_277fwqpn.json"
          path="harvesting-apple"
        />
        <Card
          title="Window Wipe"
          link="https://assets1.lottiefiles.com/packages/lf20_xxwg88ea.json"
          path="window-wipe"
        />
        <Card
          title="Row the Boat"
          link="https://assets9.lottiefiles.com/packages/lf20_hdyqh0pd.json"
          path="row-boat"
        />
      </div>
    </div>
  );
}

export default Games;
