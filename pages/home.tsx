"use client";

import { Checkbox } from "@/components/checkbox";
import { Menu } from "@/components/menu";
import { useEffect, useState } from "react";
import { Camera, Coffee, Wind, Zap } from "react-feather";

interface SaveData {
  level: number;
  experience: number;
}

const skillSize = "64";

const skills = {
  strength: {
    icon: <Zap size={skillSize} />,
    quests: ["A", "B", "C"],
  },
  agility: {
    icon: <Wind size={skillSize} />,
    quests: ["D", "E", "F"],
  },
  cooking: {
    icon: <Coffee size={skillSize} />,
    quests: ["G", "H", "I"],
  },
};

const Home = () => {
  const [saveData, setSaveData] = useState<SaveData>();
  const [selectedQuest, setSelectedQuest] =
    useState<keyof typeof skills>("strength");

  useEffect(() => {
    const localSaveData =
      localStorage.getItem("saveData") ??
      JSON.stringify({
        level: 1,
        experience: 0,
      });
    setSaveData(JSON.parse(localSaveData));
  }, []);

  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-4 max-w-[600px] m-4">
        <Menu>
          <span className="uppercase text-xl">Level. 1</span>
          <progress className="w-full" />
        </Menu>
        <Menu title="Skills">
          <div className="grid grid-flow-row grid-cols-3 gap-4">
            {Object.entries(skills).map(([key, { icon }]) => (
              <div
                key={key}
                className={`border-solid rounded-md border-4 p-4 cursor-pointer ${
                  selectedQuest === key
                    ? "border-blue-400 text-blue-400"
                    : "hover:border-blue-200 hover:text-blue-200"
                }`}
                onClick={() => setSelectedQuest(key as keyof typeof skills)}
              >
                <span className="uppercase text-xl">{key}</span>
                <div className="flex flex-row justify-between">
                  {icon}
                  <span className="text-6xl">1</span>
                </div>
              </div>
            ))}
          </div>
        </Menu>
        <Menu title="Quest">
          <div>
            <ul>
              {skills[selectedQuest]?.quests.map((quest) => (
                <li key={quest}>
                  <div className="flex flex-row gap-2 items-center my-2">
                    <Checkbox />
                    <span>{quest}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Menu>
      </div>
    </main>
  );
};

export { Home };
